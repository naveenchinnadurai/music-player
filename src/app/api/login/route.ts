import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '../../../db/drizzle';
import { user } from '../../../db/schema';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { message: 'Missing required fields' },
            { status: 201 }
        );
    }

    try {
        const existingUser = await db.select().from(user).where(eq(user.email, email));

        if (!existingUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 201 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser[0].password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 201 }
            );
        }

        return NextResponse.json(
            {
                user: {
                    id: existingUser[0].id,
                    name: existingUser[0].name,
                    email: existingUser[0].email,
                    audios: existingUser[0].audios
                },
                message: 'Login successful'
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error logging in', error },
            { status: 200 }
        );
    }
}

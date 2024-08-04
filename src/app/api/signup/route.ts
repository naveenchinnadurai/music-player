import { NextRequest, NextResponse } from 'next/server';
import { eq } from "drizzle-orm";
import db from '../../../db/drizzle';
import { user } from '../../../db/schema';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json(
            { message: 'Missing required fields' },
            { status: 401 }
        );
    }

    try {
        const existingUser = await db.select().from(user).where(eq(user.email, email));
        console.log(existingUser)
        if (!existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 200 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.insert(user).values({ name, email, password: hashedPassword, audios: null }).returning();
        const { password: _, ...userInfo } = newUser[0];
        return NextResponse.json(
            { user: userInfo, message: "Account Created Successful" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating user', error },
            { status: 201 }
        );
    }
} 

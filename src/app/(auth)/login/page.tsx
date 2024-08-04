'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/userContext'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type SignInFormInputs = z.infer<typeof signInSchema>

function SignIn() {
    const router = useRouter();
    const { setUser } = useUser();
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<SignInFormInputs>({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit = async (data: SignInFormInputs) => {
        try {
            const response = await axios.post('/api/login', {
                email: data.email,
                password: data.password,
            });
            console.log(response)
            setUser(response.data.user)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            router.push('/record');
        } catch (err) {
            console.log(err?.response?.data?.message);
        }
    }

    return (
        <div className="h-fit w-fit">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">Don&apos;t have an account?{' '} Create a free account</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••••••"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-[44px] -translate-y-1/2 transform"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    </>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mt-4" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
            </Form>
            <div className="mt-3 space-x-3 flex">
                <Button type="button" className="h-fit flex-col w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none">
                    <span className="mr-2 inline-block">
                        <svg className="h-10 w-10 text-rose-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                        </svg>
                    </span>
                    Sign in with Google
                </Button>
                <Button type="button" className="h-fit flex-col w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none">
                    <span className="mr-2 inline-block">
                        <svg className="h-10 w-10 text-[#2563EB]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                        </svg>
                    </span>
                    Sign in with Facebook
                </Button>
            </div>
        </div>
    )
}

export default SignIn;
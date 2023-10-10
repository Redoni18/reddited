"use client"
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "../../components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Icons } from "../../components/ui/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage
} from "../../components/ui/form"
import Wrapper from "../../components/Wrapper"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useLoginMutation } from "@/gql/grapqhql";
import Link from "next/link";
import constructSetError from "@/lib/toErrorMap";
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster";


const accountFormSchema = z.object({
    email: z.
        string({
            required_error: "Email address is required",
        }),
    password: z
        .string({
            required_error: "Password is required",
        })
})

type LoginProps = z.infer<typeof accountFormSchema>

const defaultValues: Partial<LoginProps> = {
    email: "",
    password: ""
}


const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter()
    const [allErrors, setAllErrors] = useState<Record<string, string>>()
    const [, loginFunction] = useLoginMutation(); //generated custom hook from graphql code generator
    const form = useForm<LoginProps>({
        resolver: zodResolver(accountFormSchema),
        defaultValues
    })

    const { toast } = useToast()

    const onSubmit = async (registerData: LoginProps) => {
        try {
            const response = await loginFunction({
                email: registerData.email,
                password: registerData.password
            })

            if(response.data?.login.user) {
                router.push('/', {scroll: false})
            } else {
                const errors = response.data?.login?.errors || [];
                setAllErrors(constructSetError(errors))
            }
          // Handle the response data as needed
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
    };
    
    useEffect(() => {
        if(allErrors) {
            toast({
                duration: 4000,
                variant: "destructive",
                title: allErrors.field,
                description: allErrors.message,
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allErrors]);
      

    return (
        <Wrapper variant="regular" className="flex items-center h-full">
            <Card className="mx-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email and password below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline">
                            <Icons.gitHub className="mr-2 h-4 w-4" />
                            Github
                        </Button>
                        <Button variant="outline">
                            <Icons.google className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                            </span>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <div>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} type="email" id="email" />
                                    </FormControl>
                                    <FormMessage className="mt-2" />
                                </div>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                <div>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} type="password" id="password" />
                                    </FormControl>
                                    <FormMessage className="mt-2" />
                                </div>
                                )}
                            />

                            {/* {!loading
                                ?
                                :
                                <Button className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            } */}
                            <Button className="w-full">Sign In</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <CardDescription className="mx-auto">
                        Don&apos;t have an account? <Link href="/register" className="text-sky-300">Register here!</Link>
                    </CardDescription>
                </CardFooter>
            </Card>
            <Toaster />
        </Wrapper>
    )
}

export default Login;

"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "../../components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
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
import { useRegisterMutation } from "@/gql/grapqhql";
import { useRouter } from 'next/navigation'
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "@/lib/createUrqlClient";


const accountFormSchema = z.object({
    username: z
        .string({
            required_error: "Username is required"
        })
        .min(3, {
            message: "Username must be at least 3 characters.",
        }),
    email: z.
        string({
            required_error: "Email address is required",
        })
        .email("This is not a valid email"),   
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(9, {
            message: "Password must have at least 9 characters"
        })
})

type RegisterProps = z.infer<typeof accountFormSchema>

const defaultValues: Partial<RegisterProps> = {
    username: "",
    email: "",
    password: ""
}


const Register: React.FC<RegisterProps> = ({}) => {
    const router = useRouter()
    const [{ fetching }, registerFunction] = useRegisterMutation(); //generated custom hook from graphql code generator
    const form = useForm<RegisterProps>({
        resolver: zodResolver(accountFormSchema),
        defaultValues
    })

    // const meQuery = MeDocument

    const onSubmit = async (registerData: RegisterProps) => {
        try {
            const response = await registerFunction({
                username: registerData.username,
                email: registerData.email,
                password: registerData.password
            })

            if(response.data?.register.user) {
                router.push('/', {scroll: false})
            } else {
                console.log("err: ", response)
            }
          // Handle the response data as needed
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
    };

    return (
        <Wrapper variant="small" className="flex items-center h-full">
            <Card className="w-3/4 mx-auto items-center">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
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
                                name="username"
                                render={({ field }) => (
                                <div>
                                    <FormLabel htmlFor="name">Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} type="text" id="name" />
                                    </FormControl>
                                    <FormMessage className="mt-2" />
                                </div>
                                )}
                            />

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

                            {!fetching
                                ?
                                <Button className="w-full">Create account</Button>
                                :
                                <Button className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            }
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <CardDescription className="mx-auto">
                        Already have an account? <Link href="/login" className="text-sky-300">Login!</Link>
                    </CardDescription>
                </CardFooter>
            </Card>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Register);

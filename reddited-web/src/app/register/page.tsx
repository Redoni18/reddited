"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "../../components/ui/input"

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
    FormControl
} from "../../components/ui/form"
import Wrapper from "../../components/Wrapper"
import { useForm } from "react-hook-form"

const accountFormSchema = z.object({
  name: z
    .string({
        required_error: "Username is required"
    })
    .min(3, {
      message: "Username must be at least 3 characters.",
    }),
  email: z.string({
    required_error: "Email address is required",
  }),
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
    name: "",
    email: "",
    password: ""
}


const Register: React.FC<RegisterProps> = ({}) => {

    const form = useForm<RegisterProps>({
        resolver: zodResolver(accountFormSchema),
        defaultValues
    })

    function onSubmit() {
       console.log('sdf')
    }

    return (
        <Wrapper variant="regular">
            <Card className="w-full mx-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
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
                                name="name"
                                render={({ field }) => (
                                <div>
                                    <FormLabel htmlFor="name">Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} type="text" id="name" />
                                    </FormControl>
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
                                </div>
                                )}
                            />

                            <Button className="w-full">Create account</Button>
                        </form>
                    </Form>
                </CardContent>
        </Card>
      </Wrapper>
    )
}

export default Register;

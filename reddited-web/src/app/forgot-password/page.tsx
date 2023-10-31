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
import { useForgotPasswordMutation } from "@/gql/grapqhql";
import { Toaster } from "@/components/ui/toaster";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "@/lib/createUrqlClient";
import { useToast } from "@/components/ui/use-toast";


const accountFormSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
})

type ForgotPasswordProps = z.infer<typeof accountFormSchema>

const defaultValues: Partial<ForgotPasswordProps> = {
    email: ""
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const { toast } = useToast()
    const [{fetching}, forgotPasswordFunction] = useForgotPasswordMutation(); //generated custom hook from graphql code generator
    const form = useForm<ForgotPasswordProps>({
        resolver: zodResolver(accountFormSchema),
        defaultValues
    })


    const onSubmit = async (forgotPasswordData: ForgotPasswordProps) => {
        try {
            await forgotPasswordFunction({
                email: forgotPasswordData.email,
            })

            toast({
                duration: 4000,
                variant: "default",
                title: 'password request sent',
                description: `New password request sent to ${forgotPasswordData.email}`
            })
          // Handle the response data as needed
        } catch (error) {
          // Handle any errors here
          console.error(error);
        }
    };

    return (
        <Wrapper className="my-auto h-screen">
            <Card className="mx-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Request a new password</CardTitle>
                    <CardDescription>
                        Enter your email here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
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

                            {!fetching
                                ?
                                <Button className="w-full">Request Password</Button>
                                :
                                <Button className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            }
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Toaster />
        </Wrapper>
    )
}


export default withUrqlClient(createUrqlClient) (ForgotPassword);

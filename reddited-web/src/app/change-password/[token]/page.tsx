"use client"
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "../../../components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
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
} from "../../../components/ui/form"
import Wrapper from "../../../components/Wrapper"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useChangePasswordMutation } from "@/gql/grapqhql";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "@/lib/createUrqlClient";
import constructSetError from "@/lib/toErrorMap";


const accountFormSchema = z.object({
    password: z
        .string({
            required_error: "Password is required",
        })
})

type ChangePasswordProps = z.infer<typeof accountFormSchema>

const defaultValues: Partial<ChangePasswordProps> = {
    password: ""
}

function ChangePassword ({ params }: { params: { token: string } }) {
    const router = useRouter()
    const [allErrors, setAllErrors] = useState<Record<string, string>>()
    const [{fetching}, changePasswordFunction] = useChangePasswordMutation(); //generated custom hook from graphql code generator
    const form = useForm<ChangePasswordProps>({
        resolver: zodResolver(accountFormSchema),
        defaultValues
    })

    const { toast } = useToast()

    const onSubmit = async (changePasswordData: ChangePasswordProps) => {
        try {
            const response = await changePasswordFunction({
                newPassword: changePasswordData.password,
                token: params.token
            })

            if(response.data?.changePassword.user) {
                router.push('/', {scroll: false})
            } else {
                const errors = response.data?.changePassword?.errors || [];
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
        <Wrapper className="my-auto h-full">
            <Card className="mx-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Change Password</CardTitle>
                    <CardDescription>
                        Enter your new password here
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                <Button className="w-full">Change Password</Button>
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


export default withUrqlClient(createUrqlClient) (ChangePassword);

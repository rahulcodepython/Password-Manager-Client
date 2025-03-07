"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface FormData {
    username: string
    password: string
}

export default function Login() {
    const {
        register,
        handleSubmit,
        reset
    } = useForm<FormData>()

    const router = useRouter()

    const login = async (data: FormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            if (response.ok) {
                const { token } = await response.json()
                setCookie("token", token)
                router.push("/")
            }
        } catch {
            toast("Invalid credentials. Try again.")
        } finally {
            reset()
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(login)}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            placeholder="m@example.com"
                                            className="focus-visible:border-input focus-visible:ring-0"
                                            {...register("username", { required: true })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            className="focus-visible:border-input focus-visible:ring-0"
                                            {...register("password", { required: true })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full cursor-pointer">
                                        Login
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

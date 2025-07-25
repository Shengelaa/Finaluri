"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema, SignInType } from "@/validation/sign-in.schema";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { axiosInstance } from "@/lib/axios-instance";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<SignInType>({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async ({ email, password }: SignInType) => {
    setLoading(true);
    try {
      const resp = await axiosInstance.post("/auth/sign-in", {
        email,
        password,
      });

      toast.success(resp.data.message || "Logged in successfully");

      if (resp.status === 201) {
        setCookie("token", resp.data.token, { maxAge: 60 * 60 });
        router.push("/");
      }
    } catch (e: any) {
      const message = e?.response?.data?.message;

      if (typeof message === "string") {
        toast.error(message);
      } else if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center">
          <div className="w-12 h-12 border-6 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="h-screen w-full flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardAction>
              <Button
                variant="link"
                type="button"
                className="cursor-pointer"
                onClick={() => router.push("/auth/sign-up")}
              >
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="*******"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full mt-4 cursor-pointer"
                disabled={loading}
              >
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

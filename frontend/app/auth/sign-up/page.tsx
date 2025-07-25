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
import { signUpSchema, SignupType } from "@/validation/sign-up.schema";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios-instance";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<SignupType>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async ({ name, lastname, email, password }: SignupType) => {
    setLoading(true);
    try {
      const resp = await axiosInstance.post("/auth/sign-up", {
        name,
        lastname,
        email,
        password,
        role: "user",
      });

      toast.success(resp.data.message || "Registered successfully");

      if (resp.status === 201) {
        router.push("/auth/sign-in");
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
        <div className="fixed inset-0 bg-black/5 z-50 flex justify-center items-center">
          <div className="w-12 h-12 border-[6px] border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="h-screen w-full flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create a new account</CardTitle>
            <CardAction>
              <Button
                variant="link"
                type="button"
                className="cursor-pointer"
                onClick={() => router.push("/auth/sign-in")}
              >
                Sign In
              </Button>
            </CardAction>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="John"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    {...register("lastname")}
                    id="lastname"
                    type="text"
                    placeholder="Doe"
                  />
                </div>
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
                    maxLength={20}
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="*****"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="cursor-pointer w-full mt-4"
                disabled={loading}
              >
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

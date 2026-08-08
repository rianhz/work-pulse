"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/features/auth/validator";
import { useRegister, useRegisterWithGoogle } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGoogleLogin } from "@react-oauth/google";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Activity } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    reset,
    resetField,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      slug: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: registerMutation, isPending } = useRegister();
  const { mutate: registerWithGoogleMutation, isPending: isRegisterWithGooglePending } = useRegisterWithGoogle();

  const registerWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      registerWithGoogleMutation({
        token: tokenResponse.access_token,
        companyName: getValues().companyName,
        slug: getValues().slug,
      });
    },
    onError: () => {
      toast.error("Failed to register with Google");
    },
  });

  const handleRegisterWithGoogle = () => {
    if (!getValues().companyName || !getValues().slug) {
      resetField("fullName");
      resetField("email");
      resetField("password");
      resetField("confirmPassword");
      setError("companyName", { message: "Company name must be at least 2 characters" });
      setError("slug", { message: "Slug must be at least 2 characters" });

      toast.error("Please fill in all required fields");
      return;
    }
    registerWithGoogle();
  };

  const onSubmit = async (values: RegisterFormValues) => {
    registerMutation(values, {
      onSuccess: () => {
        router.push("/signin");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Sign up</h1>
        <span className="text-sm text-muted-foreground">Already have an account? <Link className="text-primary hover:underline" href="/signin">Sign in</Link></span>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                
                <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        id="companyName"
                        type="text"
                        placeholder="Acme Corporation"
                        autoComplete="companyName"
                        {...register("companyName")}
                    />
                    <Activity mode={errors.companyName ? "visible" : "hidden"}>
                      <p className="text-sm text-red-500">{errors.companyName?.message}</p>
                    </Activity>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        type="text"
                        placeholder="acme-corporation"
                        autoComplete="slug"
                        {...register("slug")}
                    />
                    <Activity mode={errors.slug ? "visible" : "hidden"}>
                      <p className="text-sm text-red-500">{errors.slug?.message}</p>
                    </Activity>
                </div>
                <Separator />
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        {...register("fullName")}
                    />
                    <Activity mode={errors.fullName ? "visible" : "hidden"}>
                      <p className="text-sm text-red-500">{errors.fullName?.message}</p>
                    </Activity>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="new-password"
                        {...register("email")}
                    />
                    <Activity mode={errors.email ? "visible" : "hidden"}>
                      <p className="text-sm text-red-500">{errors.email?.message}</p>
                    </Activity>
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
                    <Activity mode={errors.password ? "visible" : "hidden"}>
                      <p className="text-sm text-red-500">{errors.password?.message}</p>
                    </Activity>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
                    <Activity mode={errors.confirmPassword ? "visible" : "hidden"}>
                      <p className="text-sm text-red-500">{errors.confirmPassword?.message}</p>
                    </Activity>
                </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full mt-4" disabled={isPending}>
                Register
              </Button>
              <div className="flex items-center justify-center gap-2">
                <Separator className="flex-1" />
                <span className="text-sm text-muted-foreground">Or</span>
                <Separator className="flex-1" />
              </div>
              <Button type="button" variant="secondary" className="w-full mt-4" disabled={isRegisterWithGooglePending} onClick={handleRegisterWithGoogle}>
                <FcGoogle className="h-4 w-4" /> Continue with Google
              </Button>

            </div>
        </form>
      </CardContent>
    </Card>
  );
}

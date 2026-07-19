"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/features/auth/validator";
import { useGoogleLoginMutation, useLogin } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginWithGoogleMutation, isPending: isPendingGoogleLogin } = useGoogleLoginMutation();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      loginWithGoogleMutation(credentialResponse.access_token);
    },
    onError: () => {
      toast.error("Failed to login with Google");
    },
  });

  const { mutate: loginMutationPassword, isPending: isPendingPassword } = useLogin();

  const onSubmit = async (values: LoginFormValues) => {
    loginMutationPassword(values);
  };

  const handleLoginWithGoogle = () => {
    loginWithGoogle();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <span className="text-sm text-muted-foreground">New here? <Link className="text-primary hover:underline" href="/signup">Create an account</Link></span>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="new-password"
                    {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link className="ml-auto text-primary hover:underline" href="/forgot-password">Forgot password?</Link>
                </div>
                <Input id="password" type="password" placeholder="Example@123" autoComplete="new-password" {...register("password")} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full mt-4" disabled={isPendingPassword} loading={isPendingPassword}>
                Login
              </Button>
              <div className="flex items-center justify-center gap-2">
                <Separator />
                <span className="text-sm text-muted-foreground">Or</span>
                <Separator />
              </div>
              <Button type="button" variant="secondary" className="w-full" disabled={isPendingGoogleLogin} onClick={handleLoginWithGoogle}>
                  <FcGoogle className="h-4 w-4" /> Login with Google
              </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}

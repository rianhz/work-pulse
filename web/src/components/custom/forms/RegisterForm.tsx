"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/features/auth/validator";
import { useRegister } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerMutation, isPending } = useRegister();

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
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
            
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        {...register("fullName")}
                    />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
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
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        id="companyName"
                        type="text"
                        placeholder="Acme Corporation"
                        autoComplete="companyName"
                        {...register("companyName")}
                    />
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
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
                    {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                </div>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
                Register
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}

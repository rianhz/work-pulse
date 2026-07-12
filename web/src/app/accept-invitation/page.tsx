"use client";

import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import BaseAvatar from "@/components/custom/images/BaseAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/features/auth/hooks";
import { useAcceptInvite, useVerifyInviteToken } from "@/features/invitations/hooks";
import { AcceptInvitationFormValues, acceptInvitationSchema } from "@/features/invitations/validator";
import { useGetPublicTenantById } from "@/features/tenants/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // 1. All custom query and mutation hooks
  const { data: inviteTokenData, isLoading: isLoadingInviteToken, error: errorInviteToken, isError: isErrorInviteToken } = useVerifyInviteToken(token || "");
  const { data: publicTenantData, isLoading: isLoadingPublicTenant, error: errorPublicTenant, isError: isErrorPublicTenant } = useGetPublicTenantById(inviteTokenData?.tenantId || "");
  const { mutate: acceptInvitationMutation, isPending: isPendingAcceptInvitation } = useAcceptInvite();
  const { mutate: loginMutationPassword, isPending: isPendingLoginPassword } = useLogin();

  // 2. Memos
  const initials = useMemo(() => {
    return publicTenantData?.name?.split(' ').map((name) => name[0]).join('').slice(0, 2).toUpperCase() || '';
  }, [publicTenantData]);

  // 3. Form Initialization
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      fullName: "",
      email: inviteTokenData?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  // 4. Effects (Moved UP to guarantee execution on every single render cycle)
  useEffect(() => {
    if (inviteTokenData && inviteTokenData?.email) {
      reset({
        email: inviteTokenData.email,
        fullName: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [inviteTokenData, reset]); // added 'reset' to the dependency array to satisfy linting rules

  // Handler functions
  const onSubmit = (data: AcceptInvitationFormValues) => {
    acceptInvitationMutation({
      token: token || "",
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    }, {
      onSuccess: () => {
        loginMutationPassword({
          email: data.email,
          password: data.password,
        }, {
          onSuccess: () => {
            reset();
          },
        });
      },
    });
  };

  // --- 5. EARLY RETURNS (SAFE TO DO NOW) ---

  if (isLoadingInviteToken || isLoadingPublicTenant) {
    return (
      <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
        <Spinner className="size-10 text-primary" />
        <span className="text-lg text-muted-foreground">Verifying...</span>
      </div>
    );
  }

  if (isErrorInviteToken) {
    return (
      <ErrorMessage title={(errorInviteToken as any)?.response?.data?.message || (errorInviteToken as Error).message || "Failed to verify invitation"} >
        <Button asChild variant="outline">
          <Link href="/signin">Go to login</Link>
        </Button>
      </ErrorMessage>
    );
  }

  if (isErrorPublicTenant) {
    return (
      <ErrorMessage title={(errorPublicTenant as any)?.response?.data?.message || (errorPublicTenant as Error).message || "Failed to load public tenant"} >
        <Button asChild>
          <Link href="/signin">Go to login</Link>
        </Button>
      </ErrorMessage>
    );
  }

  // Final UI display
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <BaseAvatar src={publicTenantData?.logo} alt={publicTenantData?.name} fallbackInitials={initials} />
      <h1 className="text-2xl font-bold">Welcome to {publicTenantData?.name}</h1>
      <Card className="w-full max-w-sm">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" placeholder="John Doe" {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  disabled
                  placeholder="m@example.com"
                  autoComplete="new-password"
                  {...register("email")}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isPendingAcceptInvitation || isPendingLoginPassword}>{isPendingAcceptInvitation || isPendingLoginPassword ? <Spinner /> : "Accept Invitation"}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
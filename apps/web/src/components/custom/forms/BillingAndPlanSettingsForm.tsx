"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles } from 'lucide-react';
import { Activity } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

const billingSettingsSchema = z.object({
  billing: z.object({
    billingEmail: z.string().email('Invalid email address'),
    billingPhone: z.string().min(6, 'Invalid phone number'),
  }),
  plan: z.string().min(1, 'Please select a plan'),
});

export type BillingSettingsFormValues = z.infer<typeof billingSettingsSchema>;

interface BillingAndPlanSettingsFormProps {
  initialData?: {
    billing?: {
      billingEmail?: string;
      billingPhone?: string;
    };
    plan?: string;
  };
  onSubmit?: (data: BillingSettingsFormValues) => void;
  isLoading?: boolean;
}

export function BillingAndPlanSettingsForm({
  initialData,
  onSubmit,
  isLoading,
}: BillingAndPlanSettingsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BillingSettingsFormValues>({
    resolver: zodResolver(billingSettingsSchema),
    defaultValues: {
      billing: {
        billingEmail: initialData?.billing?.billingEmail || '',
        billingPhone: initialData?.billing?.billingPhone || '',
      },
      plan: initialData?.plan || 'trial',
    },
  });

  const currentPlan = watch('plan');

  useEffect(() => {
    if (!initialData) return;
    reset({
      billing: {
        billingEmail: initialData?.billing?.billingEmail || '',
        billingPhone: initialData?.billing?.billingPhone || '',
      },
      plan: initialData?.plan || 'trial',
    });
  }, [initialData, reset]);

  const handleFormSubmit = (data: BillingSettingsFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const plans = [
    { id: 'trial', name: 'Free Trial', price: '$0 / mo', desc: 'Up to 5 employees' },
    { id: 'pro', name: 'Pro Tier', price: '$29 / mo', desc: 'Up to 50 employees' },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', desc: 'Unlimited access' },
  ];

  return (
    <Card className="w-full max-w-3xl rounded-md py-4">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Table>
          <TableBody>
            {/* Plan Tier Selection Row */}
            <TableRow className="hover:bg-popover border-0">
              <TableCell className="align-top px-4">
                <Label className="whitespace-nowrap">Subscription Tier</Label>
              </TableCell>
              <TableCell className="w-full px-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {plans.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setValue('plan', tier.id, { shouldDirty: true })}
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        currentPlan === tier.id
                          ? 'border-primary bg-accent/50 ring-1 ring-primary'
                          : 'border-border bg-card hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{tier.name}</span>
                        {currentPlan === tier.id && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      <p className="mt-1 text-xs font-semibold text-primary">{tier.price}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{tier.desc}</p>
                    </div>
                  ))}
                </div>
                <Activity mode={errors.plan && isDirty ? 'visible' : 'hidden'}>
                  <p className="text-xs text-red-500 mt-1">{errors.plan?.message}</p>
                </Activity>
              </TableCell>
            </TableRow>
            {/* Billing Email Row */}
            <TableRow className="hover:bg-popover border-0">
              <TableCell className="px-4">
                <Label className="whitespace-nowrap">Billing Email</Label>
              </TableCell>
              <TableCell className="w-full px-4">
                <div className="flex flex-col">
                  <InputGroup>
                    <InputGroupInput
                      type="email"
                      id="billing.billingEmail"
                      placeholder="billing@company.com"
                      {...register('billing.billingEmail')}
                    />
                  </InputGroup>
                  <Activity mode={errors.billing?.billingEmail && isDirty ? 'visible' : 'hidden'}>
                    <p className="text-xs text-red-500 mt-1">{errors.billing?.billingEmail?.message}</p>
                  </Activity>
                </div>
              </TableCell>
            </TableRow>
            {/* Billing Phone Row */}
            <TableRow className="hover:bg-popover border-0">
              <TableCell className="px-4">
                <Label className="whitespace-nowrap">Billing Phone</Label>
              </TableCell>
              <TableCell className="w-full px-4">
                <div className="flex flex-col">
                  <InputGroup>
                    <InputGroupInput
                      type="text"
                      id="billing.billingPhone"
                      placeholder="+1 555-0199"
                      {...register('billing.billingPhone')}
                    />
                  </InputGroup>
                  <Activity mode={errors.billing?.billingPhone && isDirty ? 'visible' : 'hidden'}>
                    <p className="text-xs text-red-500 mt-1">{errors.billing?.billingPhone?.message}</p>
                  </Activity>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-popover border-0">
              <TableCell colSpan={2} className="px-4">
                <div className="flex justify-end items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!isDirty}
                    onClick={() =>
                      reset({
                        billing: {
                          billingEmail: initialData?.billing?.billingEmail || '',
                          billingPhone: initialData?.billing?.billingPhone || '',
                        },
                        plan: initialData?.plan || 'trial',
                      })
                    }
                    className="min-w-[75px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={isSubmitting || isLoading}
                    disabled={!isDirty || isSubmitting || isLoading}
                    className="min-w-[75px]"
                  >
                    Save
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </Card>
  );
}
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Activity } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import { 
  LEAVE_TYPE_MATERNITY_LEAVE, 
  LEAVE_TYPE_PATERNITY_LEAVE, 
  LEAVE_TYPE_MARRIAGE_LEAVE 
} from '@/helpers/constants';

const leavePolicySchema = z.object({
  description: z.string().optional(),
  maternityDays: z.number().min(0, 'Cannot be negative'),
  paternityDays: z.number().min(0, 'Cannot be negative'),
  marriageDays: z.number().min(0, 'Cannot be negative'),
});

export type LeavePolicyFormValues = z.infer<typeof leavePolicySchema>;

interface LeavePolicyTypeItem {
  type?: Record<string, number>;
}

interface LeavePolicyFormProps {
  initialData?: {
    leavePolicy?: {
      description?: string;
      types?: LeavePolicyTypeItem[];
    };
  };
  onSubmit?: (payload: {
    leavePolicy: {
      description?: string;
      types: Array<{ type: Record<string, number> }>;
    };
  }) => void;
  isLoading?: boolean;
}

export function LeavePolicyForm({ initialData, onSubmit, isLoading }: LeavePolicyFormProps) {
  const getTypeDays = (typeKey: string, defaultVal: number): number => {
    const typesArray = initialData?.leavePolicy?.types || [];
    const found = typesArray.find((item) => item.type && item.type[typeKey] !== undefined);
    return found && found.type ? found.type[typeKey] : defaultVal;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LeavePolicyFormValues>({
    resolver: zodResolver(leavePolicySchema),
    defaultValues: {
      description: initialData?.leavePolicy?.description || '',
      maternityDays: getTypeDays(LEAVE_TYPE_MATERNITY_LEAVE, 90),
      paternityDays: getTypeDays(LEAVE_TYPE_PATERNITY_LEAVE, 14),
      marriageDays: getTypeDays(LEAVE_TYPE_MARRIAGE_LEAVE, 3),
    },
  });

  useEffect(() => {
    if (!initialData) return;
    reset({
      description: initialData?.leavePolicy?.description || '',
      maternityDays: getTypeDays(LEAVE_TYPE_MATERNITY_LEAVE, 90),
      paternityDays: getTypeDays(LEAVE_TYPE_PATERNITY_LEAVE, 14),
      marriageDays: getTypeDays(LEAVE_TYPE_MARRIAGE_LEAVE, 3),
    });
  }, [initialData, reset]);

  const handleFormSubmit = (data: LeavePolicyFormValues) => {
    const types: Array<{ type: Record<string, number> }> = [
      { type: { [LEAVE_TYPE_MATERNITY_LEAVE]: data.maternityDays } },
      { type: { [LEAVE_TYPE_PATERNITY_LEAVE]: data.paternityDays } },
      { type: { [LEAVE_TYPE_MARRIAGE_LEAVE]: data.marriageDays } },
    ];

    const payload = {
      leavePolicy: {
        description: data.description,
        types,
      },
    };

    if (onSubmit) {
      onSubmit(payload);
    }
  };

  const leaveItems = [
    { id: 'maternityDays' as const, label: 'Maternity Leave', key: LEAVE_TYPE_MATERNITY_LEAVE },
    { id: 'paternityDays' as const, label: 'Paternity Leave', key: LEAVE_TYPE_PATERNITY_LEAVE },
    { id: 'marriageDays' as const, label: 'Marriage Leave', key: LEAVE_TYPE_MARRIAGE_LEAVE },
  ];

  return (
    <Card className="w-full max-w-3xl py-4 rounded-md">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Table>
          <TableBody>
            {/* Description Row */}
            <TableRow className="hover:bg-popover border-0">
              <TableCell className="align-top px-4">
                <Label className="whitespace-nowrap">Policy Notes</Label>
              </TableCell>
              <TableCell className="w-full px-4">
                <div className="flex flex-col gap-2">
                  <InputGroup>
                    <InputGroupTextarea
                      id="description"
                      placeholder="e.g. Default statutory rules for all global employees"
                      {...register('description')}
                    />
                  </InputGroup>
                  <Activity mode={errors.description && isDirty ? 'visible' : 'hidden'}>
                    <p className="text-xs text-red-500">{errors.description?.message}</p>
                  </Activity>
                </div>
              </TableCell>
            </TableRow>

            {/* Statutory Entitlements Rows */}
            {leaveItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-popover border-0">
                <TableCell className="px-4">
                  <div className="flex items-center gap-2">
                    <Label className="whitespace-nowrap">{item.label}</Label>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {item.key}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="w-full px-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <InputGroup className="w-32">
                        <InputGroupInput
                          type="number"
                          id={item.id}
                          className="text-right"
                          {...register(item.id, { valueAsNumber: true })}
                        />
                      </InputGroup>
                      <span className="text-xs text-muted-foreground">Days</span>
                    </div>
                    <Activity mode={errors[item.id] && isDirty ? 'visible' : 'hidden'}>
                      <p className="text-xs text-red-500 mt-1">{errors[item.id]?.message}</p>
                    </Activity>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Action Row */}
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
                        description: initialData?.leavePolicy?.description || '',
                        maternityDays: getTypeDays(LEAVE_TYPE_MATERNITY_LEAVE, 90),
                        paternityDays: getTypeDays(LEAVE_TYPE_PATERNITY_LEAVE, 14),
                        marriageDays: getTypeDays(LEAVE_TYPE_MARRIAGE_LEAVE, 3),
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
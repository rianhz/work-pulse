"use client";
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Save, 
  Info, 
  HeartHandshake, 
  Baby, 
  UserCheck, 
  Sparkles, 
  Clock,
  RotateCcw
} from 'lucide-react';

// Constant Keys
const LEAVE_TYPE_MATERNITY_LEAVE = 'LEAVE_TYPE_MATERNITY_LEAVE';
const LEAVE_TYPE_PATERNITY_LEAVE = 'LEAVE_TYPE_PATERNITY_LEAVE';
const LEAVE_TYPE_MARRIAGE_LEAVE = 'LEAVE_TYPE_MARRIAGE_LEAVE';

// Zod Validation Schema matching ITenantSettings
const tenantSettingsSchema = z.object({
  maternityDays: z.coerce
    .number({ error: 'Must be a number' })
    .min(0, 'Cannot be negative')
    .max(365, 'Max 365 days'),
  paternityDays: z.coerce
    .number({ error: 'Must be a number' })
    .min(0, 'Cannot be negative')
    .max(365, 'Max 365 days'),
  marriageDays: z.coerce
    .number({ error: 'Must be a number' })
    .min(0, 'Cannot be negative')
    .max(60, 'Max 60 days'),
  requireAttachment: z.boolean(),
  autoApprove: z.boolean(),
});

export default function TenantLeaveSettings() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(tenantSettingsSchema),
    defaultValues: {
      maternityDays: 90,
      paternityDays: 14,
      marriageDays: 3,
      requireAttachment: true,
      autoApprove: false,
    },
  });

  // Watch form values for real-time sidebar & JSON preview
  const formValues = useWatch({ control });

  // Transform form values to match ITenantSettings schema on submit
  const onSubmit = async (data: z.infer<typeof tenantSettingsSchema>) => {
    const payload = {
      leavePolicy: [
        {
          type: {
            [LEAVE_TYPE_MATERNITY_LEAVE]: data.maternityDays,
            [LEAVE_TYPE_PATERNITY_LEAVE]: data.paternityDays,
            [LEAVE_TYPE_MARRIAGE_LEAVE]: data.marriageDays,
          },
        },
      ],
      // Add operational settings if needed
    };

    console.log('Submitting ITenantSettings Payload:', payload);
    // await api.put('/tenant/settings', payload);
  };

  // Construct JSON payload for dynamic preview
  const previewPayload = {
    leavePolicy: [
      {
        type: {
          [LEAVE_TYPE_MATERNITY_LEAVE]: formValues.maternityDays ?? 0,
          [LEAVE_TYPE_PATERNITY_LEAVE]: formValues.paternityDays ?? 0,
          [LEAVE_TYPE_MARRIAGE_LEAVE]: formValues.marriageDays ?? 0,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top Navigation Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                AC
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none text-slate-900">Acme Corp</h1>
                <span className="text-xs text-slate-500">Tenant Settings</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => reset()}
                disabled={!isDirty}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Info Banner */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-xs text-amber-800">
              <span className="font-semibold">Default Policies Notice:</span> Adjustments made here establish default allocations for newly onboarded employees.
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Settings Form Section */}
            <div className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Special & Statutory Leave Defaults
                      </h3>
                      <p className="text-xs text-slate-500">
                        Allocations for core family and statutory entitlements (in days)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  {/* Maternity Leave Input */}
                  <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center">
                    <div className="space-y-0.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span>Maternity Leave</span>
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-600">
                          {LEAVE_TYPE_MATERNITY_LEAVE}
                        </span>
                      </label>
                      <p className="text-xs text-slate-500">
                        Paid leave allocated for biological mothers per childbirth cycle.
                      </p>
                      {errors.maternityDays && (
                        <p className="text-[11px] font-medium text-red-500">{errors.maternityDays.message}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <input
                        type="number"
                        {...register('maternityDays')}
                        className={`w-24 rounded-lg border px-3 py-1.5 text-right text-xs font-medium outline-none focus:ring-2 ${
                          errors.maternityDays 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-500">Days</span>
                    </div>
                  </div>

                  {/* Paternity Leave Input */}
                  <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center">
                    <div className="space-y-0.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span>Paternity Leave</span>
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-600">
                          {LEAVE_TYPE_PATERNITY_LEAVE}
                        </span>
                      </label>
                      <p className="text-xs text-slate-500">
                        Paid leave for new fathers or secondary primary caregivers.
                      </p>
                      {errors.paternityDays && (
                        <p className="text-[11px] font-medium text-red-500">{errors.paternityDays.message}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <input
                        type="number"
                        {...register('paternityDays')}
                        className={`w-24 rounded-lg border px-3 py-1.5 text-right text-xs font-medium outline-none focus:ring-2 ${
                          errors.paternityDays 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-500">Days</span>
                    </div>
                  </div>

                  {/* Marriage Leave Input */}
                  <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center">
                    <div className="space-y-0.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span>Marriage Leave</span>
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-600">
                          {LEAVE_TYPE_MARRIAGE_LEAVE}
                        </span>
                      </label>
                      <p className="text-xs text-slate-500">
                        Special entitlement provided for an employee's marriage.
                      </p>
                      {errors.marriageDays && (
                        <p className="text-[11px] font-medium text-red-500">{errors.marriageDays.message}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <input
                        type="number"
                        {...register('marriageDays')}
                        className={`w-24 rounded-lg border px-3 py-1.5 text-right text-xs font-medium outline-none focus:ring-2 ${
                          errors.marriageDays 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-500">Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Enforcement Rules */}
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
                  Policy Enforcement Rules
                </h3>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Require Attachment Verification</p>
                    <p className="text-xs text-slate-500">
                      Mandate medical or formal documentation uploads for Special Leaves.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue('requireAttachment', !formValues.requireAttachment, { shouldDirty: true })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formValues.requireAttachment ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        formValues.requireAttachment ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 py-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Auto-Approve Statutory Days</p>
                    <p className="text-xs text-slate-500">
                      Bypass manager sign-off if requests fall strictly within statutory thresholds.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue('autoApprove', !formValues.autoApprove, { shouldDirty: true })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formValues.autoApprove ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        formValues.autoApprove ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Summary & JSON Preview Sidebar */}
            <div className="space-y-6">
              {/* Live Summary Card */}
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Entitlement Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 py-1.5 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Baby className="h-3.5 w-3.5 text-pink-500" /> Maternity
                    </span>
                    <span className="font-semibold text-slate-900">{formValues.maternityDays as number || 0} Days</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 py-1.5 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <UserCheck className="h-3.5 w-3.5 text-blue-500" /> Paternity
                    </span>
                    <span className="font-semibold text-slate-900">{formValues.paternityDays as number || 0} Days</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 py-1.5 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Marriage
                    </span>
                    <span className="font-semibold text-slate-900">{formValues.marriageDays as number || 0} Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-2 text-[11px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Synced with React Hook Form</span>
                </div>
              </div>

              {/* Live JSON Payload Schema */}
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4 text-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-[11px] text-slate-400">JSON Payload</span>
                  <span className="font-mono text-[10px] text-emerald-400">ILeavePolicy[]</span>
                </div>
                <pre className="overflow-x-auto p-1 font-mono text-[11px] leading-relaxed text-slate-300">
                  {JSON.stringify(previewPayload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
}
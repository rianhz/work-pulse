import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, ShieldCheck } from "lucide-react";

export default function LeavePolicyReminder() {
  return (
    <Card className="p-4 w-full">
      <CardContent className="px-0">
        <div>      
          <h3 className="text-base font-bold">Policy Reminder</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Please review the general leave guidelines before submitting your request.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm">
                <span className="font-semibold">Advance Submission:</span> Planned leave (Annual, Marriage) should be requested at least <strong>3–5 business days</strong> in advance.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm">
                <span className="font-semibold">Documentation Required:</span> Sick leave exceeding <strong>2 days</strong> or specialized leave requires valid supporting documents.                    
              </p>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm">
                <span className="font-semibold">Manager Approval:</span> Extended leave (<strong>&gt;5 days</strong>) and parental leaves require prior manager review and work coverage planning.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
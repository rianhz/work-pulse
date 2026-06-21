import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ITenant } from "@/features/tenants/tenant";
import { CircleCheck, CircleQuestionMark } from "lucide-react";

export function BillingPlansSettingsForm({ tenantId, tenant, isLoading }: { tenantId: string, tenant: ITenant, isLoading: boolean }) {
  return (
    <Card className="w-full max-w-2xl py-0 rounded-md">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Label className="whitespace-nowrap">Status</Label>
            </TableCell>
            <TableCell className="w-full">
              <Label className="capitalize min-h-[27px]">{tenant?.status} <CircleCheck className="size-4 text-green-500 bg-green-500/10" /></Label>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Label className="whitespace-nowrap">Plan</Label>
            </TableCell>
            <TableCell className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2">
                <Label className="capitalize">{tenant?.plan}</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <CircleQuestionMark className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    This is the plan that currently your tenant is on.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button variant="secondary" size="sm">Change</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
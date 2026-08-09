import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMyLeaveRequests } from "@/features/leave/hooks";
import { leaveTypesOptions, STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED, statusOptions } from "@/helpers/constants";
import moment from "moment";
import Link from "next/link";
import { Activity, useMemo, useState } from "react";

export default function RecentLeaveCard() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const { data, isLoading: isLoadingLeaveRequests } = useMyLeaveRequests({ page, limit, search });

  const leaveRequests = useMemo(() => data?.data.slice(0, 5) || [], [data?.data]);

  console.log(leaveRequests);

  const getLeaveTypeLabel = (leaveType: string) => {
    return leaveTypesOptions.find((option) => option.value === leaveType)?.label;
  }

  const getStatusLabel = (status: string) => {
    return statusOptions.find((option) => option.value === status)?.label;
  }

  return (
    <Card className="p-4 w-full">
      <CardContent className="px-0">
        <Activity mode={isLoadingLeaveRequests ? 'visible' : 'hidden'}>
          <div className="flex items-center justify-center h-40">
            <Spinner className="w-7 h-7"/>
          </div>
        </Activity>
        <Activity mode={!isLoadingLeaveRequests ? 'visible' : 'hidden'}>
          <h3 className="text-base font-bold">Recent Requests</h3>
          <div className="mt-4 flex flex-col gap-2">
            <Activity mode={leaveRequests?.length === 0 ? 'visible' : 'hidden'}>
              <p className="text-sm text-muted-foreground">No recent requests</p>
            </Activity>
            <Activity mode={leaveRequests?.length && leaveRequests.length > 0 ? 'visible' : 'hidden'}>
              {leaveRequests?.map((leaveRequest, index) => (
                <div key={`leave-request-${index}`} className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">{getLeaveTypeLabel(leaveRequest.leaveType)}</p>
                    <p className="text-xs text-muted-foreground">{moment(leaveRequest.startDate).format('DD MMM YYYY')} - {moment(leaveRequest.endDate).format('DD MMM YYYY')}</p>
                  </div>
                  <Badge variant={leaveRequest.status === STATUS_PENDING ? 'pending' : leaveRequest.status === STATUS_APPROVED ? 'approved' : leaveRequest.status === STATUS_REJECTED ? 'rejected' : 'awaitingApproval'} className="min-w-[123px] text-center">{getStatusLabel(leaveRequest.status)}</Badge>
                </div>
              ))}
            </Activity>
          </div>
          <Activity mode={leaveRequests?.length && leaveRequests.length > 0 ? 'visible' : 'hidden'}>
            <Button variant="secondary" className="w-full mt-4" asChild>
              <Link href="/leave-history">View All</Link>
            </Button>
          </Activity>
        </Activity>
      </CardContent>
    </Card>
  );
}
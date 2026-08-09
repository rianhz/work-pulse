import NotificationsTable from "@/components/custom/notifications/NotificationsTable";

export default function NotificationsPage() {
    return (
        <>
            <div className="flex justify-between items-end flex-row px-0 mb-4">
                <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">Manage your notifications and stay updated with the latest updates.</p>
                </div>
            </div>
            <NotificationsTable />
        </>
    );
}
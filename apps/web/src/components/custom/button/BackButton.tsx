import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        router.replace('/leave-requests');
    }
    return (
        <Button variant="ghost" icon={ArrowLeft} iconClassName="w-4 h-4 text-muted-foreground" onClick={handleBack}>
            <span className="text-sm text-muted-foreground">Back</span>
        </Button>
    );
}
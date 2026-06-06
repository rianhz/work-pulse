import { cookies } from "next/headers";
import { getMe } from "@/features/users/api";

export default async function AuthServerProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    let user = null;

    try {

    const cookieStore = await cookies();

        user = await getMe({ Cookie: cookieStore.toString() });


    } catch (error) {

        user = null;
    }

    return (
        <>
            {children}
        </>
    );
}
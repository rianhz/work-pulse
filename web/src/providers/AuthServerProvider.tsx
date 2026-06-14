
import { getMe } from "@/features/users/api";
import AuthProvider from "./AuthProvider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthServerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    let user = null;
    try {
        const cookieStore = await cookies();
        user = await getMe({
            Cookie: cookieStore.toString(),
        })

    } catch (error) {

        user = null;
    }

    return (
        <>
            <AuthProvider initialUser={user}>
                {children}
            </AuthProvider>
        </>
    );
}
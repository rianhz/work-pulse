"use client";

import { setUser } from "@/store/reducers/userSlice";
import { useDispatch } from "react-redux";


export default function AuthProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: any;
}) {

    const dispatch = useDispatch();

    if (initialUser) {
        dispatch(setUser(initialUser));
    }

    return <>{children}</>;
}
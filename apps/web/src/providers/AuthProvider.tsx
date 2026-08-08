"use client";

import { setTenant } from "@/store/reducers/tenantSlice";
import { setUser } from "@/store/reducers/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function AuthProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: any;
}) {

    const dispatch = useDispatch();
    const fetchTenant = async () => {
        if (initialUser) {
            dispatch(setUser(initialUser));
        }
    }

    useEffect(() => {
        fetchTenant();
    }, [initialUser, dispatch]);

    return <>{children}</>;
}
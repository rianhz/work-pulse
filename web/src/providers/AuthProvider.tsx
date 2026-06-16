"use client";

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

    useEffect(() => {
        if (initialUser) {
            dispatch(setUser(initialUser));
        }
    }, [initialUser, dispatch]);

    return <>{children}</>;
}
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {

    const accessToken =
        request.cookies.get("accessToken");

    const refreshToken =
        request.cookies.get("refreshToken");

    const isAuthPage =
        request.nextUrl.pathname.startsWith("/login")

    const isProtectedPage =
        request.nextUrl.pathname.startsWith("/dashboard");

    if (
        !accessToken &&
        !refreshToken &&
        isProtectedPage
    ) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    if (
        (accessToken || refreshToken) &&
        isAuthPage
    ) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    return NextResponse.next();
}
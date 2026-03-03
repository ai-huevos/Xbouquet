import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request)

    const url = request.nextUrl
    const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')

    if (!user && !isAuthRoute && url.pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isAuthRoute) {
        const role = user.user_metadata?.role || 'shop'
        return NextResponse.redirect(new URL(`/${role}`, request.url))
    }

    if (user && url.pathname.startsWith('/supplier')) {
        const role = user.user_metadata?.role
        if (role !== 'supplier') {
            return NextResponse.redirect(new URL('/shop', request.url))
        }
    }

    if (user && url.pathname.startsWith('/shop')) {
        const role = user.user_metadata?.role
        if (role !== 'shop') {
            return NextResponse.redirect(new URL('/supplier', request.url))
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

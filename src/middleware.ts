import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    const loginUrl = new URL('/login', request.url);

    if (token) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        '/',
    ],
};

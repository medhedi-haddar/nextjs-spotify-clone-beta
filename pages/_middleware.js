import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';


export async function middleware(req) {

    const token = await getToken({ req, secret : process.env.JWT_SECRET });
    // if token exist allow the following 
    const { pathname } = req.nextUrl;

    if(token && pathname === '/login' ) {
        return NextResponse.redirect('/');
    }
    if( pathname.includes('api/auth') || token ) {
        return NextResponse.next();
    }
    if( !token && pathname !== '/' ) {
        return NextResponse.redirect('/');
    }
}
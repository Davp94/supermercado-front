import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const publicRoutes = ['/login', '/not-found']
export function middleware(request: NextRequest) {
    //url https:midomickdls.com/productos
    //nextUrl /productos
    const { pathname } = request.nextUrl;
  //Allow access to public routes
  if(publicRoutes.some((route)=> pathname.startsWith(route))){
    return NextResponse.next();
  }
  //Valid token and authenticacion
  const token = request.cookies.get('token')?.value;
  console.log("🚀 ~ middleware ~ token:", token)
  if(!token) {
     //Redirections  
    return NextResponse.redirect(new URL('/login', request.url))
  }
  //TODO valid roles and permissions
}
 
// See "Matching Paths" below to learn more
export const config = {
   matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/login",
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/admin/:path*", "/api/articles/:path*"],
};
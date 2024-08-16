import { linkedIn } from "@/lib/auth/providers/linkedin";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const url = await linkedIn.createAuthorizationURL(state, {
    scopes: ["email", "profile", "w_member_social"],
  });

  cookies().set("linkedIn_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}

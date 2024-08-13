import { lucia } from "@/lib/auth";
import { verifyVerificationCode } from "@/lib/auth/emailAuth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const body = await req.json();
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const { user } = await lucia.validateSession(sessionId);
  console.log(user);
  const code = body.code;

  console.log(code);

  const validCode = await verifyVerificationCode(user, code);

  console.log(validCode);

  if (!validCode) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  await lucia.invalidateUserSessions(user.id);

  await connectDB();

  await User.findByIdAndUpdate(user.id, {
    emailVerified: true,
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return NextResponse.json({ success: true }, { status: 200 });
};

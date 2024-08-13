import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { lucia } from ".";
import { User } from "@/models/User";
import { connectDB } from "../db";

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}
  return result;
});

export const isVerifiedEmail = async () => {
  const { user } = await validateRequest();

  if (!user) return false;

  await connectDB();

  const dbuser = await User.findOne({
    email: user.email,
  });

  if (!dbuser?.emailVerified) {
    return false;
  }

  return true;
};

import { lucia } from "@/lib/auth";
import { isVerifiedEmail, validateRequest } from "@/lib/auth/validator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const isUserAndEmailVerified = await isVerifiedEmail();

  if (!isUserAndEmailVerified) {
    return redirect("/auth/login");
  }

  const { user } = await validateRequest();

  return (
    <>
      <h1>Welcome, {user.email}</h1>
      <form action={logout}>
        <button>Sign out</button>
      </form>
    </>
  );
}

async function logout() {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/auth/login");
}

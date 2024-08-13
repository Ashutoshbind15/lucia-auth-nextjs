import { lucia } from "@/lib/auth";
import { generateEmailVerificationCode } from "@/lib/auth/emailAuth";
import { connectDB } from "@/lib/db";
import { mailSender } from "@/lib/email";
import { User } from "@/models/User";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  return (
    <>
      <h1>Create an account</h1>
      <form action={emailsignup}>
        <label htmlFor="email">email</label>
        <input name="email" id="email" type="email" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <button>Continue</button>
      </form>
    </>
  );
}

async function emailsignup(formData) {
  "use server";
  const email = formData.get("email");
  const password = formData.get("password");

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10); // 16 characters long
  await connectDB();

  await User.create({
    _id: userId,
    email,
    password_hash: passwordHash,
  });

  const code = await generateEmailVerificationCode(userId, email);
  const name = email.split("@")[0];
  await mailSender(code, "Verify your email", email);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

async function usernamesignup(formData) {
  "use server";
  const username = formData.get("username");
  const password = formData.get("password");

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10); // 16 characters long
  await connectDB();

  await User.create({
    _id: userId,
    username,
    password_hash: passwordHash,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

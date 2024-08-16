import { linkedIn } from "@/lib/auth/providers/linkedin";
import { validateRequest } from "@/lib/auth/validator";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/Account";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";

export const GET = async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("linkedIn_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  const { user, session } = await validateRequest();

  if (!user || !session) {
    return new Response(null, {
      status: 401,
    });
  }

  try {
    const tokens = await linkedIn.validateAuthorizationCode(code);

    console.log(tokens);

    const response = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      cache: "no-store",
    });
    const linkedInUser = await response.json();

    console.log(linkedInUser);

    await connectDB();

    const existingUserAccount = await Account.findOne({
      provider: "linkedIn",
      id: linkedInUser.sub,
      user_id: user.id,
    });

    // todo: see if we need to restart the session here
    // todo: see if we need to check if the email is verified and matched

    if (existingUserAccount) {
      await Account.updateOne(
        {
          provider: "linkedIn",
          id: linkedInUser.sub,
          user_id: user.id,
        },
        {
          accessToken: tokens.accessToken,
          profileUrl: linkedInUser.picture,
          isEmailVerified: linkedInUser.email_verified,
        }
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    } else {
      await Account.create({
        provider: "linkedIn",
        user_id: user.id,
        email: linkedInUser.email,
        accessToken: tokens.accessToken,
        id: linkedInUser.sub,
        profileUrl: linkedInUser.picture,
        isEmailVerified: linkedInUser.email_verified,
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }
  } catch (e) {
    // the specific error message depends on the provider

    console.error(e);

    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};

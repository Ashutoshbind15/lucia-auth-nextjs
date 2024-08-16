import { lucia } from "@/lib/auth";
import { github } from "@/lib/auth/providers/github";
import { validateRequest } from "@/lib/auth/validator";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/Account";
import { User } from "@/models/User";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";

export const GET = async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
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
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser = await githubUserResponse.json();

    await connectDB();

    const existingUserAccount = await Account.findOne({
      provider: "github",
      id: githubUser.id,
      user_id: user.id,
    });

    // todo: see if we need to restart the session here
    // todo: see if we need to check if the email is verified and matched

    if (existingUserAccount) {
      await Account.updateOne(
        {
          provider: "github",
          id: githubUser.id,
          user_id: user.id,
        },
        {
          accessToken: tokens.accessToken,
          profileUrl: githubUser.avatar_url,
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
        provider: "github",
        user_id: user.id,
        email: githubUser.email,
        accessToken: tokens.accessToken,
        id: githubUser.id,
        profileUrl: githubUser.avatar_url,
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

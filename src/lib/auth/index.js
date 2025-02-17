import { Lucia } from "lucia";
import { adapter } from "./adapter";
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attr) => {
    return {
      email: attr.email,
    };
  },
});

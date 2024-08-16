import { LinkedIn } from "arctic";

export const linkedIn = new LinkedIn(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_CLIENT_SECRET,
  process.env.LINKEDIN_REDIRECT_URI
);

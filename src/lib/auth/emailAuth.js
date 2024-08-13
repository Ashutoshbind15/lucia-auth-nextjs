import "server-only";

import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { connectDB } from "../db";
import { EmailCode } from "@/models/EmailCode";

export async function generateEmailVerificationCode(userId, email) {
  await connectDB();

  await EmailCode.deleteMany({
    user_id: userId,
  });

  const code = generateRandomString(8, alphabet("0-9"));

  await EmailCode.create({
    user_id: userId,
    email,
    code,
    expires_at: createDate(new TimeSpan(15, "m")), // 15 minutes
  });

  return code;
}

export async function verifyVerificationCode(user, code) {
  await connectDB();

  const databaseCode = await EmailCode.findOne({
    user_id: user.id,
  });

  if (!databaseCode || databaseCode.code !== code) {
    return false;
  }

  await EmailCode.deleteOne({
    user_id: user.id,
  });

  if (!isWithinExpirationDate(databaseCode.expires_at)) {
    return false;
  }
  if (databaseCode.email !== user.email) {
    return false;
  }
  return true;
}

import mongoose from "mongoose";

export const Account =
  mongoose?.models?.Account ||
  mongoose.model(
    "Account",
    new mongoose.Schema({
      id: {
        type: String,
        required: true,
      },
      provider: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      profileUrl: {
        type: String,
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      user_id: {
        type: mongoose.Schema.Types.String,
        ref: "User",
      },
      accessToken: {
        type: String,
      },
    })
  );

import mongoose from "mongoose";

export const EmailCode =
  mongoose?.models?.EmailCode ||
  mongoose.model(
    "EmailCode",
    new mongoose.Schema({
      code: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      expires_at: {
        type: Date,
      },
      user_id: {
        type: mongoose.Schema.Types.String,
        ref: "User",
      },
    })
  );

import mongoose from "mongoose";

export const Session =
  mongoose?.models?.Session ||
  mongoose.model(
    "Session",
    new mongoose.Schema(
      {
        _id: {
          type: String,
          required: true,
        },
        user_id: {
          type: String,
          required: true,
        },
        expires_at: {
          type: Date,
          required: true,
        },
      },
      { _id: false }
    )
  );

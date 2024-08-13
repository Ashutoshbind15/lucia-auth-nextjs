import mongoose from "mongoose";
import { connectDB } from "../db";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";

await connectDB();

export const adapter = new MongodbAdapter(
  mongoose.connection.collection("sessions"),
  mongoose.connection.collection("users")
);

import mongoose from "mongoose";

const url = process.env.MONGODB_URL!;
const dbName = process.env.MONGODB_NAME!;

export async function connectToDb(): Promise<void> {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(url, {
      dbName: dbName,
    });
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Cannot connect to DB");
  }
}

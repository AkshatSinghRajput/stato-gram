"use server";

import dbConnect from "@/server/utils/database";

export async function checkDatabase() {
  try {
    const connect = await dbConnect();
    if (connect) {
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error in checkDatabase: ", e);
    return false;
  }
}

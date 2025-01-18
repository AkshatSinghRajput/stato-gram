"use server";
import dbConnect from "@/server/utils/database";

// Create User form Type

type CreateUserType = {
  name: string;
  email: string;
};

export async function createUser(data: CreateUserType) {
  try {
    const connect = await dbConnect();
    if (connect) {
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error in createUser: ", e);
    return false;
  }
}
async function getClerkUserById(userId: string) {
  try {
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching Clerk user:", error);
    return null;
  }
}

export async function createUserWithClerk(userId: string) {
  try {
    const clerkUser = await getClerkUserById(userId);
    if (!clerkUser) return false;

    console.log("Clerk User:", clerkUser);

    await createUser({
      name: clerkUser.first_name + " " + clerkUser.last_name,
      email: clerkUser.email_addresses[0].email_address,
    });

    return true;
  } catch (error) {
    console.error("Error creating user with Clerk:", error);
    return false;
  }
}

import { randomBytes, randomUUID } from "node:crypto";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  console.info("[guest-api] guest sign-in request received");
  let stage = "initializing Clerk";

  try {
    const clerk = await clerkClient();
    console.info("[guest-api] Clerk client ready");
    stage = "creating guest user";
    const guestId = randomUUID().replaceAll("-", "");
    const guest = await clerk.users.createUser({
      emailAddress: [`guest-${guestId}@example.com`],
      emailAddressIdentificationStatus: ["reserved"],
      password: `${randomBytes(32).toString("base64url")}Aa1!`,
      firstName: "Guest",
      publicMetadata: { isGuest: true },
    });
    console.info("[guest-api] guest user created");

    try {
      stage = "creating sign-in ticket";
      const signInToken = await clerk.signInTokens.createSignInToken({
        userId: guest.id,
        expiresInSeconds: 60,
      });
      console.info("[guest-api] short-lived sign-in ticket created");

      return NextResponse.json(
        { ticket: signInToken.token },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (error) {
      console.error(
        "[guest-api] ticket creation failed; removing guest user",
        error,
      );
      try {
        await clerk.users.deleteUser(guest.id);
        console.info("[guest-api] incomplete guest user removed");
      } catch (cleanupError) {
        console.error(
          "[guest-api] failed to remove incomplete guest user",
          cleanupError,
        );
      }
      throw error;
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const clerkErrors =
      typeof error === "object" &&
      error !== null &&
      "errors" in error &&
      Array.isArray(error.errors)
        ? error.errors.map((item: unknown) => {
            if (typeof item !== "object" || item === null) return item;

            return {
              code: "code" in item ? item.code : undefined,
              message: "message" in item ? item.message : undefined,
              longMessage: "longMessage" in item ? item.longMessage : undefined,
            };
          })
        : undefined;
    console.error(`[guest-api] failed while ${stage}`, {
      error,
      clerkErrors,
    });
    return NextResponse.json(
      {
        error: "Unable to create a guest session.",
        ...(process.env.NODE_ENV === "development"
          ? { detail, stage, clerkErrors }
          : {}),
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
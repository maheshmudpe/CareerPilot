import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import type { RegisterPayload } from "./auth.schema.js";
import argon2 from "argon2";
import { ConflictError } from "../../common/errors/HttpErrors.js";


export const registerUser = async (payload:RegisterPayload)=> {

    const existingUser = await db

                   .select()
                   .from(usersTable)
                   .where(eq(usersTable.email , payload.email))


    if (existingUser.length > 0) {
    throw new ConflictError("Email already registered");
}
    const passwordHash = await argon2.hash(payload.password)


    const [user] = await db

         .insert(usersTable)
         .values({
            email:payload.email,
            passwordHash
         })


        .returning({

            id:usersTable.id,
            email:usersTable.email

         })

         if (!user) {
                throw new Error("Failed to create user");
            }


         return user;


}
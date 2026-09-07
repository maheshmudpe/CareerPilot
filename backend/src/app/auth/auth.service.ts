import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import type { LoginPayload, RegisterPayload } from "./auth.schema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "../../common/errors/HttpErrors.js";
import { env } from "../../config/env.js";


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


export  const loginService = async(payload:LoginPayload) => {

   const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, payload.email));

    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }


    if (!user.passwordHash) {
       throw new UnauthorizedError("Invalid email or password");

    }

     const isPasswordValid = await argon2.verify(

        user.passwordHash, 
        payload.password

     );

     if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const tokenPayload = {
    sub: user.id
};

    const token = jwt.sign(
        tokenPayload,
       env.JWT_SECRET,
        {
        expiresIn: "1h"
    }
    )


    return {
    user: {
        id: user.id,
        email: user.email
    },
    token
};

}
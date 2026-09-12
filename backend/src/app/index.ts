import express from 'express';
import type {Express} from 'express';

import { sql } from "drizzle-orm";
import { db } from '../db/index.js';

import authRouter from './auth/auth.routes.js';
import { errorHandler } from '../common/errors/ErrorHandler.js';
import profileRouter from './profile/profile.routes.js';



export function createApplication():Express{

    const app = express()


    //middlewars
    app.use(express.json());
    

    //routes
   app.use("/auth", authRouter);
   app.use('/profile' , profileRouter)


   

    app.get("/health", async (req, res) => {
    try {
        await db.execute(sql`SELECT 1`);

        res.json({
            status: "ok",
            message: "JobTrack API is running",
            database: "connected",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed",
        });
    }
});

    app.use(errorHandler)

    return app;


}
import express from 'express';
import type {Express} from 'express';

import { sql } from "drizzle-orm";
import { db } from '../db/index.js';

import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import authRouter from './auth/auth.routes.js';
import { errorHandler } from '../common/errors/ErrorHandler.js';
import profileRouter from './profile/profile.routes.js';
import companyRouter from './company/company.routes.js';
import applicationRouter from './application/application.routes.js';
import interviewRouter from './interview/interview.routes.js';
import fileRouter from './file/file.routes.js';
import dashboardRouter from './dashboard/dashboard.routes.js';
import { env } from '../config/env.js';


export function createApplication():Express{

    const app = express()
    app.use(helmet());

    //rate-limiter

    const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts. Please try again later.",
    },
});


    //cors

  app.use(
    cors({
        origin: env.FRONTEND_URL,
    }),
);


    //middlewars
    app.use(express.json());


    

    //routes
   app.use("/auth", authRateLimiter, authRouter);
   app.use('/profile' , profileRouter)
   app.use("/companies" , companyRouter)
   app.use("/applications" ,applicationRouter)
   app.use("/interviews", interviewRouter);
   app.use("/files", fileRouter);
   app.use("/dashboard", dashboardRouter);


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
import express from 'express';
import type {Express} from 'express';

import { sql } from "drizzle-orm";
import { db } from '../db/index.js';



export function createApplication():Express{

    const app = express()


    //middlewars


    //routes

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

    return app;


}
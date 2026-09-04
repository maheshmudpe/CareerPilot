import express from 'express';
import type {Express} from 'express';



export function createApplication():Express{

    const app = express()


    //middlewars


    //routes

    app.get("/" , (req,res) => {
        res.json({message: "Welcome to JobTrack"})
    })


    app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "JobTrack API is running"
    })
})


    return app;


}
import "dotenv/config";
import {createServer} from 'node:http'

import { createApplication } from './app/index.js'


async function main(){

    try {
        const server = createServer(createApplication())
        const PORT = Number(process.env.PORT) || 8080; 

        server.listen(PORT, () => {
            console.log(`jobTrack backend is listening on ${PORT}`)
        })
    } catch (error) {

        console.log("Error starting http server")
        throw error;
        
    }
}


main()
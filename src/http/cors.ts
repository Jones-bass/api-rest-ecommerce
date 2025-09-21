import type { CorsOptions } from "cors";


export const defaultCorsOptions: CorsOptions = {
    //origin: "http://localhost:3000",
    origin: "*",
    allowedHeaders: ['Content-Type', 'Authorization'] 
}

//Access-Control-Allow-Origin: http://localhost:3000
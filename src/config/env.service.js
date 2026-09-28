import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });


const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
const salt = process.env.SALT;


export let env ={
    port,
    databaseUrl,
    salt
}
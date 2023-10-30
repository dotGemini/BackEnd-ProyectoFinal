import dotenv from 'dotenv';

dotenv.config()

export default {
    port:process.env.PORT,
    mongo:process.env.MONGO_URL,
    admin:process.env.ADMIN_NAME,
    password:process.env.ADMIN_PASSWORD,
    env: process.env.ENV,
    mailing: {
        auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS
        }
    }
}
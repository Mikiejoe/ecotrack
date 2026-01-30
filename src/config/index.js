import dotenv from "dotenv";
dotenv.config();
export default {
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || "development",
    apiVersion: process.env.API_VERSION || "v1",
    database: {
        uri: process.env.MONGO_URI || "",
    },
    logs: {
        level: process.env.LOG_LEVEL || "silly",
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        from: process.env.MAIL_FROM_ADDRESS,
        manager: process.env.DEFAULT_MANAGER_MAIL || 'info@ecotrack.com'
    },
    auth: {
        jwtSecret: process.env.ACCESS_SECRET,
        accessExpiresIn: "1d",
        refreshSecret:process.env.REFRESH_SECRET,
        refreshExpiresIn: "7m"
    },
    redis:{
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
        maxRetriesPerRequest: null,
    }
};

import dotenv from "dotenv";

dotenv.config();
// Constants
const config = {
    ENV: {
        ENV: process.env.ENV,
        PORT: process.env.PORT
    },
    POSTGRES: {
        USERNAME: process.env.POSTGRES_USERNAME,
        PASSWORD: process.env.POSTGRES_PASSWORD,
        DATABASE: process.env.POSTGRES_DATABASE,
        HOST: process.env.POSTGRES_HOST,
        DIALECT: process.env.DIALECT,
    },
    AWS: {
        AWS_PROFILE: process.env.AWS_PROFILE,
        AWS_REGION: process.env.AWS_REGION,
        AWS_MEDIA_BUCKET: process.env.AWS_MEDIA_BUCKET,
    },
    JWT: {
        SECRET: process.env.JWT_SECRET
    }
};
// Export
export default config;

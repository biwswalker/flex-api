declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_PORT: string;
    API_TYPE: string;
    API_UPLOAD: string;
    JWT_SECRET_KEY: string;
    AES_SECRET_KEY: string;
    AES_SECRET_IV: string;
    BCRYPT_SALT_ROUNDS: string;
  }
}

import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVariables = [
    "PORT",
    "DATABASE_URL",
    "JWT_SECRET",
    "CLIENT_URL",
]

// Fails fast when required environment variables are missing.
requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
});

const validateDatabaseUrl = (databaseUrl: string) => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid MySQL connection URL.");
  }

  if (parsedUrl.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must start with mysql:// because Prisma is configured with provider = \"mysql\".");
  }

  if (process.env.NODE_ENV === "production" && parsedUrl.hostname === "localhost") {
    throw new Error("DATABASE_URL cannot use localhost in production. Use the public host from your hosted MySQL provider.");
  }
};

validateDatabaseUrl(process.env.DATABASE_URL!);

export const env = {
  PORT: Number(process.env.PORT),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  CLIENT_URL: process.env.CLIENT_URL!,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

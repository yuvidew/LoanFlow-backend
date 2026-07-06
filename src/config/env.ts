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

const normalizeDatabaseUrl = (databaseUrl: string) => {
  let normalizedUrl = databaseUrl.trim();

  if (normalizedUrl.startsWith("DATABASE_URL=")) {
    normalizedUrl = normalizedUrl.slice("DATABASE_URL=".length).trim();
  }

  if (
    (normalizedUrl.startsWith("\"") && normalizedUrl.endsWith("\"")) ||
    (normalizedUrl.startsWith("'") && normalizedUrl.endsWith("'"))
  ) {
    normalizedUrl = normalizedUrl.slice(1, -1).trim();
  }

  return normalizedUrl;
};

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL!);

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

  if (process.env.NODE_ENV === "production" && parsedUrl.hostname.endsWith(".internal")) {
    throw new Error("DATABASE_URL cannot use a private .internal hostname on Render. Use the public database host from your MySQL provider.");
  }
};

validateDatabaseUrl(databaseUrl);

export const env = {
  PORT: Number(process.env.PORT),
  DATABASE_URL: databaseUrl,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  CLIENT_URL: process.env.CLIENT_URL!,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

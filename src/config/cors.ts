import { CorsOptions } from "cors";

interface CorsConfig {
  allowedOrigins: string[];
}

const getCorsConfig = (config: CorsConfig): CorsOptions => {
  const { allowedOrigins } = config;

  const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  };

  return corsOptions;
};

// List of allowed origins
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

// Get CORS options based on the allowed origins
export const corsOptions = getCorsConfig({ allowedOrigins });

export default getCorsConfig;

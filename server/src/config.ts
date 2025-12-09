import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

interface Config {
  port: number;
  jwtSecret: string;
  clientUrl : string;
}

// Validation Logic
const getEnvVar = (name: string): string => {
  const value = process.env[name];
  
  if (!value) {
    // 🛑 CRITICAL: Stop the server immediately if key is missing
    console.error(`❌ FATAL ERROR: Environment variable ${name} is missing.`);
    process.exit(1); 
  }
  
  return value;
};

// Export the validated config
export const config: Config = {
  port: parseInt(process.env.PORT || "8080", 10), // Port can have a default
  jwtSecret: getEnvVar("SUPER_SECRET_KEY"),        // Secret MUST NOT have a default
  clientUrl : getEnvVar("CLIENT_URL"),
};
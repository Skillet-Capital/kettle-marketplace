import dotenv from "dotenv";
dotenv.config();

export const formatId = (id: string) => {
  const env = process.env.NODE_ENV || "DEV";
  return `${env}_${id}`;
}

import dotenv from "dotenv";
import ImageKit from "imagekit";

dotenv.config();

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error("IMAGEKIT_PUBLIC_KEY missing in .env");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY missing in .env");
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error("IMAGEKIT_URL_ENDPOINT missing in .env");
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
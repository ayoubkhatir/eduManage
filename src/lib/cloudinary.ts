import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
    cloud: {
        cloudName: "dziurs45p",
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
        apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
    }
});
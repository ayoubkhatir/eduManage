// import { Cloudinary } from "@cloudinary/url-gen";

// export const cld = new Cloudinary({
//     cloud: {
//         cloudName: "dziurs45p",
//         apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
//         apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
//     }
// });
import { v2 as cloudinary } from 'cloudinary'

export const cld = cloudinary.config({
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
    api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
})

export default cloudinary
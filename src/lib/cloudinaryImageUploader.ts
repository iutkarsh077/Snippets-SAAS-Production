import { cloudinary } from "./cloudinary";

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id?: string;
    version?: number;
    signature?: string;
    width?: number;
    height?: number;
    format?: string;
    resource_type?: string;
    created_at?: string;
    tags?: string[];
    bytes?: number;
    type?: string;
    etag?: string;
    placeholder?: boolean;
    url?: string;
    access_mode?: string;
    original_filename?: string;
  }
  

export const uploadImageCloudinary = async (file: File, folder: string) => {

    const buffer = await file.arrayBuffer();
    const byte = Buffer.from(buffer);

    return new Promise(async (resolve, reject) => {
        const stream = await cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: folder,
            },
            async (error: any, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(result as CloudinaryUploadResult);
            }
        ).end(byte);


    });
};
import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private readonly logger;
    constructor();
    uploadImage(file: Express.Multer.File): Promise<UploadApiResponse>;
    deleteImage(publicId: string): Promise<any>;
    getImage(publicId: string): Promise<any>;
    getAllImages(folder?: string): Promise<any>;
    updateImageContext(publicId: string, context: Record<string, string>): Promise<any>;
}

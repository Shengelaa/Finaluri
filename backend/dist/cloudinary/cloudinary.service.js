"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    logger = new common_1.Logger(CloudinaryService_1.name);
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadImage(file) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('No file provided for upload.');
        }
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
                if (error) {
                    this.logger.error('Cloudinary upload failed', error);
                    return reject(new common_1.InternalServerErrorException('Cloudinary upload failed'));
                }
                resolve(result);
            });
            try {
                stream_1.Readable.from(file.buffer).pipe(uploadStream);
            }
            catch (streamError) {
                this.logger.error('Error piping file buffer to stream', streamError);
                reject(new common_1.InternalServerErrorException('Streaming upload failed.'));
            }
        });
    }
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            if (result.result !== 'ok' && result.result !== 'not found') {
                throw new Error(result.result);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error deleting image ${publicId}`, error);
            throw new common_1.InternalServerErrorException('Failed to delete image.');
        }
    }
    async getImage(publicId) {
        try {
            return await cloudinary_1.v2.api.resource(publicId);
        }
        catch (error) {
            this.logger.error(`Failed to fetch image ${publicId}`, error);
            throw new common_1.InternalServerErrorException('Image retrieval failed.');
        }
    }
    async getAllImages(folder = 'uploads') {
        try {
            return await cloudinary_1.v2.api.resources({
                type: 'upload',
                prefix: folder,
                max_results: 100,
            });
        }
        catch (error) {
            this.logger.error('Failed to list images', error);
            throw new common_1.InternalServerErrorException('Could not list images.');
        }
    }
    async updateImageContext(publicId, context) {
        try {
            const contextStr = Object.entries(context)
                .map(([key, value]) => `${key}=${value}`)
                .join('|');
            return await cloudinary_1.v2.uploader.explicit(publicId, {
                context: contextStr,
                type: 'upload',
            });
        }
        catch (error) {
            this.logger.error(`Failed to update context for ${publicId}`, error);
            throw new common_1.InternalServerErrorException('Context update failed.');
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map
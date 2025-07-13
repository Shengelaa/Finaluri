import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided for upload.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            this.logger.error('Cloudinary upload failed', error);
            return reject(
              new InternalServerErrorException('Cloudinary upload failed'),
            );
          }
          resolve(result);
        },
      );

      try {
        Readable.from(file.buffer).pipe(uploadStream);
      } catch (streamError) {
        this.logger.error('Error piping file buffer to stream', streamError);
        reject(new InternalServerErrorException('Streaming upload failed.'));
      }
    });
  }

  async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(result.result);
      }
      return result;
    } catch (error) {
      this.logger.error(`Error deleting image ${publicId}`, error);
      throw new InternalServerErrorException('Failed to delete image.');
    }
  }

  async getImage(publicId: string) {
    try {
      return await cloudinary.api.resource(publicId);
    } catch (error) {
      this.logger.error(`Failed to fetch image ${publicId}`, error);
      throw new InternalServerErrorException('Image retrieval failed.');
    }
  }

  async getAllImages(folder = 'uploads') {
    try {
      return await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: 100,
      });
    } catch (error) {
      this.logger.error('Failed to list images', error);
      throw new InternalServerErrorException('Could not list images.');
    }
  }

  async updateImageContext(publicId: string, context: Record<string, string>) {
    try {
      const contextStr = Object.entries(context)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');

      return await cloudinary.uploader.explicit(publicId, {
        context: contextStr,
        type: 'upload',
      });
    } catch (error) {
      this.logger.error(`Failed to update context for ${publicId}`, error);
      throw new InternalServerErrorException('Context update failed.');
    }
  }
}

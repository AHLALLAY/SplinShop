import { publicUrlForObject, requireBucket, safeExtension } from './uploadHandler.js';
import { randomUUID } from 'node:crypto';
import { MINIO_BUCKET, getMinioClient } from './upload.client.js';
import { AppError } from '../utils/AppError.js';

class UploadService {
    async putBuffer({ buffer, mimetype, originalName, prefix = 'uploads' }) {
        requireBucket();
        if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
            throw new AppError('buffer vide ou invalide', 400);
        }

        const p = String(prefix).replace(/^\/+|\/+$/g, '');
        const ext = safeExtension(originalName);
        const objectName = `${p}/${randomUUID()}${ext}`;

        await getMinioClient().putObject(MINIO_BUCKET, objectName, buffer, buffer.length, {
            'Content-Type': mimetype || 'application/octet-stream',
        });

        return { objectName, url: publicUrlForObject(objectName) };
    }

    async removeObject(objectName) {
        requireBucket();
        if (!objectName || typeof objectName !== 'string') return;
        const key = objectName.replace(/^\/+/, '');
        await getMinioClient().removeObject(MINIO_BUCKET, key);
    }
}

export default new UploadService();

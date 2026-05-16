import { publicUrlForObject, requireBucket, safeExtension } from "../utils/uploadHandler.js"
import { randomUUID } from 'node:crypto';
import { MINIO_BUCKET, minioClient } from "./minio.client.js";
class UploadService {
    async putBuffer({ buffer, mimetype, originalName, prefix = 'uploads' }) {
        requireBucket();
        if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw Object.assign(new Error('buffer vide ou invalide'), { statusCode: 400 });

        const p = String(prefix).replace(/^\/+|\/+$/g, '');
        const ext = safeExtension(originalName);
        const objectName = `${p}/${randomUUID()}${ext}`;

        await minioClient.putObject(MINIO_BUCKET, objectName, buffer, buffer.length, {
            'Content-Type': mimetype || 'application/octet-stream',
        });

        return { objectName, url: publicUrlForObject(objectName) };
    }

    async removeObject(objectName) {
        requireBucket();
        if (!objectName || typeof objectName !== 'string') return;
        const key = objectName.replace(/^\/+/, '');
        await minioClient.removeObject(MINIO_BUCKET, key);
    }
}

export default new UploadService();
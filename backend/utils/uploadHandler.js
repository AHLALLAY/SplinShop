import { MINIO_BUCKET } from '../upload/minio.client.js';
import path from 'node:path';

export function requireBucket() {
    if (!MINIO_BUCKET) throw Object.assign(new Error('MINIO_BUCKET manquant dans .env'), { statusCode: 500 });
}

export function safeExtension(originalName) {
    const ext = path.extname(originalName || '').toLowerCase();
    if (!ext || ext.length > 5) return '';
    if (!/^\.[a-z0-9.]+$/.test(ext)) return '';
    return ext;
}

export function publicUrlForObject(objectName) {
    const base = (process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT || '').replace(/\/+$/, '');
    const key = objectName.replace(/^\/+/, '');
    return `${base}/${MINIO_BUCKET}/${key}`;
}
import { MINIO_BUCKET } from './upload.client.js';
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

/** Extrait la clé MinIO depuis une URL publique stockée en base. */
export function objectNameFromPublicUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const bucket = MINIO_BUCKET;
    if (!bucket) return null;
    const marker = `/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.slice(idx + marker.length);
}
import * as Minio from 'minio';

function buildClient() {
    const raw = process.env.MINIO_ENDPOINT;
    if (!raw) throw new Error('MINIO_ENDPOINT manquant');

    const url = new URL(raw);
    const useSSL = url.protocol === 'https:';
    const endPoint = url.hostname;
    const port = url.port ? Number(url.port) : useSSL ? 443 : 80;

    if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
        throw new Error('MINIO_ACCESS_KEY et MINIO_SECRET_KEY sont requis');
    }

    return new Minio.Client({
        endPoint,
        port,
        useSSL,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        region: process.env.MINIO_REGION || 'us-east-1',
    });
}

export const minioClient = buildClient();
export const MINIO_BUCKET = process.env.MINIO_BUCKET;

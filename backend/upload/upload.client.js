import * as Minio from 'minio';

function buildClient() {
    const raw = process.env.MINIO_ENDPOINT;
    if (!raw) throw new Error('MINIO_ENDPOINT is required');

    const url = new URL(raw);
    const useSSL = url.protocol === 'https:';
    const endPoint = url.hostname;
    const port = url.port ? Number(url.port) : useSSL ? 443 : 80;

    if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
        throw new Error('MINIO_ACCESS_KEY and MINIO_SECRET_KEY are required');
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

let _client = null;

/** Client MinIO instancié à la demande (évite un crash au boot sans MinIO). */
export function getMinioClient() {
    if (!_client) {
        _client = buildClient();
    }
    return _client;
}

export const MINIO_BUCKET = process.env.MINIO_BUCKET;

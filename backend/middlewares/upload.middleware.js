import multer from 'multer';
import path from 'node:path';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpeg', '.jpg', '.webp']);
const storage = multer.memoryStorage();

function isAllowedImage(image) {
    const ext = path.extname(image.originalname || '').toLowerCase();
    if (ALLOWED_MIMES.has(image.mimetype) || ALLOWED_EXT.has(ext)) return true;

    return false;
}

function fileFilter(req, file, cb) {
    if (isAllowedImage(file)) {
        cb(null, true);
    } else {
        cb(Object.assign(new Error('Format image non autorisé (jpeg, webp)'), { statusCode: 400 }),
            false,
        );
    }
}

const upload = multer({
    storage,
    limits: { fileSize: MAX_BYTES },
    fileFilter,
})

export const uploadCatalogImage = upload.single('image');
export const uploadProductImage = upload.array('images', 5);

export function handleMulterError(err, req, res, next) {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Fichier trop volumineux (max 5 Mo)'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message || 'Erreur upload',
        });
    }
    const status = err.statusCode || 400;
    return res.status(status).json({
        success: false,
        message: err.message || 'Erreur upload',
    });
}
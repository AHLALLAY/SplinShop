export const MAX_PRODUCT_IMAGES = 5;

export function fileKey(file) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

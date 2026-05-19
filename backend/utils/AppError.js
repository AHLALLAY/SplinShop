export class AppError extends Error {
    /**
     * @param {string} message
     * @param {number} [statusCode=500]
     * @param {Record<string, string[]>|null} [fieldErrors=null]
     */
    constructor(message, statusCode = 500, fieldErrors = null) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.fieldErrors = fieldErrors;
    }
}

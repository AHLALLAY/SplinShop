/**
 * Envoie une réponse JSON homogène `{ success, message, data? | fieldErrors? }`.
 * @param {import('express').Response} res
 * @param {{ success: boolean, status: number, message: string, data?: unknown, fieldErrors?: object }} options
 */
export function sendApiResponse(res, { success, status, message, data, fieldErrors }) {
    const body = { success, message };
    if (success) {
        body.data = data;
    } else if (fieldErrors) {
        body.fieldErrors = fieldErrors;
    }
    return res.status(status).json(body);
}
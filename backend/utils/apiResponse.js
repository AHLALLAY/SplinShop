export function sendApiResponse(res, { success, status, message, data, fieldErrors }) {
    const body = { success, message };
    if (success) {
        body.data = data;
    } else if (fieldErrors) {
        body.fieldErrors = fieldErrors;
    }
    return res.status(status).json(body);
}
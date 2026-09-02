export class HttpError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message ?? code);
        this.status = status;
        this.code = code;
    }
}

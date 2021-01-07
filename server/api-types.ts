import { User } from "./Models/user";

export type ErrorType = {
    error: string;
    code: number;
};

export type Success = {
    success: true;
};
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            context: { user?: User; token?: string };
        }
    }
}

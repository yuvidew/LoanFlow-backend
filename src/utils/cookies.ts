import {Response} from 'express';
import { COOKIE_NAME } from '../constants/cookie';
import { env } from '../config/env';

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'none' as const,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
};

// Sets the signed auth token as an httpOnly cookie.
export const setAuthCookie = (
    res: Response,
    token: string,
) => {
    res.cookie(COOKIE_NAME, token, cookieOptions);
};

// Clears the browser auth cookie during logout.
export const clearAuthCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        ...cookieOptions,
        maxAge: undefined,
    });
};

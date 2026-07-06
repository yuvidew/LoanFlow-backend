import {Response} from 'express';
import { COOKIE_NAME } from '../constants/cookie';

// Sets the signed auth token as an httpOnly cookie.
export const setAuthCookie = (
    res: Response,
    token: string,
) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
};

// Clears the browser auth cookie during logout.
export const clearAuthCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
};

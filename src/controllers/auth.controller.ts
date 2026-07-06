import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies";

// Handles login requests and sets the auth cookie.
export const login = async (
    req: Request,
    res: Response,
) => {
    const { email, password } = req.body;

    const { token, user } = await authService.login(
        email,
        password
    );

    setAuthCookie(res, token);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token : token,
        data: user,
    });
};

// Handles logout requests by clearing the auth cookie.
export const logout = async (
    _req: Request,
    res: Response,
) => {
    clearAuthCookie(res);

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
}

// Returns the currently authenticated user's profile and role.
export const me = async (
    req: Request,
    res: Response,
) => {
    return res.status(200).json({
        success: true,
        message: "Authenticated user fetched successfully",
        data: {
            id: req.user!.id,
            name: req.user!.name,
            email: req.user!.email,
            role: req.user!.role,
        },
    });
};

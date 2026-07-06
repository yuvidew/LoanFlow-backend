import { findUserByEmail } from "../repositories/auth.repository";
import { ApiError } from '../utils/api-error';
import { generateToken } from "../utils/jwt";
import { comparePassword } from "../utils/password";

// Validates credentials and returns a signed token with user role data.
export const login = async (email: string, password: string) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    };

    const isPasswordValid = await comparePassword(
        password,
        user.password,
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    };

    const token = generateToken({
        id: user.id,
        role: user.role
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}

import jwt , {SignOptions} from "jsonwebtoken";
import {env} from "../config/env";

interface JwtPayload {
  id: string;
  role: string;
}

// Signs user identity and role data into a JWT.
export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(
        payload, 
        env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
        }
    );
};

// Verifies a JWT and returns its decoded payload.
export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
}

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Hashes a plain password before storing it.
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
} 

// Compares a login password with a stored hash.
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}

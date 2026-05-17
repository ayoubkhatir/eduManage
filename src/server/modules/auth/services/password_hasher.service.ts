import { handlePassword } from "../../../utils/handle-password";

class PasswordHasher {
    async hashPassword(password: string): Promise<string> {
        return handlePassword.hash(password);
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return handlePassword.verify(password, hashedPassword);
    }
}

export const passwordHasher = new PasswordHasher();

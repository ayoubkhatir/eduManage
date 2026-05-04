import bcrypt from 'bcrypt';

export interface IPasswordHasher {
    hashPassword(password: string): Promise<string>
    comparePassword(password: string, hash: string): Promise<boolean>
}

class PasswordHasher implements IPasswordHasher {
    private saltRounds: number = 12;
    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

export const passwordHasher = new PasswordHasher();

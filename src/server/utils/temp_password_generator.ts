export function generateTemporaryPassword(name: string) {
    return name
        .toLowerCase()
        .replace(/\s+/g, "_");
}
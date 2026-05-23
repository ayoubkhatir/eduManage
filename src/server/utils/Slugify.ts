import slugify from 'slugify'

export function ToSlug(value: string) {
    return slugify(value, {
        replacement: '-',
        lower: true,
        strict: true,
        trim: true
    })
}

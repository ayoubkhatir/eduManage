import { syncAuthSession } from "#/lib/syncAuthSession"
import { redirect } from "@tanstack/react-router"

export async function checkUserOnBeforeLoad(pathname: string) {
    const PUBLIC_PATHS = new Set([
        '/',
        '/log-in',
        '/sign-up',
        '/about',
        '/pricing',
        '/security',
        '/changelog',
        '/careers',
        '/blog',
        '/press',
        '/documentation',
        '/help',
        '/community',
        '/privacy',
        '/terms',
        '/cookie-policy',
        '/licenses',
    ])

    const authData = await syncAuthSession()
    const isPublicPath = PUBLIC_PATHS.has(pathname)

    if (!authData.token && !isPublicPath) {
        console.warn(
            '[ Auth ] No token found, redirecting to login. Path:',
            pathname,
        )
        throw redirect({ to: '/', replace: true })
    }
    console.log('[ Auth ] Auth data on route load:', authData)
    return {
        authState: authData,
    }
}
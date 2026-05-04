



import {
    getRouteApi,
    useNavigate
} from '@tanstack/react-router'

import type {RegisteredRouter, RouteIds , SearchParamOptions} from '@tanstack/react-router';

import { cleanEmptyParams } from '@/utils/cleanEmptyParams';



export function useFilterResource<T extends RouteIds<RegisteredRouter["routeTree"]>,TSearchParams extends SearchParamOptions<RegisteredRouter,T, T>["search"],>(route: T) {

    const navigate = useNavigate()
    const routeApi = getRouteApi<T>(route)

    const filters  = routeApi.useSearch();
    
    const setFilters = (newFilters : Partial<typeof filters>) => {
        navigate({
            search:  cleanEmptyParams({
                    ...filters,
                    ...newFilters,
                }) as TSearchParams
            },
        )
    }
    const resetFilters = () => {
        navigate({
            search: {} as TSearchParams,
        })
    }

    return {
        filters,
        setFilters,
        resetFilters,   
    }

}
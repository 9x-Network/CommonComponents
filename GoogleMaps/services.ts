import type { RequestOptionsInit } from 'umi-request';

async function request(
    url: string,
    options?: Omit<RequestOptionsInit, 'data' | 'body'> & {
        data?: any;
        params?: Record<string, any>;
    },
) {
    const { data, params = {}, ...rest } = options || {};
    const u = new URL(url, window.location.origin);
    if (!params.key) {
        params.key = AppConfig.googleMapKey;
    }
    if (params) {
        Object.keys(params).forEach((key) => {
            u.searchParams.set(key, params[key]);
        });
    }
    const res = await fetch(u.href, {
        body: data ? JSON.stringify(data) : undefined,
        ...rest,
    });
    return await res.json();
}

export default {
    validateAddress: (options?: {
        regionCode?: string;
        locality?: string;
        administrativeArea?: string;
        postalCode?: string;
        addressLines?: string[];
        [key: string]: any;
    }) => {
        return request('https://addressvalidation.googleapis.com/v1:validateAddress', {
            method: 'POST',
            data: { address: options },
        });
    },
    getTimezone: (location: { lat: number; lng: number }) => {
        return request(`https://maps.googleapis.com/maps/api/timezone/json`, {
            params: {
                timestamp: (Date.now() / 1000).toFixed(0),
                language: 'en',
                location: [location.lat, location.lng].join(','),
            },
        });
    },

    getGeocode: (options: { address?: string; latlng?: string }) => {
        return request(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                ...options,
                language: 'en',
            },
        });
    },
};

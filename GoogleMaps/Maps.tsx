import type { APIProviderProps, MapProps } from '@vis.gl/react-google-maps';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import defaults from 'lodash/defaults';
import React, { useEffect, useMemo, useRef } from 'react';
import { useIntl } from 'umi';
import services from './services';

interface ExtEvents {
    onMapsReady?: (map: google.maps.Map) => void;
}
export interface MapsProps extends MapProps, Omit<APIProviderProps, 'apiKey'>, ExtEvents {
    apiKey?: string;
    children?: React.ReactNode;
}
export const DefaultMapCenter = {
    lat: 48,
    lng: -101,
};
export const DefaultMapZoom = 2;

function EventEmitter(props: ExtEvents) {
    const { onMapsReady } = props;
    const map = useMap();
    const mapRef = useRef<any>();
    useEffect(() => {
        if (map && !mapRef.current) {
            mapRef.current = map;
            onMapsReady?.(map);
        }
    }, [map, onMapsReady]);
    return <></>;
}
const Maps = (props: MapsProps) => {
    const { locale } = useIntl();
    const {
        // Provider's props
        apiKey = AppConfig.googleMapKey,
        language = locale,
        libraries,
        version,
        region,
        authReferrerPolicy,
        onLoad,
        children,
        // Map's props
        style,
        mapId,
        defaultCenter = DefaultMapCenter,
        defaultZoom = DefaultMapZoom,
        ...restProps
    } = props;
    const inStyle = useMemo(() => defaults(style, { height: 300 }), [style]);
    const defaultMapId = useMemo(() => `gmap_${Date.now()}`, []);
    const providerProps = useMemo(() => {
        const params = {
            apiKey,
            libraries,
            version,
            region,
            language,
            authReferrerPolicy,
            onLoad,
        };
        Object.keys(params).forEach((key) => {
            // @ts-ignore
            if (params[key] === undefined) delete params[key];
        });
        return params;
    }, [apiKey, libraries, version, region, language, authReferrerPolicy, onLoad]);
    return (
        <APIProvider {...providerProps}>
            <Map
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                style={inStyle}
                mapId={mapId || defaultMapId}
                {...restProps}
            />
            {children}
            <EventEmitter {...restProps} />
        </APIProvider>
    );
};

Maps.services = services;

export default Maps;

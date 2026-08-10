import { AdvancedMarker } from '@vis.gl/react-google-maps';
import React, { useCallback, useEffect, useState } from 'react';
import type { MapsProps } from './Maps';
import Maps from './Maps';

type Position = MapsProps['center'];
export interface AddressViewerProps extends Omit<MapsProps, 'center' | 'defaultCenter' | 'zoom'> {
    address: string | Position;
    locatedZoom?: number;
    markerIcon?: React.ReactNode;
}

const AddressViewer = (props: AddressViewerProps) => {
    const {
        address,
        markerIcon,
        disableDefaultUI = true,
        defaultZoom = 5,
        locatedZoom = 16,
        ...rest
    } = props;
    const [position, setPosition] = useState<Position>();
    const [zoom, setZoom] = useState<number>(defaultZoom);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
    const centerAndZoom = useCallback(
        (pos: Position) => {
            setPosition(pos);
            setZoom(locatedZoom);
        },
        [locatedZoom],
    );
    useEffect(() => {
        if (typeof address === 'string') {
            if (geocoder) {
                geocoder
                    .geocode({
                        address,
                    })
                    .then((res) => {
                        console.log('[Geocode]', address, '>', res);
                        const pos = res.results?.[0]?.geometry.location;
                        if (pos) centerAndZoom(pos);
                    });
            }
        } else {
            centerAndZoom(address);
        }
    }, [address, centerAndZoom, geocoder]);
    return (
        <Maps
            zoom={zoom}
            center={position}
            libraries={['marker', 'geocoding']}
            disableDefaultUI={disableDefaultUI}
            {...rest}
            onMapsReady={(map) => {
                setGeocoder(new google.maps.Geocoder());
                rest.onMapsReady?.(map);
            }}
            onZoomChanged={(evt) => {
                setZoom(evt.detail.zoom);
                rest.onZoomChanged?.(evt);
            }}
        >
            <AdvancedMarker position={position}>{markerIcon}</AdvancedMarker>
        </Maps>
    );
};

export default AddressViewer;

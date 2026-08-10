import { Marker, useMap } from '@vis.gl/react-google-maps';
import { useCallback, useEffect } from 'react';
import type { Position } from './index';

export interface CenterHandlerProps {
    center?: Position;
    locatedZoom: number;
}
const CenterHandler = (props: CenterHandlerProps) => {
    const { center, locatedZoom } = props;
    const map = useMap();

    const centerAndZoom = useCallback(
        (pos: Position, zoom: number = locatedZoom) => {
            if (!map) return;
            map.setCenter(pos);
            if (map.getZoom()! < locatedZoom) {
                map.setZoom(zoom);
            }
        },
        [locatedZoom, map],
    );

    useEffect(() => {
        if (center) centerAndZoom(center);
    }, [center, centerAndZoom]);

    return center ? <Marker position={center} /> : null;
};

export default CenterHandler;

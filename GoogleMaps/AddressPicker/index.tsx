import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import { Modal } from 'antd';
import defaults from 'lodash/defaults';
import React, { useMemo, useRef, useState } from 'react';
import type { MapsProps } from '../Maps';
import Maps from '../Maps';
import type { AutocompleteInputRef } from './AutocompleteInput';
import AutocompleteInput from './AutocompleteInput';
import CenterHandler from './CenterHandler';
import useStyles from './style.style';

export type Position = google.maps.LatLng | google.maps.LatLngLiteral;
export interface AddressPickerProps {
    trigger: React.ReactElement;
    children?: React.ReactNode;
    value?: string;
    title?: React.ReactNode;
    placeholder?: string;
    searchInputStyle?: React.CSSProperties;
    width?: number | string;
    height?: number | string;
    mapProps?: Omit<MapsProps, 'children' | 'libraries'>;
    destroyOnClose?: boolean;
    onPlaceChange?: (place: google.maps.places.PlaceResult | null) => void;
    onConfirm?: (place: google.maps.places.PlaceResult | null) => void;
    onCancel?: () => void;
    locatedZoom?: number;
    defaultPlace?: Position;
    modalStyle?: React.CSSProperties;
}
const Index = (props: AddressPickerProps) => {
    const {
        children,
        trigger,
        title = 'Google Maps',
        placeholder,
        searchInputStyle,
        width,
        height = 300,
        mapProps,
        destroyOnClose,
        onPlaceChange,
        onConfirm,
        onCancel,
        locatedZoom = 15,
        defaultPlace,
        modalStyle,
    } = props;
    const { styles } = useStyles();
    const [visible, setVisible] = useState<boolean>(false);
    const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const inputRef = useRef<AutocompleteInputRef>(null);
    const mapTrigger = useMemo(() => {
        return React.cloneElement(trigger, {
            onClick: () => setVisible(true),
        });
    }, [trigger]);
    const pmapProps = useMemo(
        () =>
            defaults(mapProps, {
                gestureHandling: 'greedy',
                disableDefaultUI: true,
            }),
        [mapProps],
    );
    const handleOk = () => {
        setVisible(false);
        onConfirm?.(place);
    };
    const handleCancel = () => {
        setVisible(false);
        onCancel?.();
    };
    const handleMapClick = (evt: MapMouseEvent) => {
        evt.stop();
        const pos = evt.detail.latLng;
        if (pos) {
            inputRef.current?.recognition({ location: pos });
        }
    };
    return (
        <>
            {mapTrigger}
            <Modal
                open={visible}
                title={title}
                onCancel={handleCancel}
                onOk={handleOk}
                width={width}
                styles={{
                    body: { padding: 0 },
                }}
                destroyOnClose={destroyOnClose}
                maskClosable={false}
                wrapClassName={styles.googlemaps}
                style={modalStyle}
            >
                <Maps
                    style={{ width: '100%', height }}
                    libraries={['marker', 'geocoding', 'places']}
                    {...pmapProps}
                    onClick={handleMapClick}
                >
                    <MapControl position={ControlPosition.LEFT_TOP}>
                        <AutocompleteInput
                            placeholder={placeholder}
                            ref={inputRef}
                            style={{ width: `calc(${width} * 0.5)`, ...searchInputStyle }}
                            onPlace={(p) => {
                                setPlace(p);
                                onPlaceChange?.(p);
                            }}
                        />
                    </MapControl>
                    <CenterHandler
                        center={place?.geometry?.location || defaultPlace}
                        locatedZoom={locatedZoom}
                    />
                    {children}
                </Maps>
            </Modal>
        </>
    );
};

export default Index;

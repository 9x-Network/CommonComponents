import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input, Menu, message } from 'antd';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import type { Position } from './index';

export interface AutocompleteInputProps {
    onPlace?: (place: google.maps.places.PlaceResult | null, map: google.maps.Map) => void;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
}

export interface AutocompleteInputRef {
    recognition: (opts: { address?: string; location?: Position; placeId?: string }) => void;
}

const AutocompleteInput = React.forwardRef<AutocompleteInputRef, AutocompleteInputProps>(
    ({ onPlace, className, style, placeholder }, ref) => {
        const map = useMap();
        const places = useMapsLibrary('places');
        const geocoding = useMapsLibrary('geocoding');
        const [focused, setFocused] = useState(false);

        // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
        const [sessionToken, setSessionToken] =
            useState<google.maps.places.AutocompleteSessionToken>();

        // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
        const [autocompleteService, setAutocompleteService] =
            useState<google.maps.places.AutocompleteService | null>(null);

        // https://developers.google.com/maps/documentation/javascript/reference/places-service
        const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(
            null,
        );

        const [predictionResults, setPredictionResults] = useState<
            google.maps.places.AutocompletePrediction[]
        >([]);

        const [inputValue, setInputValue] = useState<string>('');

        useEffect(() => {
            if (places && map) {
                setAutocompleteService(new places.AutocompleteService());
                setPlacesService(new places.PlacesService(map));
                setSessionToken(new places.AutocompleteSessionToken());
            }

            return () => setAutocompleteService(null);
        }, [map, places]);

        const fetchPredictions = useCallback(
            debounce(async (v: string) => {
                if (!autocompleteService || !v) {
                    setPredictionResults([]);
                    return;
                }

                const request = { input: v, sessionToken };
                const response = await autocompleteService.getPlacePredictions(request);

                setPredictionResults(response.predictions);
            }, 500),
            [autocompleteService, sessionToken],
        );

        const onInputChange = useCallback(
            (value: string) => {
                setInputValue(value);
                fetchPredictions(value);
            },
            [fetchPredictions],
        );

        const recognitionAddress = useCallback(
            (option: { address?: string; location?: Position; placeId?: string }) => {
                if (geocoding) {
                    const geocoder: google.maps.Geocoder = new geocoding.Geocoder();
                    geocoder.geocode(option).then(
                        (res) => {
                            const data = res.results[0];
                            setInputValue(data.formatted_address);
                            onPlace?.(data, map!);
                        },
                        (err) => {
                            message.error(err.message);
                            console.error(err);
                        },
                    );
                }
            },
            [geocoding],
        );

        const handleSuggestionClick = useCallback(
            (placeId: string) => {
                if (!places) return;
                recognitionAddress({ placeId });
            },
            [onPlace, places, placesService, sessionToken],
        );

        useImperativeHandle<any, AutocompleteInputRef>(
            ref,
            () => ({
                recognition: (opts) => {
                    recognitionAddress(opts);
                },
            }),
            [recognitionAddress],
        );

        return (
            <div className={classnames('googlemaps_autocomplete', className)} style={style}>
                <Input
                    value={inputValue}
                    onChange={(evt) => {
                        onInputChange(evt.target.value);
                    }}
                    onPressEnter={() => recognitionAddress({ address: inputValue })}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                    placeholder={placeholder}
                />
                {focused && predictionResults.length > 0 && (
                    <Menu
                        onClick={(evt) => {
                            handleSuggestionClick(evt.key);
                        }}
                    >
                        {predictionResults.map((item) => (
                            <Menu.Item key={item.place_id}>{item.description}</Menu.Item>
                        ))}
                    </Menu>
                )}
            </div>
        );
    },
);

export default AutocompleteInput;

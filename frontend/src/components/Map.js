import React, { useEffect, useState } from 'react';
import { Spinner } from "react-bootstrap";
import GoogleMapReact from 'google-map-react';
import CoordinateConverter from "../helpers/CoordinateConverter";
import { useStore } from '../store';
import { showLand } from '../actions';
import api from "../api";

const Map = () => {
    const zoom = 15;
    const center = {
        lat: 45.81,
        lng: 15.97
    };

    const [data, setData] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const result = await api.land.getAll();
            setData(result.response);
        };
        fetchData();
    }, []);

    const [state, dispatch] = useStore();

    const handleClick = (land) => {
        dispatch(showLand({id: land.Key, owner: land.Record.owner}));
    };

    const handleGoogleMapApi = (google) => {
        data && JSON.parse(data).forEach(land => {
            let coords = [];
            try {
                land.Record.coordinates.forEach(coordinates => {
                    let coordinate = CoordinateConverter.convert(coordinates.lat, coordinates.long);
                    coords.push({lat: coordinate[0], lng: coordinate[1]});
                });
            } catch (e) {
                console.error(e);
            }

            let p = new google.maps.Polygon({
                map: google.map,
                paths: coords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#00FF00',
                fillOpacity: 0.35,
            });

            google.maps.event.addListener(p, 'click', function (e) {
                handleClick(land)
            });
        });
    };

    return (
        data === undefined ?
            <Spinner animation="border"/>
            :
            <GoogleMapReact
                yesIWantToUseGoogleMapApiInternals={true}
                defaultCenter={center}
                defaultZoom={zoom}
                onGoogleApiLoaded={handleGoogleMapApi}
            >
            </GoogleMapReact>
    );
};

export default Map;

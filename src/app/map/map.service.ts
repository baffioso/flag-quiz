import { Injectable } from '@angular/core';
import { Map, Marker, NavigationControl, LngLatLike, GeoJSONSource, LngLatBoundsLike, Popup } from 'mapbox-gl';
import bbox from '@turf/bbox';
import distance from '@turf/distance';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class MapService {
    map: Map;
    style = 'mapbox://styles/baffioso/ckdr2aahn0k9n19papv2zsglu';
    center = [0, 25];
    zoom = 3;
    marker = new Marker({ color: '#e8505b' });
    popup = new Popup({ closeButton: false });
    currentLocation: LngLatLike;
    selectedCountry = new BehaviorSubject(null);

    createMap() {
        this.map = new Map({
            container: 'map',
            style: this.style,
            center: this.center as LngLatLike,
            zoom: this.zoom,
            accessToken: environment.mapboxToken,
        });

        this.map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');

        this.map.on('load', () => {
            this.addBehavior();

            this.map.addSource('country', {
                type: 'vector',
                tiles: ['https://tileserv.baffioso.dk/public.country/{z}/{x}/{y}.pbf']
            });

            this.map.addLayer({
                id: 'country',
                type: 'fill',
                source: 'country',
                'source-layer': 'public.country',
                layout: {},
                paint: {
                    'fill-color': 'rgba(255, 255, 255, 0)'
                }
            });

            this.map.addLayer({
                id: 'country_outline',
                type: 'line',
                source: 'country',
                'source-layer': 'public.country',
                layout: {},
                paint: {
                    'line-color': 'darkgray',
                    'line-width': 2
                }
            });

            this.map.addLayer({
                id: 'country_highlight',
                type: 'fill',
                source: 'country',
                'source-layer': 'public.country',
                layout: {},
                paint: {
                    'fill-color': 'rgba(0, 0, 0, 0.3)'
                },
                filter: ['in', 'iso', '']
            });
        });
    }

    addBehavior() {

        this.map.on('click', (e) => {
            const features = this.map.queryRenderedFeatures(e.point, {
                layers: ['country']
            });

            if (features) {
                this.selectedCountry.next(features[0].properties);
                this.map.setFilter('country_highlight', ['in', 'iso', this.selectedCountry.value.iso]);
            }
        });

    }

    removeHighlight() {
        this.map.setFilter('country_highlight', ['in', 'iso', '']);
    }

    zoomTo(geom) {
        const bounds = bbox(geom) as LngLatBoundsLike;
        this.map.fitBounds(bounds, { padding: 100 });
    }

    flyToDK() {
        this.map.flyTo({ center: this.center as LngLatLike, zoom: this.zoom })
    }

}

import { injectLoad } from '@analogjs/router';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { load } from './map.server';
import { JsonPipe } from '@angular/common';
import { Map, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <h2>Map of {{ date }}</h2>
    <div class="map-container" #map></div>
  `,
  styles: [
    `
      .map-container {
        position: relative;
        width: 80vw;
        height: 80vh;
      }
    `,
  ],
  imports: [JsonPipe],
})
export default class MapComponent implements AfterViewInit {
  @ViewChild('map')
  mapEl!: ElementRef<HTMLElement>;

  @Input()
  date!: string;

  map = signal<Map | undefined>(undefined);

  geoJsons = toSignal(injectLoad<typeof load>(), { requireSync: true });

  constructor() {
    effect(() => {
      if (!this.map()) return;

      this.map()!.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.geoJsons(),
        },
      });
      this.map()!.addLayer({
        id: 'route',
        type: 'line',
        source: 'points',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 8,
        },
      });

      this.map()!.jumpTo({
        center: { lat: 52.546549, lng: 13.3528732 },
        zoom: 12,
      });
    });
  }

  ngAfterViewInit(): void {
    const map = new Map({
      container: this.mapEl.nativeElement,
      style: 'https://tiles.versatiles.org/assets/styles/neutrino.json',
    })
      .addControl(new NavigationControl())
      .on('load', () => {
        this.map.set(map);
      });
  }
}

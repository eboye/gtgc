import { injectLoad } from '@analogjs/router';
import { Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { load } from './map.server';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>Map of {{ date }}</h2>
    <p>{{ chartData() | json }}</p>
  `,
  styles: [],
  imports: [JsonPipe]
})
export default class HomeComponent {
  @Input() date: string;

  chartData = toSignal(injectLoad<typeof load>(), { requireSync: true });
}

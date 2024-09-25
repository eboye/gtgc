import { injectLoad } from '@analogjs/router';
import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { load } from './index.server';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h2>Analog</h2>
    <p>{{ data() | json }}</p>
  `,
  styles: [],
  imports: [JsonPipe]
})
export default class HomeComponent {
  chartData = toSignal(injectLoad<typeof load>(), { requireSync: true });
}

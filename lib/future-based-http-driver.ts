import {Stream, MemoryStream} from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';
import {Driver} from '@cycle/run';
import {streamFromFutureForDriver} from './stream-from-future';
import {DriverInput} from './interfaces';

export class HttpSource {
  constructor(
    private _resp$$: Stream<MemoryStream<any> & { category: string }>
  ) {}

  select(category: string): Stream<MemoryStream<any>> {
    return adapt(this._resp$$.filter(r$ => r$.category == category));
  }

  static of(resp$$: any) {
    return new HttpSource(resp$$);
  }
}

export function makeFutureHTTPDriver(): Driver<any, HttpSource> {
  return function httpDriver(req$: MemoryStream<DriverInput> ) {
    const resp$$ = req$.map(streamFromFutureForDriver);
    const mainSource = HttpSource.of(resp$$);
    // Kick it off
    resp$$.subscribe({
      next: () => {},
      error: () => {},
      complete: () => {}
    });
    return mainSource;
  };
}

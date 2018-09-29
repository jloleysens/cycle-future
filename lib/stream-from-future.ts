import {Cancel, Future} from "fluture";
import xs, {Producer} from "xstream";
import {adapt} from "@cycle/run/lib/adapt";
import {DriverInput} from './interfaces';

export const streamFromFuture = <L = any, R = L>(future: Future<L, R>) => {
  let ref: Cancel;

  const futureProducer: Producer<any> = {
    start: l => {
      ref = future.fork(
        err => {
          throw err;
        },
        val => {
          if (val instanceof Error) {
            l.error(val);
          } else {
            l.next(val);
          }
        }
      );
    },
    stop: () => ref && ref()
  };

  let f$ = xs.create(futureProducer).remember();

  f$.subscribe({
    next: () => {},
    error: () => {},
    complete: () => {}
  });

  f$ = adapt(f$);

  return f$;
};

export const streamFromFutureForDriver = (config: DriverInput) => {
  const {future} = config;

  const f$ = streamFromFuture(future);

  Object.defineProperty(f$, "category", {
    value: config.category,
    writable: false
  });

  return f$;
};
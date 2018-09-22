import { Cancel } from "fluture";
import xs, { Producer } from "xstream";
import { adapt } from "@cycle/run/lib/adapt";
import { DriverInput } from './interfaces';

export const streamFromFuture = (
  config: DriverInput
) => {
  const {future} = config;
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

  Object.defineProperty(f$, "category", {
    value: config.category,
    writable: false
  });

  return f$;
};

import {streamFromFuture, makeHTTPDriver, HttpSource} from './'
import ava from 'ava';
import {isFuture, Future} from 'fluture';
import {Stream} from 'xstream';

ava('streamFromFuture', t => {

  const f = Future.of(null);
  const stream = streamFromFuture({future: f, category: 'test'});

  t.true(isFuture(f), 'f is a future');
  t.true(stream instanceof Stream, 'we have a stream from a future');

  t.pass();
});

ava.cb('makeHTTPDriver', t => {
  t.plan(4);

  const future = Future.of(null);
  const category = 'nulls';
  const null$ = Stream.of({future, category});
  const driver = makeHTTPDriver();
  const source = driver(null$);
  const null$from$$ = source.select(category).flatten();

  t.true(typeof driver == 'function', 'driver is a function');
  t.true(source instanceof HttpSource, 'driver is a function that produces HTTP sources, given a stream');
  t.true(null$from$$ instanceof Stream, 'can get subbed stream from stream of streams in HTTP source');

  null$from$$.subscribe({
    next: v => {
      t.is(v, null, 'got expected value; null');
      t.end();
    }
  });
});
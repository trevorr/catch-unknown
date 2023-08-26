import { asError, isError } from './index';

class MyClass {
  toString() {
    return 'hello';
  }
}

const symbol = Symbol('world');

test('isError(new Error())', () => {
  expect(isError(new Error())).toBe(true);
});

test('isError({ name: "foo", message: "bar" })', () => {
  expect(isError({ name: 'foo', message: 'bar' })).toBe(true);
});

test('isError({ name: "foo", message: "bar", stack: "" })', () => {
  expect(isError({ name: 'foo', message: 'bar', stack: '' })).toBe(true);
});

test('isError({ name: "foo" })', () => {
  // no message
  expect(isError({ name: 'foo' })).toBe(false);
});

test('isError({ message: "bar" })', () => {
  // no name
  expect(isError({ message: 'bar' })).toBe(false);
});

test('isError({ name: "foo", message: "bar", stack: true })', () => {
  // wrong type for stack
  expect(isError({ name: 'foo', message: 'bar', stack: true })).toBe(false);
});

test('isError({})', () => {
  expect(isError({})).toBe(false);
});

test('isError(new MyClass())', () => {
  expect(isError(new MyClass())).toBe(false);
});

test('isError("some string")', () => {
  expect(isError('some string')).toBe(false);
});

test('isError(function f() {})', () => {
  expect(isError(function f() {})).toBe(false);
});

test('isError(symbol)', () => {
  expect(isError(symbol)).toBe(false);
});

test('isError(null)', () => {
  expect(isError(null)).toBe(false);
});

test('isError(undefined)', () => {
  expect(isError(undefined)).toBe(false);
});

test('asError(new Error())', () => {
  const err = new Error();
  expect(asError(err)).toBe(err);
  expect(err instanceof Error).toBe(true);
});

test('asError({ name: "foo", message: "bar" })', () => {
  const err = { name: 'foo', message: 'bar' };
  expect(asError(err)).toBe(err);
  expect(err instanceof Error).toBe(false);
});

test('asError({ name: "foo", message: "bar", stack: "" })', () => {
  const err = { name: 'foo', message: 'bar', stack: '' };
  expect(asError(err)).toBe(err);
  expect(err instanceof Error).toBe(false);
});

test('asError({ name: "foo" })', () => {
  const err = asError({ name: 'foo' });
  expect(err.name).toEqual('Object');
  expect(err.message).toEqual('{"name":"foo"}');
  expect(err.toString()).toEqual('Object: {"name":"foo"}');
  expect(err instanceof Error).toBe(true);
});

test('asError({ message: "bar" })', () => {
  const err = asError({ message: 'bar' });
  expect(err.name).toEqual('Object');
  expect(err.message).toEqual('bar');
  expect(err.toString()).toEqual('Object: bar');
  expect(err instanceof Error).toBe(true);
});

test('asError({ name: "foo", message: "bar", stack: true })', () => {
  const err = asError({ name: 'foo', message: 'bar', stack: true });
  expect(err.name).toEqual('Object');
  expect(err.message).toEqual('bar');
  expect(err.toString()).toEqual('Object: bar');
  expect(err instanceof Error).toBe(true);
});

test('asError({})', () => {
  const err = asError({});
  expect(err.name).toEqual('Object');
  expect(err.message).toEqual('{}');
  expect(err.toString()).toEqual('Object: {}');
  expect(err instanceof Error).toBe(true);
});

test('asError({ value: 42 })', () => {
  const err = asError({ value: 42 });
  expect(err.name).toEqual('Object');
  expect(err.message).toEqual('{"value":42}');
  expect(err.toString()).toEqual('Object: {"value":42}');
  expect(err instanceof Error).toBe(true);
});

test('asError(circular)', () => {
  const circular: Record<string, object | null> = { self: null };
  // causes JSON.stringify() to throw, falling back to String()
  circular.self = circular;
  const err = asError(circular);
  expect(err.name).toEqual('Object');
  expect(err.message).toEqual('[object Object]');
  expect(err.toString()).toEqual('Object: [object Object]');
  expect(err instanceof Error).toBe(true);
});

test('asError(new MyClass())', () => {
  const err = asError(new MyClass());
  expect(err.name).toEqual('MyClass');
  expect(err.message).toEqual('hello');
  expect(err.toString()).toEqual('MyClass: hello');
  expect(err instanceof Error).toBe(true);
});

test('asError("some string")', () => {
  const err = asError('some string');
  expect(err.name).toEqual('string');
  expect(err.message).toEqual('some string');
  expect(err.toString()).toEqual('string: some string');
  expect(err instanceof Error).toBe(true);
});

test('asError(function f() {})', () => {
  const err = asError(function f() {});
  expect(err.name).toBe('function');
  // exact representation is implementation-defined:
  // https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.tostring
  expect(err.message).toMatch(/^function/);
  expect(err.toString()).toMatch(/^function: function/);
  expect(err instanceof Error).toBe(true);
});

test('asError(symbol)', () => {
  const err = asError(symbol);
  expect(err.name).toEqual('symbol');
  expect(err.message).toEqual('Symbol(world)');
  expect(err.toString()).toEqual('symbol: Symbol(world)');
  expect(err instanceof Error).toBe(true);
});

test('asError(42)', () => {
  const err = asError(42);
  expect(err.name).toEqual('number');
  expect(err.message).toEqual('42');
  expect(err.toString()).toEqual('number: 42');
  expect(err instanceof Error).toBe(true);
});

test('asError(false)', () => {
  const err = asError(false);
  expect(err.name).toEqual('boolean');
  expect(err.message).toEqual('false');
  expect(err.toString()).toEqual('boolean: false');
  expect(err instanceof Error).toBe(true);
});

test('asError(null)', () => {
  const err = asError(null);
  expect(err.name).toEqual('object');
  expect(err.message).toEqual('null');
  expect(err.toString()).toEqual('object: null');
  expect(err instanceof Error).toBe(true);
});

test('asError(undefined)', () => {
  const err = asError(undefined);
  expect(err.name).toEqual('undefined');
  expect(err.message).toEqual('undefined');
  expect(err.toString()).toEqual('undefined: undefined');
  expect(err instanceof Error).toBe(true);
});

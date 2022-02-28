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
});

test('asError({ name: "foo", message: "bar" })', () => {
  const err = { name: 'foo', message: 'bar' };
  expect(asError(err)).toBe(err);
});

test('asError({ name: "foo", message: "bar", stack: "" })', () => {
  const err = { name: 'foo', message: 'bar', stack: '' };
  expect(asError(err)).toBe(err);
});

test('asError({ name: "foo" })', () => {
  expect(asError({ name: 'foo' })).toEqual({
    name: 'Object',
    message: '{"name":"foo"}',
  });
});

test('asError({ message: "bar" })', () => {
  expect(asError({ message: 'bar' })).toEqual({
    name: 'Object',
    message: 'bar',
  });
});

test('asError({ name: "foo", message: "bar", stack: true })', () => {
  expect(asError({ name: 'foo', message: 'bar', stack: true })).toEqual({
    name: 'Object',
    message: 'bar',
  });
});

test('asError({})', () => {
  expect(asError({})).toEqual({ name: 'Object', message: '{}' });
});

test('asError({ value: 42 })', () => {
  expect(asError({ value: 42 })).toEqual({
    name: 'Object',
    message: '{"value":42}',
  });
});

test('asError(circular)', () => {
  const circular: Record<string, object | null> = { self: null };
  // causes JSON.stringify() to throw, falling back to String()
  circular.self = circular;
  expect(asError(circular)).toEqual({
    name: 'Object',
    message: '[object Object]',
  });
});

test('asError(new MyClass())', () => {
  expect(asError(new MyClass())).toEqual({
    name: 'MyClass',
    message: 'hello',
  });
});

test('asError("some string")', () => {
  expect(asError('some string')).toEqual({
    name: 'string',
    message: 'some string',
  });
});

test('asError(function f() {})', () => {
  const err = asError(function f() {});
  expect(err.name).toBe('function');
  // exact representation is implementation-defined:
  // https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-function.prototype.tostring
  expect(err.message).toMatch(/^function/);
});

test('asError(symbol)', () => {
  expect(asError(symbol)).toEqual({
    name: 'symbol',
    message: 'Symbol(world)',
  });
});

test('asError(42)', () => {
  expect(asError(42)).toEqual({ name: 'number', message: '42' });
});

test('asError(false)', () => {
  expect(asError(false)).toEqual({ name: 'boolean', message: 'false' });
});

test('asError(null)', () => {
  expect(asError(null)).toEqual({ name: 'object', message: 'null' });
});

test('asError(undefined)', () => {
  expect(asError(undefined)).toEqual({
    name: 'undefined',
    message: 'undefined',
  });
});

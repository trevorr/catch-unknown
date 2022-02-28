function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null;
}

function getObjectMessage(obj: Record<string, unknown>): string {
  if (typeof obj.message === 'string') {
    return obj.message;
  }
  if (obj.toString !== Object.prototype.toString) {
    return obj.toString();
  }
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}

export function isError(err: unknown): err is Error {
  return (
    isObject(err) &&
    typeof err.name === 'string' &&
    typeof err.message === 'string' &&
    (!('stack' in err) || typeof err.stack === 'string')
  );
}

export function asError(err: unknown): Error {
  if (isError(err)) return err;
  const name = (isObject(err) && err.constructor.name) || typeof err;
  const message = isObject(err) ? getObjectMessage(err) : String(err);
  return { name, message };
}

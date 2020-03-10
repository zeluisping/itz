import { InvalidValue, Validator } from '../../itz';

export function itzArray<T>(...validators: Array<Validator<T>>): Validator<T[] | undefined> {
  return (_, value) => {
    if (value instanceof Array === false) {
      return InvalidValue;
    }

    const arr: T[] = [];
    const keys = Object.keys(value);
    for (const key of keys) {
      for (const validator of validators) {
        const validated = validator(key, value[key]);
        if (validated[0] === false) {
          continue;
        }
        arr[arr.length] = validated[1];
      }
      return InvalidValue;
    }
    return [true, arr];
  };
}

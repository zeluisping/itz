import { INVALID_VALUE, Validator } from '../../itz';

export type ValidatorArray<T extends any> = Array<Validator<T>>;
export type ValidatorArrayInfer<T extends ValidatorArray<any>> = T extends ValidatorArray<infer R> ? R : never;

export function itzEither<R extends ValidatorArray<any>>(...rest: R): Validator<ValidatorArrayInfer<R>> {
    return (key, value) => {
        for (const fn of rest) {
            const r = fn(key, value);
            if (r[0] === true) {
                return r;
            }
        }
        return INVALID_VALUE;
    };
}

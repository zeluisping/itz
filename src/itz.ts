import {
    itzAny,
    itzArray,
    itzAsBoolean,
    itzAsDate,
    itzAsNumber,
    itzAsOptionalBoolean,
    itzAsOptionalDate,
    itzAsOptionalNumber,
    itzAsOptionalString,
    itzAsString,
    itzBoolean,
    itzDefault,
    itzEither,
    itzNull,
    itzNumber,
    itzObject,
    itzOptional,
    itzOptionalBoolean,
    itzOptionalNull,
    itzOptionalNumber,
    itzOptionalObject,
    itzOptionalString,
    itzString,
    itzUndefined,
} from './validators';

/**
 * ValidatorReturn generic type, it accepts a single type parameter
 * which is the type of the value being validated.
 *
 * The type `readonly [false,undefined]` in the resulting union has
 * been superseeded by just `[false]`, the resulting behaviour is
 * the same and involves cleaner code with less clutter.
 */
export type ValidatorReturn<T extends any> = readonly [true, T] | readonly [false] | readonly [false, undefined];
export type Validator<T extends any> = (key: string, value: any) => ValidatorReturn<T>;

export type OptionalValidatorReturn<T> = readonly [true, T] | readonly [true, undefined];
export type OptionalValidator<T> = (key: string, value: any) => OptionalValidatorReturn<T>;

export interface IStructure {
    [K: string]: Validator<any>;
}
export type ValidatorType<T extends Validator<any>> = T extends Validator<infer R> ? R : never;

export const InvalidValue: readonly [false] = [false];
export const OptionalValue: readonly [true, undefined] = [true, undefined];

export const itz = Object.freeze({
    // Primitives
    Boolean: itzBoolean,
    Number: itzNumber,
    String: itzString,
    Object: itzObject,
    Null: itzNull,
    Undefined: itzUndefined,
    Any: itzAny,

    // Optional Primitives
    OptionalBoolean: itzOptionalBoolean,
    OptionalNumber: itzOptionalNumber,
    OptionalString: itzOptionalString,
    OptionalObject: itzOptionalObject,
    OptionalNull: itzOptionalNull,

    // Converters
    AsBoolean: itzAsBoolean,
    AsNumber: itzAsNumber,
    AsString: itzAsString,
    AsDate: itzAsDate,

    // Optional Converters
    AsOptionalBoolean: itzAsOptionalBoolean,
    AsOptionalDate: itzAsOptionalDate,
    AsOptionalNumber: itzAsOptionalNumber,
    AsOptionalString: itzAsOptionalString,

    // Generic
    Optional: itzOptional,
    Either: itzEither,
    Default: itzDefault,
    Array: itzArray,

    A<T extends IStructure>(
        structure: T,
    ): (what: { [K: string]: any }) => { [K in keyof T]: ValidatorType<T[K]> } | undefined {
        const keys = Object.keys(structure);
        return (what: { [K: string]: any }): { [K in keyof T]: ValidatorType<T[K]> } | undefined => {
            const r: { [K: string]: any } = {};
            for (const key of keys) {
                const [ok, value] = structure[key](key, what[key]);
                if (ok === false) {
                    return undefined;
                }
                r[key] = value;
            }
            return r as any;
        };
    },
});

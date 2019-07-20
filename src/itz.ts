import {
    itzAny,
    itzAsBoolean,
    itzAsDate,
    itzAsNumber,
    itzAsString,
    itzBoolean,
    itzEither,
    itzNull,
    itzNumber,
    itzObject,
    itzOptional,
    itzOptionalBoolean,
    itzOptionalEither,
    itzOptionalNull,
    itzOptionalNumber,
    itzOptionalObject,
    itzOptionalString,
    itzString,
    itzUndefined,
} from './validators';

/**
 * ValidatorReturn generic type, it accepts a single type parameter
 * which is the type of the value being returned in case of success.
 *
 * The type `readonly [false,undefined]` in the resulting union has
 * been superseeded by just `[false]`, the resulting behaviour is
 * the same and involves cleaner code with less clutter.
 */
export type ValidatorReturn<T extends any> = readonly [true, T] | readonly [false] | readonly [false, undefined];
export type Validator<T extends any> = (key: string, value: any) => ValidatorReturn<T>;
export interface IStructure {
    [K: string]: Validator<any>;
}
export type ValidatorType<T extends Validator<any>> = T extends Validator<infer R> ? R : never;

export interface IItz
    extends Readonly<{
        // Primitives
        Boolean: typeof itzBoolean;
        Number: typeof itzNumber;
        String: typeof itzString;
        Object: typeof itzObject;
        Null: typeof itzNull;
        Undefined: typeof itzUndefined;
        Any: typeof itzAny;

        // Converters
        AsBoolean: typeof itzAsBoolean;
        AsNumber: typeof itzAsNumber;
        AsString: typeof itzAsString;
        AsDate: typeof itzAsDate;

        // Generic
        Optional: typeof itzOptional;
        Either: typeof itzEither;

        // Constants
        INVALID_VALUE: readonly [false];

        // Validator constructor
        A<T extends IStructure>(
            structure: T,
        ): (what: { [K: string]: any }) => { [K in keyof T]: ValidatorType<T[K]> } | undefined;
    }> {}

export const INVALID_VALUE: readonly [false] = [false];
export const OPTIONAL_DEFAULT: readonly [true, undefined] = [true, undefined];
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

    // Generic
    Optional: itzOptional,
    Either: itzEither,

    // Constants
    INVALID_VALUE,
    OPTIONAL_DEFAULT,

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
export default itz;

type Primitive = 'boolean' | 'number' | 'string' | 'object' | 'null' | 'undefined';
type OptionalPrimitive = 'boolean?' | 'number?' | 'string?' | 'object?' | 'null?';
type PrimitiveConvert = 'as string' | 'as number' | 'as boolean';
type OptionalPrimitiveConvert = 'as string?' | 'as number?' | 'as boolean?';
type PrimitiveUpgrade = 'Date';
type OptionalPrimitiveUpgrade = 'Date?';

const PrimitiveUpgrades = ['Date'];

type PrimitiveToType<T extends Primitive> = T extends 'boolean'
    ? boolean
    : never | T extends 'number'
    ? number
    : never | T extends 'string'
    ? string
    : never | T extends 'object'
    ? object
    : never | T extends 'null'
    ? null
    : never | T extends 'undefined'
    ? undefined
    : never;

type OptionalPrimitiveToType<T extends OptionalPrimitive> = T extends 'boolean?'
    ? boolean | undefined
    : never | T extends 'number?'
    ? number | undefined
    : never | T extends 'string?'
    ? string | undefined
    : never | T extends 'object?'
    ? object | undefined
    : never | T extends 'null?'
    ? null | undefined
    : never;

type PrimitiveConvertToType<T extends PrimitiveConvert> = T extends 'as string'
    ? string
    : never | T extends 'as number'
    ? number
    : never | T extends 'as boolean'
    ? boolean
    : never;

type OptionalPrimitiveConvertToType<T extends OptionalPrimitiveConvert> = T extends 'as string?'
    ? string | undefined
    : never | T extends 'as number?'
    ? number | undefined
    : never | T extends 'as boolean?'
    ? boolean | undefined
    : never;

type PrimitiveUpgradeToType<T extends PrimitiveUpgrade> = T extends 'Date' ? Date : never;

type OptionalPrimitiveUpgradeToType<T extends OptionalPrimitiveUpgrade> = T extends 'Date?' ? Date | undefined : never;

type PrimitiveArrayToType<T extends Primitive[]> = PrimitiveToType<T[number]>;

export interface ICreatorStructure {
    [K: string]:
        | Primitive
        | Primitive[]
        | OptionalPrimitive
        | PrimitiveConvert
        | OptionalPrimitiveConvert
        | PrimitiveUpgrade
        | OptionalPrimitiveUpgrade;
}

function isOptionalPrimitive(what: ICreatorStructure[string]): what is OptionalPrimitive {
    return typeof what === 'string' && what.endsWith('?');
}

function isPrimitiveConvert(what: ICreatorStructure[string]): what is PrimitiveConvert {
    return typeof what === 'string' && what.startsWith('as ') && what.endsWith('?') === false;
}

function isOptionalPrimitiveConvert(what: ICreatorStructure[string]): what is OptionalPrimitiveConvert {
    return typeof what === 'string' && what.startsWith('as ') && what.endsWith('?');
}

function includes<T>(arr: readonly T[], value: T): boolean {
    if (!arr) {
        return false;
    }
    for (const v of arr) {
        if (v === value) {
            return true;
        }
    }
    return false;
}

function isPrimitiveUpgrade(what: ICreatorStructure[string]): what is PrimitiveUpgrade {
    return typeof what === 'string' && includes(PrimitiveUpgrades, what);
}

function isOptionalPrimitiveUpgrade(what: ICreatorStructure[string]): what is OptionalPrimitiveUpgrade {
    return (
        typeof what === 'string' && what.endsWith('?') && includes(PrimitiveUpgrades, what.substr(0, what.length - 1))
    );
}

export function ensureExhaustion(x: never): void {
    return;
}

export type ValidatorType<T> = T extends (...args: any[]) => infer R ? NonNullable<R> : never;
export type PostValidatorType<T> = (data: T) => boolean;
export type UnfoldCreatorType<T extends ICreatorStructure> = {
    [K in keyof T]: T[K] extends OptionalPrimitive
        ? OptionalPrimitiveToType<T[K]>
        : T[K] extends Primitive[]
        ? PrimitiveArrayToType<T[K]>
        : T[K] extends Primitive
        ? PrimitiveToType<T[K]>
        : T[K] extends PrimitiveConvert
        ? PrimitiveConvertToType<T[K]>
        : T[K] extends OptionalPrimitiveConvert
        ? OptionalPrimitiveConvertToType<T[K]>
        : T[K] extends PrimitiveUpgrade
        ? PrimitiveUpgradeToType<T[K]>
        : T[K] extends OptionalPrimitiveUpgrade
        ? OptionalPrimitiveUpgradeToType<T[K]>
        : never; // should never happen since CreatorTemplate does not allow it
};

export default function<
    T extends ICreatorStructure,
    O extends {
        [K in keyof T]: T[K] extends OptionalPrimitive
            ? OptionalPrimitiveToType<T[K]>
            : T[K] extends Primitive[]
            ? PrimitiveArrayToType<T[K]>
            : T[K] extends Primitive
            ? PrimitiveToType<T[K]>
            : T[K] extends PrimitiveConvert
            ? PrimitiveConvertToType<T[K]>
            : T[K] extends OptionalPrimitiveConvert
            ? OptionalPrimitiveConvertToType<T[K]>
            : T[K] extends PrimitiveUpgrade
            ? PrimitiveUpgradeToType<T[K]>
            : T[K] extends OptionalPrimitiveUpgrade
            ? OptionalPrimitiveUpgradeToType<T[K]>
            : never; // should never happen since CreatorTemplate does not allow it
    }
>(
    structure: T,
    postValidator?: PostValidatorType<O>,
): ((what: { [K: string]: any }) => O | null) &
    Readonly<{ structure: Readonly<typeof structure>; postValidator?: (data: O) => boolean }> {
    const validator = (what: { [K: string]: any }): O | null => {
        if (!what) {
            return null;
        }

        const result: { [K: string]: any } = {};

        for (const key of Object.keys(structure)) {
            const tmp: ICreatorStructure[string] = structure[key];

            // prepare these for cleaner code
            const value: any = what[key];
            const valuetype = typeof value;

            if (isPrimitiveConvert(tmp)) {
                switch (tmp) {
                    case 'as string':
                        // check if value type is a convertible type [string | number | boolean]
                        if (valuetype === 'string' || valuetype === 'number' || valuetype === 'boolean') {
                            // it's an accepted value for conversion, convert to string
                            result[key as string] = '' + value;
                            break;
                        }
                        // value is not convertible, fail
                        return null;
                    case 'as number':
                        // check the value is convertible to number [string && !isNaN() | number | boolean]
                        if (
                            (valuetype === 'string' && isNaN(+value) === false) ||
                            valuetype === 'number' ||
                            valuetype === 'boolean'
                        ) {
                            // string gets converted to number, we made sure it is one
                            // number remains unchanged, and boolean becomes 0 (false) or 1 (true)
                            result[key as string] = +value;
                            break;
                        }
                        // value is not convertible, fail
                        return null;
                    case 'as boolean':
                        // check if the value is convertible to boolean ['true' | 'false' | '0' | '1' | number | boolean]
                        if (valuetype === 'string' && includes(['true', 'false', '0', '1'], value.toLowerCase())) {
                            // value is convertible from string, compare against accepted truthy values
                            result[key as string] = value.toLowerCase() === 'true' || value === '1';
                            break;
                        } else if (valuetype === 'number' || valuetype === 'boolean') {
                            // value is convertible from number or boolean; boolean remains unchanged and
                            // number gets converted where 0 (zero) is false and anyting else is true
                            result[key as string] = !!value;
                            break;
                        }
                        // value is not convertible, fail
                        return null;
                    default:
                        throw ensureExhaustion(tmp);
                }

                // it was a conversion type, move on to next field
                continue;
            }

            if (isOptionalPrimitiveConvert(tmp)) {
                // it is a convert type, check which one and convert
                switch (tmp) {
                    case 'as string?':
                        // check if value type is a convertible type [string | number | boolean]
                        if (valuetype === 'string' || valuetype === 'number' || valuetype === 'boolean') {
                            // it's an accepted value for conversion, convert to string
                            result[key as string] = '' + value;
                            break;
                        }

                        // value is not convertible, use undefined
                        result[key as string] = undefined;
                        break;
                    case 'as number?':
                        // check the value is convertible to number [string && !isNaN() | number | boolean]
                        if (
                            (valuetype === 'string' && isNaN(+value) === false) ||
                            valuetype === 'number' ||
                            valuetype === 'boolean'
                        ) {
                            // string gets converted to number, we made sure it is one
                            // number remains unchanged, and boolean becomes 0 (false) or 1 (true)
                            result[key as string] = +value;
                            break;
                        }

                        // value is not convertible, use undefined
                        result[key as string] = undefined;
                        break;
                    case 'as boolean?':
                        // check if the value is convertible to boolean ['true' | 'false' | '0' | '1' | number | boolean]
                        if (valuetype === 'string' && includes(['true', 'false', '0', '1'], value.toLowerCase())) {
                            // value is convertible from string, compare against accepted truthy values
                            result[key as string] = value.toLowerCase() === 'true' || value === '1';
                            break;
                        } else if (valuetype === 'number' || valuetype === 'boolean') {
                            // value is convertible from number or boolean; boolean remains unchanged and
                            // number gets converted where 0 (zero) is false and anyting else is true
                            result[key as string] = !!value;
                            break;
                        }

                        // value is not convertible, use undefined
                        result[key as string] = undefined;
                        break;
                    default:
                        // make sure we handle all possible UTypeConvert values
                        throw ensureExhaustion(tmp);
                }

                // it was a conversion type, move on to next field
                continue;
            }

            if (isPrimitiveUpgrade(tmp)) {
                // it is a primitive upgrade, check which one and upgrade
                switch (tmp) {
                    case 'Date':
                        // only works for relevant types
                        if (valuetype === 'number' || valuetype === 'string') {
                            // create the date instance
                            const date = new Date(value);

                            // make sure the date is valid
                            if (isNaN(date.getTime()) === true) {
                                // value is not convertible, fail
                                return null;
                            }

                            // all good, store the date object
                            result[key as string] = new Date(value);

                            // all done, continue to next field
                            continue;
                        }
                        // value is not convertible, fail
                        return null;
                    default:
                        // make sure we handle all possible PrimitiveUpgrade values
                        ensureExhaustion(tmp);
                }

                // it was an upgrade type, move on to next field
                continue;
            }

            if (isOptionalPrimitiveUpgrade(tmp)) {
                // is is an optional primitive upgrade, check which one and upgrade
                switch (tmp) {
                    case 'Date?':
                        // only works for relevant types
                        if (valuetype === 'number' || valuetype === 'string') {
                            // create the date instance
                            const date = new Date(value);

                            // make sure the date is valid
                            if (isNaN(date.getTime()) === true) {
                                // value is not convertible, use undefined
                                result[key as string] = undefined;

                                // all done, continue to next field
                                continue;
                            }

                            // all good, store the date object
                            result[key as string] = new Date(value);

                            // all done, continue to next field
                            continue;
                        }

                        // value is not upgradeable, optional results in undefined then
                        result[key as string] = undefined;

                        // and procced to next field
                        continue;
                    default:
                        // make sure we handle all possible OptionalPrimitiveUpgrade values
                        ensureExhaustion(tmp);
                }

                // it was an optional upgrade type, move on to next field
                continue;
            }

            // unfold optional primitives (and make primitives a single element array)
            const types: Primitive[] =
                typeof tmp !== 'string'
                    ? tmp
                    : isOptionalPrimitive(tmp)
                    ? [tmp.substr(0, tmp.length - 1) as Primitive, 'undefined']
                    : [tmp];

            // check if value is acceptable
            if (
                (value === null && includes(types, 'null')) === false &&
                includes(types, valuetype as Primitive) === false
            ) {
                return null;
            }

            // value is acceptable, store it for result
            result[key as string] = value;
        }

        return typeof postValidator === 'function'
            ? postValidator(result as O) === true
                ? (result as O)
                : null
            : (result as O);
    };

    return Object.freeze(
        Object.assign(validator, {
            postValidator,
            structure: Object.freeze(structure),
        }),
    );
}

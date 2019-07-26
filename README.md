![itz logo](logo.png)

`itz` is a TypeScript library for performing runtime object type validation, while offering correct intellisense, it allows you to write custom type validations, giving you the hability to validate complex type structures.

Besides being able to validate fields, you can also mutate them, and even give back a completely different type from what came in.

If you really wanted you could even go as far as making HTTP requests (or anything else really) inside a validator and use the result of such an operation as the validated value. For cases like this don't forget that any time spent doing such extra work is extra time spent validating the object. Also when any field fails validation, all previous already validated fields are discarded, throwing away any extra fancy processing you may want to perform.

# Index

-   [Example Usage](#Example-Usage)
-   [Custom Validators](#Custom-Validators)
-   [Documentation](#Documentation)
    -   [Constants](#Constants)
        -   [InvalidValue](#InvalidValue)
        -   [OptionalValue](#OptionalValue)
    -   [Validators](#Validators)
        -   [Primitives](#Primitive-Validators)
            -   [itz.Boolean](#itz.Boolean)
            -   [itz.Number](#itz.Number)
            -   [itz.String](#itz.String)
            -   [itz.Object](#itz.Object)
            -   [itz.Null](#itz.Null)
            -   [itz.Undefined](#itz.Undefined)
            -   [itz.Any](#itz.Any)
        -   [Converters](#Converters)
            -   [itz.AsBoolean](#itz.AsBoolean)
            -   [itz.AsDate](#itz.AsNumber)
            -   [itz.AsNumber](#itz.AsString)
            -   [itz.AsString](#itz.AsObject)
        -   [Generics](#Generics)
            -   [itz.Default](#itz.Default)
-   [Documentation TODO](#Documentation-TODO)

# Example Usage

A simple example usege would be performing validation on request data.

For example, here we quickly validate `req.params` to ensure it matches the structure we want. In this case we'll be wanting two fields:

-   `name` that **must** be a `string`
-   `age` that should be convertible to a `number` and if not then `undefined` (for being optional)

```typescript
import { Router } from 'express';
import itz from 'itz';

const router = Router();
export default router;

const GreetParams = itz.A({
    name: itz.String,
    age: itz.AsOptionalNumber, // same as: itz.Optional(itz.AsNumber)
});

router.use('/greet/:name/:age?', (req, res) => {
    const params = GreetParams(req.params);
    if (typeof params === 'undefined') {
        res.status(401).send('Have you been drinking?');
        return;
    }
    if (typeof params.age === 'undefined') {
        res.status(200).send(`Hello there ${params.name}! How old are you?`);
        return;
    }
    if (params.age < 18) {
        res.status(403).send(`You're too young to be here ${params.name}!`);
        return;
    }
    res.status(200).send(`Hello there ${params.name}! You're ${params.age}, not too shabby.`);
});
```

Here the declared local variable `params` is of the type `undefined | { name: string, age: number | undefined }`. If validation fails `undefined` is returned, otherwise it returns the new validated object.

# Custom Validators

The signature of a validator must comply with the type `Validator`
All you need to write a custom validator is to create a function that follows the type `Validator`. Following is an example validator that validates a string literal type union:

```typescript
import { InvalidValue, ValidatorReturn } from 'itz';

export type ESpan = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
function isESpan(x: any): x is ESpan {
    switch (x) {
        case 'hourly':
        case 'daily':
        case 'weekly':
        case 'monthly':
        case 'yearly':
            return true;
        default:
    }
    return false;
}

export function itzESpan(key: string, value: any): ValidatorReturn<ESpan> {
    if (isESpan(value) === true) {
        return [true, value];
    }
    return InvalidValue;
}
```

The way a validator is written, allows us to do post processing on the value before returning it into the final object. With this you can also do more advanced processing of any kind; you can go as crazy as making an HTTP request to a remote server for retrieving a default value, anything goes. When doing such crazy things remember that if a field further ahead, from the one your validator is currently working on, fails to be validated, the whole partial object that had already been validated will be discarded as the main porpuse of this library is to validate the object against the whole wanted structure.

The return type of a validator is a tuple with either of the forms:

-   `[false]` on failure (use constant `InvalidValue`)
-   `[false,undefined]` **@deprecated** alias for `[false]`
-   `[true, T]` on success where `T` is the type you're validating

For simplicity, checkout [Constants](#Constants)

-   the first element is the `ok` flag; `true` means validated and `false` means failure
-   the second element has two options
    -   when `ok === false` it **must** be `undefined`
    -   of type `T` (the type you're validating) when `ok === true`; alternative to doing `return [false,undefined]`, creating tuples all the time, you can just use the constant `return itz.INVALID_VALUE`. For optional validators instead of always having do do `return [true,undefined]`, also creating tuples all time, you can just do `return itz.OPTIONAL_DEFAULT`.

The key being validated is provided for any case where it might be useful, only the keys from the given structure are validated, any extra keys the object being validated might have are just ignored.

# Constants

To aid in the creation of custom validators, a few constants where created for common validation results.

### InvalidValue

Defined simply as `readonly [false]` this constant can be used by validators when validation fails, making it more expressive.

### OptionalValue

Defined simply as `readonly [true, undefined]` this constant is meant to be used with optional validators, when validation fails and so the fallback optional value `undefined` is used.

# Validators

Validators are the foundation of this library, as they are the ones in charge of all the type checking, value conversions and what not.

## Primitives

Primitives directly represent the primitives of the language. They're the most strict type of validators as the input value must have exactly the type we want, and nothing more.

### itz.Boolean

This validator ensures that the type of the value is specifically `boolean`, failing if not.

A field that passes this validation will have the type `boolean`.

### itz.Number

This validator ensures that the type of the value is specifically `number`, failing if not.

A field that passes this validation will have the type `number`.

### itz.String

This validator ensures that the type of the value is specifically `string`, failing if not.

A field that passes this validation will have the type `string`.

### itz.Object

This validator ensures that the type of the value is specifically `object`, failing if not. Despite that `typeof null === 'object'`, this validator does not consider `null` to be a valid value.

A field that passes this validation will have the type `object`.

### itz.Null

This validator ensures that the value is specifically `null`, failing if not.

A field that passes this validation will have the type `null`.

### itz.Undefined

This validator ensures the value is specifically `undefined`, failing if not.

A field that passes this validation will have the type `undefined`.

### itz.Any

This validator always passes. The resulting field will be of type `any`.

## Converters

Converters are a _special_ kind of validators. Well not really special as both have the same signatures and a similar porpuse. The difference being that these validators usually give back a completely new value derived from the original.

### itz.AsBoolean

Attempts to convert the value to a `boolean`, failing if not known how.

Conversions are possible from the following types:

-   `boolean` (no conversion)
-   `number`
    -   `false` when `0`
    -   `true` when anything but `0`
-   `string`
    -   `true` when `"1"` or `"true"`
    -   `false` when `"0"` or `"false"`

A field that passes this validation will have the type `boolean`.

### itz.AsDate

Attempts to convert the value to a `Date`, failing if not known how.

Conversions are possible from the following types:

-   `Date` (no conversion)
-   `number` [@see Unix Timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Unix_timestamp)
    > An integer value representing the number of milliseconds since January 1, 1970, 00:00:00 UTC (the Unix epoch), with leap seconds ignored.
-   `string` [@see Timestamp String]()
    > A string value representing a date, specified in a format recognized by the [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) method ...

A field that passes this validation will have the type `Date`.

### itz.AsNumber

Attempts to convert the value to a `number`, failing if not known how.

Conversions are possible from the following types:

-   `number` (no conversion)
-   `string` fails if not a number representation (**NaN**)
-   `boolean`
    -   `1` when `true`
    -   `0` when `false`

A field that passes this validation will have the type `number`.

### itz.AsString

Attempts to convert the value to a `string`, failing if not known how.

Conversions are possible from the following types:

-   `string` (no conversion)
-   `number` (string representation of the number)
-   `boolean`
    -   `"true"` when `true`
    -   `"false"` when `false`

A field that passes this validation will have the type `string`.

## Generics

The porpuse of these generics is to give you a lot more flexibility in defining your validation structures. Since they're generic, they can be used together with other kinds of validators as to compose a new type validation. Essentially they are but different composition methods.

### itz.Default

This generic makes any other validator always have a fallback value, taking over validators that result in either an [`InvalidValue`](#InvalidValue) or [`OptionalValue`](#OptionalValue). This means any field with a default will never fail nor have the type `undefined`.

#### Signature

```typescript
function <T, X extends Exclude<T, undefined>>(
    validator: Validator<T>,
    Default: X,
)
```

Any field with this generic is guaranteed to always return the value of type `T` (the type being validated).

---

# Documentation TODO

-   `itz.A`
-   **Validators**
    -   **Generic**
        -   `itz.Either`
        -   `itz.Optional`
    -   **Optional Converters**
        -   `itz.AsOptionalBoolean`
        -   `itz.AsOptionalDate`
        -   `itz.AsOptionalNumber`
        -   `itz.AsOptionalString`
    -   **Optional Primitives**
        -   `itz.OptionalBoolean`
        -   `itz.OptionalNumber`
        -   `itz.OptionalString`
        -   `itz.OptionalObject`
        -   `itz.OptionalNull`

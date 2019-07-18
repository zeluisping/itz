![itz logo](logo.png)

`itz` is a TypeScript library for performing runtime object type validation, while offering correct intellisense.

The package was written in a way that will allow the developer to write custom field validations, this means you won't be limited by the already provided field validators.

# Example Usage

A great example of usage would be for an Express powered API, where we would perform type and value checks, at the beggining of every endpoint, for any data that we want to use from request, be it `query`, `body`, or any other.

Following is a simple example endpoint where we're validating `req.params`:
```typescript
import { Router } from 'express';
import itz from '.';

const router = Router();
export default router;

const GreetParams = itz.A({
    name: itz.String,
    age: itz.Optional(itz.AsNumber),
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
        return
    }
    res.status(200).send(`Hello there ${params.name}! You're ${params.age}, not too shabby.`);
});
```

# Writing Custom Validators

All you need to write a custom validator is to create a function that follows the type `Validator`. Following is an example validator that validates a string literal type union.
```typescript
import { ValidatorReturn } from '../../itz';

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
            return false;
    }
}

export function itzESpan(key: string, value: any): ValidatorReturn<ESpan> {
    return isESpan(value) ? [true, value] : [false, undefined];
}
```

The way a validator is written, allows us to do post processing on the value before returning it into the final object. With this you can also do more advanced processing of any kind; you can go as crazy as making an HTTP request to a remote server for retrieving a default value, anything goes. When doing such crazy things remember that if a field further ahead, from the one your validator is working currently on, fails to be validated, the whole partial object that had already been validated will be discarded as the main porpuse of this library is to validate the object against the whole wanted structure.

The return type of a validator is a tuple with two elements: the first element is the `ok` flag (`true` means validated, `false` means failure), the second element must be `undefined` when `ok === false` and of type `T` (from the return type of your validator, `ValidatorReturn<T>`) when `ok === true`.

The key being validated is provided for any case where it might be useful, only the keys from the given structure are validated, any extra keys the object being validated might have are just ignored.

## Documentation
A complete documentation will be written, until then I've left here the basics on how to use this. Really there is not much more to it.

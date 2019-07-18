import { Validator } from '../../itz';

// tslint:disable-next-line: interface-name class-name
export interface itzEither {
    <A extends any, B extends any>(a: Validator<A>, b: Validator<B>): Validator<A | B>;
    <A extends any, B extends any, C extends any>(a: Validator<A>, b: Validator<B>, c: Validator<C>): Validator<
        A | B | C
    >;
    <A extends any, B extends any, C extends any, D extends any>(
        a: Validator<A>,
        b: Validator<B>,
        c: Validator<C>,
        d: Validator<D>,
    ): Validator<A | B | C | D>;
}

export const itzEither: itzEither = (
    a: Validator<any>,
    b: Validator<any>,
    c?: Validator<any>,
    d?: Validator<any>,
    e?: Validator<any>,
): Validator<any> => {
    return (key, value) => {
        const ar = a(key, value);
        if (ar[0] === true) {
            return ar;
        }
        const br = b(key, value);
        if (br[0] === true) {
            return br;
        }
        if (typeof c === 'undefined') {
            return [false, undefined];
        }
        const cr = c(key, value);
        if (cr[0] === true) {
            return cr;
        }
        if (typeof d === 'undefined') {
            return [false, undefined];
        }
        const dr = d(key, value);
        if (dr[0] === true) {
            return dr;
        }
        if (typeof e === 'undefined') {
            return [false, undefined];
        }
        return e(key, value);
    };
};

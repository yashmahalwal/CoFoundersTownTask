type Resolve<T> = (value: T) => void;
type Reject = (reason?: unknown) => void;
export type ResolvablePromise<T> = {
    promise: Promise<T>;
    reject: Reject;
    resolve: Resolve<T>;
};

export function makeResolvable<T>(
    promiseCtor: Promise<T>
): ResolvablePromise<T> {
    let resolve: Resolve<T>;
    let reject: Reject;

    const promise = new Promise<T>((_resolve, _reject) => {
        reject = _reject;
        resolve = _resolve;
        promiseCtor.then(_resolve).catch(_reject);
    });

    return { promise, reject, resolve };
}

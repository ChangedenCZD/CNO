module.exports = (promise, returnPromise = false) => {
    if (returnPromise) {
        return promise;
    } else {
        return (async () => {
            return await promise;
        })();
    }
};
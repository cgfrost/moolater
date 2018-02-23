class SkipjaqAuth {

    getToken(skipjaq, debug) {
        return new Promise((resolve, reject) => {
            skipjaq.post('auth', debug, {},
                     resolve,
                     reject);
        });
    }

}

/* eslint-env node*/

module.exports = class StubSkipjaq {

    post(path, debug, params, body, complete, error) {
        complete({path: path,
            debug: debug,
            params: params,
            body: body,
            complete: complete,
            error: error
        });
    }

};
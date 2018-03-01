/* eslint-env jasmine, node*/

let StubSkipjaq = require("./helpers/StubSkipjaq");

describe("Test the SkipjaqAction API calls", function() {

    let skipjaq = new StubSkipjaq();
    let skipjaqAction;

    beforeEach(function() {
        let SkipjaqAction = this.loadClass("src/background/SkipjaqAction.js");
        skipjaqAction = new SkipjaqAction();
    });

    it("getToken with the expected parameters.", function(done) {

        skipjaqAction.getToken(skipjaq, true, "bob", "password").then((resp) => {
            expect(resp.path).toBe("auth");
            expect(resp.debug).toBe(true);
            expect(resp.params).toEqual({});
            expect(resp.body.user).toBe("bob");
            expect(resp.body.password).toBe("password");
            done();
        }, (error) => {
            fail(`Error caught ${error}`);
        });

    });

});


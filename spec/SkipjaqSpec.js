/* eslint-env jasmine, node*/

describe("Test the Skipjaq API calls", function() {

    let skipjaq;

    beforeEach(function() {
        let Skipjaq = this.loadClass("src/background/Skipjaq.js");
        skipjaq = new Skipjaq("INVALID");
    });

    it("setToken.", function() {
        expect(skipjaq.isUserReady(false)).toBe(false);
        skipjaq.setToken("anything");
        expect(skipjaq.isUserReady(false)).toBe(true);
    });

    it("isUserReady.", function() {
        expect(skipjaq.isUserReady(false)).toBe(false);
    });

});


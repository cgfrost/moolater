import md5 from './md5';

export default class {

  constructor(data) {
    if (!data.a || !data.b) {
      throw `Milk Error: Missing data. ${md5("bob")}`;
    }
    this.data = data;
  }

  isUserAuthenticated(callback, onError) {
    browser.storage.local.get(["token", "frob"]).then(callback, onError);
  }


}

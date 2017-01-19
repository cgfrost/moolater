
window.hello = (name) => {
  return `Hello ${name}`;
};

console.warn("LOADED A MODULE");


// export default class {
//
//   constructor(data) {
//     if (!data.a || !data.b) {
//       throw 'Milk Error: Missing data.';
//     }
//     this.data = data;
//   }
//
//   hello (name) {
//     return `Hello ${name}`;
//   }
//
//   /**
//    * Generates a RTM authentication URL
//    *
//    * @return     URL String
//    */
//   getAuthUrl () {
//     var params = {
//       api_key: data.a,
//       perms: this.permissions
//     };
//     params.frob = this.frob;
//     return AUTH_URL + this.encodeUrlParams(params);
//   }
//
//
// };

// function proxyMap() {
//   // could even be a ref inside the proxy
//   const keys = new Map();
//   let keySequence = 0;

//   const map = proxy({
//     internalState: {},
//     get(k) {
//       return this.internalState[keys.get(k)];
//     },
//     set(k, v) {
//       keySequence++;

//       const proxyKey = canProxy(k) ? proxy(k) : k;
//       keys.set(proxyKey, keySequence);
//       this.internalState[keySequence] = v;

//       return this;
//     },
//   });

//   // seal object, hide properties etc...

//   return map;
// }

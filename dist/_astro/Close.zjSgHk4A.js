var u={exports:{}},t={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function v(){if(x)return t;x=1;var n=Symbol.for("react.transitional.element"),d=Symbol.for("react.fragment");function i(R,r,e){var s=null;if(e!==void 0&&(s=""+e),r.key!==void 0&&(s=""+r.key),"key"in r){e={};for(var o in r)o!=="key"&&(e[o]=r[o])}else e=r;return r=e.ref,{$$typeof:n,type:R,key:s,ref:r!==void 0?r:null,props:e}}return t.Fragment=d,t.jsx=i,t.jsxs=i,t}var a;function p(){return a||(a=1,u.exports=v()),u.exports}var l=p();function k({className:n}){return l.jsx("svg",{className:n,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:l.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})}export{k as C,l as j};

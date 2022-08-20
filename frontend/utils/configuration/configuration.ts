import SimpleCrypto from "simple-crypto-js";

const cipherKey = "&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRf";
const ethraw = "xyz";
const hhraw = "abc";

export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);

export const hh_Resell_Contract_Address = "";
export const hh_NFT_Contract_Address = "";
const hhrpc = "http://localhost:8545";

export var mainnet = hhrpc;

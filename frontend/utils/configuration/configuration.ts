import SimpleCrypto from "simple-crypto-js";

const cipherKey = "&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRf";
const ethraw = "xyz";
const hhraw = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);

export const hh_Resell_Contract_Address =
  "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690";
export const hh_NFT_Contract_Address =
  "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";
const hhrpc = "http://localhost:8545";

export var mainnet = hhrpc;

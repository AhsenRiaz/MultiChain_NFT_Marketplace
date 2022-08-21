import SimpleCrypto from "simple-crypto-js";

const cipherKey = "&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRf";
const ethraw = "xyz";
const hhraw = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);

export const hh_Resell_Contract_Address =
  "0x0165878A594ca255338adfa4d48449f69242Eb8F";
export const hh_NFT_Contract_Address =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const hhrpc = "http://localhost:8545";

export var mainnet = hhrpc;

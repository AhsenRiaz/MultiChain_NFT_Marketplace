import SimpleCrypto from "simple-crypto-js";
import { create } from "ipfs-http-client";

const cipherKey = "&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRf";
const ethraw = "xyz";
const hhraw =
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);

export const hh_Resell_Contract_Address =
  "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
export const hh_NFT_Contract_Address =
  "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

export const hh_NFT_Create_Address =
  "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

export const hh_Resell_Custom_NFT_Address =
  "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
const hhrpc = "http://localhost:8545";

let projectId = "2Do1aq9LEnyxqFwrmPtm77e7nZZ";
let projectSecret = "795fa7af4645b27c69a6e2fe4a152d75";
export let auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
// ifps config
export const client = create("https://ipfs.infura.io:5001/api/v0" as any);

export var mainnet = hhrpc;

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
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const hh_NFT_Contract_Address =
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const hh_NFT_Create_Address =
  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

export const hh_Resell_Custom_NFT_Address =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const hhrpc = "http://localhost:8545";

let projectId = "2Do1aq9LEnyxqFwrmPtm77e7nZZ";
let projectSecret = "795fa7af4645b27c69a6e2fe4a152d75";
export let auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
// ifps config
export const client = create("https://ipfs.infura.io:5001/api/v0" as any);

export var mainnet = hhrpc;

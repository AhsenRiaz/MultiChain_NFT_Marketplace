import SimpleCrypto from "simple-crypto-js";

const cipherKey = "&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRf";
const ethraw = "xyz";
const hhraw = process.env.NEXT_PUBLIC_PRIVATE_KEY as any;

export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);

export let hh_Resell_Contract_Address =
  "0xC06bbF6F52E6FB2a699868e90BcC140c691DAff3";

export let hh_NFT_Contract_Address =
  "0xAfE4F995C1bCf3017fB84303D63Bc7677c0FA91e";

export const hh_NFT_Create_Address =
  "0xff05aF051AAa442c8c0d8B768EdbB4f2d32A77A4";

export const hh_Resell_Custom_NFT_Address =
  "0x68f10D9b6292a031e23c560408e8C7556919a350";

const hhrpc = process.env.NEXT_PUBLIC_RPC as any;

export var mainnet = hhrpc;

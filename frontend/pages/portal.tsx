import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import {
  Card,
  Button,
  Input,
  Col,
  Row,
  Spacer,
  Container,
  Text,
  Grid,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  cipherHH,
  hh_NFT_Contract_Address,
  mainnet,
  simpleCrypto,
} from "../utils/configuration/configuration";

const Portal = () => {
  const [user, setUser] = useState<string | null>(null);
  const [resalePrice, setResalePrice] = useState({ price: "" });
  const [nfts, setNfts] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    connecUser();
  }, [setNfts, setUser]);

  const connecUser = async () => {
    try {
      if (window.ethereum && Web3.givenProvider) {
        await Web3.givenProvider.enable();
        let web3 = new Web3(Web3.givenProvider);
        let accounts = await web3.eth.getAccounts();
        let account = accounts[0];
        setUser(account);
      }
    } catch (err) {}
  };

  const getWalletNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(mainnet);
      const key = simpleCrypto.decrypt(cipherHH).toString();
      const wallet = new ethers.Wallet(key, provider);
      const contract = new ethers.Contract(hh_NFT_Contract_Address, [], wallet);
      const itemArray = [] as any;
      contract.totalSupply().then((result: any) => {
        let totalSup = parseInt(result);
        for (let i = 0; i < totalSup; i++) {
          var token = i + 1;
          const owner = contract.ownerOf(token).catch(function (error: Error) {
            console.log("getWalletNFTs: owner error");
          });
          const rawUri = contract
            .tokenUri(token)
            .catch(function (error: Error) {
              console.log("getWalletNFTs: tokenUri error");
            });
          const Uri = Promise.resolve(rawUri);
          const getUri = Uri.then((value) => {
            let str: string = value;
            let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
            console.log("cleanUri", cleanUri);
            let metadata = axios.get(cleanUri).catch(function (error: any) {
              console.log(error);
            });
            return metadata;
          });
          getUri.then((value) => {
            let rawImg = value && value.data && value.data.image;
            let name = value && value.data && value.data.name;
            let desc = value && value.data && value.data.desc;
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            Promise.resolve(owner).then((value) => {
              let owner = value;
              let meta = {
                name: name,
                img: image,
                tokenId: token,
                wallet: owner,
                desc,
              };
              console.log(meta);
              itemArray.push(meta);
            });
          });
        }
      });
      await new Promise((r) => setTimeout(r, 3000));
      setNfts(itemArray);
    } catch (err) {}
  };

  return <div>portal</div>;
};

export default Portal;

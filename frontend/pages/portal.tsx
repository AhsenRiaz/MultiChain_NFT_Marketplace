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
  Link,
  Progress,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  auth,
  cipherHH,
  hh_NFT_Contract_Address,
  hh_NFT_Create_Address,
  hh_Resell_Contract_Address,
  mainnet,
  simpleCrypto,
} from "../utils/configuration/configuration";
import { Collection_Contract_Abi } from "../utils/contracts/Collection";
import Loader from "../components/Loader";
import { NftMarketResell_Contract_Abi } from "../utils/contracts/NftMarketResell";
import { Create_NFT_ABI } from "../utils/contracts/CreateNFT";

const Portal = () => {
  const router = useRouter();

  const [user, setUser] = useState<string | null>(null);
  const [resalePrice, setResalePrice] = useState<string | null>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [createdNfts, setCreatedNfts] = useState<any[]>([]);

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [nftsFound, setNftsFound] = useState<boolean>(false);

  useEffect(() => {
    connectUser();
    getWalletNFTs();
    getCreatedNfts();
  }, [setNfts, user, nftsFound, setCreatedNfts]);

  const connectUser = async () => {
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
      setLoadingState(true);
      const provider = new ethers.providers.JsonRpcProvider(mainnet);
      const key = simpleCrypto.decrypt(cipherHH).toString();
      const wallet = new ethers.Wallet(key, provider);
      const contract = new ethers.Contract(
        hh_NFT_Contract_Address,
        Collection_Contract_Abi,
        wallet
      );
      const itemArray = [] as any;
      contract.totalSupply().then((result: any) => {
        let totalSup = parseInt(result);
        for (let i = 0; i < totalSup; i++) {
          var token = i + 1;
          const owner = contract.ownerOf(token).catch(function (error: Error) {
            console.log("getWalletNFTs: owner error");
          });
          const rawUri = contract
            .tokenURI(token)
            .catch(function (error: Error) {
              console.log("getWalletNFTs: tokenUri error");
            });
          const Uri = Promise.resolve(rawUri);
          const getUri = Uri.then((value) => {
            let str: string = value;
            let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
            let metadata = axios.get(cleanUri).catch(function (error: any) {
              console.log(error);
            });
            return metadata;
          });
          getUri.then((value) => {
            let rawImg = value && value.data && value.data.image;
            let name = value && value.data && value.data.name;
            let desc = value && value.data && value.data.description;
            let image =
              rawImg && rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            Promise.resolve(owner).then((value) => {
              if (value === user) {
                setNftsFound(true);
                let owner = value;
                let meta = {
                  name: name,
                  img: image,
                  tokenId: token,
                  wallet: owner,
                  desc,
                };
                itemArray.push(meta);
              } else {
                setNfts([]);
              }
            });
          });
        }
      });
      await new Promise((r) => setTimeout(r, 3000));
      setNfts(itemArray);
      setLoadingState(false);
    } catch (err) {
      setLoadingState(false);
      console.log("Error occured");
    }
  };

  const getCreatedNfts = async () => {
    try {
      setLoadingState(true);
      const provider = new ethers.providers.JsonRpcProvider(mainnet);
      const key = simpleCrypto.decrypt(cipherHH).toString();
      const wallet = new ethers.Wallet(key, provider);
      const contract = new ethers.Contract(
        hh_NFT_Create_Address,
        Create_NFT_ABI,
        wallet
      );
      const itemArray = [] as any;
      contract.getTokenIds().then((result: any) => {
        let totalSup = parseInt(result);
        for (let i = 0; i < totalSup; i++) {
          var token = i + 1;
          const owner = contract.ownerOf(token).catch(function (error: Error) {
            console.log("getWalletNFTs: owner error");
          });
          const rawUri = contract
            .tokenURI(token)
            .catch(function (error: Error) {
              console.log("getWalletNFTs: tokenUri error");
            });
          const Uri = Promise.resolve(rawUri);
          const getUri = Uri.then((value) => {
            let str: string = value;
            let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
            let metadata = axios
              .get(cleanUri, {
                headers: {
                  Authorization: auth,
                },
              })
              .catch(function (error: any) {
                console.log(error);
              });
            return metadata;
          });
          getUri.then((value) => {
            let rawImg = value && value.data && value.data.image;
            let name = value && value.data && value.data.name;
            let desc = value && value.data && value.data.description;
            let image =
              rawImg && rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            Promise.resolve(owner).then((value) => {
              console.log("osner", value);
              if (value === user) {
                setNftsFound(true);
                let owner = value;
                let meta = {
                  name: name,
                  img: image,
                  tokenId: token,
                  wallet: owner,
                  desc,
                };
                itemArray.push(meta);
              } else {
                setCreatedNfts([]);
              }
            });
          });
        }
      });
      await new Promise((r) => setTimeout(r, 3000));
      setCreatedNfts(itemArray);
      setLoadingState(false);
    } catch (err) {
      setLoadingState(false);
      console.log("Error occured", err);
    }
  };

  const openWeb3Modal = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      return signer;
    } catch (err) {
      console.log("Error in openWeb3Modal", err);
    }
  };

  const relistNFT = async (tokenId: number) => {
    try {
      console.log("tokenId", tokenId);
      const signer = await openWeb3Modal();
      const price = ethers.utils.parseUnits(resalePrice as string, "ether");
      const nftContract = new ethers.Contract(
        hh_NFT_Contract_Address,
        Collection_Contract_Abi,
        signer
      );
      const resellNftContract = new ethers.Contract(
        hh_Resell_Contract_Address,
        NftMarketResell_Contract_Abi,
        signer
      );
      console.log("resellNftContract", resellNftContract);
      await nftContract.setApprovalForAll(hh_Resell_Contract_Address, true);
      let listingFee = await resellNftContract.getListingFee();
      let transaction = await resellNftContract.listSale(tokenId, price, {
        value: listingFee,
      });
      let fulfilled = await transaction.wait();
      console.log("fulfilled", fulfilled);
      router.push("/");
    } catch (err) {
      console.log("Error in relistNFT", err);
    }
  };

  return (
    <div>
      <Container sm>
        <Row>
          <Col>
            {loadingState ? <Loader /> : null}

            <Text h4>NFT's in Wallet </Text>
            <Text h5 css={{ color: "#39FF14" }}>
              {user}
            </Text>

            <Row>
              <Button
                size="sm"
                onPress={connectUser}
                css={{ marginRight: "$2", marginBottom: "$2" }}
              >
                Refresh Wallet
              </Button>
              <Button
                size="sm"
                onPress={getWalletNFTs}
                css={{ marginRight: "$2", marginBottom: "$2" }}
              >
                Refresh NFTs
              </Button>
            </Row>
            {nftsFound === false && <Text h1>No NFT Found</Text>}
          </Col>
        </Row>
        <Grid.Container gap={3}>
          {nfts.map((nft, i) => {
            return (
              <Grid xs={6} sm={4} md={6} lg={4}>
                <Link>
                  <Card variant="bordered" isHoverable key={i}>
                    <Card.Image
                      objectFit="cover"
                      width="100%"
                      height={250}
                      src={nft.img}
                    />
                    <Card.Body>
                      <Text h3>Owned by You</Text>
                      <Text h5>
                        {nft.name} Token-{nft.tokenId}
                      </Text>
                      {/* <Text>{nft.desc}</Text> */}
                      <Input
                        size="sm"
                        css={{
                          marginTop: "$4",
                          maxWidth: "120px",
                          marginBottom: "$2",
                          border: "$inputBorder",
                          fontFamily: "SF Pro Display",
                          fontWeight: "bolder",
                          fontSize: "large",
                        }}
                        onChange={(e) => setResalePrice(e.target.value)}
                        placeholder="Set your price"
                      />
                      <Button
                        size="md"
                        color={"gradient"}
                        css={{ mt: "$5", fontSize: "16px" }}
                        onPress={async () => await relistNFT(nft.tokenId)}
                      >
                        Relist for Sale
                      </Button>
                    </Card.Body>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid.Container>
        <Spacer />
        <Container md>
          <Text h4>Created NFT's in Wallet</Text>
          <Row>
            <Grid.Container>
              {createdNfts.map((nft: any, i) => {
                console.log("createdNFTs", createdNfts);
                return (
                  <Grid>
                    <Link>
                      <Card
                        isHoverable
                        key={i}
                        css={{ mw: "200px", marginRight: "$1" }}
                        variant="bordered"
                      >
                        <Card.Image src={nft.img} />
                        <Card.Body key={i}>
                          <h3
                            style={{
                              color: "#9D00FF",
                              fontFamily: "SF Pro Display",
                            }}
                          >
                            Owned by You
                          </h3>
                          <Text h5>
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text>{nft.desc}</Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid.Container>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default Portal;

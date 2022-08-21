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
  cipherHH,
  hh_NFT_Contract_Address,
  mainnet,
  simpleCrypto,
} from "../utils/configuration/configuration";
import { Collection_Contract_Abi } from "../utils/contracts/Collection";
import Loader from "../components/Loader";

const Portal = () => {
  const [user, setUser] = useState<string | null>(null);
  const [resalePrice, setResalePrice] = useState({ price: "" });
  const [nfts, setNfts] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    connectUser();
    getWalletNFTs();
  }, [setNfts, user]);

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
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            Promise.resolve(owner).then((value) => {
              if (value === user) {
                let owner = value;
                let meta = {
                  name: name,
                  img: image,
                  tokenId: token,
                  wallet: owner,
                  desc,
                };
                itemArray.push(meta);
              }
              setNfts([]);
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

  // if (!nfts.length) {
  //   return (
  //     <Container>
  //       <Row>
  //         <Col
  //           css={{
  //             width: "100%",
  //             border: "2px solid red",
  //             display: "flex",
  //             justifyContent: "center",
  //             height:'70vh',
  //             alignItems:"center"
            
  //           }}
  //         >
  //           <Text h3>No NFT Found</Text>
  //         </Col>
  //       </Row>
  //     </Container>
  //   );
  // }

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
                      <Text>{nft.desc}</Text>
                      <Input
                        size="sm"
                        css={{
                          marginTop: "$2",
                          maxWidth: "120px",
                          marginBottom: "$2",
                          border: "$blue500",
                        }}
                        style={{
                          color: "black",
                          fontFamily: "SF Pro Display",
                          fontWeight: "bolder",
                          fontSize: "15px",
                        }}
                        placeholder="Set your price"
                      />
                      <Button
                        size="md"
                        color={"gradient"}
                        css={{ mt: "$5", fontSize: "16px" }}
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
      </Container>
    </div>
  );
};

export default Portal;

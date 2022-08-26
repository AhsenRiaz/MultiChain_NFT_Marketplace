import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import {
  Grid,
  Card,
  Text,
  Button,
  Row,
  Spacer,
  Container,
} from "@nextui-org/react";
import "sf-font";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  cipherHH,
  hh_NFT_Contract_Address,
  hh_NFT_Create_Address,
  hh_Resell_Contract_Address,
  hh_Resell_Custom_NFT_Address,
  mainnet,
  simpleCrypto,
} from "../../utils/configuration/configuration";
import { Collection_Contract_Abi } from "../../utils/contracts/Collection";
import { NftMarketResell_Contract_Abi } from "../../utils/contracts/NftMarketResell";
import { getSigner, responsive } from "../../utils";
import { Create_NFT_ABI } from "../../utils/contracts/CreateNFT";
import { Resell_Custom_NFT_Market } from "../../utils/contracts/NftMarketResellCustom";
import confetti from "canvas-confetti";

const HomePage = () => {
  const router = useRouter();

  const [listedNfts, setListedNfts] = useState<any[]>([]);
  const [customCreatedNfts, setCustomCreatedNfts] = useState<any[]>([]);

  useEffect(() => {
    getListedNFTs();
    loadNewSaleNFTs();
  }, [setListedNfts]);

  const handleConfetti = () => {
    confetti();
  };

  const getListedNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(mainnet);
      const key = simpleCrypto.decrypt(cipherHH).toString();
      const wallet = new ethers.Wallet(key, provider);
      const nftContract = new ethers.Contract(
        hh_NFT_Contract_Address,
        Collection_Contract_Abi,
        wallet
      );

      const marketplaceContract = new ethers.Contract(
        hh_Resell_Contract_Address,
        NftMarketResell_Contract_Abi,
        wallet
      );

      const itemArray = [] as any[];
      nftContract.totalSupply().then((result: any) => {
        for (let i = 0; i < result; i++) {
          var token = i + 1;
          var owner = nftContract.ownerOf(token);
          var getOwner = Promise.resolve(owner);
          getOwner.then((address: any) => {
            if (address === hh_Resell_Contract_Address) {
              console.log("address", address, "i", i);
              const rawUri = nftContract.tokenURI(token);
              const Uri = Promise.resolve(rawUri);
              const getUri = Uri.then((value) => {
                let str = value;
                let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
                console.log(cleanUri);
                let metadata = axios.get(cleanUri).catch(function (error) {
                  console.log(error.toJSON());
                });
                return metadata;
              });
              getUri.then((value: any) => {
                let rawImg = value.data.image;
                var name = value.data.name;
                var desc = value.data.description;
                let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
                const price = marketplaceContract.getPrice(token);
                Promise.resolve(price).then((_hex: any) => {
                  var salePrice = Number(_hex);
                  var txPrice = salePrice.toString();
                  Promise.resolve(owner).then((value) => {
                    let ownerW = value;
                    let outPrice = ethers.utils.formatUnits(
                      salePrice.toString(),
                      "ether"
                    );
                    let meta = {
                      name: name,
                      img: image,
                      cost: txPrice,
                      val: outPrice,
                      tokenId: token,
                      wallet: ownerW,
                      desc,
                    };
                    console.log(meta);
                    itemArray.push(meta);
                  });
                });
              });
            }
          });
        }
      });
      await new Promise((r) => setTimeout(r, 3000));
      setListedNfts(itemArray);
    } catch (err) {
      console.log("Transaction Failed", err);
    }
  };

  async function loadNewSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(mainnet);
    const key = simpleCrypto.decrypt(cipherHH).toString();
    const wallet = new ethers.Wallet(key, provider);
    const tokenContract = new ethers.Contract(
      hh_NFT_Create_Address,
      Create_NFT_ABI,
      wallet
    );
    const marketContract = new ethers.Contract(
      hh_Resell_Custom_NFT_Address,
      Resell_Custom_NFT_Market,
      wallet
    );
    const data = await marketContract.getAvailableNfts();
    console.log("data", data);
    const items = await Promise.all(
      data.map(async (i: any) => {
        console.log("i", i);
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        console.log("tokenURI", tokenUri);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        console.log("price", price);
        let item = {
          itemId: i.itemId.toNumber(),
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    console.log("items", items);
    setCustomCreatedNfts(items);
  }

  const buyNFT = async (tokenId: number, cost: string) => {
    try {
      let signer = await getSigner();
      let marketplaceContract = new ethers.Contract(
        hh_Resell_Contract_Address,
        NftMarketResell_Contract_Abi,
        signer
      );
      const transaction = await marketplaceContract.buyNft(tokenId, {
        value: cost,
      });
      const fulfilled = await transaction.wait();
      console.log("fulfilled", fulfilled);
      router.push("/portal");
    } catch (err) {
      console.log("Error in buyNFT", err);
    }
  };

  const buyCustomCreatedNFT = async (nft: any) => {
    try {
      console.log("nft", nft);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const customNftMarketplace = new ethers.Contract(
        hh_Resell_Custom_NFT_Address,
        Resell_Custom_NFT_Market,
        signer
      );
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await customNftMarketplace.buyNFT(nft.itemId, {
        value: price,
      });
    } catch (error) {
      console.log("Error while buy customNFT", error);
    }
  };

  return (
    <div>
      <Container
        xl
        css={{
          backgroundImage:
            "linear-gradient(to top, #020202, #050505, #080808, #0b0b0b, #0e0e0e, #16141a, #1e1724, #291a2d, #451a3a, #64133c, #820334, #9b0022)",
        }}
      >
        <Container xs css={{ marginBottom: "$3" }}>
          <Text css={{ marginLeft: "$40" }} h2>
            Top Collections
          </Text>
          <Carousel
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={6000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={800}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-60-px"
          >
            {listedNfts.map((nft, i) => (
              <div key={i}>
                <Card.Image width={300} height={300} src={nft.img} />
              </div>
            ))}
          </Carousel>
        </Container>
      </Container>
      <Container sm>
        <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
          <Text h3>Latest NFTs</Text>
        </Row>
        <Grid.Container gap={3}>
          {listedNfts.map((nft, i) => {
            return (
              <Grid key={i} xs={3}>
                <Card
                  css={{ boxShadow: "1px 1px 10px #ffffff" }}
                  variant="bordered"
                  key={i}
                >
                  <Text
                    css={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "SF Pro Display",
                      fontSize: "20px",
                      marginLeft: "10px",
                    }}
                  >
                    {nft.name} Token-{nft.tokenId}{" "}
                  </Text>
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      css={{ maxWidth: "180px", borderRadius: "6%" }}
                      src={nft.img}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row
                      key={i}
                      wrap="wrap"
                      justify="space-between"
                      align="center"
                    >
                      <Text style={{ fontSize: "20px" }}>Price: {nft.val}</Text>
                      <Button
                        size={"sm"}
                        color="gradient"
                        style={{ fontSize: "20px" }}
                        onPress={async () =>
                          await buyNFT(nft.tokenId, nft.cost)
                        }
                      >
                        Buy
                      </Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            );
          })}
        </Grid.Container>
      </Container>
      <Spacer />
      <Container sm>
        <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
          <Text h3>Latest NFTs Created</Text>
        </Row>
        <Grid.Container gap={1} justify="flex-start">
          {customCreatedNfts.map((nft, i) => (
            <Grid key={i} xs={3}>
              <Card
                style={{
                  marginRight: "3px",
                  boxShadow: "1px 1px 10px #ffffff",
                }}
                variant="bordered"
                key={i}
              >
                <Text
                  css={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "SF Pro Display",
                    fontSize: "20px",
                    marginLeft: "1rem",
                  }}
                >
                  {nft.name}
                </Text>
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      borderRadius: "6%",
                    }}
                    src={nft.image}
                  />
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text>{nft.description}</Text>
                    <Text style={{ fontSize: "30px" }}>{nft.price}</Text>
                    <Button
                      color="gradient"
                      style={{ fontSize: "20px" }}
                      onPress={async () => {
                        handleConfetti();
                        buyCustomCreatedNFT(nft);
                      }}
                    >
                      Buy
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </Container>
    </div>
  );
};

export default HomePage;

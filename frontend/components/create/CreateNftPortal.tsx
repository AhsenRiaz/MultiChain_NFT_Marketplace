import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import confetti from "canvas-confetti";
import "sf-font";
import { Resell_Custom_NFT_Market } from "../../utils/contracts/NftMarketResellCustom";
import { Create_NFT_ABI } from "../../utils/contracts/CreateNFT";
import { getSigner } from "../../utils";
import {
  Grid,
  Card,
  Text,
  Button,
  Row,
  Spacer,
  Container,
  Col,
  Input,
  FormElement,
} from "@nextui-org/react";
import {
  cipherHH,
  client,
  hh_NFT_Create_Address,
  hh_Resell_Custom_NFT_Address,
  mainnet,
  simpleCrypto,
} from "../../utils/configuration/configuration";

interface IFormInput {
  price?: string;
  name?: string;
  description?: string;
}

const CreateNftPortal = () => {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [formInput, setFormInput] = useState<IFormInput>({
    price: "",
    name: "",
    description: "",
  });

  const handleAsset = async (e: any) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog: any) => console.log("received", prog),
      });
      console.log("added", added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log("Url", url);

      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const buyNFT = async () => {
    const { description, name } = formInput;
    if (!description && !name && !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      mintNFT(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const mintNFT = async (url: string) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        hh_NFT_Create_Address,
        Create_NFT_ABI,
        signer
      );
      let cost = await contract.cost();
      let transaction = await contract.mintNFT(url, { value: cost });
      await transaction.wait();
      router.push("/portal");
    } catch (err) {}
  };

  const listNFT = async () => {
    const { description, name, price } = formInput;
    if (!description && !name && !price && !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createNFT(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const createNFT = async (url: string) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        hh_NFT_Create_Address,
        Create_NFT_ABI,
        signer
      );
      let transaction = contract.createNFT(url);
      let tx = transaction.wait();
      console.log("tx", tx);
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      const price = ethers.utils.parseUnits(formInput.price as string, "ether");
      contract = new ethers.Contract(
        hh_Resell_Custom_NFT_Address,
        Resell_Custom_NFT_Market,
        signer
      );
      let listingFee = await contract.listingFees();
      listingFee = listingFee.toString();
      transaction = await contract.listNft(tokenId, price, {
        value: listingFee,
      });
      let tx2 = await transaction.wait();
      console.log("tx2", tx2);
      router.push("/");
    } catch (error) {
      console.log("Error whicl creatingNFT", error);
    }
  };

  return (
    <div>
      <Spacer />
      <Container lg gap={2}>
        <Text h2>Create NFT Portal</Text>
        <Row gap={4}>
          <Col>
            <Spacer />
            <Card css={{ marginTop: "$5", marginBottom: "$5" }}>
              <Card.Body style={{ backgroundColor: "#00000040" }}>
                <Text>
                  Select your Preferred Network, Create your Amazing NFT by
                  uploading your art using the simple NFT Dashboard. Simple!
                </Text>
              </Card.Body>
            </Card>
            <img src="chainagnostic.png" />
            <Card css={{ marginTop: "$5" }}>
              <Card.Body style={{ backgroundColor: "#00000040" }}>
                <Text>
                  Chain-Agnostic Marketplace that allows you to sell your NFT
                  and accept your favorite crypto as payment! No borders, No
                  restrictions. Simple!
                </Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Spacer />
            <Text h3>Create and Sell your NFT in the Marketplace</Text>
            <Card>
              <Card.Body style={{ backgroundColor: "#000000" }}>
                <Input
                  placeholder="Enter your NFT Name"
                  onChange={(e) =>
                    setFormInput({ ...formInput, name: e.target.value })
                  }
                />
              </Card.Body>
            </Card>
            <Card>
              <Card.Body style={{ backgroundColor: "#000000" }}>
                <Input
                  placeholder="NFT Description"
                  onChange={(e) =>
                    setFormInput({ ...formInput, description: e.target.value })
                  }
                />
              </Card.Body>
            </Card>
            <Card>
              <Card.Body style={{ backgroundColor: "#000000" }}>
                <Input
                  type={"file"}
                  name="Asset"
                  onChange={(e) => {
                    handleAsset(e);
                  }}
                />
                {fileUrl && (
                  <img
                    className="rounded "
                    height="200"
                    width="200"
                    src={fileUrl}
                  />
                )}
              </Card.Body>
            </Card>
            <Container>
              <Input
                css={{ marginTop: "$2" }}
                placeholder="Set your price in N2DR"
                onChange={(e) =>
                  setFormInput({ ...formInput, price: e.target.value })
                }
              />
              <Button
                size="sm"
                style={{ fontSize: "20px" }}
                onPress={listNFT}
                css={{
                  marginTop: "$2",
                  marginBottom: "$5",
                  color: "$gradient",
                }}
              >
                List your NFT!
              </Button>
              <Button
                size="sm"
                style={{ fontSize: "20px" }}
                onPress={buyNFT}
                css={{
                  marginTop: "$2",
                  marginBottom: "$5",
                  color: "$gradient",
                }}
              >
                Buy your NFT!
              </Button>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateNftPortal;

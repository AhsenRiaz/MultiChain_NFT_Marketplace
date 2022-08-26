import {
  bscMainnet,
  bscTestnet,
  ethereumMainnet,
  ropstenTestnet,
  hardhatChain,
  polygonMumbai,
  polygonMainnet,
} from "../utils/chains";
import "sf-font";
import { Col, Dropdown, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";

const ConnectChain = () => {
  const [selectedValue, setSelectedValue] = useState<any>("Connect Wallet");

  const selectChain = async () => {
    try {
      const { currentKey } = selectedValue;
      var bscMain = "Binance Smart Chain";
      var polygonMain = "Polygon";
      var ethMain = "Ethereum";
      var polMumbai = "Mumbai";
      var bscTest = "Bsctest";
      var ropstenTest = "Ropsten";
      var hardhat = "Hardhat";
      if (currentKey === bscMain) {
        await bscMainnet();
      } else if (currentKey === polygonMain) {
        await polygonMainnet();
      } else if (currentKey === ethMain) {
        await ethereumMainnet();
      } else if (currentKey === polMumbai) {
        await polygonMumbai();
      } else if (currentKey === bscTest) {
        await bscTestnet();
      } else if (currentKey === ropstenTest) {
        console.log("fulfilled");
        await ropstenTestnet();
      } else if (currentKey === hardhat) {
        await hardhatChain();
      }
    } catch (error) {
      console.log("Error while selecting chain", error);
    }
  };

  useEffect(() => {
    selectChain();
  }, [selectedValue]);

  return (
    <Col css={{ marginTop: "$6" }}>
      <Dropdown>
        <Dropdown.Button
          aria-label="Connect Wallet"
          flat
          style={{
            background: "#00000070",
            boxShadow: "0px 0px 4px #ffffff",
            fontFamily: "SF Pro Display",
            fontWeight: "500",
            color: "white",
            fontSize: "20px",
          }}
          css={{ tt: "capitalize" }}
        >
          {selectedValue}
        </Dropdown.Button>
        <Dropdown.Menu
          css={{
            backgroundColor: "#ffffff30",
          }}
          aria-label="Single selection actions"
          color="secondary"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedValue}
          onSelectionChange={setSelectedValue}
        >
          <Dropdown.Item textValue="Ethereum" key="Ethereum">
            <Text h6>Ethereum</Text>
          </Dropdown.Item>
          <Dropdown.Item
            textValue="Binance Smart Chain"
            key="Binance Smart Chain"
          >
            <Text h6>BSC Mainnet</Text>
          </Dropdown.Item>
          <Dropdown.Item textValue="Polygon" key="Polygon">
            <Text h6>Polygain Mainnet</Text>
          </Dropdown.Item>
          <Dropdown.Item textValue="Hardhat" key="Hardhat">
            <Text h6>Hardhat</Text>
          </Dropdown.Item>
          <Dropdown.Item textValue="Ropsten" key="Ropsten">
            <Text h6>Ropsten Testnet</Text>
          </Dropdown.Item>
          <Dropdown.Item textValue="Bsctest" key="Bsctest">
            <Text h6>BSC Testnet</Text>
          </Dropdown.Item>
          <Dropdown.Item textValue="Mumbai" key="Mumbai">
            <Text h6>Polygain Mumbai Testnet</Text>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  );
};

export default ConnectChain;

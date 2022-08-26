import { Button, Col, Row, Container } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import "sf-font";
import Logo from "../public/assets/logo.png";
import ConnectChain from "./ConnectChain";


const Header = () => {
  return (
    <div style={{ backgroundColor: "black" }}>
      <Container xl>
        <Row justify="center" align="center" css={{ padding: "0rem 1rem" }}>
          <Col>
            <Image height={90} width={90} src={Logo} alt="logo" />
          </Col>
          <Col>
            <Button
              size={"sm"}
              style={{
                background: "#00000070",
                boxShadow: "0px 0px 4px #ffffff",
              }}
            >
              <Link href="/">
                <a
                  style={{
                    fontFamily: "SF Pro Display",
                    fontWeight: "500",
                    color: "white",
                    fontSize: "20px",
                    textDecoration: "none",
                  }}
                >
                  Marketplace
                </a>
              </Link>
            </Button>
          </Col>

          <Col>
            <Button
              size="sm"
              style={{
                background: "#00000070",
                boxShadow: "0px 0px 4px #ffffff",
              }}
            >
              <Link href="/create">
                <a
                  style={{
                    fontFamily: "SF Pro Display",
                    fontWeight: "500",
                    color: "white",
                    fontSize: "20px",
                    textDecoration: "none",
                  }}
                >
                  Create NFT
                </a>
              </Link>
            </Button>
          </Col>
          <Col>
            <Button
              size="sm"
              style={{
                background: "#00000070",
                boxShadow: "0px 0px 4px #ffffff",
              }}
            >
              <Link href="/portal">
                <a
                  style={{
                    fontFamily: "SF Pro Display",
                    fontWeight: "500",
                    color: "white",
                    fontSize: "20px",
                    textDecoration: "none",
                  }}
                >
                  My NFT Portal
                </a>
              </Link>
            </Button>
          </Col>
          <ConnectChain />
        </Row>
      </Container>
    </div>
  );
};

export default Header;

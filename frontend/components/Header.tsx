import {
  createTheme,
  NextUIProvider,
  Spacer,
  Button,
  Col,
  Row,
  Container,
  Dropdown,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import "sf-font";
import Logo from "../public/assets/logo.png";

const Header = () => {
  return (
    <div style={{ backgroundColor: "black" }}>
      <Container xl>
        <Row justify="center" align="center" css={{ padding: "0rem 1rem" }}>
          <Col>
            <Image height={90} width={90} src={Logo} />
          </Col>
          <Col>
            <Link href="/">
              <Button
                size={"sm"}
                style={{
                  background: "#00000070",
                  boxShadow: "0px 0px 4px #ffffff",
                }}
              >
                <a
                  style={{
                    fontFamily: "SF Pro Display",
                    fontWeight: "500",
                    color: "white",
                    fontSize: "20px",
                  }}
                >
                  Marketplace
                </a>
              </Button>
            </Link>
          </Col>
          <Col>
            <Link href="/collections">
              <Button
                size="sm"
                style={{
                  background: "#00000070",
                  boxShadow: "0px 0px 4px #ffffff",
                }}
              >
                <a
                  style={{
                    fontFamily: "SF Pro Display",
                    fontWeight: "500",
                    color: "white",
                    fontSize: "20px",
                  }}
                >
                  Collections
                </a>
              </Button>
            </Link>
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
                  }}
                >
                  My NFT Portal
                </a>
              </Link>
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;

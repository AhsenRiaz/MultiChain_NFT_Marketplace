import { Container, Col, Row, Progress } from "@nextui-org/react";

const Loader = () => {
  return (
    <Container xs >
      <Row css={{ height: "20vh", display: "flex", alignItems: "center" }}>
        <Col>
          <Progress
            indeterminated
            value={50}
            color="secondary"
            status="secondary"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;

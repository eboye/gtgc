import { Col, Grid, Panel, Row } from "rsuite";
import DistanceByActivityType from "./charts/ByActivityTypeBarChart";

export function Dashboard() {
  return (
    <Grid fluid>
      <Row gutter={15}>
        <Col lg={24} xl={12}>
          <Panel header="Distance Traveled" bordered>
            <DistanceByActivityType type="distance" />
          </Panel>
        </Col>
        <Col lg={24} xl={12}>
          <Panel header="Time Spend" bordered>
            <DistanceByActivityType type="duration" />
          </Panel>
        </Col>
      </Row>
    </Grid>
  );
}

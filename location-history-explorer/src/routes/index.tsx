import { Card, Col, Row } from "solid-bootstrap";
import ActivityTypeByWeekBarChart from "~/components/ActivityTypeByWeekBarChart";
import ActivityTypeByYearBarChart from "~/components/ActivityTypeByYearBarChart";

export default function Home() {
  return (
    <main>
      <Row xs={1} md={2} class="g-4">
      <Col>
          <Card>
            <Card.Body>
              <ActivityTypeByYearBarChart />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <ActivityTypeByWeekBarChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  );
}

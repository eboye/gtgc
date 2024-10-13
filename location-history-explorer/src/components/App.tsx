import { useContext, useState } from "react";
import dayjs from "dayjs";
import {
  Container,
  Content,
  CustomProvider,
  DateRangePicker,
  Text,
  Nav,
  Sidebar,
  Sidenav,
  Panel,
  Grid,
  Row,
  Col,
} from "rsuite";
import BarChartIcon from "@rsuite/icons/BarChart";
import GlobalIcon from "@rsuite/icons/Global";
import "rsuite/dist/rsuite.min.css";
import { DateRangeContext } from "../context/DateRangeContext";
import DistanceByActivityType from "./DistanceByActivityTypeBarChart";

const panelStyles = {
  padding: "15px 20px",
};

export default function App() {
  const [dateRange, setDateRange] = useState(useContext(DateRangeContext));

  return (
    <DateRangeContext.Provider value={dateRange}>
      <CustomProvider theme="dark">
        <Container>
          <Sidebar>
            <Sidenav>
              <Sidenav.Header></Sidenav.Header>
              <Sidenav.Body>
                <Nav defaultActiveKey="1">
                  <Nav.Item panel style={panelStyles}>
                    <Text muted weight="light">
                      Date Range
                    </Text>
                    <DateRangePicker
                      defaultValue={dateRange}
                      onChange={(dates) => {
                        if (dates && dates.length === 2) setDateRange(dates);
                      }}
                      format="yyyy-MM-dd"
                      isoWeek={true}
                      cleanable={false}
                    />
                  </Nav.Item>
                  <Nav.Item icon={<BarChartIcon />}>Dashboard</Nav.Item>
                  <Nav.Item icon={<GlobalIcon />}>Map</Nav.Item>
                </Nav>
              </Sidenav.Body>
            </Sidenav>
          </Sidebar>

          <Content>
            <Grid fluid>
              <Row gutter={4}>
                <Col lg={24} xl={12}>
                  <Panel header="Distance Traveled" bordered>
                    <DistanceByActivityType />
                  </Panel>
                </Col>
              </Row>
            </Grid>
          </Content>
        </Container>
      </CustomProvider>
    </DateRangeContext.Provider>
  );
}

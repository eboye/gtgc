import { useState } from "react";
import {
  Container,
  Content,
  CustomProvider,
  Nav,
  Sidebar,
  Sidenav,
} from "rsuite";
import BarChartIcon from "@rsuite/icons/BarChart";
import GlobalIcon from "@rsuite/icons/Global";
import "rsuite/dist/rsuite.min.css";
import { DateRangeContext, type DateRange } from "../context/DateRangeContext";
import { Outlet, useMatch } from "react-router-dom";
import DateRangeSelector from "./DateRangeSelector";

const panelStyles = {
  padding: "15px 20px",
};

export default function Layout({
  allTimeDateRange,
}: {
  allTimeDateRange: DateRange;
}) {
  const [dateRange, setDateRange] = useState<DateRange>(allTimeDateRange);

  const rootMatch = useMatch("/");
  const mapMatch = useMatch("/map");

  return (
    <DateRangeContext.Provider value={dateRange}>
      <CustomProvider theme="dark">
        <Container style={{ height: "100vh" }}>
          <Sidebar width="380">
            <Sidenav>
              <Sidenav.Header></Sidenav.Header>
              <Sidenav.Body>
                <Nav defaultActiveKey="1" style={{ height: "100%" }}>
                  <Nav.Item panel style={panelStyles}>
                    <DateRangeSelector
                      allTimeDateRange={allTimeDateRange}
                      onDateRangeChange={(newRange) => setDateRange(newRange)}
                    />
                  </Nav.Item>
                  <Nav.Item
                    href="#/"
                    active={Boolean(rootMatch)}
                    icon={<BarChartIcon />}
                  >
                    Dashboard
                  </Nav.Item>
                  <Nav.Item
                    href="#/map"
                    active={Boolean(mapMatch)}
                    icon={<GlobalIcon />}
                  >
                    Map
                  </Nav.Item>
                </Nav>
              </Sidenav.Body>
            </Sidenav>
          </Sidebar>
          <Content style={{ padding: "15px 20px" }}>
            <Outlet />
          </Content>
        </Container>
      </CustomProvider>
    </DateRangeContext.Provider>
  );
}

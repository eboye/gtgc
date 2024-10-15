import { useState } from "react";
import {
  Container,
  Content,
  CustomProvider,
  DateRangePicker,
  Text,
  Nav,
  Sidebar,
  Sidenav,
} from "rsuite";
import BarChartIcon from "@rsuite/icons/BarChart";
import GlobalIcon from "@rsuite/icons/Global";
import "rsuite/dist/rsuite.min.css";
import { DateRangeContext, type DateRange } from "../context/DateRangeContext";
import { subMonths, subYears } from "date-fns";
import { type RangeType } from "rsuite/esm/DateRangePicker";
import { Outlet, useMatch, useMatches } from "react-router-dom";

const panelStyles = {
  padding: "15px 20px",
};

export default function Layout({
  minDate,
  maxDate,
}: {
  minDate: Date;
  maxDate: Date;
}) {
  const rootMatch = useMatch("/");
  const mapMatch = useMatch("/map");

  const [dateRange, setDateRange] = useState<DateRange>([minDate, maxDate]);
  const predefinedRanges = [
    {
      label: "All Time",
      value: [minDate, maxDate],
      placement: "left",
    },
    {
      label: "Last Year",
      value: [subYears(new Date(), 1), new Date()],
      placement: "left",
    },
    {
      label: "Last Month",
      value: [subMonths(new Date(), 1), new Date()],
      placement: "left",
    },
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
  ] as RangeType[];

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
                      ranges={predefinedRanges}
                      defaultValue={dateRange}
                      onChange={(dates) => {
                        if (dates && dates.length === 2) setDateRange(dates);
                      }}
                      format="yyyy-MM-dd"
                      isoWeek={true}
                      cleanable={false}
                    />
                  </Nav.Item>

                  <Nav.Item href="#/" active={Boolean(rootMatch)} icon={<BarChartIcon />}>
                    Dashboard
                  </Nav.Item>
                  <Nav.Item href="#/map" active={Boolean(mapMatch)} icon={<GlobalIcon />}>
                    Map
                  </Nav.Item>
                </Nav>
              </Sidenav.Body>
            </Sidenav>
          </Sidebar>

          <Content>
            <Outlet />
          </Content>
        </Container>
      </CustomProvider>
    </DateRangeContext.Provider>
  );
}

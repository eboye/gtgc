import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { Dashboard } from "./Dashboard";
import { Map } from "./Map";

export default function App({
  minDate,
  maxDate,
}: {
  minDate: Date;
  maxDate: Date;
}) {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout minDate={minDate} maxDate={maxDate} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

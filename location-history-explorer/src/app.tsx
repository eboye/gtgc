import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "./app.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "./components/AppNavBar";
import { Container } from "solid-bootstrap";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Location History Explorer</Title>
          <AppNavBar />
          <Suspense>
            <Container>
              {props.children}
            </Container>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

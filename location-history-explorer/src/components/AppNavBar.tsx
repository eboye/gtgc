import { Container, Nav, Navbar } from "solid-bootstrap";

export default function AppNavBar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Location History Explorer</Navbar.Brand>
        <Navbar.Toggle aria-controls="app-navbar-nav" />
        <Navbar.Collapse id="app-navbar-nav">
          <Nav class="me-auto">
            <Nav.Link href="/">Overview</Nav.Link>
            <Nav.Link href="/map">Map</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
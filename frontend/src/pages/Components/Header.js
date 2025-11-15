import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../images/logo.png';
import "../../css/header.css";

function Header({user}) {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>

             <Navbar.Brand href="#home">
            <img
              src= {logo}
              width="100"
              height="100"
              className="logoi d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Brand href="#home">ARTIST CORNER</Navbar.Brand>
          <Nav className="me-auto">
            <NavDropdown title="Explore" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Artwork</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Book
              </NavDropdown.Item>
               </NavDropdown>
            <Nav.Link href="#features">About</Nav.Link>
            <Nav.Link href="#pricing">Help</Nav.Link>
          </Nav>
            <Navbar.Text>
            Hello, {user.username}
          </Navbar.Text>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
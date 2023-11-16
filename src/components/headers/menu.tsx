/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge, Container, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../productList/AppContext";
interface MenuProps {
  api: string;
}

export default function Menu(props: MenuProps) {
  const { state } = useAppContext(); // ใช้ Context ที่คุณสร้าง
  const resulteData: any = JSON.parse(localStorage.getItem("resulte") || "{}");
  const { api } = props;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("resulte");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <Navbar
        bg="light"
        data-bs-theme="light"
        expand="lg"
        fixed="top"
        className="shadow  navbar-underline"
      >
        <Container>
          <Navbar.Brand as={Link} to="/home">
            <Image
              alt=""
              src="/img/logo.jpg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            ระบบคลังสินค้า
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home" className="nav-link">
                หน้าหลัก
              </Nav.Link>
              <Link to="/productlist" className="nav-link">
                รายการสินค้า
              </Link>

              <Link to="/approved" className="nav-link">
                รออนุมัติ
              </Link>
              {resulteData.status == "ผู้ดูแลระบบ" && <>
                <NavDropdown title="การจัดการ" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/division">
                    ข้อมูลแผนก
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/position">
                    ข้อมูลตำแหน่ง
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/users">
                    ข้อมูลผู้ใช้ระบบ
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/productType">
                    ข้อมูลประเภทสินค้า
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products">
                    ข้อมูลสินค้า
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/incomingstock">
                    นำเข้าสินค้า
                  </NavDropdown.Item>
                </NavDropdown>
              </>}
            </Nav>
            <Nav>
              <Link to="/checkapproval" className="nav-link">
                <BsFillCartCheckFill className="text-warning" /> <Badge bg="warning" pill>{state.amount}</Badge>
              </Link>
              <NavDropdown
                title={
                  <Image
                    src={api + "/ImagesPathAPI/" + resulteData.imageFile}
                    height={25}
                    roundedCircle
                  />
                }
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  ข้อมูลส่วนตัว
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>ออกจากระบบ</NavDropdown.Item>
              </NavDropdown>
              <Link to="" className="nav-link text-bg-success">
                {resulteData.status}
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

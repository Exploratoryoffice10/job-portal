import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import UserService from '../../services/UserService'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from 'reactstrap';

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory()
  const toggle = () => setIsOpen(!isOpen);
  if(props.loggedIn && props.user.user.role==='applicant')
  return (
    <div>
      <Navbar className="light" dark expand="md">
        <NavbarBrand href="/">NaukriSearch</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="navbar-nav ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/myapplications">My Applications</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" onClick={async () => {
                await UserService.logout()
                .then(r => props.reloadHook())
              }} >Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
  else if(props.loggedIn)
  return(
    <div>
      <Navbar className="light" dark expand="md">
        <NavbarBrand href="/">NaukriSearch</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="navbar-nav ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/createNew">Post a Job</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/employees">Employees</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" onClick={async () => {
                await UserService.logout()
                .then(r => props.reloadHook())
              }} >Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
  else 
  return (
    <div>
      <Navbar color="light" dark  expand="md">
        <NavbarBrand href="/">NaukriSearch</NavbarBrand>
      </Navbar>
    </div>
  );

}

export default Example;

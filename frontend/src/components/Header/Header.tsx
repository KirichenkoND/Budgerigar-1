import React, { Component } from 'react';
import logo from "../../assets/react.svg";

import { Nav, Navbar, Container, FormControl, Form } from 'react-bootstrap';


export default class Header extends Component {
    render() {
        return (
            <>
                <Navbar fixed="top" collapseOnSelect expand="md" bg="light" variant="light">
                    <Container>
                        <Navbar.Brand href='/'>
                            <img
                                src={logo}
                                height="30"
                                width="30"
                                className='d-inline-block align-top'
                                alt="Logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="/patients">Пациенты</Nav.Link>
                                <Nav.Link href="/doctors">Медперс</Nav.Link>
                                <Nav.Link href="/">Свободная касса</Nav.Link>
                            </Nav>
                            <Form>
                                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </>
        )
    }
}
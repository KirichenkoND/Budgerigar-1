import { FC } from 'react';
import HeaderLink from '../HeaderLink/HeaderLink';
import "./Header.scss"

const HeaderLinks = [
    {
        text: 'Home',
        path: '/home',
    },
    {
        text: 'Пациенты',
        path: '/patients',
    },
    {
        text: 'Докторы',
        path: '/doctors',
    },
]

export const Header: FC = () => {
    return (
        <>
            <header>
                <div className='header'>
                    <div className='header-logo'>LOGO</div>
                    <div className='header-links'>
                        {
                            HeaderLinks.map((headerLink, i) => {
                                return (
                                    <HeaderLink
                                        key={i}
                                        text={headerLink.text}
                                        path={headerLink.path}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </header>

            {/* <Navbar fixed="top" collapseOnSelect expand="md" bg="light" variant="light">
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
                    </Navbar.Collapse>
                </Container>
            </Navbar> */}
        </>
    )
}
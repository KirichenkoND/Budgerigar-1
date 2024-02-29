import React from 'react';
import "./HeaderLink.scss"
import { Link } from 'react-router-dom';
interface HeaderLinkProps {
    text: string;
    path: string;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ text, path }) => {
    return (
        // <Link to={path}>
            <a href={path} className='header-link-route' >
                <div className='header-link'>
                    {text}
                </div>
            </a>
        // </Link>
    );
};

export default HeaderLink;
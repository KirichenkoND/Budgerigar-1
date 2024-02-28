import React from 'react';
import "./HeaderLink.scss"
interface HeaderLinkProps {
    text: string;
    path: string;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ text, path }) => {
    return (
        <a href={path} className='header-link-route' >
            <div className='header-link'>
                {text}
            </div>
        </a>
    );
};

export default HeaderLink;
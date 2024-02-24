import React, { FC } from 'react';
import "./HeaderLink.scss"
interface HeaderLinkProps {
    text: string;
    path: string;
}

const HeaderLink: FC<HeaderLinkProps> = ({ text, path }) => {
    return (
        <a href={path} className='header-link-route' >
            <div className='header-link'>
                {text}
            </div>
        </a>
    );
};

export default HeaderLink;
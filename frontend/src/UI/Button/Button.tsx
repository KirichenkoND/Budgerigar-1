import React from 'react';
import "./Button.scss";

interface ButtonProps {
    text: string;
    styleName?: string;
}

const Button: React.FC<ButtonProps> = ({ text = "ТЫКНИ", styleName = 'default_btn' }) => {
    return (
        <button className={styleName}>
            {text}
        </button>
    );
};

export default Button;
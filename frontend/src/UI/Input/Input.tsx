import React from 'react';
import "./Input.scss";

interface InputProps {
    type: string;
    styleName?: string
    placeholder?: string;
}

const Input: React.FC<InputProps> = ({type = "text", styleName = "default_input", ...OtherFields}) => {
    return (
        <input type={type} className={styleName} {...OtherFields}/>
    );
};

export default Input;
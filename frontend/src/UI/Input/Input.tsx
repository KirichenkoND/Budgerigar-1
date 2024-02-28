import React from 'react';
import "./Input.scss";

interface InputProps {
    type: string;
    styleName: string;
}

const Input: React.FC<InputProps> = ({type = "text", styleName = "default_input"}) => {
    return (
        <input type={type} className={styleName}/>
    );
};

export default Input;
import React from 'react';
import "./Input.scss";

interface InputProps {
    type?: string;
    styleName?: string
    placeholder?: string;
    onChange: (event: React.ChangeEvent<any>) => void;
    value: string;
}

const Input: React.FC<InputProps> = ({type = "text", styleName = "default_input", value, onChange, ...OtherFields}) => {
    return (
        <input type={type} value={value} className={styleName} onChange={onChange} {...OtherFields}/>
    );
};

export default Input;
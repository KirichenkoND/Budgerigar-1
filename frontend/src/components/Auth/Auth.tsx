import React from 'react';
import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input'

import './Auth.scss'

const Auth: React.FC = () => {
    return (
        <>
            <div className="container">
                <div className="login">
                <label>Логин</label>
                    <div className="sec-2">
                        <Input type="login" styleName="auth_input" placeholder="Ivanova_m1" />
                    </div>
                </div>
                <div className="password">
                    <label>Пароль</label>
                    <div className="sec-2">
                        <Input type="password" styleName="auth_input" placeholder="************" />
                    </div>
                </div>
                <Button text="Авторизоваться" styleName="auth_btn" />
            </div>
        </>
    );
}

export default Auth;
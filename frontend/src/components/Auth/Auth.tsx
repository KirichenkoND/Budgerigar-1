import React from 'react';
import Button from '../../UI/Button/Button'
import Input from '../../UI/Input/Input'

import './Auth.scss'

const Auth: React.FC = () => {
    return (
        <>
            <div className="container">
                <div className="login">
                    <label className='label_auth'>Логин</label>
                    <div className="sec-2">
                        <Input type="login" styleName="auth_input" placeholder="Ivanova_m1" />
                    </div>
                </div>
                <div className="password">
                    <label className='label_auth'>Пароль</label>
                    <div className="sec-2">
                        <Input type="password" styleName="auth_input" placeholder="************" />
                    </div>
                </div>
                <div className="sec-2">
                    <Button text="Авторизоваться" styleName="auth_btn" />
                </div>
            </div>
        </>
    );
}

export default Auth;
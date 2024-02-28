import React from 'react';

import './Auth.scss'

const Auth: React.FC = () => {
    return (
        <>
            <div className="container">
                <div className="login">
                    <label htmlFor="login">Логин</label>
                    <div className="sec-2">
                        <input type="login" name="login" placeholder="example@example.com" />
                    </div>
                </div>
                <div className="password">
                    <label htmlFor="password">Пароль</label>
                    <div className="sec-2">
                        <input type="password" name="password" placeholder="************" />
                    </div>
                </div>
                <button className="auth">Авторизоваться</button>
            </div>
        </>
    );
}

export default Auth;
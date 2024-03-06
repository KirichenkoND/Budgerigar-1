import { FC } from "react";
import HeaderLink from "../HeaderLink/HeaderLink";
import "./Header.scss";
import Button from "../../UI/Button/Button";
import { useNavigate } from "react-router-dom";
import logo from '../../../public/vite.svg';

const HeaderLinks = [
  {
    text: "Главная",
    path: "/",
  },
  {
    text: "Пациенты",
    path: "/patients",
  },
  {
    text: "Врачи",
    path: "/doctors",
  },
  {
    text: "Сотрудники",
    path: "/editor",
  }
];

export const Header: FC = () => {
  return (
    <>
      <header>
        <div className="header">
          <div className="header-logo">
            <HeaderLink
              image={logo}
              path="/"
            />
          </div>
          <div className="header-links">
            {HeaderLinks.map((headerLink, i) => {
              return (
                <HeaderLink
                  key={i}
                  text={headerLink.text}
                  path={headerLink.path}
                />
              );
            })}
          </div>
          <div className="auth-button">
            <a href="/auth">
              <Button text={"Войти"} />
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

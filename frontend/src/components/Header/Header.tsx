import { FC, useCallback } from "react";
import HeaderLink from "../HeaderLink/HeaderLink";
import "./Header.scss";
import Button from "../../UI/Button/Button";
import logo from "../../../public/vite.svg";
import logo_1 from "../../../public/user.svg";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { delUser } from "../../store/slices/userSlice";
import { useLogoutMutation } from "../../api/api";

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
  },
];

export const Header: FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [logoutFetch] = useLogoutMutation({});

  const logout = useCallback(() => {
    logoutFetch({});
    dispatch(delUser());
  }, []);
  return (
    <>
      <header>
        <div className="header">
          <div className="header-logo">
            <HeaderLink image={logo} path="/" />
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
          <div className={user !== null ? `auth-button-user` : "auth-button"}>
            {user !== null ? (
              <>
                <a href="/me" style={{textDecoration: 'none'}}>
                  <span style={{ marginRight: 15, textDecoration: 'none' }}>{user.phone}</span>
                  <img style={{ marginRight: 10 }} src={logo_1} alt="account" />
                </a>
                <Button text={"Выйти"} onClick={logout} />
              </>
            ) : (
              <a href="/auth">
                <Button text={"Войти"} />
              </a>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

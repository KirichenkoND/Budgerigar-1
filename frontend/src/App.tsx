import Router from './Router/Router';
import { Header } from './components/Header/Header';
import { useAppDispatch } from './store/store';
import { useEffect } from 'react';
import { setUser } from './store/slices/userSlice';

import './App.scss';
import { Outlet } from 'react-router-dom';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json().then(x => {
      if (x) {
        dispatch(setUser({ phone: x.phone }))
      }
    }) : null)
  }, []);
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App

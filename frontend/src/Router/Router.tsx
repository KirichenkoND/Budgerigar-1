import { Route, Routes, BrowserRouter } from 'react-router-dom';
import SchedulePage from '../Pages/SchedulePage/SchedulePage';
import PatientListPage from '../Pages/PatientListPage/PatientListPage';
import DoctorListPage from '../Pages/DoctorListPage/DoctorListPage';
import NotFound from '../components/NotFound/NotFound';
import MainPage from '../Pages/MainPage/MainPage';
import AuthPage from '../Pages/AuthPage/AuthPage';
import EditorPage from '../Pages/EditorPage/EditorPage';
import TestComponentPage from '../Pages/TestComponentPage/TestComponentPage';

const Router = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path='/schedule' element={<SchedulePage />} />
                    <Route path='/patients' element={<PatientListPage />} />
                    <Route path="/doctors" element={<DoctorListPage />} />
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/editor' element={<EditorPage />} />
                    <Route path='/test' element={<TestComponentPage />} />
                    <Route path='*' element={<NotFound message="404 Not Found" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default Router;
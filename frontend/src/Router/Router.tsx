import { Route, Routes, BrowserRouter } from 'react-router-dom';
import SchedulePage from '../Pages/SchedulePage';
import PatientListPage from '../Pages/PatientListPage';
import DoctorListPage from '../Pages/DoctorListPage';
import AuthPage from '../Pages/AuthPage';
import EditorPage from '../Pages/EditorPage';

import NotFound from '../components/NotFound/NotFound';

const Router = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/schedule' element={<SchedulePage />} />
                    <Route path='/patients' element={<PatientListPage />} />
                    <Route path="/doctors" element={<DoctorListPage />} />
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/editor' element={<EditorPage />} />

                    <Route path='*' element={<NotFound message="404 Not Found" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default Router;
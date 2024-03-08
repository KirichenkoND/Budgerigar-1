import React from 'react';
import './MePage.scss';

const MePage = () => {
    return (
        <>
            <div className='MeContainer'>
                <div className='MeData'>
                    <div className='MeAside'>
                        <span>Фамилия</span>
                        <span>Пиванов</span>
                        <span>Имя</span>
                        <span>Пиван</span>
                        <span>Отчество</span>
                        <span>Пиванович</span>
                        <span>Возраст</span>
                        <span>24</span>
                        <span>Договор</span>
                        <span>ABCDE001</span>
                    </div>
                </div>

                <div className='MeInfoContainer'>
                    <div className='MeInfoWrapper'>
                        <span>12345</span>
                    </div>
                    <div className='MeInfoWrapper'>
                        <span>1078901</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MePage;
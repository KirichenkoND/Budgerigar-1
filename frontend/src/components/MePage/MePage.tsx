import React from 'react';
import './MePage.scss';
import useravatar from '../../../public/user.svg';
import { MiniCards } from '../../UI/MiniCards/MiniCards';

const MePage: React.FC = () => {
    return (
        <>
            <div className='MeContainer'>
                <div className='MeData'>
                    <div className='MeAside'>
                        <div className='MeAside2'>
                            <button type="button" className="profileButton">
                                <img src={useravatar} />
                            </button>
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
                </div>

                <div className='MeInfoContainer'>
                    <div className='MeInfoWrapper'>
                        <span>Адрес проживания</span>
                        <span>Адрес: 362300, Липецкая область, город Балашиха, шоссе Ладыгина, 02</span>
                    </div>
                    <div className='MeInfoWrapper'>
                        <span>Визиты к врачу</span>
                        <div className="scroll-list">
                            <div className="sessions-list">
                                <div className="session-item">
                                    <p><strong>Дата визита:</strong></p>
                                    <p><strong>Жалобы:</strong></p>
                                    <p><strong>Диагноз:</strong></p>
                                    <p><strong>Рекомендации:</strong></p>
                                </div>
                                <div className="session-item">
                                    <p><strong>Дата визита:</strong></p>
                                    <p><strong>Жалобы:</strong></p>
                                    <p><strong>Диагноз:</strong></p>
                                    <p><strong>Рекомендации:</strong></p>
                                </div>
                                <div className="session-item">
                                    <p><strong>Дата визита:</strong></p>
                                    <p><strong>Жалобы:</strong></p>
                                    <p><strong>Диагноз:</strong></p>
                                    <p><strong>Рекомендации:</strong></p>
                                </div>
                                <div className="session-item">
                                    <p><strong>Дата визита:</strong></p>
                                    <p><strong>Жалобы:</strong></p>
                                    <p><strong>Диагноз:</strong></p>
                                    <p><strong>Рекомендации:</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MePage;
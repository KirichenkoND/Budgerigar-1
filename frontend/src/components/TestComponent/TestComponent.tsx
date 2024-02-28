import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import './TestComponent.scss'
import React, { useState } from 'react';

import { MiniCards } from '../../UI/MiniCards/MiniCards';

import useravatar from '../../../public/user.svg';

export const TestComponent: React.FC = () => {
    return (
        <>
            <div className='MedicalCardContainer'>
                <div className='MedicalData'>
                    <div className='MedicalData2'>
                        <div className='MedicalAside'>
                            <div className='Userinform'>
                                <div className="profile_select_container">
                                    <button type="button" className="dghTSH">
                                        <img src={useravatar} />
                                    </button>

                                    <div className="sc-ifAKCX EANAk" />
                                    <div id="profile_select_name" className="sc-bwzfXH sc-jrOYZv lnEaOP">
                                        <span className="sc-jzJRlG sc-fQfKYo cfDcIS">Иван</span>
                                        <span className="sc-jzJRlG sc-fQfKYo cfDcIS">Иванович И.</span>
                                    </div>
                                    <div className="sc-ifAKCX fVODKB" />
                                    <div className="sc-gIjDWZ dxzocw">
                                        <button
                                            id="profile_select_open_button"
                                            type="button"
                                            className="sc-bdVaJa dghTSH"
                                        ></button>
                                        <div id="profile_list_container" className="sc-kwclOP fLyoFE" />
                                    </div>
                                    <div className="sc-ifAKCX fwMRKw" />
                                    <span color="#263479" className="sc-chPdSV chQZVy">
                                        пол
                                    </span>
                                    <span color="#FFFFFF" id="profile_select_gender" className="sc-eNQAEJ ffbiLu">
                                        мужской
                                    </span>
                                    <div className="sc-ifAKCX fVODKB" />
                                    <span color="#263479" className="sc-chPdSV chQZVy">
                                        возраст
                                    </span>
                                    <span
                                        color="#FFFFFF"
                                        id="profile_select_birth_date"
                                        className="sc-eNQAEJ ffbiLu"
                                    >
                                        55 лет
                                    </span>
                                    <span color="#263479" className="sc-chPdSV chQZVy">
                                        Номер договора
                                    </span>
                                    <span
                                        color="#FFFFFF"
                                        id="profile_select_birth_date"
                                        className="sc-eNQAEJ ffbiLu"
                                    >
                                        ABCDEFR
                                    </span>
                                </div>

                            </div>

                        </div>

                        <div className="MedicalContainer">
                            <div className='MedicalCardsMain'>
                                <div className='MedicalCards'>
                                    <MiniCards /><MiniCards /><MiniCards />
                                </div>
                            </div>
                            <div className='MedicalCardsMain'>
                                <div className='MedicalCards'>
                                    <MiniCards /><MiniCards /><MiniCards />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
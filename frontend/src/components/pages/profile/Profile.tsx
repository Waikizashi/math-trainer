import React, { useEffect, useRef } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import { mainContainer, subContainer, section, visualArea } from '../../../utils/styles/global-styles';

const Profile = () => {
    const parentRef = useRef(null);
    useEffect(() => {
        if (parentRef) {
        }
    }, []);
    return (
        <div className={mainContainer}>
            <MainMenu />
            <div className={subContainer}>
                <div className={section}>
                    <h5 className="card-header">Profile</h5>
                    <div className="card-body">
                        <form>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
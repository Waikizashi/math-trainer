import React, { useEffect, useRef } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import MainMenu from '../../components/navigation/Menu';

const Profile = () => {
    const parentRef = useRef(null);
    useEffect(() => {
        if (parentRef) {
        }
    }, []);
    const mainContainer = cn(
        'main-container',
        'd-flex',
        'flex-column',
        'justify-content-center',
        'align-items-center',
        'w-100',
        'h-100',
    )
    const subContainer = cn(
        'd-flex',
        'justify-content-center',
        'align-items-center',
        'w-100',
        'h-100',
        'my-2'
    )
    const section = cn(
        "card",
        "text-center",
        "mx-2",
        'h-100',
        'w-100',
    )
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
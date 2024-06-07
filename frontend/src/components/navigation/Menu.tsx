import React, { useContext } from 'react';
import cn from 'classnames';
import s from './menu.module.css';
import { Link, useLocation } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import QuizIcon from '@mui/icons-material/Quiz';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HubIcon from '@mui/icons-material/Hub';
import AuthContext from '../../context/AuthContext'; // Импортируйте AuthContext
import { useLanguage } from '../../context/LanguageContext';
import { Button, Nav } from 'react-bootstrap';

interface MenuProps {
    description?: string;
}

const MainMenu: React.FC<MenuProps> = (description) => {
    const authContext = useContext(AuthContext);
    const { changeLanguage, language, translations } = useLanguage();

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { user, logout } = authContext;

    const toggleLanguage = () => {
        changeLanguage(language === 'en' ? 'sk' : 'en');
    };

    const menuClasses = cn(
        s.container,
        s.menu
    );

    const location = useLocation();
    const isHome = location.pathname === '/home';

    const mainMenu = () => (
        <nav className="p-0 w-100 navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/home">
                    <img src="/favicon.ico" width="30" height="30" className="d-inline-block align-top mx-2" alt="Math trainer" />
                    {translations.mainTitle}
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="w-100 navbar-nav d-flex justify-content-end">
                        <li>
                            <Nav.Link className='p-0' onClick={toggleLanguage}>
                                <Button className=' m-2 py-0 bg-primary'>{language === 'en' ? 'EN' : 'SK'}</Button>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/home">{translations.homepage}</Link>
                        </li>
                        {user ? (
                            <>
                                <li hidden={!(user.role === 'ADMIN')} className="nav-item">
                                    <Link className="nav-link text-warning" aria-current="page" to="/admin">{translations.adminPanel}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={cn("nav-link", location.pathname === '/theory' ? 'active' : '')} aria-current="page" to="/theory">{translations.theoryPage}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={cn("nav-link", location.pathname === '/practice' ? 'active' : '')} aria-current="page" to="/practice">{translations.practicePage}</Link>
                                </li>
                            </>
                        ) : <></>
                        }
                        <li className="nav-item">
                            <Link className={cn("nav-link", location.pathname === '/constructor' ? 'active' : '')} aria-current="page" to="/constructor">{translations.constructor}</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <button id="ref-login" type="button" className="btn btn-primary py-0 dropdown-toggle">
                                    {user?.username}
                                </button>
                            </a>
                            <ul className="shadow border border-secondary border-1 dropdown-menu mt-1 p-2 bg-light" style={{ width: "fit-content", zIndex: 1100 }}>
                                {user ? (
                                    <>
                                        <li><Link type="button" className="w-100 btn btn-success mb-2 py-1" to="/profile">{translations.profile}</Link></li>
                                        <li><button type="button" className="w-100 btn btn-outline-danger py-0" onClick={logout}>{translations.signOut}</button></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link type="button" className="w-100 btn btn-success mb-2 py-0" to="/login">{translations.signIn}</Link></li>
                                        <li><Link type="button" className="w-100 btn btn-outline-dark py-0 " to="/register">{translations.signUp}</Link></li>
                                    </>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );

    const homeMenu = () => (
        <div className={s.centeredContainer}>
            <div className={cn(menuClasses)}>
                <div className="row justify-content-center align-items-center">
                    <div className="col-12 text-center m-1">
                        <Link to="/practice">
                            <Fab color="primary">
                                <QuizIcon></QuizIcon>
                            </Fab>
                        </Link>
                    </div>
                </div>
                <div className="row justify-content-around align-items-center">
                    <div className="col-auto text-center m-1">
                        <Link to="/profile">
                            <Fab color="primary">
                                <AccountBoxIcon></AccountBoxIcon>
                            </Fab>
                        </Link>
                    </div>
                    <div className="col-auto text-center my-4">
                        <Fab href="https://github.com/Waikizashi" color="secondary">
                            <GitHubIcon></GitHubIcon>
                        </Fab>
                    </div>
                    <div className="col-auto text-center m-1">
                        <Link to="/theory">
                            <Fab color="primary">
                                <MenuBookIcon></MenuBookIcon>
                            </Fab>
                        </Link>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center">
                    <div className="col-12 text-center m-1">
                        <Link to="/constructor">
                            <Fab color="primary">
                                <HubIcon></HubIcon>
                            </Fab>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isHome ? homeMenu() : mainMenu()}
        </>
    );
};

export default MainMenu;

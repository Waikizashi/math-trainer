import React from 'react';
import cn from 'classnames';
import s from './menu.module.css';
import { Link, useLocation } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import QuizIcon from '@mui/icons-material/Quiz';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HubIcon from '@mui/icons-material/Hub';

interface MenuProps {
    description?: string;
}

const pages = ['home', 'theory', 'exercices', 'constructor'];
const settings = ['profile', 'logout'];


const MainMenu: React.FC<MenuProps> = (description) => {
    const menuClasses = cn(
        s.container,
        s.menu
    )
    const location = useLocation();
    const isHome = location.pathname === '/home';


    const mainMenu = () => (
        <nav className="w-100 navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/home">
                    <img src="/favicon.ico" width="30" height="30" className="d-inline-block align-top mx-2" alt="Math trainer" />
                    Math trainer
                </Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="w-100 navbar-nav d-flex justify-content-end">
                        <li className="nav-item">
                            <Link className="nav-link"
                                aria-current="page" to="/home">home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={cn("nav-link",
                                location.pathname === '/theory' ? 'active' : '')}
                                aria-current="page" to="/theory">theory</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={cn("nav-link",
                                location.pathname === '/exercices' ? 'active' : '')}
                                aria-current="page" to="/exercices">exercices</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={cn("nav-link",
                                location.pathname === '/constructor' ? 'active' : '')}
                                aria-current="page" to="/constructor">constructor</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <button id="ref-login" type="button" className="btn btn-success py-0 dropdown-toggle">
                                    ME
                                </button>
                            </a>
                            <ul className="dropdown-menu" style={{ zIndex: 1100 }}>
                                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                <li><Link className="dropdown-item" to="/login">Login</Link></li>
                            </ul>

                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )

    const homeMenu = () => (
        <div className={menuClasses}>
            <div className="row justify-content-center align-items-center">
                <div className="col-12 text-center m-1">
                    <Link to="/exercices">
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
    )

    return (
        <>
            {isHome ? homeMenu() : mainMenu()}
        </>
    );
};

export default MainMenu;
import React, { useEffect, useRef } from 'react';
import s from './login.module.css';
import cn from 'classnames';
import MainMenu from '../../navigation/Menu';
import { mainContainer, subContainer, section, visualArea } from '../../../utils/styles/global-styles';

const LoginPage = () => {
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
                    <h5 className="card-header">Sign In</h5>
                    <div className="card-body h-100">
                        <form className='h-100 d-flex flex-column justify-content-evenly'>
                            <div className="d-flex flex-column justify-content-evenly">
                                <div id="email-form" className="form-group my-2">
                                    <label>Email address</label>
                                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp"
                                        placeholder="Enter email" />
                                </div>
                                <div id="pass-form" className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control my-4" id="pass"
                                        placeholder="Password - min 6 symbols" />
                                </div>
                            </div>
                            <a id="login" type="submit" className="btn btn-success">Login</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
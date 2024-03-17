import React, { useEffect, useRef } from 'react';
import s from './theoryPage.module.css';
import cn from 'classnames';
import MainMenu from '../../components/navigation/Menu';

const Login = () => {
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
        "m-auto",
        'w-25'
    )
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

export default Login;
import React, { useEffect, useRef, useState } from 'react';
import s from './login.module.css';
import cn from 'classnames';
import { mainContainer, subContainer } from '../../../utils/styles/global-styles';
import AuthService from '../../../service/AuthService';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const parentRef = useRef(null);
    useEffect(() => {
        if (parentRef) {
        }
    }, []);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await AuthService.register({ username, email, password, role: 'USER' });
            alert('Registration successful');
        } catch (error) {
            alert('Failed to register');
        }
    };

    const registerSection = cn(
        "card",
        "text-center",
        "my-auto",
        "mx-2",
        'mw-25'
    )

    return (
        <div className={mainContainer}>
            {/* <MainMenu /> */}
            <div className={subContainer}>
                <div className={registerSection} style={{ height: "fit-content" }}>
                    <h5 className="card-header">Register</h5>
                    <div className="card-body h-100">
                        <form className='h-100 d-flex flex-column justify-content-evenly' onSubmit={handleRegister}>
                            <div className="d-flex flex-column justify-content-evenly">
                                <div id="username-form" className="form-group my-2">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div id="email-form" className="form-group my-2">
                                    <label>Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div id="pass-form" className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control my-2"
                                        id="pass"
                                        placeholder="Password - min 6 symbols"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div id="confirm-pass-form" className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control my-2"
                                        id="confirm-pass"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button id="register" type="submit" className="btn btn-success">Register</button>
                            <Link className='my-1' to='/login'><button id="login" className="btn btn-outline-primary w-100">Login</button></Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;

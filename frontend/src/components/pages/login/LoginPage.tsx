import React, { useEffect, useRef, useState, useContext } from 'react';
import cn from 'classnames';
import { mainContainer, subContainer } from '../../../utils/styles/global-styles';
import AuthContext from '../../../context/AuthContext'; // Импортируйте AuthContext
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const parentRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { login } = authContext;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            alert('Login successful');
        } catch (error) {
            alert('Failed to login');
        }
    };

    useEffect(() => {
        if (parentRef) {
        }
    }, []);

    const loginSection = cn(
        "card",
        "text-center",
        "my-auto",
        "mx-2",
        'mw-25'
    );

    return (
        <div className={mainContainer}>
            <div className={subContainer}>
                <div className={loginSection} style={{ height: "fit-content" }}>
                    <h5 className="card-header">Sign In</h5>
                    <div className="card-body h-100">
                        <form className='h-100 d-flex flex-column justify-content-evenly' onSubmit={handleLogin}>
                            <div className="d-flex flex-column justify-content-evenly">
                                <div id="email-form" className="form-group my-2">
                                    <label>Username</label>
                                    <input
                                        className="form-control"
                                        id="email"
                                        aria-describedby="emailHelp"
                                        placeholder="email or username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div id="pass-form" className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control mb-4"
                                        id="pass"
                                        placeholder="Password - min 6 symbols"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button id="login" type="submit" className="btn btn-success">Login</button>
                            <Link className='my-1' to='/register'><button id="login" type="submit" className="btn btn-primary w-100">Register</button></Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

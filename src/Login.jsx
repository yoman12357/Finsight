import React, { useState, useEffect } from 'react';
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, provider, db } from './firebase';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const particleArray = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: 3 + Math.random() * 5,
            size: Math.random() * 4 + 2
        }));
        setParticles(particleArray);
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await setDoc(doc(db, "users", user.uid), {
                username: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastLogin: new Date()
            }, { merge: true });

            console.log("Google Login Success:", user);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    lastLogin: new Date()
                }, { merge: true });
                console.log("Login User Data:", user);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                await updateProfile(user, { displayName: formData.username });
                await setDoc(doc(db, "users", user.uid), {
                    username: formData.username,
                    email: formData.email,
                    createdAt: new Date()
                });
                alert('Signup Successful!');
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ email: '', password: '', username: '' });
    };

    return (
        <div className="login-container">
            <div className="particle-field">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.left}%`,
                            animationDuration: `${particle.animationDuration}s`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`
                        }}
                    />
                ))}
            </div>

            <div className="grid-background">
                <div className="grid-lines-horizontal"></div>
                <div className="grid-lines-vertical"></div>
            </div>

            <div className="holo-circle holo-circle-1"></div>
            <div className="holo-circle holo-circle-2"></div>
            <div className="holo-circle holo-circle-3"></div>

            <div className="content-wrapper">
                <div className="branding-section">
                    <div className="brand-content">
                        <div className="brand-logo-placeholder">
                            <div className="logo-hexagon"></div>
                        </div>
                        <h1 className="brand-title">
                            <span className="title-fin">Fin</span>
                            <span className="title-sight">Sight</span>
                        </h1>
                        <p className="brand-tagline">Smart Wallet & Expense Analyzer</p>
                        <div className="brand-description">
                            <p>Experience the future of financial management</p>
                        </div>
                        <div className="floating-elements">
                            <div className="float-element float-1"></div>
                            <div className="float-element float-2"></div>
                            <div className="float-element float-3"></div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-container">
                        <div className="form-header">
                            <div className="header-glow"></div>
                            <h2 className="form-title">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="form-subtitle">
                                {isLogin
                                    ? 'Enter your credentials to access your financial universe'
                                    : 'Join the future of financial intelligence'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-fields">
                                {!isLogin && (
                                    <div className="input-group">
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                required
                                                className="futuristic-input"
                                                placeholder=" "
                                            />
                                            <label className="floating-label">Username</label>
                                            <div className="input-border"></div>
                                            <div className="input-icon">
                                                <svg viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="futuristic-input"
                                            placeholder=" "
                                        />
                                        <label className="floating-label">Email Address</label>
                                        <div className="input-border"></div>
                                        <div className="input-icon">
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" />
                                                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="futuristic-input"
                                            placeholder=" "
                                        />
                                        <label className="floating-label">Password</label>
                                        <div className="input-border"></div>
                                        <div className="input-icon">
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {isLogin && (
                                    <div className="form-options">
                                        <label className="remember-me">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                            <span className="checkbox-label">Remember me</span>
                                        </label>
                                        <a href="#" className="forgot-password">Forgot Password?</a>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                <span className="btn-text">
                                    {loading
                                        ? 'Processing...'
                                        : (isLogin ? 'Access System' : 'Initialize Account')
                                    }
                                </span>
                                <div className="btn-glow"></div>
                                {!loading && (
                                    <div className="btn-particles">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                )}
                            </button>

                            <div className="divider">
                                <span className="divider-line"></span>
                                <span className="divider-text">Or continue with</span>
                                <span className="divider-line"></span>
                            </div>

                            <div className="social-login">
                                <button type="button" onClick={handleGoogleLogin} className="social-btn">
                                    <svg viewBox="0 0 24 24" className="social-icon">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </button>
                                <button type="button" className="social-btn">
                                    <svg viewBox="0 0 24 24" className="social-icon">
                                        <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                </button>
                                <button type="button" className="social-btn">
                                    <svg viewBox="0 0 24 24" className="social-icon">
                                        <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="form-footer">
                                <p className="toggle-text">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    <button type="button" onClick={toggleMode} className="toggle-btn">
                                        {isLogin ? 'Sign Up' : 'Sign In'}
                                    </button>
                                </p>
                            </div>
                        </form>

                        <div className="corner-decoration corner-tl"></div>
                        <div className="corner-decoration corner-tr"></div>
                        <div className="corner-decoration corner-bl"></div>
                        <div className="corner-decoration corner-br"></div>
                    </div>
                </div>
            </div>
            <div className="scan-line"></div>
        </div>
    );
};

export default Login;
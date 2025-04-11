import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import config from '../../config/config';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const nickname = location.state?.nickname;
  const mail = location.state?.email;

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (!password) {
      setMessage('введите пароль!');
    } else {
      try {
        const data = {
            mail: mail,
            password: password
        };
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: "include",
            withCredentials: true
        };
        const response = await fetch(`${config.API_URL}/users/login`, options);
        if (response.status === 200) {
            navigate('/');
        } else if (response.status === 404) {
            setMessage('Неверный пароль');
        } else {
          setMessage('Ошибка при авторизации');
        }
      } catch (error) {
        setMessage('Ошибка подключения к серверу');
      }
    }
  };

  setTimeout(() => {
    setMessage('');
  }, 4000);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className='login-body'>
      <div className="login-container">
        <div>
          <a href="/" className="back-link">на главную</a>
        </div>
        <h1>Добро пожаловать, {nickname}</h1>
        <p>Введите пароль, чтобы войти в систему</p>
        <div className="input-group">
          <input
            type="password"
            placeholder="пароль"
            value={password}
            onChange={handlePasswordChange}
            className={`password-input ${password ? 'active' : ''}`}
          />
          <button onClick={handleLogin} className="login-button">
            продолжить
          </button>
        </div>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default LoginPage;

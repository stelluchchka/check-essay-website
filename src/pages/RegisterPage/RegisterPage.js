import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import config from '../../config/config';

function RegisterPage() {
  const [mail, setMail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassord] = useState('');
  const [password2, setPassord2] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Функция для валидации mail
  const validateMail = (mail) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(mail).toLowerCase());
  };

  // Обработчик нажатия на кнопку
  const handleRegister = async () => {
    if (!mail || !nickname || !password || !password2) {
      setMessage('введите все данные!');
    } else if (!validateMail(mail)) {
      setMessage('введите электронную почту корректно🙄');
    } else if (password != password2) {
      setMessage('пароли не совпадают!');
    } 
    else {
      try {
        const data = {
          mail: mail,
          nickname : nickname,
          password: password
        };
        console.log(data)
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: "include",
            withCredentials: true
        };
        const response = await fetch(`${config.API_URL}/users`, options);
        if (response.status === 201) {
          navigate('/');
        } else if (response.status === 400) {
          setMessage('Эта почта уже используется');
        }
        else {
          setMessage('Ошибка при регистрации пользователя');
        }
      } catch (error) {
        setMessage('Ошибка подключения к серверу');
      }
    }
  };

  setTimeout(() => {
    setMessage('');
  }, 4000);

  const handleMailChange = (e) => {
    setMail(e.target.value);
  };
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassord(e.target.value);
  };
  const handlePassword2Change = (e) => {
    setPassord2(e.target.value);
  };
  return (
    <div className="register-container">
      <div className="register-box">
        <a href="/" className="back-link">на главную</a>
        <h1>Добро пожаловать в eSSay</h1>
        <div className="login-group">
          <p>Уже есть аккаунт?</p>
          <a href="/welcome" className="back-link-login">Войти</a>
        </div>
        <form className="register-form">
          <input
            type="mail"
            placeholder="электронная почта"
            value={mail}
            onChange={handleMailChange}
            className={`input-field ${mail ? 'active' : ''}`}
          />
          <input
            type="nickname"
            placeholder="никнейм"
            value={nickname}
            onChange={handleNicknameChange}
            className={`input-field ${nickname ? 'active' : ''}`}
          />
          <input
            type="password"
            placeholder="пароль"
            value={password}
            onChange={handlePasswordChange}
            className={`input-field ${password ? 'active' : ''}`}
          />
          <input
            type="password"
            placeholder="повторите пароль"
            value={password2}
            onChange={handlePassword2Change}
            className={`input-field ${password2 ? 'active' : ''}`}
          />
        </form>
        {message && <div className="message">{message}</div>}
        <button type="submit" onClick={handleRegister} className="register-button">зарегистрироваться</button>
      </div>
    </div>
  );
}

export default RegisterPage;

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ProfilePage.css';
import EssayCard from '../../components/EssayCard/EssayCard';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";
import config from '../../config/config';

const ProfilePage = () => {
  const [essays, setEssays] = useState([]);
  const [results, setResults] = useState([]);
  const [nickname, setNickname] = useState("nickname");
  const [countChecks, setCountChecks] = useState(0);
  const [mail, setMail] = useState("example@mail.ru");
  const [countEssays, setCountEssays] = useState(0)
  const [countPublishedEssays, setCountPublishedEssays] = useState(0)
  const [averageResult, setAverageResult] = useState(0)
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [newMail, setNewMail] = useState("");
  const [isModerator, setIsModerator] = useState(0);

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLogout = async () => {
    try {
      const options = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: "include",
          withCredentials: true
      };
      const response = await fetch(`${config.API_URL}/users/logout`, options);
      if (response.status === 200) {
          navigate('/');
      } else {
        console.log('Ошибка при выходе из системы');
      }
    } catch (error) {
      console.log('Ошибка подключения к серверу');
    }
    cookies.remove("session_id", { path: "/" }); 
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewNickname(nickname);
    setNewMail(mail);
  };

  const handleSave = async () => {
    try {
      const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        withCredentials: true,
        body: JSON.stringify({ nickname: newNickname, mail: newMail })
      };
      const response = await fetch(`${config.API_URL}/users`, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setNickname(newNickname);
      setMail(newMail);
      setIsEditing(false);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: "include",
          withCredentials: true
      };
        const response = await fetch(`${config.API_URL}/users/me/essays`, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEssays(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: "include",
          withCredentials: true
        };
        const response = await fetch(`${config.API_URL}/users/info`, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setNickname(data["nickname"]);
        setCountChecks(data["count_checks"])
        setMail(data["mail"]);
        setCountEssays(data["count_essays"])
        setCountPublishedEssays(data["count_published_essays"])
        setAverageResult(data["average_result"])
        setIsModerator(data["is_moderator"])
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    const fetchResults = async () => {
      try {
        const response = await fetch(`${config.API_URL}/users/me/results`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Transform data for the chart
        const chartData = data.map(result => ({
          name: new Date(result.completed_at).toLocaleDateString('ru-RU', {
            month: 'numeric',
            year: '2-digit'
          }),
          value: result.score
        }));
        
        setResults(chartData);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
    fetchEssays();
    fetchUserInfo();
  }, []); 

  return (
    <div className="profile-container">
      <Header />
      <div className="content">
        <h2 className="section-title">Информация</h2>
        <div className="info">
          <div className="info-text">
            <p className="nickname">{nickname}</p>
            <p className="email">{mail}</p>
            {!isModerator && 
            <>
            <p className="results">доступно проверок: {countChecks}</p>
            <p className="results">написано сочинений: {countEssays}</p>
            <p className="results">опубликовано сочинений: {countPublishedEssays}</p>
            <p className="results">средний результат: {averageResult}</p>   
            </>         
            }
          </div>
        {isEditing ? (
          <div className="edit-container">
            <div className="edit-fields">
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="Новый никнейм"
              />
              <input
                type="text"
                value={newMail}
                onChange={(e) => setNewMail(e.target.value)}
                placeholder="Новая почта"
              />
            </div>
            <div className="edit-buttons">
              <button onClick={handleSave} className="btn white">Сохранить</button>
              <button onClick={() => setIsEditing(false)} className="btn blue">Отмена</button>
            </div>
          </div>
        ) : (
          <div className="info-buttons">
            <button onClick={handleEdit} className="btn white">Изменить информацию</button>
            <button onClick={handleLogout} className="btn blue">Выйти</button>
          </div>
        )}
      </div>
        {!isModerator && (
          <>
            <h2 className="section-title">Прогресс</h2>
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#01B4BC" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <h2 className="section-title">Мои сочинения</h2>
            <div className="essay-grid">
              {essays.map((essay) => (
                <EssayCard
                  key={essay.id}
                  ifUserEssay={true}
                  id={essay.id}
                  nickname={essay.author_nickname}
                  title={essay.variant_title}
                  variant_id={essay.variant_id}
                  score={essay.score}
                  likes={essay.likes}
                  status={essay.status}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
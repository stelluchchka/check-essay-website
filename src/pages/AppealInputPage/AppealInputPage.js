import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './AppealInputPage.css';
import config from '../../config/config';

function AppealInputPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [essay, setEssay] = useState(null);
  const [results, setResults] = useState(null)
  const [criteria, setCriteria] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [appealText, setAppealText] = useState('');

  const location = useLocation();

  const lastResult = Array.isArray(results) && results.length > 0 ? results[results.length - 1] : null;
  const getScoreKey = (index) => `K${index + 1}_score`;
  const getExplanationKey = (index) => `K${index + 1}_explanation`;

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await fetch(`${config.API_URL}/criteria`, { credentials: 'include' });
        if (!response.ok) throw new Error('Ошибка загрузки критериев');
        const data = await response.json();
        setCriteria(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCriteria();
  }, []);

  useEffect(() => {
    const fetchEssay = async () => {
      try {
        // Always fetch from user essays endpoint for appeals
        const response = await fetch(`${config.API_URL}/users/me/essays/${id}`, { 
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки сочинения');
        
        const data = await response.json();
        setEssay(data);
        setResults(data["results"])
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEssay();
  }, [id]);


  const handleAppealToggle = async () => {
    if (!appealText.trim()) {
      alert('Пожалуйста, введите текст апелляции');
      return;
    }

    try {
      const url = `${config.API_URL}/essays/${id}/appeal`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appeal_text: appealText }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Ошибка при подаче апелляции');
      }
      console.log("Сочинение подано на апелляцию")
      setStatus("appeal")
      navigate(`/essays/${id}`, { state: { ifUserEssay: true } });

    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!essay) return <div>Ошибка загрузки сочинения</div>;

  return (
    <div className="App">
      <Header />
      <main className="essay-content">

      <div className="variant-title-section">
        {essay.variant_title}
      </div>   
      <div className="essay-text-section">
          {essay.essay_text}
      </div>
      <div className="content-container">
        <div className="info-container">
          <div className="info-text">
            автор {essay.author_nickname}
          </div> 

        </div>
        <section className="result-content">
          <table className="result-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Критерий</th>
                <th>Пояснение</th>
                <th>Баллы</th>
                <th>Макс.</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion, index) => (
                <tr key={criterion.id}>
                  <td>K{index + 1}</td>
                  <td>{criterion.title}</td>
                  <td>{lastResult ? lastResult[getExplanationKey(index)] : ''}</td>
                  <td className="points">{lastResult ? lastResult[getScoreKey(index)] : ''}</td>
                  <td className="points">{criterion.max_score}</td>
                </tr>
              ))}
            <tr>
              <td colSpan="3" style={{ fontWeight: "bold", textAlign: "left" }}>Сумма баллов:</td>
              <td className="points" style={{ fontWeight: "bold" }}>
                {lastResult
                  ? lastResult.score !== undefined
                    ? lastResult.score
                    : criteria.reduce((sum, _, i) => sum + (lastResult[`K${i + 1}_score`] || 0), 0)
                  : ''}
              </td>
              <td className="points" style={{ fontWeight: "bold" }}>
                {criteria.reduce((sum, c) => sum + (c.max_score || 0), 0)}
              </td>
            </tr>
            </tbody>
          </table>
    
          <div className="appeal-form">
            <h3>Текст апелляции</h3>
            <textarea
              value={appealText}
              onChange={(e) => setAppealText(e.target.value)}
              placeholder="Опишите, почему вы не согласны с оценкой..."
              className="appeal-input"
              rows={5}
            />
            <div className='appeal-button-container'>
            <button onClick={handleAppealToggle} className={`btn-appeal`}>Апеллировать
            </button>   
          </div>   
          </div>
        </section>

        </div>
      </main>
    </div>
  );
}

export default AppealInputPage;

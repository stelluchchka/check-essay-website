import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './AppealInputPage.css';
import config from '../../config/config';

function AppealInputPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [essay, setEssay] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [appealText, setAppealText] = useState('');

  const location = useLocation();

  const criteria = [
    {
      id: "K1",
      title: "Отражение позиции автора по указанной проблеме исходного текста",
      content:
        "Позиция ученика в целом верно отражает позицию автора. Ученик правильно указал, что внешняя цель человека не всегда соответствует его сущности.",
      points: 1,
    },
    {
      id: "K2",
      title: "Комментарий к позиции автора по указанной проблеме исходного текста",
      content: "Комментарий должен включать примеры и пояснения, которые обосновывают позицию автора.",
      points: 2,
    },
    {
      id: "K3",
      title: "Собственное отношение к позиции автора по указанной проблеме",
      content: "Ученик высказывает свою точку зрения и аргументирует её с опорой на содержание текста.",
      points: 2,
    },
    {
      id: "K4",
      title: "Фактическая точность речи",
      content: "Ответ должен быть точным, без фактических ошибок в описании событий или выводах.",
      points: 1,
    },
    {
      id: "K5",
      title: "Логичность речи",
      content: "Текст должен быть логически связанным и последовательным.",
      points: 1,
    },
    {
      id: "K6",
      title: "Соблюдение этических норм",
      content: "Ответ не должен содержать неэтичные высказывания или нарушать нормы общения.",
      points: 1,
    },
    {
      id: "K7",
      title: "Соблюдение орфографических норм",
      content: "Ответ должен быть написан без орфографических ошибок.",
      points: 1,
    },
    {
      id: "K8",
      title: "Соблюдение пунктуационных норм",
      content: "Текст должен соответствовать правилам пунктуации.",
      points: 1,
    },
    {
      id: "K9",
      title: "Соблюдение грамматических норм",
      content: "Ответ не должен содержать грамматических ошибок.",
      points: 1,
    },
    {
      id: "K10",
      title: "Соблюдение речевых норм",
      content: "Речь должна быть ясной, выразительной и соответствовать ситуации.",
      points: 1,
    },
  ];


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
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion, index) => (
                <tr key={criterion.id}>
                  <td>K{index + 1}</td>
                  <td>{criterion.title}</td>
                  <td>{criterion.content}</td>
                  <td className="points">{criterion.points}</td>
                </tr>
              ))}
              <tr>
              <td colSpan="3" style={{ fontWeight: "bold", textAlign: "left" }}>Сумма баллов:</td>
              <td className="points" style={{ fontWeight: "bold" }}>
                {criteria.reduce((sum, criterion) => sum + criterion.points, 0)}
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

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CheckEssayPage.css';
import config from '../../config/config';

function CheckEssayPage() {
  const { id } = useParams();
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [criteriaInputs, setCriteriaInputs] = useState({});
  const [criteria, setCriteria] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (criterionId, field, value) => {
    setCriteriaInputs(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        [field]: value
      }
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(criteriaInputs).reduce((sum, criterion) => 
      sum + (parseInt(criterion?.score) || 0), 0);
  };

  const validateInputs = () => {
    const newErrors = {};
    criteria.forEach(criterion => {
      const input = criteriaInputs[criterion.id] || {};
      if (!input.explanation) {
        newErrors[`${criterion.id}_explanation`] = `Заполните пояснение для критерия ${criterion.id}`;
      }
      if (!input.score) {
        newErrors[`${criterion.id}_score`] = `Укажите балл для критерия ${criterion.id}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch essay
        const essayResponse = await fetch(`${config.API_URL}/essays/${id}`, { 
          credentials: 'include' 
        });
        if (!essayResponse.ok) throw new Error('Ошибка загрузки сочинения');
        const essayData = await essayResponse.json();
        setEssay(essayData);

        // Fetch criteria
        const criteriaResponse = await fetch(`${config.API_URL}/criteria`, { 
          credentials: 'include' 
        });
        if (!criteriaResponse.ok) throw new Error('Ошибка загрузки критериев');
        const criteriaData = await criteriaResponse.json();
        setCriteria(criteriaData.map(c => ({
          id: `K${c.id}`,
          title: c.title,
          max_score: c.max_score
        })));

      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCheckToggle = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const detailedResult = {
        ...Object.fromEntries(
          Object.entries(criteriaInputs).flatMap(([key, value]) => [
            [`${key}_score`, parseInt(value.score) || 0],
            [`${key}_explanation`, value.explanation || '']
          ])
        ),
        score: calculateTotalScore()
      };

      const response = await fetch(`${config.API_URL}/result/appeal/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(detailedResult),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке результатов');
      }
      console.log("Результаты успешно отправлены");
      navigate(`/appeals`);
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!essay) return <div>Ошибка загрузки сочинения</div>;

  return (
    <div>
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
        </section>
        <section className="result-content">
            <div className="result-grid">
            {criteria.map((criterion) => (
            <div key={criterion.id} className="result-card">
              <div className="card-header">
                <h3 className="card-title">{criterion.id}. {criterion.title}</h3>
              </div>
              <textarea
                className={`card-text ${errors[`${criterion.id}_explanation`] ? 'error' : ''}`}
                value={criteriaInputs[criterion.id]?.explanation || ''}
                onChange={(e) => handleInputChange(criterion.id, 'explanation', e.target.value)}
                placeholder="Введите пояснение"
              />
              {errors[`${criterion.id}_explanation`] && 
                <div className="error-message">{errors[`${criterion.id}_explanation`]}</div>
              }
              <div className="card-points">
              баллов 
                <input
                  type="number"
                  min="0"
                  max={criterion.max_score}
                  value={criteriaInputs[criterion.id]?.score || ''}
                  onChange={(e) => handleInputChange(criterion.id, 'score', e.target.value)}
                  className={`points-input ${errors[`${criterion.id}_score`] ? 'error' : ''}`}
                />
                из {criterion.max_score}
              </div>
              {errors[`${criterion.id}_score`] && 
                <div className="error-message">{errors[`${criterion.id}_score`]}</div>
              }
            </div>
          ))}
            </div>
            <div className="total-score">
              Сумма баллов: {calculateTotalScore()}
            </div>
            <div className="btn-container">
                <button 
                    className="btn-check" 
                    onClick={handleCheckToggle}
                    disabled={loading}
                >
                    {loading ? 'Проверка...' : 'Сохранить результаты'}
                </button>
            </div>
        </section>
      </main>
    </div>
  );
}

export default CheckEssayPage;

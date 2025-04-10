import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './EssayInputPage.css';
import Header from '../../components/Header/Header';

const EssayInputPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  if (!params || !params.id) {
      throw new Error("Параметр 'id' отсутствует в URL");
  }
  const id = +params.id;

  const [essayText, setEssayText] = useState('');
  const [essayId, setEssayId] = useState(0);
  const [variantText, setVariantText] = useState('');
  const [variantTitle, setVariantTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const essay_id = location.state?.id || 0;

  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/variants/${id}`);
        if (!response.ok) {
          throw new Error(`Ошибка при загрузке варианта ${id}`);
        }
        const data = await response.json();
        setVariantTitle(data.variant_title || '')
        setVariantText(data.variant_text || '');
      } catch (error) {
        console.error('Ошибка при загрузке информации о варианте:', error);
        setVariantTitle('Ошибка при загрузке заголовка варианта');
        setVariantText('Ошибка при загрузке текста варианта');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEssayData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/me/essays/${essay_id}`);
        if (!response.ok) {
          throw new Error(`Ошибка при загрузке сочинения ${essay_id}`);
        }
        const data = await response.json();
        setEssayText(data.essay_text || '');
      } catch (error) {
        console.error('Ошибка при загрузке информации о сочинении:', error);
        setEssayText('Ошибка при загрузке текста сочинения');
      } finally {
        setIsLoading(false);
      }
    };

    setEssayId(essay_id)
    if (essay_id !== 0) {
      fetchEssayData()
    }
    fetchVariantData();
  }, [id, essay_id]);

  const handleInputChange = (e) => {
    setEssayText(e.target.value);
  };

  const handleSave = async () => {
    if (!essayText) {
      setMessage('введите текст сочинения!')
    }
    else if (essayId === 0) {
      try {
        const data = {
            variant_id: id,
            essay_text: essayText,
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
        const response = await fetch(`http://localhost:8080/essays`, options);
        if (response.status === 201) {
          setMessage('сочинение сохранено')
          console.log("Сочинение успешно создано")
          const data = await response.json();
          setEssayId(data["essay_id"])
        } else if (response.status === 404) {
          console.log('Ошибка в тексте');
        } else {
          console.log('Ошибка сервера');
        }
      } catch (error) {
        console.log('Ошибка подключения к серверу');
      }
    } else {
      try {
        const data = {
            essay_text: essayText,
        };
        
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: "include",
            withCredentials: true
        };
        const response = await fetch(`http://localhost:8080/essays/` + essayId, options);
        if (response.status === 200) {
          setMessage('сочинение сохранено')
          console.log("Текст успешно сохранен")
        } else if (response.status === 404) {
          console.log('Ошибка в тексте');
        } else {
          console.log('Ошибка сервера');
        }
      } catch (error) {
        console.log('Ошибка подключения к серверу');
      }
    }
  };

  const handleCheck = async () => {
    if ((essayText.match(/[А-Яа-яЁёA-Za-z]+(?:-[А-Яа-яЁёA-Za-z]+)?/g) || []).length < 250) {
      setMessage('текст сочинения должен быть больше 250 символов!')
    } else {
      handleSave()
      try {
        const data = {
            variant_id: id,
            essay_text: essayText,
        };
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: "include",
            withCredentials: true
        };
        const response = await fetch(`http://localhost:8080/essays/`  + essayId + `/save`, options);
        if (response.status === 201 || response.status === 200) {
          setMessage('сочинение отправлено на проверку')
          console.log("Сочинение отправлено на проверку")

          console.log(response)
          const result = await response.json();
          const essay_id = result.essay_id;
          setEssayId(essay_id)
          navigate('/profile');
        } else {
          console.log('Ошибка сервера');
        }
      } catch (error) {
        console.log('Ошибка подключения к серверу');
      }
    }
  };

  setTimeout(() => {
    setMessage('');
  }, 3000);

  return (
    <div>
      <Header/>
      <div className="variant-breadcrumbs-section">
    
        <a className="breadcrumbs-href" href="/variants">варианты</a>  
        {id === 0 ? 
        <a className="breadcrumbs-variant"> / индивидуальный</a>
        :
        <a className="breadcrumbs-variant"> / {id}</a>
        }
        
      </div>
      <div>
        <div className="variant-title-section">
        {isLoading ? 'Загрузка...' : variantTitle}
        </div>   
        <div className="variant-text-section">
          {isLoading ? 'Загрузка...' : variantText}
        </div>
      </div>

      <div className="essay-page">
        <div className="essay-hint-section">
          <div className='hint-form'>
            <div className="hint-form-number">1</div>
            <p>Введение. Мягко подведите читателя к сочинению в 2-3 предложениях.</p>
          </div>
          <div className='hint-form'>
            <div className="hint-form-number">2</div>
            <p>Сформулируйте проблему. Для этого нужно 2-4 предложения.</p>
          </div>
          <div className='hint-form'>
            <div className="hint-form-number">3,4</div>
            <p>Комментарий к проблеме. На каждой примере подробно на 4-7 предложений.</p>
          </div>
          <div className='hint-form'>
            <div className="hint-form-number">5</div>
            <p>Отношение автора к проблеме. Упомяните 1-2 предложения.</p>
          </div>
          <div className='hint-form'>
            <div className="hint-form-number">6</div>
            <p>Своё отношение к вышесказанному.</p>
          </div>
          <div className='hint-form'>
            <div className="hint-form-number">7</div>
            <p>Итог: вывод, обобщение рассуждений.</p>
          </div>
      </div>
      <div className="essay-input-section">
        <textarea
          placeholder="Начните вводить текст..."
          value={essayText}
          onChange={handleInputChange}
          className="essay-textarea"
        />
      </div>        
      </div>
        <div className="button-container">
          {message && <div className="message">{message}</div>}
          <button className="save-btn" onClick={handleSave}>сохранить</button>
          <button className="check-btn" onClick={handleCheck}>проверить</button>
        </div>
    </div>
  );
};

export default EssayInputPage;

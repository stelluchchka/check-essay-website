import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './EssayPage.css';
import Cookies from "universal-cookie";
import config from '../../config/config';

function EssayPage() {
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [essay, setEssay] = useState(null);
  const [status, setStatus] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const ifUserEssay = location.state?.ifUserEssay || false;

  const cookies = new Cookies();
  useEffect(() => {
    const session = cookies.get("session");
    setIsLoggedIn(!!session);
  }, []);


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
    const fetchIsLiked = async () => {
      try {
        const likeResponse = await fetch(`${config.API_URL}/likes/is_liked/${id}`, { credentials: 'include' });
        if (!likeResponse.ok) throw new Error('Ошибка проверки лайка');
        
        const likeData = await likeResponse.json();
        setIsLiked(likeData.is_liked);

      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
  };
    const fetchEssay = async () => {
      if (ifUserEssay) {
        try {
          const response = await fetch(`${config.API_URL}/users/me/essays/${id}`, { credentials: 'include' });
          if (!response.ok) throw new Error('Ошибка загрузки сочинения');
          
          const data = await response.json();
          setEssay(data);
          setLikes(data["likes"]);
          setIsPublished(data["is_published"])
          setStatus(data["status"])
  
        } catch (error) {
          console.error('Ошибка загрузки:', error);
        } finally {
          setLoading(false);
        }
      } else {
      try {
        const response = await fetch(`${config.API_URL}/essays/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Ошибка загрузки сочинения');
        
        const data = await response.json();
        setEssay(data);
        setLikes(data["likes"]);
        setIsPublished(data["is_published"])
        setStatus(data["status"])

      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    }
  };

    fetchEssay();
    if (isPublished) {
      fetchIsLiked()
    }

  }, [id, ifUserEssay, isPublished]);

  const handleLikeToggle = async () => {
    try {
      const url = `${config.API_URL}/likes/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(isLiked ? 'Ошибка при удалении лайка' : 'Ошибка при добавлении лайка');
      }

      const updatedLikes = isLiked ? likes - 1 : likes + 1;
      setLikes(updatedLikes);
      setIsLiked(!isLiked);
  
      setEssay((prevEssay) => ({
        ...prevEssay,
        likes: updatedLikes,
      }));

    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const url = `${config.API_URL}/essays/${id}/publish`;
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Ошибка при публикации');
      }
      setIsPublished(true)
      console.log("Сочинение опубликовано")

    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAppealToggle = () => {
    navigate(`/essays/appeal/${id}`, { 
      state: { ifUserEssay: true } 
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Если комментарий пустой, не отправляем

    try {
      const response = await fetch(`${config.API_URL}/comments/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment_text: newComment }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении комментария');
      }

      const newCommentData = await response.json();
      setNewComment('');

      setEssay((prevEssay) => {
        const updatedEssay = {
          ...prevEssay,
          comments: [newCommentData, ...prevEssay.comments],
        };
        return updatedEssay;
      });



    } catch (error) {
      console.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
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

        {isPublished && 
          <div className='like-content'>
            <div className="like-text">{likes}</div>
            <button onClick={handleLikeToggle} className={`like-button ${isLiked ? 'liked' : ''}`} disabled={!isLoggedIn}>
              {isLiked ? 'Убрать лайк' : 'Нравится'}
            </button>   
          </div>    
        }
        {!isPublished &&
          <div className='like-content'>
            <button onClick={handlePublishToggle} className={`like-button`}>Опубликовать
            </button>   
          </div>    
        }
        {ifUserEssay && status === 'checked' &&
          <div className='like-content'>
            <button onClick={handleAppealToggle} className={`like-button`}>Апеллировать
            </button>   
          </div>    
        }

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

      {isPublished && 
        <div>
          {isLoggedIn &&
            <div className="comment-input-section">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Введите ваш комментарий..."
                className="comment-input"
              />
              <button onClick={handleAddComment} className="add-comment-button">
                Добавить комментарий
              </button>
            </div>
          }
          {essay.comments?.map((comment) => (
            <div className="comment-section" key={comment.id}>
              <span className="author-text">{comment.author_nickname}</span>
              <span className="date-text">{formatDate(comment.created_at)}</span>
              <div className="comment-text">{comment.comment_text}</div>
            </div>
          ))}
        </div>
        }
        </div>
      </main>
    </div>
  );
}

export default EssayPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateVariantPage.css';
import Header from '../../components/Header/Header';
import config from '../../config/config';

const CreateVariantPage = () => {
    const [formData, setFormData] = useState({
        variantText: '',
        variantTitle: '',
        authorPosition: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const { variantText, variantTitle, authorPosition } = formData;

        if (!variantText || !variantTitle || !authorPosition) {
            setMessage('Заполните все поля!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${config.API_URL}/variants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    variant_text: variantText,
                    variant_title: variantTitle,
                    author_position: authorPosition
                }),
                credentials: "include",
                withCredentials: true
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Вариант сохранен');
                navigate(`/essay-input/${data.id}`);
            } else {
                setMessage(data.message || 'Произошла ошибка при сохранении');
            }
        } catch (error) {
            setMessage('Ошибка подключения к серверу');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="form-container">
                <h1>Создание варианта</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="variantTitle">Введите название текста</label>
                        <input
                            type="text"
                            id="variantTitle"
                            name="variantTitle"
                            value={formData.variantTitle}
                            onChange={handleChange}
                            placeholder="Название текста"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="variantText">Введите текст</label>
                        <textarea
                            id="variantText"
                            name="variantText"
                            value={formData.variantText}
                            onChange={handleChange}
                            placeholder="Текст"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="authorPosition">Введите позицию автора</label>
                        <textarea
                            id="authorPosition"
                            name="authorPosition"
                            value={formData.authorPosition}
                            onChange={handleChange}
                            placeholder="Позиция автора"
                            required
                        />
                    </div>
                </form>
            </div>
            <div className="button-container">
                {message && <div className="message">{message}</div>}
                <button 
                    onClick={handleSave}
                    className="save-btn" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Сохранение...' : 'Далее'}
                </button>
            </div>
        </div>
    );
};

export default CreateVariantPage;
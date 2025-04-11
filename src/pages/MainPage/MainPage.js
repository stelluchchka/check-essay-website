import React, { useState, useEffect } from "react";
import Header from '../../components/Header/Header';
import "./MainPage.css";
import config from '../../config/config';

const MainPage = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [essaysCount, setEssaysCount] = useState(0);
  const [variantsCount, setVariantsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
        fetch(`${config.API_URL}/counts`)
        .then(response => response.json())
        .then(data => {
            setVariantsCount(data["variants_count"]);
            setEssaysCount(data["essays_count"]);
            setUsersCount(data["users_count"])
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching variants count:', error);
            setIsLoading(false);
        });
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [usersCount, essaysCount, variantsCount]);

  return (
    <div>
      <Header />
      <main className="main">
        <div className="columns">
          {/* Левая колонка */}
          <div className="left-column">
            <section className="intro">
              <h1 className="intro-header">СЕРВИС ПО ПОДГОТОВКЕ К НАПИСАНИЮ СОЧИНЕНИЯ ЕГЭ</h1>
              <p>На данный момент доступно {isLoading ? '...' : variantsCount}  различных вариантов</p>
              <p>Всего на сайте опубликовано {isLoading ? '...' : essaysCount} сочинений</p>
              <p>Зарегистрировано {isLoading ? '...' : usersCount} пользователей, готовящихся к написанию сочинения</p>
            </section>
            <div className="columns">
              <div className="feature-card dark">
                  <h2>ПРОФИЛЬ</h2>
                  <p>Следите за прогрессом в ЛК. Публикуйте свои сочинения, чтобы узнать мнение со стороны.</p>
              </div>
              <div className="feature-card light">
                  <h2>МОДЕРАЦИЯ</h2>
                  <p>Если вы не согласны с результатами проверки, подайте апелляцию, и тогда ваше сочинение проверит человек.</p>
              </div>
              </div>                
            </div>


          {/* Правая колонка */}
          <div className="right-column">
            <div className="feature-card light right">
              <h2>КОМЬЮНИТИ</h2>
              <p>Публикуйте свои сочинения и вместе совершенствуйте свои навыки. Лайкайте понравившиеся сочинения и пишите комментарии, чтобы помочь стать лучше!</p>
            </div>
            <div className="feature-card dark right">
              <h2>ОНЛАЙН ПРОВЕРКА СОЧИНЕНИЯ</h2>
              <p>Нейронная сеть сразу проверит ваше сочинение и выдаст результаты с пояснениями по каждому из 10 критериев.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default MainPage;

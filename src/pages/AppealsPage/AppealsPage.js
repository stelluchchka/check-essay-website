import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import EssayCard from '../../components/EssayCard/EssayCard';
import './AppealsPage.css';
import config from '../../config/config';

function AppealsPage() {
  const [essays, setEssays] = useState([]);

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        const response = await fetch(`${config.API_URL}/essays/appeal`,);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEssays(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchEssays();
  }, []); 
  return (
    <div className="App">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <Header />
      <main>
        <section className="essay">
          <h2>Аппеляции</h2>
          <div className="essay-grid">
            {essays.map((essay) => (
              <EssayCard
                key={essay.id}
                id={essay.id}
                ifUserEssay={false}
                ifAppeal={true}
                nickname={essay.author_nickname}
                title={essay.variant_title}
                variant_id={essay.variant_id}
                score={essay.score}
                likes={essay.likes}
              />
            ))}
          </div>
          </ section>
      </main>
    </div>
  );
}

export default AppealsPage;
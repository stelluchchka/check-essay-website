import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import './VariantsPage.css';

function VariantsPage() {
  const navigate = useNavigate();
  const [variantsCount, setVariantsCount] = useState(0);

  useEffect(() => {
        fetch('http://localhost:8080/counts')
        .then(response => response.json())
        .then(data => {
            setVariantsCount(data["variants_count"]);
        })
        .catch(error => {
            console.error('Error fetching variants count:', error);
        });
  }, []);

  useEffect(() => {}, [variantsCount]);
  return (
    <div>
      <Header />
      <section className="variant-section">
        <h2>База вариантов</h2>
        <div className="variant-grid">
          {[...Array(variantsCount)].map((_, i) => (
            <button key={i} className="variant-btn" onClick={() => navigate(`/essay-input/${i + 1}`)}>вариант {i+1} 
        </button>
          ))}
        </div>
        <button className="btn-create" onClick={() => navigate(`/variants/individual`)}>написать сочинение по своему варианту</button>
      </section>
    </div>
  );
}

export default VariantsPage;
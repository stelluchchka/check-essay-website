import React from 'react';
import '../../App.css';
import './EssayCard.css';
import { Link } from "react-router-dom";

const EssayCard = ({ ifUserEssay, ifAppeal, id, title, nickname, variant_id, score, likes, status }) => {
  return (
    <div className="essay-card">
      <div>
        <p><strong>{title}</strong></p>
        <p>автор: {nickname}</p>
        <p>вариант: {variant_id}</p>
        <p>баллы: {score}</p>
        <p>нравится: {likes}</p>
      </div>
      <div className='essay-card-right'>
        <Link to={ifAppeal ? `/essays/check/${id}` : status==="draft" ? `/essays/input/${variant_id}` : `/essays/${id}`} state={{ ifUserEssay, id }}>
          <button className="btn-read">
            {ifAppeal ? "проверить" : status === "draft" ? "дописать" : "прочитать"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EssayCard;

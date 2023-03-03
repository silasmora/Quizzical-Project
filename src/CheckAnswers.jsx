import React, { useState, useEffect } from 'react'
import './CheckAnswers.css'

function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export default function CheckAnswers() {

  const [answer, setAnswer] = useState([])
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState([])
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  const [numCorrect, setNumCorrect] = useState(0)

  function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&category=27&difficulty=medium&type=multiple")
      .then(res => res.json())
      .then(data => {
        const shuffledAnswers = data.results.map((result) => ({
          ...result,
          answers: shuffle([...result.incorrect_answers, result.correct_answer]),
        }));
        setAnswer(shuffledAnswers)
      })
      .catch((err) => console.error(err))
  }
  
  useEffect(() => {
    fetchQuestions()
  }, [])

  function handleAnswerChange(questionIndex, answerIndex) {
    setSelected((prevSelected) => {
      const newSelectedAnswers = [...prevSelected];
      newSelectedAnswers[questionIndex] = answerIndex;
      return newSelectedAnswers;
    });
  }
  
  
  function checkUserAnswers() {
    let numCorrect = 0;
    const correctAnswers = answer.map((item) => item.correct_answer);

    const newResult = selected.map((selectedAnswer, index) => {
      const isCorrect = answer[index].answers[selectedAnswer] === correctAnswers[index];
      if (isCorrect) {
        numCorrect++;
        return true;
      }
      return false;
    });

    setResult(newResult);
    setShowCorrectAnswers(true)
    setNumCorrect(numCorrect)
  }

  function playAgain() {
    setSelected([])
    setResult([])
    setShowCorrectAnswers(false)
    setNumCorrect(0)
  }

  function resetGame() {
    setSelected([])
    setResult([])
    setShowCorrectAnswers(false)
    setNumCorrect(0)
    fetchQuestions()
  }
  
  return (
    <div className='container'>
      {answer.map((item, questionIndex) => (
      <div key={questionIndex}>
        <h1 dangerouslySetInnerHTML={{ __html: item.question }}></h1>
        <ul className="answers">
        {answer[questionIndex].answers.map((answer, answerIndex) => (
              <li
                key={answerIndex}
                className={`${
                  result[questionIndex] !== undefined &&
                  result[questionIndex] === true &&
                  answerIndex === item.answers.indexOf(item.correct_answer)
                    ? 'correct'
                    : ''
                } ${
                  result[questionIndex] !== undefined &&
                  result[questionIndex] === false &&
                  answerIndex === selected[questionIndex]
                    ? 'incorrect incorrect-answer'
                    : ''
                } ${
                  selected[questionIndex] === answerIndex ? 'selected' : ''
                } ${
                  showCorrectAnswers &&
                  answerIndex === item.answers.indexOf(item.correct_answer)
                    ? `correct correct-answer` 
                    : ''
                  } ${
                    showCorrectAnswers && answerIndex !== selected[questionIndex] && answerIndex !== item.answers.indexOf(item.correct_answer)
                      ? 'incorrect-answer' 
                      : ''    
                }`}
                onClick={() => handleAnswerChange(questionIndex, answerIndex)}
                dangerouslySetInnerHTML={{ __html: answer }}
              ></li>
            ))}
        </ul>
      </div>
      ))}
      <div className='bottom-tags'>
        {showCorrectAnswers && <h3 className='score' >You scored {numCorrect}/{answer.length} correct answers</h3>}
        <button 
          className='check-answers-button'
          onClick={showCorrectAnswers ? playAgain : checkUserAnswers}
        >{showCorrectAnswers ? "Play again" : "Check answers"}</button> 
        {showCorrectAnswers ? <button
        style={{
          marginLeft: '-25px'
        }}
        className='check-answers-button'
        onClick={resetGame}>
          New questions
        </button> : ""}
      </div>
    </div>
  )
}

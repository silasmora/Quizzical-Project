import { useState } from 'react'
import CheckAnswers from './CheckAnswers'
import './App.css'


function App() {
  
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  
  function handleStartQuiz() {
    setIsQuizStarted(!isQuizStarted)
  }

  const styles = {
    height: isQuizStarted ? '150px' : '220px',
  }
  return (
    <main >
      <img style={styles} className="top-right-img" src="./images/blobs.png"  />
      {
        isQuizStarted ? 
        <CheckAnswers />
        :
        <div className='start-quiz'>
        <h1>Quizzical</h1>
        <p className='description'>Some description if needed</p>
        <button
          className='start-quiz-button'
          onClick={handleStartQuiz}
        >Start Quiz</button>
        </div> 
      }
      <img style={styles} className="bottom-left-img" src="./images/blobs-blue.png"  />
    </main>
  )
}

export default App

import React, { useState, useEffect } from 'react';

function QuestionList({ questions }) {
  const [showComments, setShowComments] = useState({});
  const [answers, setAnswers] = useState({}); // Store answers

  useEffect(() => {
    // Load previous answers from localStorage (or your preferred storage)
    const storedAnswers = localStorage.getItem('answers');
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    // Save answers to localStorage whenever answers change
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));

    // Send the answer to your backend API for saving in the database
    fetch('/api/save-answer', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionId, answer }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save answer');
      }
      // Handle successful save (e.g., show a success message)
      console.log('Answer saved successfully!');
    })
    .catch(error => {
      // Handle error (e.g., show an error message)
      console.error('Error saving answer:', error);
    });
  };

  const toggleComments = (questionId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          {/* ... (rest of your code) ... */}

          <div className="answer-choices">
            {question.answer_choices &&
              question.answer_choices.map((choice, choiceIndex) => (
                <label key={choiceIndex}>
                  <input
                    type="radio"
                    name={`answer-${question.id}`} // Use question.id for name
                    value={choice}
                    checked={answers[question.id] === choice} // Set checked state
                    onChange={() => handleAnswerChange(question.id, choice)}
                  />{' '}
                  {choice}
                </label>
              ))}
          </div>

          {/* ... (rest of your code) ... */}
        </div>
      ))}
    </div>
  );
}

export default QuestionList;
import React, { useState } from 'react';
import '../styles/Quiz.css';
import { getQuestions } from '../scripts/quizLogic';

export const Quiz = () => {
  const [keyword, setKeyword] = useState('');
  const [questions, setQuestions] = useState({});
  const [showTextFields, setShowTextFields] = useState({}); // Track visibility for each question

  const toggleTextField = (index) => {
    setShowTextFields({
      ...showTextFields,
      [index]: !showTextFields[index] // Toggle visibility for the specific question
    });
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = () => {
    const fetchedQuestions = getQuestions(keyword);
    setQuestions(fetchedQuestions);
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Dra Mylena's Quiz</h1>

      <div>
        <input
          type="text"
          placeholder="Enter keyword"
          value={keyword}
          onChange={handleKeywordChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {Object.entries(questions).map(([pageNumber, questionData], index) => (
        <div key={index} className="question-container">
          <p className="question-page">Page {pageNumber}</p>
          <p className="question-text">{questionData['question_text']}</p>

          <div className="answer-choices">
            {questionData['answers_choices'].map((choice, choiceIndex) => (
              <label key={choiceIndex}>
                <input type="radio" name={`answer-${index}`} value={choice} /> {choice}
              </label>
            ))}
          </div>

          <button onClick={() => toggleTextField(index)}>
            {showTextFields[index] ? 'Hide Observations' : 'Add Observations'}
          </button>

          {showTextFields[index] && (
            <form>
              <label htmlFor={`observations-${index}`}>Observations:</label>
              <div className="tooltip-container">
                <input type="text" id={`observations-${index}`} name={`observations-${index}`} />
              </div>
              <input type="submit" value="Save" />
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

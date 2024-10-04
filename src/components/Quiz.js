import React, { useState, useCallback, useEffect } from 'react';
import '../styles/Quiz.css';
import { getQuestions, updateAnswer, updateComment, getInfo } from '../scripts/quizLogic';

export const Quiz = () => {
  const [keyword, setKeyword] = useState('');
  const [info, setInfo] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showComments, setShowComments] = useState({});

  // useEffect(() => {
  //   loadPrevAnswers();
  // }, [questions]);

  // const loadPrevAnswers = () => {

  // }

  const toggleComments = (questionId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  const handleInfoChange = (event) => {
    setInfo(event.target.value);
  }

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = async () => {
    const fetchedQuestions = await getQuestions(keyword);
    setQuestions(fetchedQuestions);
  };

  const handleInfo = async () => {
    const fetchedInfo = await getInfo(info);
    document.getElementById('question-info').textContent = fetchedInfo;
  }

  // Custom debounce function
  const debounce = (delay, callback) => {
    let timer;
    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback(...args);
        timer = null;
      }, delay);
    };
  };

  const debouncedSetAnswer = useCallback(
    debounce(1000, async (questionId, answer) => {
      try {
        await updateAnswer(questionId, answer);
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }),
    []
  );

  const debouncedSetComment = useCallback(
    debounce(2000, async (questionId, value) => {
      try {
        await updateComment(questionId, value);
      } catch (error) {
        console.error('Error saving comment:', error);
      }
    }),
    []
  );

  const handleAnswerChange = async (id, choice) => {
    debouncedSetAnswer(id, choice);
  };

  const handleCommentChange = async (id, value) => {
    debouncedSetComment(id, value);
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Dr Mylena's Quiz</h1>

      <div className='keyword-container'>
        <input
          type="text"
          placeholder="Enter keyword"
          value={keyword}
          onChange={handleKeywordChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className='info-container'>
        <input
          type="text"
          placeholder="Get comments and previous answers"
          value={info}
          onChange={handleInfoChange}
        />
        <button onClick={handleInfo}>Search</button>
      </div>

      <p id='question-info'></p>
      
      {questions.length !== 0 ? questions.map((question, index) => (
        <div key={index} className="question-container">
          <h3 className="question-title">Question {question.id} | Page {question.page_number}</h3>
          <p className="question-text">{question.question_text}</p>

          <div className="answer-choices">
            {question.answer_choices && question.answer_choices.map((choice, choiceIndex) => (
              <label key={choiceIndex}>
                <input
                  type="radio"
                  name={`answer-${question.documentId}`}
                  id={`answer-${question.documentId}-${choice[0]}`}
                  value={choice}
                  onChange={() => handleAnswerChange(question.documentId, choice)}
                /> {choice}
              </label>
            ))}
          </div>

          <button onClick={() => toggleComments(question.id)}>
            {showComments[question.id] ? 'Hide Comments' : 'Show Comments'}
          </button>

          {showComments[question.id] && (
            <div className="comments">
              <input
                type="text"
                id={`comments-${question.documentId}`}
                name="comments"
                onChange={() => handleCommentChange(question.documentId, document.getElementById(`comments-${question.documentId}`).value)}
              />
            </div>
          )}
        </div>
      )) : <p>No questions found with that keyword</p>}
    </div >
  );
}

import React, { useState, useCallback } from 'react';
import '../styles/Quiz.css';
import { getQuestions, updateAnswer, updateComment, getQuestionsTags, getTagColor, addTag } from '../scripts/quizLogic';

export const Quiz = () => {
  const [keyword, setKeyword] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showComments, setShowComments] = useState({});

  const toggleComments = (questionId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeywordSearch = async () => {
    const fetchedQuestions = await getQuestions(keyword);
    setQuestions(fetchedQuestions);
  };

  const handleFilterTagsChange = (event) => {
    setFilterTags(event.target.value);
  }

  const handleFilterTagsSearch = async () => {
    const fetchedQuestions = await getQuestionsTags(filterTags);
    setQuestions(fetchedQuestions);
  };

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

  const handleAnswerChange = async (id, choice) => {
    debouncedSetAnswer(id, choice);
  };

  const handleCommentChange = async (id, value) => {
    await updateComment(id, value);
  }

  const handleTagAdded = async (id, newTag) => {
    await addTag(id, newTag);
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
        <button onClick={handleKeywordSearch}>Search</button>
      </div>

      <div className='tags-search-container'>
        <input
          type="text"
          placeholder="Enter tags separated by commas"
          value={filterTags}
          onChange={handleFilterTagsChange}
        />
        <button onClick={handleFilterTagsSearch}>Search</button>
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
              <p>Previous Answer: {question.prev_answer}</p>
              <div>
                Previous Comments:
                {
                  Array.isArray(question.comments) ? ( // Check if it's an array
                    question.comments.map(comment => <p key={comment}>- {comment}</p>)
                  ) : (
                    <p key={question.comments}>- {question.comments}</p> // If string, render it directly
                  )
                }
              </div>
              <input
                type="text"
                id={`comments-${question.documentId}`}
                name="comments"
                placeholder="Enter comments"
              />
              <button onClick={() => handleCommentChange(question.documentId, document.getElementById(`comments-${question.documentId}`).value)}>Add comment</button>
            </div>
          )}

          <div className="tags-container">
            <div className="tags">
              {question.tags?.map((tag) => (
                <span key={tag} style={{ backgroundColor: getTagColor(tag) }}>
                  {tag}
                </span>
              ))}
            </div>

            <div className='tag-adder'>
              <input
                type="text"
                id={`tags-${question.documentId}`}
                name="tags"
                placeholder="Add tag"
              />
              <button onClick={() => handleTagAdded(question.documentId, document.getElementById(`tags-${question.documentId}`).value)}>Add tag</button>
            </div>
          </div>
        </div>
      )) : <p>No questions found with that keyword/tag</p>}
    </div >
  );
}

import data from '../assets/data.json';

function getAnswerChoices(answerChoicesStr) {
  const answers_choices = []
  if (answerChoicesStr) {
    const answerChoices = answerChoicesStr.split(/([A-Z]\. *)/).filter(choice => choice.trim());

    for (let i = 0; i < answerChoices.length; i += 2) {
      
      if (i + 1 < answerChoices.length) {
        answers_choices[i / 2] = `${(answerChoices[i] + answerChoices[i + 1])}`;
      }
    }
  }
  return answers_choices;
}

function getQuestions(keyword = 'canada') {
  const questions = {};

  for (let i = 0; i < data.pages.length; i++) {
    const page = data.pages[i];

    for (const question of page.questions) {
      if (question.question_text.toLowerCase().includes(keyword.toLowerCase()) ||
        question.answer_choices.toLowerCase().includes(keyword.toLowerCase())) {
        questions[i + 2] = {}
        questions[i + 2]['question_text'] = question.question_text
        questions[i + 2]['answers_choices'] = getAnswerChoices(question.answer_choices);
      }
    }
  }

  return questions;
}

export { getQuestions };
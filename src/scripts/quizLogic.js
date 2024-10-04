import { collection, getDocs, limit, orderBy, query, doc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import your Firestore instance

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

// TO DO
async function updateAnswer(id, choice) {
  try {
    const questionRef = doc(db, "questions", id);
    await updateDoc(questionRef, {
      prev_answer: choice[0] 
    });
  } catch (error) {
    console.error("Error updating answer: ", error);
    return []; 
  }
}

async function updateComment(id, value) {
  try {
    const questionRef = doc(db, "questions", id);
    await updateDoc(questionRef, {
      comments: value
    });

  } catch (error) {
    console.error("Error updating comment: ", error);
    return [];
  }
}

async function getQuestions(keyword = 'canada') {
  try {
    const questionsRef = query(
      collection(db, 'questions'),
      orderBy("id"),
      limit(100)
    );

    const querySnapshot = await getDocs(questionsRef);
    const result = [];
    querySnapshot.forEach((questionData) => {
      const question = questionData.data();
      question.documentId = questionData.id;

      if (question.question_text && question.answer_choices) {
        if (
          question.question_text.toLowerCase().includes(keyword.toLowerCase()) ||
          question.answer_choices.toLowerCase().includes(keyword.toLowerCase())
        ) {
          question.answer_choices = getAnswerChoices(question.answer_choices);
          // question.show = false;
          result.push(question);
        }
      }
    });
    return result;

  } catch (error) {
    console.error("Error getting questions: ", error);
    return [];
  }
}

async function getInfo(id) {

  id = +id;

  const questionsRef = query(
    collection(db, 'questions'),
    where("id", "==", id),
    limit(1)
  );

  const querySnapshot = await getDocs(questionsRef);
  let result = "Previous Answer = " + querySnapshot.docs[0].data().prev_answer;
  result += "\n";
  result += "Comments = " + querySnapshot.docs[0].data().comments;
  return result;
}

export { getQuestions, updateAnswer, updateComment, getInfo };
import { collection, getDocs, getDoc, limit, orderBy, query, doc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import your Firestore instance

const DATABASE = 'questions'; // questions-test

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
    const questionRef = doc(db, DATABASE, id);
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
    const questionRef = doc(db, DATABASE, id);
    await updateDoc(questionRef, {
      comments: value
    });

  } catch (error) {
    console.error("Error updating comment: ", error);
    return [];
  }
}

// ONLY FETCH IT ONCE!
async function getQuestions(keyword = 'canada') {
  try {
    const questionsRef = query(
      collection(db, DATABASE),
      orderBy("id"),
      limit(5)
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

async function getQuestionsTags(filterTags = 'canada') {
  try {
    const tagArray = filterTags.split(',').map(tag => tag.trim());

    // Create a base query
    let questionsRef = collection(db, DATABASE); 

    // Apply filtering if filterTags are provided
    if (tagArray.length > 0) {
      questionsRef = query(questionsRef, where("tags", "array-contains-any", tagArray));
    }

    // Apply ordering and limit
    questionsRef = query(questionsRef, orderBy("id"), limit(5));

    // Fetch the documents
    const querySnapshot = await getDocs(questionsRef);
    const result = [];
    querySnapshot.forEach((questionData) => {
      const question = questionData.data();
      question.documentId = questionData.id;
      result.push(question);
    });
    return result;

  } catch (error) {
    console.error("Error getting questions: ", error);
    return [];
  }
}

const getTagColor = (tagName) => {
  const tagColors = [
    '#663399', // Purple
    '#4CAF50', // Green
    '#008CBA', // Blue
    '#f44336', // Red
    '#e91e63', // Pink
    '#2980b9', // Strong Blue
    '#8e44ad', // Dark Purple
    '#2ecc71', // Emerald
    '#e67e22', // Carrot
    '#f1c40f', // Sunflower
    '#3498db', // Peter River
    '#9b59b6', // Amethyst
    '#27ae60', // Nephritis
    '#d35400', // Orange
    '#f39c12', // Sun Flower
    '#1abc9c', // Turquoise
    '#34495e', // Wet Asphalt
    '#7f8c8d', // Concrete
    '#95a5a6', // Light Grey
    '#bdc3c7', // Silver
    '#ecf0f1', // Clouds
  ];
  // Create a simple hash function to assign consistent colors to tags
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = (hash << 5) - hash + tagName.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return tagColors[Math.abs(hash) % tagColors.length]; // Choose a color from the palette based on hash
};

const addTag = async (id, newTag) => {
  try {
    const questionRef = doc(db, DATABASE, id);

    // 1. Get the existing tags
    const questionSnap = await getDoc(questionRef);
    const existingTags = questionSnap.data().tags || []; // Handle cases where tags might not exist

    // 2. Update with the new tag added
    await updateDoc(questionRef, {
      tags: [...existingTags, newTag] 
    });

    console.log('added tag');

  } catch (error) {
    console.error("Error updating comment: ", error);
    return []; 
  }
};

export { getQuestions, updateAnswer, updateComment, getQuestionsTags, getTagColor, addTag };
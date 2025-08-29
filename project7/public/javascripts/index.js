
function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);

  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }

  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));

  return ele;
}
const main = document.querySelector('main');
const newQuestionButton = document.querySelector('#btn-show-modal-question');

const modalQuestion = document.querySelector('#modal-question');
const questionText = document.querySelector('#question-text');
const questionSubmitButton =  document.querySelector('#create-question');

const modalAnswer = document.querySelector('#modal-answer');
const answerText = document.querySelector('#answer-text');
const answerSubmitButton =  document.querySelector('#create-answer');

const closeButtons =  document.querySelectorAll('.close');

newQuestionButton.addEventListener('click', function() {
  modalQuestion.style.display = 'block';
});

closeButtons.forEach(btn => {
  btn.addEventListener('click', function(evt) {
    evt.target.closest('dialog').style.display = 'none';
  });
});

questionSubmitButton.addEventListener('click', async function() {
  const text = questionText.value.trim();
  if (!text) return;

  const url = '/questions'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({question: text})
  }

  const res = await fetch(url, options);
  const data = await res.json();
  if (data.error) {
    console.error('Error:', data.error);
    return;
  }
  const answerButton = createElement('button', { class: 'answer-btn' }, 'Add Answer');
  answerButton.addEventListener('click', function(evt) {
    const id = evt.target.closest('section').id;
    console.log("Setting question id:", id); // debugging
    document.querySelector('#question-id').value = id;
    modalAnswer.style.display = 'block';
  });
  const ul = createElement('ul');
  const newQuestionElem = createElement('section', { id: data._id }, 
    createElement('h2', {}, text),
    ul,
    answerButton
    );
  main.appendChild(newQuestionElem)
  modalQuestion.style.display = 'none';
  questionText.value = '';
});

answerSubmitButton.addEventListener('click', async function() {
  const id = document.querySelector('#question-id').value; 
  const text = answerText.value.trim();
  if (!text) return;

  const url = `/questions/${id}/answers`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({answer: text})
  }
  const res = await fetch(url, options);
  const data = await res.json();
  if (data.error) {
    console.error('Error:', data.error);
    return;
  }
  const sectionElem = document.getElementById(id); 
  const ul = sectionElem.querySelector('ul'); 
  ul.appendChild(createElement('li', {}, text));

  modalAnswer.style.display = 'none';
  answerText.value = '';
});

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/questions');
  const questions = await res.json();

  questions.forEach(question => {
    const ul = createElement('ul');
    question.answers.forEach(a => {
      ul.appendChild(createElement('li', {}, a));
    });

    const answerButton = createElement('button', { class: 'answer-btn' }, 'Add Answer');
    answerButton.addEventListener('click', function(evt) {
      document.querySelector('#question-id').value = question._id;
      modalAnswer.style.display = 'block';
    });

    const section = createElement(
      'section', { id: question._id },
      createElement('h2', {}, question.question),
      ul,
      answerButton
    );

    main.appendChild(section);
  });
});





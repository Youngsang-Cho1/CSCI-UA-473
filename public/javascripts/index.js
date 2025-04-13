
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

const closeButton =  document.querySelector('.close');

newQuestionButton.addEventListener('click', function() {
  modalQuestion.style.display = 'block';
})

closeButton.addEventListener('click', function(evt) {
  evt.target.style.display = 'none';
})

questionSubmitButton.addEventListener('click', async function() {
  const text = questionText.value.trim();
  if (!text) return;

  const url = '/questions'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({text})
  }

  const res = await fetch(url, options);
  const result = await res.json();
  if (result.error) {
    console.error('Error:', result.error);
    return;
  }

  const newQuestionElem = createElement('section', { id: result._id }, 
    createElement('h2', {}, text),
    createElement('ul'),
    createElement('button', { class: 'answer-btn' }, 'Add Answer')
    );
  main.appendChild(newQuestionElem)
  modalQuestion.style.display = 'none';
  questionText.value = '';
})







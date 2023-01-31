import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';

const state = {
  data: [],
  feedback: null,
  feedbackColor: 'blink',
};

const validate = (field) => {
  const schema = yup.object().shape({
    url: yup.string().required()
      .url('Ссылка должна быть валидным URL')
      .notOneOf(state.data, 'Данный RSS уже существует!'),
  });
  try {
    schema.validateSync(field, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const watchedState = onChange(state, () => {});

const inputForm = document.querySelector('.rss-form');
const feedbackForm = document.querySelector('.feedback');
const formControl = document.querySelector('.form-control');

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const url = formData.get('url');
  console.log(typeof url);
  const validateErrors = validate({ url });
  console.log(validateErrors);
  if (_.isEmpty(validateErrors)) {
    watchedState.data.push(url);
    watchedState.feedback = 'RSS успешно загружен';
    formControl.classList.remove('is-invalid');
    feedbackForm.classList.remove('blink');
    watchedState.feedbackColor = 'green';
    feedbackForm.classList.add(state.feedbackColor);
    feedbackForm.textContent = state.feedback;
  } else {
    watchedState.feedback = validateErrors;
    feedbackForm.classList.remove('green');
    feedbackForm.classList.add('blink');
    feedbackForm.textContent = state.feedback.url.message;
    formControl.classList.add('is-invalid');
  }
});

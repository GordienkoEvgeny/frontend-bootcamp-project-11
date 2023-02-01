import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import resources from './locales/index.js';

export default () => {
  const inputForm = document.querySelector('.rss-form');
  const feedbackForm = document.querySelector('.feedback');
  const formControl = document.querySelector('.form-control');
  const buttonGroup = document.querySelector('.btn-group');
  const russianLanguageButton = buttonGroup.querySelector('#ru');
  const englishLanguageButton = buttonGroup.querySelector('#en');
  const header = document.querySelector('.display-3');
  const bottomHeader = document.querySelector('.lead');
  const textFrame = document.querySelector('label[for="url-input"]');
  const textUnderFrame = document.querySelector('.text-muted');
  const buttonAdd = document.querySelector('button[type="submit"]');

  const state = {
    links: [],
    feedbackKey: null,
    errorStatus: 'valid',
    feedbackColor: 'blink',
    currentLanguage: 'ru',
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {});

  const render = () => {
    header.textContent = `${i18nInstance.t('keyHead')}`;
    bottomHeader.textContent = `${i18nInstance.t('keyBottomHead')}`;
    textFrame.textContent = `${i18nInstance.t('keyLink')}`;
    textUnderFrame.textContent = `${i18nInstance.t('keyExample')}`;
    buttonAdd.textContent = `${i18nInstance.t('keyAdd')}`;
    if (state.errorStatus === 'valid') {
      formControl.classList.remove('is-invalid');
      feedbackForm.classList.remove('blink');
      feedbackForm.classList.add(state.feedbackColor);
      feedbackForm.textContent = `${i18nInstance.t(state.feedbackKey)}`;
    } else {
      feedbackForm.classList.remove('green');
      feedbackForm.classList.add(state.feedbackColor);
      feedbackForm.textContent = `${i18nInstance.t(state.feedbackKey)}`;
      formControl.classList.add('is-invalid');
    }

    if (state.currentLanguage === 'ru') {
      englishLanguageButton.classList.remove('btn-primary');
      englishLanguageButton.classList.add('btn-outline-primary');
      russianLanguageButton.classList.remove('btn-outline-primary');
      russianLanguageButton.classList.add('btn-primary');
    } else {
      russianLanguageButton.classList.remove('btn-primary');
      russianLanguageButton.classList.add('btn-outline-primary');
      englishLanguageButton.classList.remove('btn-outline-primary');
      englishLanguageButton.classList.add('btn-primary');
    }
  };

  const watchedState = onChange(state, () => { // WATCHED-STATE
    render();
  });

  englishLanguageButton.addEventListener('click', () => {
    i18nInstance.changeLanguage('en').then();
    watchedState.currentLanguage = 'en';
  });

  russianLanguageButton.addEventListener('click', () => {
    i18nInstance.changeLanguage('ru').then();
    watchedState.currentLanguage = 'ru';
  });

  const validate = (field) => {
    const schema = yup.object().shape({
      url: yup.string().required()
        .url(`${i18nInstance.t('errorValidUrl')}`)
        .notOneOf(state.links, `${i18nInstance.t('errorPresence')}`),
    });
    try {
      schema.validateSync(field, { abortEarly: false });
      return {};
    } catch (e) {
      return _.keyBy(e.inner, 'path');
    }
  };

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const validateErrors = validate({ url });
    if (_.isEmpty(validateErrors)) {
      watchedState.links.push(url);
      watchedState.feedbackKey = 'done';
      watchedState.feedbackColor = 'green';
      watchedState.errorStatus = 'valid';
      inputForm.reset();
      formControl.focus();
    } else {
      if (validateErrors.url.message.slice(0, 6) === 'Ссылка') {
        watchedState.feedbackKey = 'errorValidUrl';
      } else {
        watchedState.feedbackKey = 'errorPresence';
      }
      feedbackForm.classList.remove('green');
      watchedState.feedbackColor = 'blink';
      watchedState.errorStatus = 'invalid';
    }
  });
  formControl.focus();
  render();
};

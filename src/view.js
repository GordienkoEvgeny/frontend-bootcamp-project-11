import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
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
  const feedsForm = document.querySelector('#feeds');
  const feedsGroup = document.querySelector('#feeds-group');

  const state = {
    links: [],
    feeds: [],
    posts: [],
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
    inputForm.reset();
    formControl.focus();
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

  const renderFeeds = () => {
    feedsForm.textContent = `${i18nInstance.t('keyFeeds')}`;
    feedsGroup.innerHTML = ''; // ЭТО ВАЖНО! очищает ul перед добавлением фидов
    state.feeds.forEach((feed) => {
      const liElem = document.createElement('li');
      liElem.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3Elem = document.createElement('h3');
      h3Elem.classList.add('h6', 'm-0');
      const pElem = document.createElement('p');
      pElem.classList.add('m-0', 'small', 'text-black-50');
      h3Elem.append(feed.title);
      pElem.append(feed.description);
      liElem.append(h3Elem);
      liElem.append(pElem);
      feedsGroup.prepend(liElem);
    });
  };

  const watchedState = onChange(state, () => { // WATCHED-STATE
    render();
    renderFeeds();
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
        .url('errorURL')
        .notOneOf(state.links, 'errPresence'),
    });
    try {
      schema.validateSync(field, { abortEarly: false });
      return {};
    } catch (e) {
      return _.keyBy(e.inner, 'path');
    }
  };

  const parseRSS = (responseData) => {
    const parser = new DOMParser();
    const dataDOM = parser.parseFromString(responseData, 'text/xml');
    if (dataDOM.querySelector('parseerror')) {
      throw new Error('parseError');
    }
    return dataDOM;
  };

  const getFeed = (dataDOM) => {
    console.log(dataDOM);
    const title = dataDOM.querySelector('title').textContent;
    const description = dataDOM.querySelector('description').textContent;
    console.log(title, description);
    return ({ title, description });
  };

  const getPosts = (dataDom) => {
    const posts = dataDom.querySelectorAll();
    console.log(posts);
  };

  const getProxy = (stateURL) => {
    const proxy = new URL('https://allorigins.hexlet.app');
    proxy.pathname = '/get';
    proxy.searchParams.set('url', stateURL);
    return proxy.toString();
  };

  const requestAndAddDataToLists = (link) => {
    const proxyURL = getProxy(link);
    axios.get(proxyURL)
      .then((response) => {
        const dataDOM = parseRSS(response.data.contents);
        watchedState.feeds.push(getFeed(dataDOM));
        console.log(state.feeds);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const validateErrors = validate({ url });
    if (_.isEmpty(validateErrors)) {
      feedsForm.textContent = 'Фиды';
      watchedState.links.push(url);
      watchedState.feedbackKey = 'done';
      watchedState.feedbackColor = 'green';
      watchedState.errorStatus = 'valid';
      requestAndAddDataToLists(url);
    } else {
      if (validateErrors.url.message === 'errorURL') {
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

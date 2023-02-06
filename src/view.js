import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';

export default () => {
  const inputForm = document.querySelector('.rss-form');
  const feedbackForm = document.querySelector('.feedback');
  const formInput = document.querySelector('.form-control');
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
  const postsForm = document.querySelector('#posts');
  const postsGroup = document.querySelector('#posts-group');
  const state = {
    links: [],
    feeds: [],
    posts: [],
    downloadStatus: 'loaded',
    feedbackKey: null,
    disabled: false,
    errorStatus: 'valid',
    feedbackColor: 'green',
    currentLanguage: 'ru',
    uiState: {
      visitedLinks: {},
    },
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {});

  const render = () => {
    inputForm.reset();
    buttonAdd.disabled = state.disabled;
    formInput.disabled = state.disabled;
    if (state.downloadStatus === 'loading') {
      feedbackForm.classList.remove('blink');
      feedbackForm.classList.add(state.feedbackColor);
      feedbackForm.textContent = `${i18nInstance.t('keyLoading')}`;
    } else {
      // formInput.focus();
      postsForm.textContent = `${i18nInstance.t('keyPosts')}`;
      feedsForm.textContent = `${i18nInstance.t('keyFeeds')}`;
      header.textContent = `${i18nInstance.t('keyHead')}`;
      bottomHeader.textContent = `${i18nInstance.t('keyBottomHead')}`;
      textFrame.textContent = `${i18nInstance.t('keyLink')}`;
      textUnderFrame.textContent = `${i18nInstance.t('keyExample')}`;
      buttonAdd.textContent = `${i18nInstance.t('keyAdd')}`;
      if (state.errorStatus === 'valid') {
        formInput.classList.remove('is-invalid');
        feedbackForm.classList.remove('blink');
        feedbackForm.classList.add(state.feedbackColor);
        feedbackForm.textContent = `${i18nInstance.t(state.feedbackKey)}`;
      } else {
        feedbackForm.classList.remove('green');
        feedbackForm.classList.add(state.feedbackColor);
        feedbackForm.textContent = `${i18nInstance.t(state.feedbackKey)}`;
        formInput.classList.add('is-invalid');
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
    }
  };

  const renderFeeds = () => {
    feedsGroup.innerHTML = ''; //  очищает ul перед добавлением фидов
    state.feeds.forEach((feed) => {
      const liElem = document.createElement('li');
      liElem.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3Elem = document.createElement('h3');
      h3Elem.classList.add('h6', 'm-0');
      const pElem = document.createElement('p');
      pElem.classList.add('m-0', 'small', 'text-black-50', 'bb');
      h3Elem.append(feed.title);
      pElem.append(feed.description);
      liElem.append(h3Elem);
      liElem.append(pElem);
      feedsGroup.prepend(liElem);
    });
  };

  const renderPosts = () => {
    postsGroup.innerHTML = ''; //  очищает ul перед добавлением постов
    state.posts.forEach((post) => {
      const modalTitle = document.querySelector('.modal-title');
      const modalBody = document.querySelector('.modal-body');
      const readCompletelyModalButton = document.querySelector('.full-article');
      const closeModalWindowBtn = document.querySelector('.btn-secondary');
      const liElem = document.createElement('li');
      liElem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const aElem = document.createElement('a');
      aElem.classList.add('fw-bold');
      aElem.setAttribute('id', post.id);
      aElem.setAttribute('href', post.link);
      aElem.setAttribute('target', '_blank');
      aElem.textContent = post.title;
      const postButton = document.createElement('button');
      const divElem = document.createElement('div');
      divElem.classList.add('col-auto');
      postButton.setAttribute('type', 'button');
      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postButton.setAttribute('data-id', post.id);
      postButton.setAttribute('data-bs-toggle', 'modal');
      postButton.setAttribute('data-bs-target', '#modal');
      postButton.textContent = `${i18nInstance.t('keyView')}`;
      liElem.append(aElem);
      divElem.append(postButton);
      liElem.append(divElem);
      postsGroup.prepend(liElem);
      if (state.uiState.visitedLinks[post.id]) { // если в UI стейте есть id который был посещен
        aElem.classList.remove('fw-bold'); // добавляется стиль посещенной ссылки
        aElem.classList.add('fw-normal');
        aElem.classList.add('visited-links');
      }
      aElem.addEventListener('click', () => {
        state.uiState.visitedLinks[post.id] = true; // поменять на WatchSTATE
        renderPosts();
      });
      postButton.addEventListener('click', (e) => {
        const idButton = e.target.getAttribute('data-id');
        const currentPost = state.posts.find(({ id }) => idButton === id);
        // eslint-disable-next-line max-len
        state.uiState.visitedLinks[currentPost.id] = true; // при клике добавляю id поста в UI стейт!!!!!!!!!!
        modalTitle.textContent = currentPost.title;
        modalBody.textContent = currentPost.description;
        readCompletelyModalButton.textContent = `${i18nInstance.t('modalButtonRead')}`;
        closeModalWindowBtn.textContent = `${i18nInstance.t('closeModalWindow')}`;
        readCompletelyModalButton.setAttribute('href', currentPost.link);
        renderPosts();
      });
    });
  };

  const watchedState = onChange(state, () => { // WATCHED-STATE
    render();
    renderFeeds();
    renderPosts();
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
    const title = dataDOM.querySelector('title').textContent;
    const description = dataDOM.querySelector('description').textContent;
    const checkFeeds = (state.feeds).find((content) => content.title === title);
    if (!checkFeeds) {
      watchedState.feeds.push({ title, description });
    }
  };

  const getPosts = (dataDom) => {
    const postsContent = dataDom.querySelectorAll('item');
    postsContent.forEach((post) => {
      const id = _.uniqueId();
      const postTitle = post.querySelector('title').textContent;
      const postLink = post.querySelector('link').textContent;
      const postDescription = post.querySelector('description').textContent;
      const checkPosts = (state.posts).find((content) => content.title === postTitle);
      if (!checkPosts) {
        watchedState.posts.push({
          id, title: postTitle, link: postLink, description: postDescription,
        });
      }
    });
  };

  const getProxy = (stateURL) => {
    const proxy = new URL('https://allorigins.hexlet.app');
    proxy.pathname = '/get';
    proxy.searchParams.set('url', stateURL);
    proxy.searchParams.set('disableCache', true);
    return proxy.toString();
  };

  const requestAndAddDataToLists = (link) => {
    const proxyURL = getProxy(link);
    axios.get(proxyURL)
      .then((response) => {
        if (response.status >= 500) {
          watchedState.errorStatus = 'invalid';
          watchedState.feedbackKey = 'networkErr';
          watchedState.feedbackColor = 'blink';
          watchedState.downloadStatus = 'loaded';
        } else {
          const dataDOM = parseRSS(response.data.contents);
          getFeed(dataDOM);
          getPosts(dataDOM);
          watchedState.disabled = false;
          watchedState.downloadStatus = 'loaded';
        }
      })
      .catch(() => {
        watchedState.errorStatus = 'invalid';
        watchedState.feedbackKey = 'errorLink';
        watchedState.feedbackColor = 'blink';
        watchedState.downloadStatus = 'loaded';
        watchedState.disabled = false;
        state.links.pop();
        formInput.focus();
      });
    Promise.all(state.links).then(() => setTimeout(() => requestAndAddDataToLists(link), 5000));
  };
  inputForm.addEventListener('submit', (event) => {
    formInput.focus();
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const validateErrors = validate({ url });
    if (_.isEmpty(validateErrors)) {
      watchedState.disabled = true;
      watchedState.downloadStatus = 'loading';
      watchedState.links.push(url);
      watchedState.feedbackKey = 'done';
      watchedState.feedbackColor = 'green';
      watchedState.errorStatus = 'valid';
      requestAndAddDataToLists(url);
      watchedState.disabled = false;
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
  render();
};

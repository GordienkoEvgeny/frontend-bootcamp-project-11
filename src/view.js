import * as component from './modules/UI.js';
import state from './modules/appState.js';
import i18nInstance from './modules/helpers/i18n.js';
// eslint-disable-next-line import/no-cycle
import watchedState from './modules/helpers/watcher.js';

export const render = () => {
  component.inputSubmitForm.reset();
  component.submitButton.disabled = state.disabled;
  component.addForm.disabled = state.disabled;
  if (state.downloadStatus === 'loading') {
    component.statusForm.classList.remove('blink');
    component.statusForm.classList.add(state.feedbackColor);
    component.statusForm.textContent = `${i18nInstance.t('keyLoading')}`;
  } else {
    component.postsTitle.textContent = `${i18nInstance.t('keyPosts')}`;
    component.feedsTitle.textContent = `${i18nInstance.t('keyFeeds')}`;
    component.pageTitle.textContent = `${i18nInstance.t('keyHead')}`;
    component.bottomHeader.textContent = `${i18nInstance.t('keyBottomHead')}`;
    component.textInTheForm.textContent = `${i18nInstance.t('keyLink')}`;
    component.exampleForm.textContent = `${i18nInstance.t('keyExample')}`;
    component.submitButton.textContent = `${i18nInstance.t('keyAdd')}`;
    if (state.errorStatus === 'valid') {
      component.addForm.classList.remove('is-invalid');
      component.statusForm.classList.remove('blink');
      component.statusForm.classList.add(state.feedbackColor);
      component.statusForm.textContent = `${i18nInstance.t(state.feedbackKey)}`;
    } else {
      component.statusForm.classList.remove('green');
      component.statusForm.classList.add(state.feedbackColor);
      component.statusForm.textContent = `${i18nInstance.t(state.feedbackKey)}`;
      component.addForm.classList.add('is-invalid');
    }

    const primeLanguageButton = state.currentLanguage === 'ru' ? component.russianLanguageButton : component.englishLanguageButton; /// !!!!!!!!!!
    const notPrimeLanguageButton = state.currentLanguage === 'en' ? component.russianLanguageButton : component.englishLanguageButton;
    primeLanguageButton.classList.remove('btn-outline-primary');
    primeLanguageButton.classList.add('btn-primary');
    notPrimeLanguageButton.classList.add('btn-outline-primary');
    notPrimeLanguageButton.classList.remove('btn-primary'); /// !!!!!!!!
  }
};
export const renderFeeds = () => {
  component.feedsListForm.innerHTML = ''; //  очищает ul перед добавлением фидов
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
    component.feedsListForm.prepend(liElem);
  });
};
export const renderPosts = () => {
  component.postsListForm.innerHTML = ''; //  очищает ul перед добавлением постов
  state.posts.forEach((post) => {
    const modalTitle = document.querySelector('.modal-title'); //!
    const modalBody = document.querySelector('.modal-body');//!
    const readCompletelyModalButton = document.querySelector('.full-article');
    const closeModalWindowBtn = document.querySelector('.btn-secondary');
    const liElem = document.createElement('li');
    liElem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const aElem = document.createElement('a');
    aElem.setAttribute('href', post.link);
    aElem.classList.add('fw-bold');
    aElem.setAttribute('id', post.id);
    aElem.setAttribute('target', '_blank');
    aElem.setAttribute('rel', 'noopener noreferrer');
    aElem.textContent = post.title;
    const postButton = document.createElement('button');
    postButton.setAttribute('type', 'button');
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'pbt');
    postButton.setAttribute('data-id', post.id);
    postButton.setAttribute('data-bs-toggle', 'modal');
    postButton.setAttribute('data-bs-target', '#modal');
    postButton.textContent = `${i18nInstance.t('keyView')}`;
    liElem.append(postButton);
    liElem.prepend(aElem);
    component.postsListForm.prepend(liElem);
    if (state.uiState.visitedLinks[post.id]) { // если в UI стейте есть id который был посещен
      aElem.classList.remove('fw-bold'); // добавляется стиль посещенной ссылки
      aElem.classList.add('fw-normal');
      aElem.classList.add('visited-links');
    }
    aElem.addEventListener('click', () => {
      watchedState.uiState.visitedLinks[post.id] = true;
    });
    postButton.addEventListener('click', (e) => {
      const idButton = e.target.getAttribute('data-id');
      const currentPost = watchedState.posts.find(({ id }) => idButton === id);
      watchedState.uiState.visitedLinks[currentPost.id] = true; // при клике,id в UI стейт
      modalTitle.textContent = currentPost.title;
      modalBody.textContent = currentPost.description;
      readCompletelyModalButton.textContent = `${i18nInstance.t('modalButtonRead')}`;
      closeModalWindowBtn.textContent = `${i18nInstance.t('closeModalWindow')}`;
      readCompletelyModalButton.setAttribute('href', currentPost.link);
    });
  });
};

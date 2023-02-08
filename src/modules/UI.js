const buttonGroup = document.querySelector('.btn-group');
const inputSubmitForm = document.querySelector('.rss-form');
const statusForm = document.querySelector('.feedback');
const addForm = document.querySelector('.form-control');
const russianLanguageButton = buttonGroup.querySelector('#ru');
const englishLanguageButton = buttonGroup.querySelector('#en');
const pageTitle = document.querySelector('.display-3');
const bottomHeader = document.querySelector('.lead');
const textInTheForm = document.querySelector('label[for="url-input"]');
const exampleForm = document.querySelector('.text-muted');
const submitButton = document.querySelector('button[type="submit"]');
const feedsTitle = document.querySelector('#feeds');
const feedsListForm = document.querySelector('#feeds-group');
const postsTitle = document.querySelector('#posts');
const postsListForm = document.querySelector('#posts-group');

export {
  inputSubmitForm, statusForm, addForm, russianLanguageButton, englishLanguageButton,
  pageTitle, bottomHeader, textInTheForm, exampleForm, submitButton, feedsTitle,
  feedsListForm, postsTitle, postsListForm, buttonGroup,
};

import _ from 'lodash';
import * as component from '../UI.js';
import i18nInstance from '../helpers/i18n.js';
import watchedState from '../helpers/watcher.js';
import validate from '../validator.js';
import request from './request.js';
import { render } from '../../view.js';

export default () => {
  component.buttonGroup.addEventListener('click', (event) => {
    const currentLanguageButton = event.target.getAttribute('id');
    if (currentLanguageButton === 'ru') {
      i18nInstance.changeLanguage('ru').then();
      watchedState.currentLanguage = 'ru';
    } else {
      i18nInstance.changeLanguage('en').then();
      watchedState.currentLanguage = 'en';
    }
  });
  component.inputSubmitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const validateErrors = validate({ url });
    if (_.isEmpty(validateErrors)) {
      watchedState.disabled = true;
      watchedState.downloadStatus = 'loading';
      watchedState.feedbackKey = 'done';
      watchedState.feedbackColor = 'green';
      watchedState.errorStatus = 'valid';
      request(url);
      watchedState.disabled = false;
    } else {
      if (validateErrors.url.message === 'errorURL') {
        watchedState.feedbackKey = 'errorValidUrl';
      } else {
        watchedState.feedbackKey = 'errorPresence';
      }
      watchedState.feedbackColor = 'blink';
      watchedState.errorStatus = 'invalid';
    }
  });
  render();
};

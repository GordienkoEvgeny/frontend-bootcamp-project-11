import i18n from 'i18next';
import resources from '../../locales/index.js';
// eslint-disable-next-line import/no-cycle
import runApp from '../controllers/event-listeners.js';

const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: true,
  resources,
}).then(() => { runApp(); });

export default i18nInstance;

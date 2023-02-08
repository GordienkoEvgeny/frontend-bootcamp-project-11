import i18n from 'i18next';
import resources from '../../locales/index.js';

export const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: true,
  resources,
}).then(() => {});

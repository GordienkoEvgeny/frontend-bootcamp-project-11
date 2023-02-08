import { watchedState } from '../helpers/watcher.js';

export const parseRSS = (responseData, link) => {
  const parser = new DOMParser();
  const dataDOM = parser.parseFromString(responseData, 'text/xml');
  if (dataDOM.querySelector('parsererror')) {
    watchedState.blackList.push(link);
    throw new Error('parseError');
  }
  return dataDOM;
};

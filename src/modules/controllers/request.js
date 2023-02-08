import axios from 'axios';
import { state } from '../appState.js';
import { getProxy } from './get-proxy.js';
import { parseRSS } from './parser.js';
import { getAndAddFeeds } from './get-add-feeds.js';
import { getAndAddPosts } from './get-add-posts.js';
import { watchedState } from '../helpers/watcher.js';
import * as component from '../UI.js';

export const request = (link) => {
  const checkBlackList = (state.blackList).find((bLink) => bLink === link);
  if (!checkBlackList) {
    const proxyURL = getProxy(link);
    axios.get(proxyURL)
      .then((response) => {
        const dataDOM = parseRSS(response.data.contents, link);
        getAndAddFeeds(dataDOM);
        getAndAddPosts(dataDOM);
        watchedState.disabled = false;
        watchedState.downloadStatus = 'loaded';
        const checkLinks = (state.links).find((stateLinks) => stateLinks === link);
        if (!checkLinks) {
          watchedState.links.push(link);
        }
      })
      .catch((error) => {
        error.message === 'parseError'
          ? watchedState.feedbackKey = 'errorLink'
          : watchedState.feedbackKey = 'networkErr';
        watchedState.errorStatus = 'invalid';
        watchedState.feedbackColor = 'blink';
        watchedState.downloadStatus = 'loaded';
        watchedState.disabled = false;
        component.addForm.focus();
      });
  }

  Promise.all(state.links).then(() => setTimeout(() => request(link), 5000));
};

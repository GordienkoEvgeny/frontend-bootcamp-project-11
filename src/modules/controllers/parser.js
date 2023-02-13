import _ from 'lodash';
import watchedState from '../helpers/watcher.js';
import state from '../appState.js';

export const parseRSS = (responseData, link) => {
  const parser = new DOMParser();
  const dataDOM = parser.parseFromString(responseData, 'text/xml');
  if (dataDOM.querySelector('parsererror')) {
    watchedState.blackList.push(link);
    throw new Error('parseError');
  }
  return dataDOM;
};

export const getAndAddFeeds = (dataDOM) => {
  const title = dataDOM.querySelector('title').textContent;
  const feedDescription = dataDOM.querySelector('description').textContent;
  const checkFeeds = (state.feeds).find((content) => content.title === title);
  if (!checkFeeds) {
    watchedState.feeds.push({ title, description: feedDescription });
  }
};

export const getAndAddPosts = (dataDom) => {
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

import state from '../appState.js';
import watchedState from '../helpers/watcher.js';

const getAndAddFeeds = (dataDOM) => {
  const title = dataDOM.querySelector('title').textContent;
  const feedDescription = dataDOM.querySelector('description').textContent;
  const checkFeeds = (state.feeds).find((content) => content.title === title);
  if (!checkFeeds) {
    watchedState.feeds.push({ title, description: feedDescription });
  }
};

export default getAndAddFeeds;

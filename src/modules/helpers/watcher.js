import onChange from 'on-change';
import state from '../appState.js';
// eslint-disable-next-line import/no-cycle
import { render, renderFeeds, renderPosts } from '../../view.js';

const watchedState = onChange(state, () => {
  render();
  renderFeeds();
  renderPosts();
});

export default watchedState;

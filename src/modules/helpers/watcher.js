import onChange from 'on-change';
import state from '../appState.js';
import { render, renderFeeds, renderPosts } from '../../view.js';

const watchedState = onChange(state, () => {
  render();
  renderFeeds();
  renderPosts();
});

export default watchedState;

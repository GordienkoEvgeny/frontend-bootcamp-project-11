import _ from 'lodash';
import state from '../appState.js';
import watchedState from '../helpers/watcher.js';

const getAndAddPosts = (dataDom) => {
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

export default getAndAddPosts;

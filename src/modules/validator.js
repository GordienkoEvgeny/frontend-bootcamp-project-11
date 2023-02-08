import * as yup from 'yup';
import _ from 'lodash';
import { state } from './appState.js';

export const validate = (field) => {
  const schema = yup.object().shape({
    url: yup.string().required()
      .url('errorURL')
      .notOneOf(state.links, 'errPresence'),
  });
  try {
    schema.validateSync(field, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

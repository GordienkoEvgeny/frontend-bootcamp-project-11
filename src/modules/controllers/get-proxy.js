const getProxy = (stateURL) => {
  const proxy = new URL('https://allorigins.hexlet.app');
  proxy.pathname = '/get';
  proxy.searchParams.set('url', stateURL);
  proxy.searchParams.set('disableCache', true);
  return proxy.toString();
};

export default getProxy;

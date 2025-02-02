export const checkBrowserSupport = () => {
  const support = {
    flexbox: typeof document.createElement('div').style.flex !== 'undefined',
    grid: typeof document.createElement('div').style.grid !== 'undefined',
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    fileReader: !!window.FileReader,
    fetch: !!window.fetch,
    webp: false
  };

  // Check WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    support.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  return support;
};

export const applyBrowserFixes = () => {
  const support = checkBrowserSupport();

  if (!support.flexbox) {
    document.body.classList.add('no-flexbox');
  }

  if (!support.grid) {
    document.body.classList.add('no-grid');
  }

  // Add polyfills if needed
  if (!support.fetch) {
    require('whatwg-fetch');
  }

  return support;
}; 
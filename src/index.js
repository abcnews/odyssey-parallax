const { render, h } = require('preact');
const Immutable = require('immutable');

const { getSections } = require('./loader');

const init = () => {
  // Load any actual parallax sections
  getSections().forEach(section => mount(section.mountNode, section));

  // See if there is one destined for the Header
  const interactive = document.querySelector('.Header-media *[data-parallax-layers]');
  if (interactive) {
    const section = {
      layers: Immutable.fromJS(JSON.parse(interactive.getAttribute('data-config')))
    };

    const mountNode = document.createElement('div');
    interactive.parentNode.insertBefore(mountNode, interactive);

    mount(mountNode, section);
  }
};

let mount = (element, section) => {
  const App = require('./components/app');
  render(<App layers={section.layers} />, element, element.lastChild);
};

// Do some hot reload magic with errors
if (module.hot) {
  // Wrap the actual renderer in an error trap
  let attemptMount = mount;
  mount = (element, section) => {
    try {
      attemptMount(element, section);
    } catch (e) {
      // Render the error to the screen in place of the actual app
      const ErrorBox = require('./error');
      render(<ErrorBox error={e} />, element, element.lastChild);
    }
  };

  // If a new app build is detected try rendering it
  module.hot.accept('./components/app', () => {
    setTimeout(init);
  });
}

if (window.__ODYSSEY__) {
  init();
} else {
  window.addEventListener('odyssey:api', init);
}

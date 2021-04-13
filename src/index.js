const React = require('react');
const {render} = require('react-dom');
const App = require('./components/app');
const {whenOdysseyLoaded} = require('@abcnews/env-utils')

const { getSections } = require('./loader');

const init = () => {
  // Load any actual parallax sections
  getSections().forEach(sectionPromise => sectionPromise.then(section => {
    mount(section.mountNode, section);
  }));
};

let mount = (element, section) => {
  render(<App layers={section.layers} />, element);
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
      Dom.render(<ErrorBox error={e} />, element);
    }
  };

  // If a new app build is detected try rendering it
  module.hot.accept('./components/app', () => {
    setTimeout(init);
  });
}

whenOdysseyLoaded.then(init);
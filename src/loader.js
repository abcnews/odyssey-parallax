require('es6-promise');
require('whatwg-fetch');

function getSections() {
  // grab #parallax anchors
  const anchors = [].slice.call(document.querySelectorAll('a[name^=parallax]'));

  // grab old init-interactives
  const interactives = [].slice.call(document.querySelectorAll('*[data-parallax-layers]'));

  // Process them all
  const parallaxes = anchors.concat(interactives);
  return Promise.all(parallaxes.map(parallax => getSection(parallax)).filter(n => n));
}

function getSection(startNode) {
  let section = {
    startNode
  };

  // load the layers if need be
  return Promise.resolve()
    .then(() => {
      if (startNode.hasAttribute('data-config')) {
        return JSON.parse(startNode.getAttribute('data-config'));
      } else {
        section.key = startNode.getAttribute('name').replace('parallax', '');
        return fetch(`//www.abc.net.au/dat/news/interactives/parallaxative/${section.key}/config.json`).then(r =>
          r.json()
        );
      }
    })
    .then(layers => {
      section.layers = layers;

      // Create a node that we can mount onto
      section.mountNode = document.createElement('div');
      section.mountNode.className = 'u-full';
      section.startNode.parentNode.insertBefore(section.mountNode, section.startNode);

      section.startNode.parentNode.removeChild(section.startNode);

      return section;
    })
    .catch(err => {
      console.log('Fetch err:', err);
    });
}

module.exports = { getSections, getSection };

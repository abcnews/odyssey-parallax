const Immutable = require('immutable');

function getSections() {
  if (!window._parallaxes) {
    window._parallaxes = window.__ODYSSEY__.utils.anchors
      .getSections('parallax')
      .map(section => {
        try {
          let interactive;

          section.betweenNodes.forEach(node => {
            if (node.getAttribute && node.hasAttribute('data-parallax-layers')) {
              interactive = node;
            } else if (node.tagName === 'DIV' && node.querySelector('[data-parallax-layers]')) {
              interactive = node.querySelector('[data-parallax-layers]');
            } else {
              node.parentNode.removeChild(node);
            }
          });

          section.layers = Immutable.fromJS(JSON.parse(interactive.getAttribute('data-config')));
        } catch (e) {
          // No layer data
          return false;
        }

        // Create a node that we can mount onto
        section.mountNode = document.createElement('div');
        section.mountNode.className = 'u-full';
        section.startNode.parentNode.insertBefore(section.mountNode, section.startNode);

        return section;
      })
      .filter(s => s);
  }

  return window._parallaxes;
}

module.exports = { getSections };

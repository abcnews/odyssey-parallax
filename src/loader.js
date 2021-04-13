const {selectMounts, getMountValue} = require ('@abcnews/mount-utils')

function getSections() {
  return selectMounts('parallax').map(parallax => getSection(parallax));
}

function getSection(startNode) {
  let section = {
    startNode
  };

  // load the layers if need be
  return Promise.resolve()
    .then(() => {
      
        section.key = getMountValue(startNode, 'parallax');
        return fetch(`//www.abc.net.au/dat/news/interactives/parallaxative/${section.key}/config.json`).then(r =>
          r.json()
        );
      
    })
    .then(layers => {
      section.layers = layers;
      section.mountNode = section.startNode;
      section.startNode.classList.add('u-full')
      return section;
    })
    .catch(err => {
      console.log('Fetch err:', err);
    });
}

module.exports = { getSections, getSection };

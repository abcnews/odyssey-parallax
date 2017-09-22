const Immutable = require('immutable');

let sections;
function getSections() {
    if (!sections) {
        sections = window.__ODYSSEY__.utils.anchors
            .getSections('parallax')
            .map(section => {
                console.log('what');

                try {
                    let interactive;

                    console.log('SECTION', section.betweenNodes);

                    section.betweenNodes.forEach(node => {
                        if (node.tagName === 'DIV' && node.querySelector('[data-parallax-layers]')) {
                            interactive = node.querySelector('[data-parallax-layers]');
                        } else {
                            node.parentNode.removeChild(node);
                        }
                    });

                    section.layers = Immutable.fromJS(JSON.parse(interactive.getAttribute('data-config')));
                } catch (e) {
                    console.log('ERROR', e);

                    // No layer data
                    return false;
                }

                console.log('SECTION', section);

                // Create a node that we can mount onto
                section.mountNode = document.createElement('div');
                section.mountNode.className = 'u-full';
                section.startNode.parentNode.insertBefore(section.mountNode, section.startNode);

                return section;
            })
            .filter(s => s);
    }

    return sections;
}

module.exports = { getSections };

function textNumbers(value) {
    return parseFloat(
        value
            .replace('minus', '-')
            .replace('negative', '-')
            .replace('point', '.')
    );
}

function alternatingCaseToObject(string) {
    const config = string.match(/[A-Z]+[0-9a-z]+/g);

    if (!config) return {};

    let o = {};

    config.forEach(match => {
        let [, key, value] = match.match(/([A-Z]+)([0-9a-z]+)/);
        key = key.toLowerCase();

        // Do some type guessing
        if (value.match(/(minus)?(\d+)to(minus)?(\d+)/)) {
            value = value.split('to').map((value, index, all) => {
                return [1 - index * (1 / (all.length - 1)), textNumbers(value)];
            });
        } else if (parseFloat(value).toString() === value) {
            value = parseFloat(value);
        } else if (value === 'true' || value === 'yes') {
            value = true;
        } else if (value === 'false' || value === 'no') {
            value = false;
        }

        if (o[key]) {
            // Key exists so treat it as a list
            if (!(o[key] instanceof Array)) {
                o[key] = [o[key]];
            }
            o[key].push(value);
        } else {
            o[key] = value;
        }
    });

    return o;
}

let sections;
function getSections() {
    if (!sections) {
        sections = window.__ODYSSEY__.utils.anchors
            .getSections('parallax')
            .map(section => {
                console.log('found section?');

                // See if there is an interactive node as the first thing
                if (section.betweenNodes[0].tagName === 'DIV') {
                    section.mountNode = section.betweenNodes[0].querySelector(
                        '.init-interactive'
                    );
                    // Don't include this node in the marker check
                    section.betweenNodes[0].mountable = true;
                } else {
                    // Create a node that we can mount onto
                    section.mountNode = document.createElement('div');
                    section.mountNode.className = 'u-full';
                    section.startNode.parentNode.insertBefore(
                        section.mountNode,
                        section.startNode
                    );
                }

                section.layers = getLayersForSection(section);

                return section;
            });
    }

    return sections;
}

function getLayersForSection(section) {
    let layers = [];
    let nextConfig = section.config;
    let nextNodes = [];

    let idx = 0;

    // Commit the current nodes to a layer
    function pushLayer() {
        if (nextNodes.length === 0) return;

        layers.push({
            idx: idx++,
            config: nextConfig,
            nodes: nextNodes,
            section
        });
        nextNodes = [];
    }

    // Check the section nodes for markers and marker content
    section.betweenNodes.forEach((node, index) => {
        if (
            node.tagName === 'A' &&
            node.getAttribute('name') &&
            node.getAttribute('name').indexOf('layer') === 0
        ) {
            // Found a new marker so we should commit the last one
            pushLayer();

            // If marker has no config then just use the previous config
            let configString = node
                .getAttribute('name')
                .replace(new RegExp(`^${name}`), '');
            if (configString) {
                nextConfig = alternatingCaseToObject(configString);
                nextConfig.hash = configString;
            }
        } else if (!node.mountable) {
            // Any other nodes just get grouped for the next marker
            nextNodes.push(node);
            node.parentNode.removeChild(node);
        }

        // Any trailing nodes just get added as a last marker
        if (index === section.betweenNodes.length - 1) {
            pushLayer();
        }
    });

    return layers;
}

module.exports = { getSections };

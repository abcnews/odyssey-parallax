const Preact = require('preact');

const styles = require('./layer.scss');

class Layer extends Preact.Component {
    constructor(props) {
        super(props);

        this.calc = this.calc.bind(this);
    }

    componentDidMount() {
        const { layer } = this.props;

        if (!layer.nodes) return;

        // Layer with depth 1 is the background and shouldn't mount
        if (layer.config.depth === 1) {
            const image = layer.nodes.find(n => n.tagName === 'IMG');
            if (image && image.getAttribute('src')) {
                this.backgroundImage = image.getAttribute('src');
            }
        } else {
            layer.nodes.forEach(node => {
                this.wrapper.appendChild(node);
            });
        }
    }

    componentWillUnmount() {
        const { layer } = this.props;

        if (!layer.nodes) return;

        // Layer with depth 1 is the background and wasn't mounted
        if (layer.config.depth > 1) {
            layer.nodes.forEach(node => {
                this.wrapper.removeChild(node);
            });
        }
    }

    calc(property, defaultTo) {
        const { layer, distance } = this.props;
        const stops = layer.config[property];

        if (!stops) return defaultTo;

        // Get the first stop the is past this distance
        let index = stops.findIndex(stop => stop[0] <= distance);
        if (!index) index = 0;

        if (index === 0 || stops[index][0] === distance) {
            return stops[index][1];
        } else {
            let previousStop = stops[index - 1];
            let nextStop = stops[index];

            let sizeOfStop = nextStop[0] - previousStop[0];
            let distanceInStop = (distance - previousStop[0]) / sizeOfStop;

            let minValue = previousStop[1];
            let maxValue = nextStop[1];
            let range = maxValue - minValue;

            return minValue + range * distanceInStop;
        }
    }

    render() {
        const { layer, distance } = this.props;
        const { config } = layer;

        const d = config.depth - 1;

        let minY = d * -5;
        let maxY = d * 5;
        let rangeY = Math.abs(maxY - minY);

        const rotate = this.calc('rotate', 0);
        const zoom = this.calc('zoom', 1);

        let scale = 1 + (1 * (zoom / 10) - 0.1);
        let y = -50 + minY + rangeY * distance + this.calc('y', 0);

        let filter = [
            `blur(${this.calc('blur', 0)}px)`,
            `grayscale(${this.calc('grayscale', 0)})`,
            `sepia(${this.calc('sepia', 0)})`
        ].join(' ');

        let x = -50 + this.calc('x', 0);

        let layerStyle = {
            top: '50%',
            left: '50%',
            transform: `translateX(${x}%) translateY(${y}%) scale(${scale}) rotate(${rotate}deg)`,
            filter
        };

        if (d === 0) {
            // This is the background layer
            layerStyle.width = '100%';
            layerStyle.height = '100%';
            layerStyle.backgroundSize = 'cover';
            layerStyle.backgroundPosition = '50% 50%';
            layerStyle.backgroundImage = `url(${this.backgroundImage})`;
        }

        return (
            <div
                ref={el => (this.wrapper = el)}
                className={`${styles.wrapper}`}
                style={layerStyle}
            />
        );
    }
}

module.exports = Layer;

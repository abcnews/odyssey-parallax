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
        const p = layer.config[property];

        if (!p) return defaultTo;

        let range = p.to - p.from;
        return p.from + range * (1 - distance);

        // TODO, let this be a curve?
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
        let y = minY + rangeY * distance;

        let filter = [
            `blur(${this.calc('blur', 0)}px)`,
            `grayscale(${this.calc('grayscale', 0)})`,
            `sepia(${this.calc('sepia', 0)})`
        ].join(' ');

        let layerStyle = {
            transform: `translateY(${y}%) scale(${scale}) rotate(${rotate}deg)`,
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

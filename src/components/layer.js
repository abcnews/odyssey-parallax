const Preact = require('preact');

const styles = require('./layer.scss');

class Layer extends Preact.Component {
    componentDidMount() {
        const { layer } = this.props;

        if (!layer.nodes) return;

        layer.nodes.forEach(node => {
            this.wrapper.appendChild(node);
        });
    }

    componentWillUnmount() {
        const { layer } = this.props;

        if (!layer.nodes) return;

        layer.nodes.forEach(node => {
            this.wrapper.removeChild(node);
        });
    }

    render() {
        const { layer } = this.props;

        // the translate y will beb based on this.props.distance and the depth
        const y = -50 - (layer.config.depth - 1) * 15 * this.props.distance;
        const scale = 1 + (layer.config.depth - 1) * 0.05;

        return (
            <div
                ref={el => (this.wrapper = el)}
                className={styles.wrapper}
                style={{ transform: `translate(-50%, ${y}%) scale(${scale})` }}
            />
        );
    }
}

module.exports = Layer;

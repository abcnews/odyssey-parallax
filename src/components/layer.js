const { h, Component } = require('preact');

const styles = require('./layer.scss');

class Layer extends Component {
    constructor(props) {
        super(props);

        this.hasTween = this.hasTween.bind(this);
        this.calc = this.calc.bind(this);
    }

    hasTween(property) {
        const { layer, orientation, timeline } = this.props;

        return layer.getIn([orientation, 'tweens']).find(t => t.get('property') === property);
    }

    calc(property, defaultTo) {
        const { layer, orientation, timeline } = this.props;

        const tween = layer.getIn([orientation, 'tweens']).find(t => t.get('property') === property);

        if (!tween) return defaultTo;

        const stops = tween.get('stops').toJS();
        const index = Math.ceil((1 - timeline) * (stops.length - 1));
        if (index === 0) {
            return stops[index];
        } else {
            let sizeOfStop = 1 / (stops.length - 1);
            let startOfStop = (index - 1) * sizeOfStop;
            let endOfStop = index * sizeOfStop;

            let timelineInStop = (1 - timeline - startOfStop) / sizeOfStop;

            let minValue = stops[index - 1];
            let maxValue = stops[index];
            let range = maxValue - minValue;

            return minValue + range * timelineInStop;
        }
    }

    render() {
        const { layer, orientation, timeline, layerParent } = this.props;

        if (!layerParent) return <div />;

        let d = parseInt(layer.get('depth'));

        if (isNaN(d)) d = 1;

        let minY = d * -1;
        let maxY = d * 1;
        let rangeY = Math.abs(maxY - minY);

        const rotate = this.calc('rotate', 0);
        const zoom = d * 0.66 + this.calc('zoom', 1);

        let scale = 1 + (1 * (zoom / 10) - 0.1);

        // if there is an x tween then use that, or just normal x
        let x = -50 + parseFloat(layer.getIn([orientation, 'x']));
        if (this.hasTween('x')) {
            x = -50 + this.calc('x', 0);
        }
        // map x to a position within the stage
        x = layerParent.offsetWidth * (x / 100);

        // if there is a y tween use that, or just normal y
        const yParallax = minY + rangeY * timeline;
        let y = -50 + parseFloat(layer.getIn([orientation, 'y'])) + yParallax;
        if (this.hasTween('y')) {
            y = -50 + this.calc('y', 0) + yParallax;
        }
        // map x to a position within the stage
        y = layerParent.offsetHeight * (y / 100);

        const filter = [
            'blur(?px)',
            'brightness(?)',
            'contrast(?)',
            'grayscale(?)',
            'hue-rotate(?deg)',
            'invert(?)',
            'opacity(?)',
            'saturate(?)',
            'sepia(?)'
        ]
            .map(f => {
                const value = this.calc(f.split('(')[0], null);
                return value === null ? null : f.replace('?', value);
            })
            .filter(f => f)
            .join(' ');

        let wrapperStyle = {
            width: layerParent.offsetWidth + 'px',
            height: layerParent.offsetHeight + 'px',
            top: '50%',
            left: '50%',
            transform: `translateX(${x}px) translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
            transformOrigin: '50% 50%',
            filter,
            mixBlendMode: layer.get('blendMode')
        };

        let mediaStyle = {
            width: '100%'
        };

        if (layer.getIn([orientation, 'cover'])) {
            // set images shortest side to be 100%
            const imageRatio = layer.get('width') / layer.get('height');
            const stageRatio = layerParent.offsetWidth / layerParent.offsetHeight;
            const size = 100;
            if (stageRatio >= imageRatio) {
                // behave like landscape
                mediaStyle.width = size + '%';
            } else if (layerParent) {
                // behave like portrait
                const height = layerParent.offsetHeight * size / 100;
                mediaStyle.width = parseFloat(layer.get('width')) * (height / layer.get('height')) + 'px';
            }
        } else {
            const size = parseFloat(layer.getIn([orientation, 'size']));
            if (orientation === 'landscape') {
                mediaStyle.width = size + '%';
            } else if (layerParent) {
                const height = layerParent.offsetHeight * size / 100;
                mediaStyle.width = parseFloat(layer.get('width')) * (height / layer.get('height')) + 'px';
            }
        }

        let src = layer.get('image');
        let media;
        if (src.indexOf('.mp4') > -1) {
            media = <video src={src} autoPlay loop />;
        } else {
            media = <img src={src} />;
        }

        return (
            <div className={styles.wrapper} style={wrapperStyle}>
                <div className={styles.media} style={mediaStyle}>
                    {media}
                </div>
            </div>
        );
    }
}

module.exports = Layer;

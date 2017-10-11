const React = require('react');

const styles = require('./layer.scss');

class Layer extends React.Component {
  constructor(props) {
    super(props);

    this.getTween = this.getTween.bind(this);
    this.calc = this.calc.bind(this);
  }

  getTween(property) {
    const { layer, orientation, timeline } = this.props;

    return layer[orientation].tweens.filter(t => t.property === property)[0];
  }

  calc(property, defaultTo) {
    const { layer, orientation, timeline } = this.props;

    const tween = this.getTween(property);

    if (!tween) return defaultTo;

    const stops = tween.stops;
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

    let d = parseInt(layer.depth, 10);

    if (isNaN(d)) d = 1;

    let minY = d * -1;
    let maxY = d * 1;
    let rangeY = Math.abs(maxY - minY);

    const rotate = this.calc('rotate', 0);
    let scale = 1 + d * 0.02;

    if (this.getTween('zoom')) {
      const zoom = d * 0.66 + this.calc('zoom', 1);
      scale = scale * (zoom / 10) - 0.1;
    }

    // if there is an x tween then use that, or just normal x
    let x = -50 + parseFloat(layer[orientation].x);
    if (this.getTween('x')) {
      x = -50 + this.calc('x', 0);
    }
    // map x to a position within the stage
    x = layerParent.offsetWidth * (x / 100);

    // if there is a y tween use that, or just normal y
    const yParallax = minY + rangeY * timeline;
    let y = -50 + parseFloat(layer[orientation].y) + yParallax;
    if (this.getTween('y')) {
      y = -50 + this.calc('y', 0) + yParallax;
    }
    // map y to a position within the stage
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
      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: '50% 50%',
      filter,
      mixBlendMode: layer.blendMode
    };

    let mediaStyle = {
      width: '100%'
    };

    if (layer[orientation].cover) {
      // set images shortest side to be 100%
      const imageRatio = layer.width / layer.height;
      const stageRatio = layerParent.offsetWidth / layerParent.offsetHeight;
      const size = 100;
      if (stageRatio >= imageRatio) {
        // behave like landscape
        mediaStyle.width = size + '%';
      } else if (layerParent) {
        // behave like portrait
        const height = layerParent.offsetHeight * size / 100;
        mediaStyle.width = parseFloat(layer.width) * (height / layer.height) + 'px';
      }
    } else {
      const size = parseFloat(layer[orientation].size);
      if (orientation === 'landscape') {
        mediaStyle.width = size + '%';
      } else if (layerParent) {
        const height = layerParent.offsetHeight * size / 100;
        mediaStyle.width = parseFloat(layer.width) * (height / layer.height) + 'px';
      }
    }

    let src = layer.image;
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

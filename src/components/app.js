const React = require('react');

const Layer = require('./layer');
const styles = require('./app.scss');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onViewportChanged = this.onViewportChanged.bind(this);

    this.state = {
      imagesHaveLoaded: false,
      layers: props.layers.reverse(),
      orientation: 'landscape',
      timeline: 0
    };

    this.imagesToLoad = this.state.layers.length;
  }

  componentDidMount() {
    __ODYSSEY__.scheduler.subscribe(this.onViewportChanged);

    // Load images
    this.state.layers.forEach(layer => {
      if (layer.image.indexOf('.mp4') > -1) {
        this.imagesToLoad--;
      } else {
        let img = document.createElement('img');
        img.addEventListener('load', event => {
          try {
            this.imagesToLoad--;
            if (this.imagesToLoad === 0) {
              this.setState({ imagesHaveLoaded: true });
            }
          } catch (ex) {}
        });
        img.addEventListener('error', event => {
          try {
            this.imagesToLoad--;
            if (this.imagesToLoad === 0) {
              this.setState({ imagesHaveLoaded: true });
            }
          } catch (ex) {}
        });
        img.src = layer.image;
      }
    });
  }

  componentWillUnmount() {
    __ODYSSEY__.scheduler.unsubscribe(this.onViewportChanged);
  }

  onViewportChanged() {
    if (!this.wrapper) return;

    const bounds = this.wrapper.getBoundingClientRect();
    const isVisible = bounds.top < bounds.height && (bounds.top > 0 || bounds.bottom > 0);

    if (isVisible) {
      this.setState(state => {
        return {
          timeline: (1 + bounds.top / bounds.height) / 2
        };
      });
    }

    this.setState(state => {
      return {
        orientation: Math.max(window.innerWidth, window.innerHeight) === window.innerWidth ? 'landscape' : 'portrait'
      };
    });
  }

  render() {
    const { layers } = this.state;

    return (
      <div ref={el => (this.wrapper = el)} className={styles.wrapper}>
        <div className={styles.layers}>
          {this.state.imagesHaveLoaded &&
            layers.map((layer, index) => {
              return (
                <Layer
                  key={index}
                  layer={layer}
                  orientation={this.state.orientation}
                  layerParent={this.wrapper}
                  timeline={this.state.timeline}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

module.exports = App;

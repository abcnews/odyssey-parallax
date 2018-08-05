const React = require('react');

const Layer = require('./layer');
const styles = require('./app.scss');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);
    this.onLoadedImage = this.onLoadedImage.bind(this);
    this.updateTimeline = this.updateTimeline.bind(this);

    this.state = {
      imagesHaveLoaded: false,
      layers: props.layers.reverse(),
      orientation: 'landscape',
      timeline: 0
    };

    this.imagesToLoad = this.state.layers.length;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);

    // Load images
    this.state.layers.forEach(layer => {
      if (layer.image.indexOf('.mp4') > -1) {
        this.imagesToLoad--;
      } else {
        let img = document.createElement('img');
        img.addEventListener('load', this.onLoadedImage);
        img.addEventListener('error', this.onLoadedImage);
        img.src = layer.image;
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onLoadedImage() {
    try {
      this.imagesToLoad--;
      if (this.imagesToLoad === 0) {
        this.setState({ imagesHaveLoaded: true }, () => {
          // Do a scroll to force the timeline to update
          this.updateTimeline();
        });
      }
    } catch (ex) {}
  }

  updateTimeline() {
    if (!this.wrapper) return;
    const bounds = this.wrapper.getBoundingClientRect();
    const isVisible = bounds.top < bounds.height && (bounds.top > 0 || bounds.bottom > 0);

    if (isVisible) {
      this.setState(() => {
        // round the timeline position to hopefully avoid floating point nonsense
        let timeline = (1 + bounds.top / bounds.height) / 2;
        timeline = Math.round(timeline * 1000) / 1000;

        return { timeline };
      });
    }

    this.setState(() => {
      return {
        orientation: Math.max(window.innerWidth, window.innerHeight) === window.innerWidth ? 'landscape' : 'portrait'
      };
    });
  }

  onScroll() {
    // If users have 'reduce motion' turned on then don't update on scroll
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.updateTimeline();
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

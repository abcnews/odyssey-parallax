const React = require('react');

const Layer = require('./layer');
const styles = require('./app.scss');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onViewportChanged = this.onViewportChanged.bind(this);

    this.state = {
      layers: props.layers.reverse(),
      orientation: 'landscape',
      timeline: 0
    };
  }

  componentDidMount() {
    __ODYSSEY__.scheduler.subscribe(this.onViewportChanged);
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
          {layers.map((layer, index) => {
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

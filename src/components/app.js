const { h, Component } = require('preact');

const Layer = require('./layer');
const styles = require('./app.scss');

class App extends Component {
    constructor(props) {
        super(props);

        this.onViewportChanged = this.onViewportChanged.bind(this);

        this.state = {
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

    onViewportChanged(viewport) {
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
                orientation: Math.max(viewport.width, viewport.height) === viewport.width ? 'landscape' : 'portrait'
            };
        });
    }

    render() {
        const { layers } = this.props;

        return (
            <div ref={el => (this.wrapper = el)} className={styles.wrapper}>
                <div className={styles.layers}>
                    {layers
                        .reverse()
                        .map(layer => {
                            return (
                                <Layer
                                    key={layer.get('id')}
                                    layer={layer}
                                    orientation={this.state.orientation}
                                    layerParent={this.wrapper}
                                    timeline={this.state.timeline}
                                />
                            );
                        })
                        .toJS()}
                </div>
            </div>
        );
    }
}

module.exports = App;

const Preact = require('preact');

const Layer = require('./layer');
const styles = require('./app.scss');

class App extends Preact.Component {
    constructor(props) {
        super(props);

        this.onScroll = this.onScroll.bind(this);

        this.state = {
            distance: 0
        };
    }

    componentDidMount() {
        __ODYSSEY__.scheduler.subscribe(this.onScroll);
    }

    componentWillUnmount() {
        __ODYSSEY__.scheduler.unsubscribe(this.onScroll);
    }

    onScroll(viewport) {
        if (!this.wrapper) return;

        const bounds = this.wrapper.getBoundingClientRect();
        const isVisible =
            bounds.top < bounds.height && (bounds.top > 0 || bounds.bottom > 0);

        if (isVisible) {
            this.setState({
                distance: (1 + bounds.top / bounds.height) / 2
            });
        }
    }

    render() {
        const { section } = this.props;

        return (
            <div
                ref={el => (this.wrapper = el)}
                className={`Block is-right u-full ${styles.wrapper}`}>
                <div className="Block-media is-fixed">
                    {section.layers.map(layer => {
                        return (
                            <Layer
                                layer={layer}
                                distance={this.state.distance}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

module.exports = App;

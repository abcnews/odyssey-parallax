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
                distance: 0 - bounds.top / bounds.height
            });
        }
    }

    render() {
        const { section } = this.props;

        return (
            <div ref={el => (this.wrapper = el)} className={styles.wrapper}>
                {section.layers.map(layer => {
                    return (
                        <Layer layer={layer} distance={this.state.distance} />
                    );
                })}
            </div>
        );
    }
}

module.exports = App;

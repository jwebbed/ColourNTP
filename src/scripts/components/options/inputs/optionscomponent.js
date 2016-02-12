import { h, Component } from 'preact';

import Chrome from '../../../modules/chrome';

class OptionsComponent extends Component {
    constructor () {
        super();

        this.state = {
            value: this.props.value
        };
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        });
    }

    render () {
        return null;
    }
}

export default OptionsComponent;

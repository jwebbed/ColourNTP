import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import OptionsComponent from './optionscomponent';
import Chrome from '../../../modules/chrome';

@autobind
class Colour extends OptionsComponent {
    handleChange (e) {
        let key   = this.props.optkey,
            value = e.target.value;

        Chrome.setSetting(key, value);

        this.setState({ value: value });
    }

    render (props, state) {
        return (
            <label>
                <span>{props.label}:</span>
                <input type='color' value={state.value} onChange={this.handleChange} />
            </label>
        );
    }
}

export default Colour;

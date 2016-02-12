import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import OptionsComponent from './optionscomponent';
import Chrome from '../../../modules/chrome';

@autobind
class Textbox extends OptionsComponent {
    handleChange (e) {
        const value = e.target.value;

        Chrome.setSetting(this.props.optkey, value);

        this.setState({ value: value });
    }

    render (props, state) {
        return (
            <label>
                <span>{props.label}:</span>
                <input type='text' value={state.value} onChange={this.handleChange} />
            </label>
        );
    }
}

export default Textbox;

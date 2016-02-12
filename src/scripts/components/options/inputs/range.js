import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import OptionsComponent from './optionscomponent';
import Chrome from '../../../modules/chrome';

@autobind
class Range extends OptionsComponent {
    handleChange (e) {
        let key   = this.props.optkey,
            value = e.target.value;

        Chrome.setSetting(key, value);

        this.setState({ value: value });
    }

    render (props, state) {
        return (
            <label>
                <p>{props.label}:</p>
                <input type='range' min='0' max='100' step='1' value={state.value}
                    onChange={this.handleChange} />
                <span>({state.value}%)</span>
            </label>
        );
    }
}

export default Range;

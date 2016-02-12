import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import OptionsComponent from './optionscomponent';
import Chrome from '../../../modules/chrome';

@autobind
class Dropdown extends OptionsComponent {
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
                <select value={state.value} onChange={this.handleChange}>
                    { props.options.map((item, i) => {
                        return <option key={i} value={item}>{item}</option>;
                    }) }
                </select>
            </label>
        );
    }
}

export default Dropdown;

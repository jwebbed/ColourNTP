import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import OptionsComponent from './optionscomponent';
import Radio from './radio';
import Chrome from '../../../modules/chrome';

@autobind
class RadioGroup extends OptionsComponent {
    handleChange (val) {
        let key = this.props.optkey;

        Chrome.setSetting(key, val);

        this.setState({ value: val });
    }

    render (props, state) {
        let group = props.group;

        return (
            <div>
                { props.children.map((radio, i) => (
                    <Radio {...radio.attributes}
                        key={i}
                        checked={state.value === radio.attributes.value}
                        group={group}
                        onChange={this.handleChange}>
                        {radio.children}
                    </Radio>
                )) }
            </div>
        );
    }
}

export default RadioGroup;

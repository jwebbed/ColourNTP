import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import OptionsComponent from './optionscomponent';
import Chrome from '../../../modules/chrome';

@autobind
class Checkbox extends OptionsComponent {
    handleChange (e) {
        const value = e.target.checked;

        Chrome.setSetting(this.props.optkey, value);

        this.setState({ value: value });
    }

    render (props, state) {
        return (
            <div>
                <label>
                    <input type='checkbox' checked={state.value}
                        onChange={this.handleChange} />

                    { props.tooltip ?
                        <abbr>
                            <span>{props.label}</span>
                            <div>
                                <strong>{props.label}</strong>
                                <p>{props.tooltip}</p>
                            </div>
                        </abbr> :
                        <span>{props.label}</span>
                    }
                </label>

                { state.value ?
                    <div className='options__content'>{props.children}</div> :
                    null
                }
            </div>
        );
    }
}

export default Checkbox;

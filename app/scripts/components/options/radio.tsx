///<reference path='../../types/react.d.ts' />
///<reference path='../../types/settings.d.ts' />

import React = require('react');


interface IProps {
    label: string;
    tooltip?: string;
    value: boolean;
}

interface IState {
    value: boolean;
}

class Radio extends React.Component<IProps, IState> {
    constructor (props) {
        super(props);

        this.state = {
            value: this.props.value
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (e) {
        this.setState({
            value: e.target.checked
        });
    }

    render () {
        return (
            <label>
                <input type='radio' checked={this.state.value} onChange={this.handleChange} />
                <abbr>
                    <span>{this.props.label}</span>
                    { this.props.tooltip &&
                        <span>
                            <strong>{this.props.label}</strong>
                            <p>{this.props.tooltip}</p>
                        </span>
                    }
                </abbr>
            </label>
        );
    }
}

export = Radio;
import { h, Component } from 'preact';

import Tab from './tab';

class Tabs extends Component {
    constructor () {
        super();

        this.state = {
            activeTab: this.props.activeTab
        };
    }

    handleTab (tab) {
        // Close tab if open
        if (this.props.canToggle) {
            tab = this.state.activeTab === tab ? null : tab
        }

        this.setState({
            activeTab: tab
        });

        if (this.props.onToggle) {
            this.props.onToggle(tab);
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.activeTab !== this.state.activeTab) {
            this.setState({
                activeTab: nextProps.activeTab
            });
        }
    }

    render (props, { activeTab }) {
        return (
            <div>
                <ul className='tabs'>
                    { props.children.map((tab, i) => {
                        if (tab) {
                            let tabClass = 'tabs__tab';
                            if (activeTab === i) {
                                tabClass += ' tabs__tab--active';
                            }

                            return (
                                <li key={i}
                                    className={tabClass}
                                    onClick={this.handleTab.bind(this, i)}>
                                    {tab.attributes.name}
                                </li>
                            );
                        }
                    }) }
                </ul>

                {props.children[activeTab]}
            </div>
        );
    }
}

export default Tabs;

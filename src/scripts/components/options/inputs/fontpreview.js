import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import Chrome from '../../../modules/chrome';
import WebFont from '../../../modules/webfont';

@autobind
class FontPreview extends Component {
    constructor () {
        super();

        this.state = {
            font: this.props.font
        };
    }

    componentDidMount () {
        WebFont.loadFont(this.state.font);

        // Fetch new settings when changed
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.msg === 'saved') {
                this.fetchSettings();
            }
        });
    }

    fetchSettings () {
        Chrome.getSettings((settings) => {
            WebFont.loadFont(settings.fontWeb);

            this.setState({
                font: settings.fontWeb
            });
        });
    }

    render ({}, { font }) {
        return <p>Preview: <span style={{ fontFamily: font }}>12:34:56</span></p>;
    }
}

export default FontPreview;

import autobind from 'autobind-decorator';
import { h, Component } from 'preact';

import Chrome from '../../modules/chrome';
import Colours from '../../modules/colours';
import TimeHelper from '../../modules/timehelper';
import Unsplash from '../../modules/unsplash';
import WebFont from '../../modules/webfont';

import Time from './time';
import DateDisplay from './date';
import Hex from './hex';
import Panels from './panels';
import History from './history';

@autobind
class NewTab extends Component {
    constructor () {
        super();

        this.state = {
            settings     : {},
            time         : {},
            date         : '',
            colour       : '',

            coloursClass : 'colours colours--hidden',
            bgImage      : null,
            bgOpacity    : 1
        };
    }

    componentDidMount () {
        this.fetchSettings();

        // Fetch new settings when changed
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.msg === 'saved') {
                this.fetchSettings();
            }
        });
    }

    componentWillUnmount () {
        clearInterval(this.interval);
        this.interval = null;
    }

    fetchSettings () {
        Chrome.getSettings((settings) => {
            var coloursClass = 'colours';

            // No animations
            if (!settings.animations) {
                coloursClass += ' notransition';
            }

            // Text/colour protection
            if (settings.colour !== 'regular' || settings.bg !== 'none') {
                coloursClass += ' full';
            }

            // Solid colour
            if (settings.colour === 'solid') {
                this.setState({
                    colour : settings.colourSolid
                });
            }

            // No background image (or offline)
            if (settings.bg === 'none' || !navigator.onLine) {
                this.loadBgImage(null);
            }

            // Default font (or offline)
            if (settings.font === 'default' || !navigator.onLine) {
                this.loadFont(null);
            }

            // Online: set background image/web font
            if (navigator.onLine) {
                if (settings.bg === 'unsplash') {
                    Unsplash.getImage(settings.bgUnsplashFreq, (imgUrl) => {
                        this.loadBgImage(imgUrl, settings.bgOpacity);
                    });
                }

                if (settings.bg === 'custom' && settings.bgCustomUrl !== '') {
                    this.loadBgImage(settings.bgCustomUrl, settings.bgOpacity);
                }

                if (settings.font === 'web') {
                    this.loadFont(settings.fontWeb, true);
                }
            }

            // Date
            if (settings.showDate) {
                this.setDate();
            }

            // Check if the clock was already started
            if (this.interval) {
                this.setState({
                    coloursClass : coloursClass,
                    settings     : settings
                });
            } else {
                // Start the clock when we hit the next second
                setTimeout(() => {
                    this.tick();
                    this.interval = setInterval(this.tick, 1000);

                    this.setState({
                        coloursClass : coloursClass,
                        settings     : settings
                    });
                }, 1000 - (Date.now() % 1000));
            }
        });
    }

    tick () {
        var now     = new Date(),
            hour    = now.getHours(),
            minute  = now.getMinutes(),
            second  = now.getSeconds();

        var time = {
            pm     : hour >= 12,
            hour   : TimeHelper.pad(hour),
            minute : TimeHelper.pad(minute),
            second : TimeHelper.pad(second)
        };

        this.setState({
            time : time
        });

        if (hour == 0 && minute == 0 && second == 0) {
            this.setDate();
        }

        if (this.state.settings.colour !== 'solid' && this.state.bgOpacity !== 0) {
            this.tickColour(time);
        }
    }

    tickColour (time) {
        var colour = `#${time.hour}${time.minute}${time.second}`;

        var seconds =
            (parseInt(time.hour, 10) * 60 * 60) +
            (parseInt(time.minute, 10) * 60) +
            (parseInt(time.second, 10));

        switch (this.state.settings.colour) {
            case 'full':
                colour = Colours.secondToHexColour(seconds);
                break;

            case 'hue':
                colour = Colours.secondToHueColour(seconds);
                break;
        }

        this.setState({
            colour : colour
        });
    }

    setDate () {
        this.setState({
            date : new Date().toISOString().split('T')[0]
        });
    }

    loadFont (font, isWeb) {
        WebFont.loadFont(font);

        if (!this.elStyleFont) {
            this.elStyleFont = document.createElement('style');
            document.head.appendChild(this.elStyleFont);
        }

        this.elStyleFont.textContent = font ? `* { font-family: '${font}' !important; }` : '';
    }

    loadBgImage (imgUrl, opacity) {
        this.setState({
            bgImage   : imgUrl,
            bgOpacity : imgUrl ? opacity / 100 : 1
        });
    }

    onClickNewTab () {
        chrome.tabs.update(null, { url: 'chrome-search://local-ntp/local-ntp.html' });
    }

    render (props, state) {
        var settings = state.settings;

        if (Object.keys(settings).length === 0) {
            return <div className={state.coloursClass} />;
        }

        // Background styles
        var bgColourStyle = {
            backgroundColor : state.bgOpacity < 1 ?
                Colours.rgba(state.colour, state.bgOpacity) :
                state.colour
        };

        return (
            <div className={state.coloursClass}>
                { state.bgImage &&
                    <div className='colours__bg_img'
                        style={{ backgroundImage: `url(${state.bgImage})`}} />
                }

                { state.bgOpacity !== 0 &&
                    <div className='colours__bg' style={bgColourStyle} />
                }

                <div className='colours__btns'>
                    { settings.shortcutOpts &&
                        <a target='_blank' className='colours__btn--options'
                            href='options.html' title='Options' />
                    }

                    { settings.shortcutNewTab &&
                        <a className='colours__btn--newtab' title='Default new tab'
                            onClick={this.onClickNewTab} />
                    }

                    { settings.shortcutImage && state.bgImage &&
                        <a target='_blank' className='colours__btn--download'
                            href={state.bgImage} title='Open image' />
                    }
                </div>

                <div className='info'>
                    { settings.showTime &&
                        <Time hourFormat24={settings.time24hr} time={state.time} />
                    }

                    { settings.showDate &&
                        <DateDisplay date={state.date} />
                    }

                    { settings.showHex && state.bgOpacity !== 0 &&
                        <Hex colour={state.colour} />
                    }

                    <Panels />
                </div>

                { settings.ticker && settings.colour !== 'solid' &&
                    <History colour={state.colour} />
                }
            </div>
        );
    }
}

export default NewTab;

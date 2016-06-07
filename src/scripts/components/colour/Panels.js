import classNames from 'classnames';
import React from 'react';

import { Tabs } from '../layout/Tabs';
import { Tab } from '../layout/Tab';

import { Chrome } from '../../modules/chrome';

export class Panels extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      open           : -1,

      showVisited    : true,
      topSites       : [],

      showClosed     : true,
      recentlyClosed : [],

      showDevices    : true,
      devices        : [],

      showApps       : true,
      showAllApps    : true,
      showWebStore   : true,
      apps           : [],

      showShortcuts  : true,
      shortcuts      : [],

      showFavicons   : true
    };

    this.messageListener = this.messageListener.bind(this);
    this.fetchSettings = this.fetchSettings.bind(this);
    this.onClickTab = this.onClickTab.bind(this);
  }

  componentDidMount () {
    this.fetchSettings();

    // Fetch new settings when changed
    chrome.runtime.onMessage.addListener(this.messageListener);
  }

  componentWillUnmount () {
    chrome.runtime.onMessage.removeListener(this.messageListener);
  }

  messageListener (request, sender, sendResponse) {
    if (request.msg === 'saved') {
      this.fetchSettings();
    }
  }

  fetchSettings () {
    Chrome.getSettings()
      .then((settings) => {
        this.setState({
          open          : settings.openPanel,
          showVisited   : settings.panelVisited,
          showClosed    : settings.panelClosed,
          showDevices   : settings.panelDevices,
          showApps      : settings.panelApps,
          showAllApps   : settings.showAllApps,
          showWebStore  : settings.showWebStore,
          showShortcuts : settings.panelShortcuts,
          showFavicons  : settings.showFavicons
        });

        if (settings.panelVisited) {
          Chrome.getTopSites(settings.maxVisited)
            .then((items) => {
              this.setState({
                topSites: items
              });
            });
        }

        if (settings.panelClosed) {
          Chrome.getRecentlyClosed(settings.maxClosed)
            .then((items) => {
              this.setState({
                recentlyClosed: items
              });
            });
        }

        if (settings.panelDevices) {
          Chrome.getDevices()
            .then((items) => {
              this.setState({
                devices: items
              });
            });
        }

        if (settings.panelApps) {
          Chrome.getApps()
            .then((items) => {
              this.setState({
                apps: items
              });
            });
        }

        if (settings.panelShortcuts) {
          Chrome.getShortcuts()
            .then((items) => {
              this.setState({
                shortcuts: items
              });
            });
        }
      });
  }

  onClickTab (tab) {
    Chrome.setSetting('openPanel', tab);

    this.setState({
      open: tab
    });
  }

  onClickSession (session) {
    return () => {
      chrome.sessions.restore(session, null);
    };
  }

  onClickApp (id, href) {
    return () => {
      if (href) {
        chrome.tabs.update(null, { url: href });
      } else {
        chrome.management.launchApp(id);
      }
    };
  }

  onClickShortcut (url) {
    return () => {
      chrome.tabs.update(null, { url: url });
    };
  }

  render () {
    const state = this.state;

    const panelsClass = classNames('panels', {
      'panels--nofavicons': !state.showFavicons
    });

    return (
      <div className={panelsClass}>
        <Tabs onToggle={this.onClickTab} activeTab={state.open} canToggle>
          { state.showVisited &&
            <Tab name='Most visited'>
              <ul className='panels__panel'>
                { state.topSites.map((site, i) => (
                  <li key={i}>
                    <a className={`item-${i}`} title={site.title} href={site.url}
                      style={{ backgroundImage: `url('${site.img}')` }}>
                      {site.title}
                    </a>
                  </li>
                )) }
              </ul>
            </Tab>
          }

          { state.showClosed &&
            <Tab name='Recently closed'>
              <ul className='panels__panel'>
                { (state.recentlyClosed.length === 0) ?
                  <p className='panels__panel__message'>No recently closed sessions</p> :
                  state.recentlyClosed.map((session, i) => (
                    <li key={i} onClick={this.onClickSession(session.session)}>
                      <a className={`item-${i}`} title={session.title}
                        style={{ backgroundImage: `url('${session.img}')` }} >
                        {session.title}
                      </a>
                    </li>
                  ))
                }
              </ul>
            </Tab>
          }

          { state.showDevices &&
            <Tab name='Other devices'>
              <ul className='panels__panel panels__panel--devices'>
                { (state.devices.length === 0) ?
                  <p className='panels__panel__message'>No tabs from other devices</p> :
                  state.devices.map((device, i) => {
                    return (
                      <li key={i} className={`item-${i}`} >
                        <p className='panels__panel--devices__name'>{device.title}</p>
                        <ul>
                          { device.tabs.map((tab, j) => (
                            <li key={j}>
                              <a title={tab.title} href={tab.url}
                                style={{ backgroundImage: `url('${tab.img}')` }} >
                                {tab.title}
                              </a>
                            </li>
                          )) }
                        </ul>
                      </li>
                    );
                  })
                }
              </ul>
            </Tab>
          }

          { state.showApps &&
            <Tab name='Apps'>
              <ul className='panels__panel panels__panel--apps'>
                { state.apps.map((app, i) => {
                  if ((app.id === 'ntp-apps' && !this.state.showAllApps) ||
                    (app.id === 'ntp-webstore' && !this.state.showWebStore)) {
                    return null;
                  }

                  return (
                    <li key={i} onClick={this.onClickApp(app.id, app.href)}>
                      <a className={`item-${i}`}>
                        <img src={app.img} alt={app.title} />
                        <div className='panels__panel--apps__name'>{app.title}</div>
                      </a>
                    </li>
                  );
                }) }
              </ul>
            </Tab>
          }

          { state.showShortcuts &&
            <Tab name='Shortcuts'>
              <ul className='panels__panel'>
                { state.shortcuts.map((shortcut, i) => (
                  <li key={i} onClick={this.onClickShortcut(shortcut.url)}>
                    <a className={`item-${i}`} title={shortcut.title}
                      style={{ backgroundImage: `url('${shortcut.img}')` }} >
                      {shortcut.title}
                    </a>
                  </li>
                )) }
              </ul>
            </Tab>
          }
        </Tabs>
      </div>
    );
  }
}

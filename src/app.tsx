import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { History } from 'history';

import Home from './components/home';

interface Props {
  store: Store<any>;
  history: History;
}

export class App extends React.Component<Props, {}> {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <Home/>
      </Provider>
    );
  }
}

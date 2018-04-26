import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { createBrowserHistory } from 'history';
import { Router, Route, Redirect, Link } from 'react-router-dom';

// import components
import FormMediaUploadComponent from "./components/FormMediaUploadComponent";
import NasaMediaUploadComponent from "./components/NasaMediaUploadComponent";
import MediaListComponent from "./components/MediaListComponent";
import LoaderComponent from 'Components/LoaderComponent';

interface Props {
  store: Store<any>;
  history: History;
}

export class App extends React.Component<Props, {}> {

  render() {
    const { store, history } = this.props;
    const brsHistory = createBrowserHistory();
    return (
      <Provider store={store}>
        <Router history={brsHistory}>
          <div>
            <nav className="navbar navbar-inverse">
              <div className="container-fluid">
                <div className="navbar-header">
                  <a className="navbar-brand" href="#">NFQ React demo | Powered By fireBase / NASA Media Library</a>
                </div>
                <ul className="nav navbar-nav">
                  <li><Link to="/">Add Media file by Form</Link></li>
                  <li><Link to="/nasa">Add Media file from NASA API</Link></li>
                  <li><Link to="/list">View all Items</Link></li>
                </ul>
              </div>
            </nav>
            <hr />
            <div className="container-fluid">
              <Route exact path="/" component={FormMediaUploadComponent} />
              <Route exact path="/nasa" component={NasaMediaUploadComponent} />
              <Route exact path="/list" component={MediaListComponent} />
              <Route exact path="/edit/:id" component={FormMediaUploadComponent} />
              <Route exact path="/loader" component={LoaderComponent} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

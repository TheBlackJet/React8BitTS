import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { History } from 'history';

// import components
import MediaUploadComponent from "./components/MediaUploadComponent";
import MediaListComponent from "./components/MediaListComponent";

interface Props {
  store: Store<any>;
  history: History;
}

export class App extends React.Component<Props, {}> {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <div className="container-fluid">
          <div className="row wrapper">
            <div className="col-4 media-upload-column">
              <MediaUploadComponent />
            </div>
            <div className="col-8 media-list-column">
              <MediaListComponent />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

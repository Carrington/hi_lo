import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import 'rxjs';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store} key="provider">
    <App />
  </Provider>,
  document.getElementById('root')
);

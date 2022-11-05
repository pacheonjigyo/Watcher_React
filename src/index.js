import React from "react";
import ReactDOM from "react-dom";

import promiseFinally from "promise.prototype.finally";

import { HashRouter } from "react-router-dom";
import { useStrict } from "mobx";
import { Provider } from "mobx-react";

import App from "./App";

import statusStore from "./stores/statusStore";
import logsStore from "./stores/logsStore";
import dataStore from "./stores/dataStore";

const stores = {
  statusStore,
  logsStore,
  dataStore,
};

window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
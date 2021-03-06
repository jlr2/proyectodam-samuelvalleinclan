import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import recoilPersist from "recoil-persist";
import "./index.css";
import "./mvp.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const { RecoilPersist, updateState } = recoilPersist([], {
  key: "recoil-persist",
  storage: sessionStorage,
});

ReactDOM.render(
  <RecoilRoot initializeState={updateState}>
    <RecoilPersist />
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);

serviceWorker.unregister();
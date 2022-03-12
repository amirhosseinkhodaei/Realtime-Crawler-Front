import React from "react";
import ReactDOM from "react-dom";
import 'antd/dist/antd.min.css';
// import './index.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/Home/Home";

ReactDOM.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>,
  document.getElementById("root")
);

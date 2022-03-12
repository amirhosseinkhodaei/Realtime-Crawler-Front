import React from "react";
import { Spin } from "antd";

export const Loading = (props) => {
  return (
    <Spin
      className="loading-spinner"
      spinning={props.isLoading}
      // indicator={<i className="fal fa-spinner-third fa-spin"></i>}
    >
      {props.children}
    </Spin>
  );
};

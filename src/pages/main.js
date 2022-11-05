import React from 'react';

import 'antd/dist/antd.css';
import '../App.css';

import { Layout } from 'antd';

const { Content } = Layout;

class main extends React.Component{
  render() {
    return (
      <Content className="App-main" align="center">
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <img src="./favicon.png" width="10%"/>

        <br></br>
        <br></br>

        Watcher v1.0.0
        
        <br></br>

        <a href="/#/dashboard">
          대시보드로 이동
        </a>

      </Content>
    );
  }
}

export default main;
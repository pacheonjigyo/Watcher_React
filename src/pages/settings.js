import React from 'react';

import 'antd/dist/antd.css';
import '../App.css';

import { inject, observer } from "mobx-react";
import { Layout, Input, Modal } from 'antd';

const { Search } = Input;
const { Content } = Layout;

const success = (name, value) => {
  let secondsToGo = 2;

      const modal = Modal.success({
        title: "성공",
        content: name + "이(가) " + value + "으로 설정되었습니다.",
      });

      const timer = setInterval(() => {
        secondsToGo -= 1;
      }, 1000);

      setTimeout(() => {
        clearInterval(timer); 
        
        modal.destroy();
      }, secondsToGo * 1000);
}

@inject("dataStore") @observer
class settings extends React.Component{
  onUpdated = value => {
    this.props.dataStore.updateInterval(value);

    success("업데이트 주기", value);
  }

  onDelayed = value => {
    this.props.dataStore.updateDelayed(value);

    success("지연 판정시간", value);
  }

  render() {
    return (
      <Content className="App-content">
        <Layout className="App-table">
          환경설정

          <br></br>
          <br></br>

          <table align="center">
            <tr>
              <td className="App-td" width="20%">
                업데이트 주기(초): 
              </td>
              
              <td className="App-td">
                <Search
                  placeholder={"기본값: " + this.props.dataStore.interval}
                  allowClear
                  enterButton="저장"
                  size="middle"
                  onSearch={this.onUpdated}
                />
              </td>
            </tr>

            <tr>
              <td className="App-td" width="20%">
                지연시간 최소값(ms): 
              </td>
              
              <td className="App-td">
                <Search
                  placeholder={"기본값: " + this.props.dataStore.delayed}
                  allowClear
                  enterButton="저장"
                  size="middle"
                  onSearch={this.onDelayed}
                />
              </td>
            </tr>
          </table>
        </Layout>
      </Content>
    );
  }
}

export default settings;
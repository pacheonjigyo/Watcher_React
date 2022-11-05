import React from 'react';

import 'antd/dist/antd.css';
import '../App.css';

import { observer, inject } from 'mobx-react'
import { Layout, Table, Input } from 'antd';

const { Search } = Input;
const { Content } = Layout;

var filterValue = null;

@inject("logsStore") @observer
class logs extends React.Component{
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Content className="App-content">
        <Layout className="App-table">
          실시간 로그

          <br></br>
          <br></br>

          <table align="center">
            <tr>
              <td className="App-td" align="center">
                키워드 검색: 
              </td>

              <td className="App-td">
                <Input
                  placeholder="로그 유형"
                  allowClear
                  size="middle"
                  onChange={this.onSearchType}
                />
              </td>

              <td className="App-td">
                <Input
                  placeholder="서버 네임"
                  allowClear
                  size="middle"
                  onChange={this.onSearchName}
                />
              </td>
            </tr>
          </table>

          <br></br>

          <Table className="App-mobile" columns={this.props.logsStore.tablecolumnsmobile.slice()} dataSource={this.props.logsStore.tabledatatemp.slice()} />
          <Table className="App-pc" columns={this.props.logsStore.tablecolumns.slice()} dataSource={this.props.logsStore.tabledatatemp.slice()} />
        </Layout>
      </Content>
    );
  }
  
  onSearchType = (e) => {
    filterValue = e.target.value;

    if(filterValue != null)
      this.props.logsStore.filterListsByType(filterValue);
  }

  onSearchName = (e) => {
    filterValue = e.target.value;

    if(filterValue != null)
      this.props.logsStore.filterListsByName(filterValue);
  }
}

export default logs;
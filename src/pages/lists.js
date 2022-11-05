import React from 'react';

import 'antd/dist/antd.css';
import '../App.css';

import { observer, inject } from 'mobx-react'
import { Layout, Table, Input } from 'antd';

const { Search } = Input;
const { Content } = Layout;

var filterValue = null;

@inject("statusStore") @observer
class lists extends React.Component{
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Content className="App-content">
        <Layout className="App-table">
          서버 현황

          <br></br>
          <br></br>

          <Table className="App-mobile" columns={this.props.statusStore.totaltablecolumnsmobile.slice()} dataSource={this.props.statusStore.totaltabledata.slice()} />
          <Table className="App-pc" columns={this.props.statusStore.totaltablecolumns.slice()} dataSource={this.props.statusStore.totaltabledata.slice()} />

          <br></br>

          <table align="center">
            <tr>
              <td className="App-td" align="center">
                키워드 검색:
              </td>

              <td className="App-td">
                <Input
                  placeholder="서버 네임"
                  allowClear
                  size="middle"
                  onChange={this.onSearchName}
                />
              </td>
              
              <td className="App-td">
                <Input
                  placeholder="IP 주소"
                  allowClear
                  size="middle"
                  onChange={this.onSearchIP}
                />
              </td>
            </tr>
          </table>

          <br></br>

          <Table className="App-mobile" columns={this.props.statusStore.tablecolumnsmobile.slice()} dataSource={this.props.statusStore.tabledatatemp.slice()} />
          <Table className="App-pc" columns={this.props.statusStore.tablecolumns.slice()} dataSource={this.props.statusStore.tabledatatemp.slice()} />
        </Layout>
      </Content>
    );
  }

  onSearchName = (e) => {
    filterValue = e.target.value;

    if(filterValue != null)
      this.props.statusStore.filterListsByName(filterValue);
  }

  onSearchIP = (e) => {
    filterValue = e.target.value;

    if(filterValue != null)
      this.props.statusStore.filterListsByIP(filterValue);
  }
}

export default lists;
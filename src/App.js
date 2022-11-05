import React from "react";

import axios from 'axios';
import https from 'https';
import moment from 'moment-timezone';

import { Switch, Route, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Link } from 'react-router-dom';

import Main from "pages/main";
import Dashboard from "pages/dashboard";
import Logs from "pages/logs";
import Lists from "pages/lists";
import Settings from "pages/settings";
import Laboratory from "pages/test/laboratory";

import 'antd/dist/antd.css';

import { MenuUnfoldOutlined, MenuFoldOutlined, DashboardOutlined, LaptopOutlined, SettingOutlined, BugOutlined} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const ping = [];
const trust = [];

const agent = new https.Agent({
  rejectUnauthorized: true
})

var date;

let events = [0, 0, 0];
let states = [];

var keyLog = 0;
var keyStatus = 0;

@inject("statusStore", "logsStore", "dataStore") @withRouter @observer
export default class App extends React.Component {
  onSearch = value => {
    this.props.statusStore.filterLists(value);
  }

  initiate = () => {
    this.props.statusStore.refresh();
    this.addLists();
  }

  fetchQuotes = async () => {
    const count = [0, 0, 0];

    this.props.statusStore.listUrls.forEach(function(listUrl, index) {
      const date1 = new Date().getTime();

      count[1]++;

      moment.tz.setDefault("Asia/Seoul");
      date = moment().format('YYYY/MM/DD HH:mm:ss');

      this.props.dataStore.updateTime(date);
      this.props.dataStore.updatePie(count[0], count[1], count[2]);

      axios.get(listUrl.api, {httpsAgent : agent})
      .then(res => {
        const date2 = new Date().getTime();

        ping[index] = date2 - date1;

        let temp;

        if(ping[index] > this.props.dataStore.delayed)
        {
          states[index][1]++;

          this.props.statusStore.setListStates(index, 1);

          events[0]++;

          temp = 'images/orange.png';
        }
        else
        {
          count[0]++;
          count[1]--;
          
          states[index][0]++;

          if(listUrl.state > 0)
            this.props.statusStore.setListStates(index, 0);
          else
            this.props.statusStore.setListStates(index, -1);

          if(res.status === 200)
            temp = 'images/green.png';
          else
            temp = 'images/orange.png';
        }

        date = moment().format('YYYY/MM/DD HH:mm:ss');

        trust[index] = Math.round(states[index][0] * 100 / (states[index][0] + states[index][1] + states[index][2]));
        
        this.props.dataStore.updatePie(count[0], count[1], count[2]);

        this.props.statusStore.updateLists(index, listUrl.name, listUrl.ipv4, temp, states, trust, ping, date);
        this.props.statusStore.updateTotalLists(count[0] + count[1] + count[2], count[0], count[1], count[2], (count[0] + count[1]) / (count[0] + count[1] + count[2]))

        if(listUrl.state !== -1)
          this.props.logsStore.addEvents(keyLog++, this.props.statusStore.listTypes[listUrl.state].image, this.props.statusStore.listTypes[listUrl.state].type, listUrl.name, this.props.statusStore.listTypes[listUrl.state].contents, date);
      })
      .catch((e) => {
        const date2 = new Date().getTime();

        ping[index] = date2 - date1;

        count[2]++;
        count[1]--;

        if(ping[index] > 1000 * 15)
          this.props.statusStore.setListStates(index, 4);
        else
        {
          if (e.response)
            this.props.statusStore.setListStates(index, 2);
          else
            this.props.statusStore.setListStates(index, 3);
        }

        states[index][2]++;

        let temp;
        temp = 'images/red.png';

        date = moment().format('YYYY/MM/DD HH:mm:ss');

        trust[index] = Math.round(states[index][0] * 100 / (states[index][0] + states[index][1] + states[index][2]));

        events[2]++;

        this.props.dataStore.updatePie(count[0], count[1], count[2]);

        this.props.statusStore.updateLists(index, listUrl.name, listUrl.ipv4, temp, states, trust, ping, date);
        this.props.statusStore.updateTotalLists(count[0] + count[1] + count[2], count[0], count[1], count[2], (count[0] + count[1]) / (count[0] + count[1] + count[2]))

        if(listUrl.state !== -1)
          this.props.logsStore.addEvents(keyLog++, this.props.statusStore.listTypes[listUrl.state].image, this.props.statusStore.listTypes[listUrl.state].type, listUrl.name, this.props.statusStore.listTypes[listUrl.state].contents, date);
      });
    }.bind(this));

    this.props.dataStore.updateRealtime(this.props.statusStore.listUrls, ping);

    clearInterval(this.timer);

    this.timer = setInterval(() => this.fetchQuotes(), 1000 * this.props.dataStore.interval);
  }

  addLists = () => {
    for(var i = keyStatus; i < this.props.statusStore.listUrls.length; i++)
    {
      states.push([0, 0, 0]);

      ping.push(0);
      trust.push(100);
      
      this.props.dataStore.seriesRealtimeTemp.push({name: this.props.statusStore.listUrls[i].name, data: []});
    
      for(var i = 0; i < this.props.dataStore.seriesRealtimeTemp.length - 1; i++)
        this.props.dataStore.seriesRealtimeTemp[i].data = [];
    
      this.props.dataStore.updateRealtimeSeries(this.props.statusStore.listUrls[i].name);
      this.props.statusStore.addTable(keyStatus);

      keyStatus++;
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.initiate();
      this.fetchQuotes().then(() => this.timer = setInterval(() => this.fetchQuotes(), 1000 * this.props.dataStore.interval));
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <Layout className="App-layout">
        <Header className="App-header" style={{ padding: 0 }}>
          {React.createElement(this.props.dataStore.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "App-trigger",
            onClick: this.props.dataStore.toggle
          })}

          <table>
            <tr>
              <td>
                <a href="/#/main">
                  <img className="App-logo" src="./favicon.png" width="60px"/>
                </a>
              </td>

              <td>
                Watcher
              </td>
            </tr>
          </table>

          <Layout className="App-header" align="right">
            <table width="97%" align="right">
              <tr align="right">
                <td>
                  * {this.props.dataStore.updated}에 업데이트됨
                </td>
              </tr>
            </table>
          </Layout>
        </Header>

        <Layout>
          <Sider collapsedWidth="0px" trigger={null} collapsible collapsed={this.props.dataStore.collapsed}>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                  대시보드
                  <Link to="/dashboard" />
              </Menu.Item>

              <Menu.Item key="lists" icon={<LaptopOutlined />}>
                  서버 현황
                  <Link to="/lists" />
              </Menu.Item>

              <SubMenu key="settings" icon={<SettingOutlined />} title="환경설정">
                  <Menu.Item key="5">
                      실시간 로그
                      <Link to="/logs" />
                  </Menu.Item>
                  
                  <Menu.Item key="6">
                      환경설정
                      <Link to="/settings" />
                  </Menu.Item>
              </SubMenu>

              {/* <Menu.Item key="laboratory" icon={<BugOutlined />}>
                  실험실
                  <Link to="/test/laboratory" />
              </Menu.Item> */}
            </Menu>
          </Sider>

          <Switch>
            <Route path="/main" component={Main} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/logs" component={Logs} />
            <Route path="/lists" component={Lists} />
            <Route path="/settings" component={Settings} />
            <Route path="/test/laboratory" component={Laboratory} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </Layout>
      </Layout>
    );
  }
}
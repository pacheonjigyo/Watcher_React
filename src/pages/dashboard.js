import React from 'react';

import 'antd/dist/antd.css';
import '../App.css';

import { observer, inject } from 'mobx-react'
import { Layout } from 'antd';

import ReactApexChart from "react-apexcharts";

const { Content } = Layout;

@inject("dataStore") @observer
class dashboard extends React.Component{
  render() {
    return (
      <Content className="App-content">
        <table className="App-chart">
          <tr>
            <td className="App-td">
              <Layout className="App-sublayout">
                <div align='left'>좋음</div>

                <ReactApexChart options={this.props.dataStore.optionsPie} series={this.props.dataStore.seriesPie1.slice()} type="donut" align="center" width={300} height={300}/>
              </Layout>
            </td>

            <td className="App-td">
              <Layout className="App-sublayout">
                <div align='left'>보통</div>

                <ReactApexChart options={this.props.dataStore.optionsPie} series={this.props.dataStore.seriesPie2.slice()} type="donut" align="center" width={300} height={300}/>
              </Layout>
            </td>

            <td className="App-td">
              <Layout className="App-sublayout">
                <div align='left'>나쁨</div>

                <ReactApexChart options={this.props.dataStore.optionsPie} series={this.props.dataStore.seriesPie3.slice()} type="donut" align="center" width={300} height={300}/>
              </Layout>
            </td>
          </tr>

          <tr>
            <td className="App-td" colspan="3">
              <Layout className="App-sublayout">
                <div align='left'>지연시간</div>
                <ReactApexChart options={this.props.dataStore.optionsRealtime} series={this.props.dataStore.seriesRealtime.slice()} type="line" align="center" width="90%" height={300}/>
              </Layout>
            </td>
          </tr>
        </table>
      </Content>
    );
  }
}

export default dashboard;
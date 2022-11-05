import React from "react";
import moment from 'moment-timezone';
import ApexCharts from "apexcharts";

import { observable, action } from 'mobx';

class dataStore extends React.Component {

  @observable seriesPie1;
  @observable seriesPie2;
  @observable seriesPie3;
  @observable seriesRealtime;

  @observable interval;
  @observable collapsed;
  @observable delayed;
  @observable updated;

  constructor(props) {
    super(props);

    moment.tz.setDefault("Asia/Seoul");

    this.interval = 15,
    this.delayed = 5000,
    this.updated = '0000/00/00 00:00:00',

    this.collapsed = true,

    this.seriesPie1 = [0, 0, 0, 0],
    this.seriesPie2 = [0, 0, 0, 0],
    this.seriesPie3 = [0, 0, 0, 0],

    this.seriesRealtime = [],
    this.seriesRealtimeTemp = [],

    this.optionsPie = {
      labels: ['합계', '합계', '합계', '합계'],
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: false
              },
              value: {
                show: true,
                showAlways: true,
                fontSize: '80px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 700,
                color: '#373d3f',
                offsetY: 30,
                formatter: function (val) {
                  return val
                }
              },
              total: {
                show: true
              }
            }
          },      
        }
      }
    }
    
    this.optionsRealtime = {
      chart: {
        id: "realtime",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        range: 10
      },
      yaxis: {
        show: false,
      },
      legend: {
        show: true
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        x: {
          show: false,
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            return '*지연시간(ms) = 응답시간 - 요청시간'
          },
        },
        y: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            return value + 'ms'
          },
        },
        marker: {
          show: true,
        },
      }
    }
  }

  @action toggle = () => {
    this.collapsed = !this.collapsed;
  }

  @action updatePie(count1, count2, count3) {
    this.seriesPie1 = [0, count1, 0, 0];
    this.seriesPie2 = [0, 0, count2, 0];
    this.seriesPie3 = [0, 0, 0, count3];
  }

  @action updateRealtime(listUrls, trust) {
    const x = Math.floor(new Date().getTime() / (this.interval * 1000));
    
    for(var i = 0; i < listUrls.length; i++)
    {
      this.seriesRealtimeTemp[i].name = listUrls[i].name;
      this.seriesRealtimeTemp[i].data.push({x: x, y: trust[i]});

      this.seriesRealtime[i].name = this.seriesRealtimeTemp[i].name;
      this.seriesRealtime[i].data = this.seriesRealtimeTemp[i].data;

      if(this.seriesRealtime[i].data.length >= 20)
      {
        this.seriesRealtimeTemp[i].data = this.cutRealtime(i);
        this.seriesRealtime[i].data = this.seriesRealtimeTemp[i].data;
      }
    }

    ApexCharts.exec("realtime", "updateSeries", this.seriesRealtime.slice());
  }

  @action updateRealtimeSeries(name) {
    this.seriesRealtime.push({name: name, data: []});
  }

  @action updateInterval(value) {
    this.interval = value;
  }

  @action updateDelayed(value) {
    this.delayed = value;
  }

  @action updateTime(value) {
    this.updated = value;
  }

  cutRealtime(i) {
    return this.seriesRealtimeTemp[i].data.slice(this.seriesRealtimeTemp[i].data.length - 10, this.seriesRealtimeTemp[i].data.length);
  }
}

export default new dataStore();
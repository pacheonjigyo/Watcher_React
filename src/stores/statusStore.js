import React from "react";
import axios from 'axios';
import https from 'https';

import { observable, action } from 'mobx';

import { EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { observer } from "mobx-react";

const agent = new https.Agent({
  rejectUnauthorized: true
})

@observer
class statusStore extends React.Component {

  @observable tabledata;
  @observable tabledatatemp;
  @observable totaltabledata;

  @observable tablecolumns;
  @observable totaltablecolumns;
  @observable totaltablecolumnsmobile;

  constructor(props) {
    super(props);

    this.listUrls = [],
    this.refresh();

    this.listTypes = [
      {
        type: "통신 복구",
        contents: "서버로부터 응답을 정상적으로 받았습니다.",
        image: "images/green.png"
      },
      {
        type: "네트워크 지연",
        contents: "서버로부터 응답이 지연되었습니다.",
        image: "images/orange.png"
      },
      {
        type: "응답 없음",
        contents: "서버가 응답하지 않습니다.",
        image: "images/red.png"
      },
      {
        type: "연결 실패",
        contents: "인터넷 또는 호스트를 찾을 수 없습니다.",
        image: "images/red.png"
      },
      {
        type: "타임아웃",
        contents: "서버로부터 응답 시간이 초과되었습니다.",
        image: "images/orange.png"
      }
    ],

    this.tabledata = [],
    this.tabledatatemp = [],

    this.totaltabledata = [
      {
        key: 0,
        total: 0,
        good: 0,
        soso: 0,
        bad: 0,
        ability: 0,
      }
    ],

    this.totaltablecolumns = [
      {
        title: '전체 서버',
        dataIndex: 'total',
        key: 'total',

        align: 'center',
      },
      {
        title: '정상 가동',
        dataIndex: 'good',
        key: 'good',

        align: 'center',
      },
      {
        title: '응답 지연',
        dataIndex: 'soso',
        key: 'soso',

        align: 'center',
      },
      {
        title: '응답 없음',
        dataIndex: 'bad',
        key: 'bad',

        align: 'center',
      },
      {
        title: '가동률',
        dataIndex: 'ability',
        key: 'ability',
        render: text => text + "%",

        align: 'center',
      },
    ]

    this.tablecolumns = [
      {
        title: '번호',
        dataIndex: 'key',
        key: 'key',
        render: text => text + 1,

        align: 'center',
      },
      {
        title: '서버 네임',
        dataIndex: 'name',
        key: 'name',

        align: 'left',
      },
      {
        title: 'IP 주소',
        dataIndex: 'address',
        key: 'address',

        align: 'left',
      },

      {
        title: '누적 요청량(성공/지연/실패)',
        dataIndex: 'states',
        key: 'states',
        render: text => (text[0] + text[1] + text[2]) + "(" + text[0] + "/" + text[1] + "/" + text[2] + ")",

        align: 'center',
      },

      {
        title: '신뢰도',
        dataIndex: 'trust',
        key: 'trust',
        render: text => text + "%",

        align: 'center',
      },
      {
        title: '응답한 시간',
        dataIndex: 'updated',
        key: 'updated',

        align: 'center',
      },
      {
        title: '지연시간',
        dataIndex: 'delayed',
        key: 'delayed',

        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'image',
        key: 'image',
        render: text => <img src={text} width="20px" height="20px"/>,

        align: 'center',
      },
    ]

    this.totaltablecolumnsmobile = [
      {
        title: '전체',
        dataIndex: 'total',
        key: 'total',

        align: 'center',
      },
      {
        title: '가동률',
        dataIndex: 'ability',
        key: 'ability',
        render: text => text + "%",

        align: 'center',
      },
    ]

    this.tablecolumnsmobile = [
      {
        title: '서버 네임',
        dataIndex: 'name',
        key: 'name',

        align: 'left',
      },
      {
        title: '상태',
        dataIndex: 'image',
        key: 'image',
        render: text => <img src={text} width="20px" height="20px"/>,

        align: 'right',
      },
    ]

    this.tablecolumnsmain = [
      {
        title: '서버 네임',
        dataIndex: 'name',
        key: 'name',

        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'image',
        key: 'image',
        render: text => <img src={text} width="20px" height="20px"/>,

        align: 'center',
      },
      {
        title: '수정 및 삭제',
        dataIndex: 'key',
        key: 'key',
        render: text =>
          <div>
            <Tooltip title="수정">
              <Button type="primary" onClick={() => this.editLists(text)} icon={<EditOutlined />}/>
            </Tooltip>

            &nbsp;

            <Tooltip title="삭제">
              <Button type="primary" onClick={() => this.deleteLists(text)} icon={<MinusCircleOutlined />}/>
            </Tooltip>
          </div>,

        align: 'center',
      }
    ]
  }

  @action refresh() {
    fetch("/data.json")
    .then(res => res.json())
    .then(res => {
      this.listUrls = res;
    });
  }

  @action addTable(key) {
    this.tabledata.push({
      key: key,
      name: '-',
      address: '-',
      image: 'images/orange.png',
      states: [0, 0, 0],
      trust: 0,
      delayed: '-',
      updated: '-'
    });

    this.tabledatatemp = this.tabledata;
  }

  @action updateTotalLists(total, good, soso, bad, ability) {
    this.totaltabledata = [
      {
        key: 0,
        total: total,
        good: good,
        soso: soso,
        bad: bad,
        ability: ability * 100
      }
    ]
  }

  @action updateLists(index, name, address, temp, states, trust, ping, date) {
    this.tabledata[index] = {
        key: index,
        name: name,
        address: address,
        image: temp,
        states: states[index],
        trust: trust[index],
        delayed: ping[index] + 'ms',
        updated: date
    }
  }

  @action editLists(index) {
    this.tabledata[index] = {
      key: index,
      name: 'name',
      address: 'address',
      image: 'temp',
      states: 0,
      trust: 0,
      delayed: 0 + 'ms',
      updated: 'date'
    }

    this.listUrls[index] = {
      key: index,
      name: "name", 
      api: "api", 
      state: -1, 
      web: "web", 
      ipv4: "ipv4"
    };

    this.tabledatatemp[index] = this.tabledata[index];
  }

  @action setListStates(index, value) {
    this.listUrls[index].state = value;
  }

  @action deleteLists(index) {
    this.tabledata = this.tabledata.filter(item => item.key !== index);
    this.tabledatatemp = this.tabledata;

    this.listUrls = this.listUrls.filter(item => item.key !== index);
  }

  @action saveData = (key, name, api, state, web, ipv4) => {
    axios.post("http://localhost:3001/api/lists", {
      key: key,
      name: name,
      api: api,
      state: state,
      web: web,
      ipv4: ipv4
    }, {httpsAgent : agent})
    .then(res => {
    })
    .catch((e) => {
    });
  }

  @action filterListsByName(value) {
    if(this.tabledatatemp !== null && value !== null)
      this.tabledatatemp = this.tabledata.filter(item => item.name.includes(value));
  }

  @action filterListsByIP(value) {
    if(this.tabledatatemp !== null && value !== null)
      this.tabledatatemp = this.tabledata.filter(item => item.address.includes(value));
  }
}

export default new statusStore();
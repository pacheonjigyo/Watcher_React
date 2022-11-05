import React from "react";
import { observable, action } from 'mobx';

class logsStore extends React.Component {

  @observable tabledata;
  @observable tablecolumns;
  @observable tabledatatemp;

  constructor(props) {
    super(props);

    this.tabledata = [],
    this.tabledatatemp = [],

    this.tablecolumns = [
      {
        title: '구분',
        dataIndex: 'image',
        key: 'image',
        render: text => <img src={text} width="20px" height="20px"/>,

        align: 'center',
      },
      {
        title: '로그 유형',
        dataIndex: 'type',
        key: 'type',

        align: 'center',
      },
      {
        title: '서버 네임',
        dataIndex: 'name',
        key: 'name',

        align: 'center',
      },
      {
        title: '내용',
        dataIndex: 'contents',
        key: 'contents',

        align: 'left',
      },
      {
        title: '일시',
        dataIndex: 'updated',
        key: 'updated',

        align: 'center',
      },
    ]

    this.tablecolumnsmobile = [
      {
        title: '로그 유형',
        dataIndex: 'type',
        key: 'type',

        align: 'center',
      },
      {
        title: '일시',
        dataIndex: 'updated',
        key: 'updated',

        align: 'center',
      },
    ]
  }

  @action addEvents(key, image, type, name, contents, date) {
    this.tabledata.push({
      key: key,
      image: image,
      type: type,
      name: name,
      contents: contents,
      updated: date
    });

    this.tabledatatemp = this.tabledata;
  }

  @action filterListsByType(value) {
    if(this.tabledatatemp !== null && value !== null)
      this.tabledatatemp = this.tabledata.filter(item => item.type.includes(value));
  }

  @action filterListsByName(value) {
    if(this.tabledatatemp !== null && value !== null)
      this.tabledatatemp = this.tabledata.filter(item => item.name.includes(value));
  }
}

export default new logsStore();
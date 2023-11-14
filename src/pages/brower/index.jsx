import React, { Component } from 'react';
import { Layout, Input, Col, Row, Card, Modal, Tabs, Table, Button } from 'antd';
import PageLayout from '@/components/pageLayout';
import { RightOutlined } from '@ant-design/icons';
import LineEcharts from '../../components/Echarts/LineEcharts';
import { withTranslation } from 'react-i18next';
import request from '@/utils/request';
import './index.less';
import './locale';

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
// const { t } = useTranslation('brower');
let timer = null;
class Brower extends Component {
  state = {
    data: {
      x: ['2022-07-10', '2022-07-11', '2022-07-12', '2022-07-13', '2022-07-14', '2022-07-15', '2022-07-16', '2022-07-17', '2022-07-18', '2022-07-19'],
      y: [35000, 37708, 28789, 39922, 30000, 36725, 38790, 38789, 34230, 33023],
    },
    result: '',
    dataParams: '',
    isModalVisible: false,
    keyData: [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ],
    keyData_1: [],
  };

  componentDidMount() {
    this.getContacrtFunction();
    this.getLineChartFunction();
    this.func();
    this.onTableData();
  }

  func = () => {
    let that = this;
    timer = setInterval(() => {
      that.getContacrtFunction();
      that.getLineChartFunction();
      that.onTableData();
    }, 3000);
  };

  componentWillUnmount() {
    clearInterval(timer);
  }

  getContacrtFunction() {
    request(`/api/n9e/xuperchain/contract/count?chain_name=xuper`, {
      method: 'GET',
    }).then((res) => {
      // console.log(res);
      this.setState({
        dataParams: res.dat,
      });
    });
  }

  getLineChartFunction() {
    request(`/api/n9e/xuperchain/tx/line/chart`, {
      method: 'GET',
    }).then((res) => {
      // console.log(res);
      let data = {
        x: res.dat.data,
        y: res.dat.counts,
      };
      this.setState({
        data: data,
      });
    });
  }

  onSearchShow(e) {
    this.onSearch(e);
  }

  onSearch(e) {
    let data = {
      chain_name: 'xuper',
      input: e,
    };
    request(`/api/n9e/xuperchain/tx/query?chain_name=${data.chain_name}&input=${data.input}`, {
      method: 'GET',
    }).then((res) => {
      // console.log(res);
      this.setState({
        result: res.dat,
        isModalVisible: true,
      });
    });
  }

  onTableData() {
    request(`/api/n9e/xuperchain/tx/history`, {
      method: 'GET',
    }).then((res) => {
      console.log(res, '-----res-----');
      let blocks = res.dat.blocks.map((item) => {
        item.key = item.block_id;
        return item;
      });
      let txs = res.dat.txs.map((item) => {
        item.key = item.tx_id;
        return item;
      });
      this.setState({
        keyData: blocks,
        keyData_1: txs,
      });
    });
  }

  render() {
    const { t } = this.props;
    const { data, result, dataParams, isModalVisible, keyData, keyData_1 } = this.state;
    const columns = [
      {
        title: t('bottom.altitude'),
        dataIndex: 'block_height',
        key: 'block_height',
        render: (text) => (
          <a
            onClick={() => {
              this.onSearch(text);
            }}
          >
            {text}
          </a>
        ),
      },
      {
        title: t('bottom.volumeTransaction'),
        dataIndex: 'tx_number',
        key: 'tx_number',
        render: (text) => <span>{text}</span>,
      },
      {
        title: t('bottom.time'),
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (text) => <span>{text}</span>,
      },
      {
        title: t('bottom.blockHash'),
        dataIndex: 'block_id',
        key: 'block_id',
        render: (text) => (
          <a
            onClick={() => {
              this.onSearch(text);
            }}
          >
            {text}
          </a>
        ),
      },
    ];
    const columns_1 = [
      {
        title: t('bottom.initiator'),
        dataIndex: 'from_address',
        key: 'from_address',
        render: (text) => <span>{text ? text[0] : ''}</span>,
      },
      {
        title: t('bottom.receiver'),
        dataIndex: 'to_addresses',
        key: 'to_addresses',
        render: (text) => <span>{text ? text[0] : ''}</span>,
      },
      {
        title: t('bottom.time'),
        dataIndex: 'date',
        key: 'date',
        render: (text) => <span>{text}</span>,
      },
      {
        title: t('bottom.transactionHash'),
        dataIndex: 'tx_id',
        key: 'tx_id',
        render: (text) => (
          <a
            onClick={() => {
              this.onSearch(text);
            }}
          >
            {text}
          </a>
        ),
      },
    ];
    return (
      <>
        <PageLayout title={t('title')}>
          <Layout>
            <Header className='header'>
              <Search
                placeholder={t('placeholder')}
                size='large'
                onSearch={(e) => {
                  this.onSearch(e);
                }}
                style={{ width: 600, height: '100px', marginTop: '60px' }}
              />
            </Header>
            <Content className='Content'>
              <Row>
                <Col span={12} className='rowleft'>
                  <Row className='rowleftRow'>
                    <Col span={24} className='rowleftTop'>
                      <div>
                        <p>{t('left.blockHt')}</p>
                        <p className='textNum'>{dataParams.height}</p>
                      </div>
                      <div>
                        <p>{t('left.totalTransaction')}</p>
                        <p className='textNum'>{dataParams.tx_counts}</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className='rowleftCenterRow'>
                    <Col span={12}>
                      <p>{t('left.contractNumber')}</p>
                      <p className='textNum'>
                        {dataParams.count}
                        {t('pcs')}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>{t('left.nodeNum')}</p>
                      <p className='textNum'>
                        {dataParams.node_sum}
                        {t('pcs')}
                      </p>
                    </Col>
                  </Row>
                  <Row className='rowleftRightRow'>
                    <Col span={12}>
                      <p>{t('left.blockingTime')}</p>
                      <p className='textNum'>3{t('s')}</p>
                    </Col>
                    <Col span={12}>
                      <p>{t('left.concurrentPeak')}</p>
                      <p className='textNum'>
                        356{t('strokes')}/{t('s')}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className='rowright'>
                  <LineEcharts data={data} yname={t('numTransaction')} />
                </Col>
              </Row>
            </Content>

            <Tabs
              defaultActiveKey='1'
              onChange={() => {
                // this.onChange();
              }}
              style={{ backgroundColor: '#ffffff', padding: '10px' }}
              size='large'
            >
              <TabPane tab={t('bottom.newBlock')} key='1'>
                <Table columns={columns} dataSource={keyData} pagination={false} size='large' />
              </TabPane>
              <TabPane tab={t('bottom.newTransaction')} key='2'>
                <Table columns={columns_1} dataSource={keyData_1} pagination={false} size='large' />
              </TabPane>
            </Tabs>

            <Modal
              footer={[
                <Button
                  onClick={() => {
                    this.setState({ isModalVisible: false });
                  }}
                >
                  关闭
                </Button>,
              ]}
              title={t('popup.title')}
              width='80%'
              visible={isModalVisible}
              onOk={() => {
                this.setState({ isModalVisible: false });
              }}
              onCancel={() => {
                this.setState({ isModalVisible: false });
              }}
            >
              {result ? <div className='line'></div> : ''}
              {/* 交易 */}
              <>
                {result.transaction ? (
                  <>
                    <Footer className='Footer' style={{ fontSize: '12px' }}>
                      <h5>{t('popup.subTitle2')}</h5>
                      <div>{t('popup.abstract')}</div>
                      <Row gutter={16} className='CardgutterRow'>
                        <Col span={12}>
                          <Card bordered={false} className='Cardgutter'>
                            <p className='block'>
                              <span>{t('popup.transactionType')}</span>
                              <span>{result.transaction.coinbase ? t('normal') : t('pact')}</span>
                            </p>
                            <p className='block'>
                              <span>{t('popup.transactionHash')}</span>
                              <span
                                className='urlclick'
                                onClick={() => {
                                  this.onSearchShow(result.transaction.tx_id);
                                }}
                              >
                                {result.transaction.tx_id}
                              </span>
                            </p>
                            <p className='block'>
                              <span>{t('left.blockHt')}</span>
                              {result.transaction.block_height}
                            </p>
                            <p className='block'>
                              <span>{t('popup.blockingTime')}</span>
                              {result.transaction.block_timestamp}
                            </p>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card bordered={false} className='Cardgutter'>
                            <p className='block'>
                              <span>{t('popup.transactionInitiationTime')}</span>
                              {result.transaction.date}
                            </p>
                            <p className='block'>
                              <span>{t('popup.initiationAmount')}</span>
                              {result.transaction.from_total}
                            </p>
                            <p className='block'>
                              <span>{t('popup.receiveAmount')}</span>
                              {result.transaction.to_total}
                            </p>
                            <p className='block'>
                              <span>{t('popup.handlingCharge')}</span>
                              {result.transaction.fee}
                            </p>
                          </Card>
                        </Col>
                      </Row>
                    </Footer>
                    <Footer className='Footer'>
                      <div>{t('popup.trading')}</div>
                      {result.transaction.to_addresses
                        ? result.transaction.to_addresses.map((items) => {
                            return (
                              <Row gutter={16} className='CardgutterRow'>
                                <Col span={11}>
                                  <Card bordered={false} className='Cardgutter'>
                                    <p className='block'>
                                      <span>{t('bottom.initiator')}</span>
                                      {result.transaction.from_address ? result.transaction.from_address : ''}
                                    </p>
                                  </Card>
                                </Col>
                                <Col span={2} className='colrightoutline'>
                                  <RightOutlined className='RightOutlined' />
                                </Col>
                                <Col span={11}>
                                  <Card bordered={false} className='Cardgutter'>
                                    <p className='block toblock'>
                                      <span>{t('bottom.receiver')}</span>
                                      {items}
                                    </p>
                                  </Card>
                                </Col>
                              </Row>
                            );
                          })
                        : ''}
                    </Footer>
                  </>
                ) : (
                  ''
                )}
              </>

              {/* 块 */}
              <>
                {result.block ? (
                  <>
                    <Footer className='Footer FooterModel' style={{ fontSize: '12px' }}>
                      <h5>{t('popup.subTitle')}</h5>
                      <div>{t('popup.abstract')}</div>
                      <Row gutter={16} className='CardgutterRow'>
                        <Col span={12}>
                          <Card bordered={false} className='Cardgutter'>
                            <p className='block'>
                              <span>{t('left.blockHt')}</span>
                              {result.block.block_height}
                            </p>
                            <p className='block'>
                              <span>{t('popup.ordinaryTransNun')}</span>
                              {result.block.tx_number}
                            </p>
                            <p className='block'>
                              <span>{t('popup.broadcaster')}</span>
                              {result.block.miner}
                            </p>
                            <p className='block'>
                              <span>{t('bottom.time')}</span>
                              {result.block.timestamp}
                            </p>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card bordered={false} className='Cardgutter'>
                            <p className='block'>
                              <span>{t('bottom.blockHash')}</span>
                              {result.block.block_id}
                            </p>
                            <p className='block'>
                              <span>{t('popup.prevBlockHashe')}</span>
                              <span
                                className='urlclick'
                                onClick={() => {
                                  this.onSearchShow(result.block.pre_hash);
                                }}
                              >
                                {result.block.pre_hash}
                              </span>
                            </p>
                            <p className='block'>
                              <span>{t('popup.latterBlockHashe')}</span>
                              <span
                                className='urlclick'
                                onClick={() => {
                                  this.onSearchShow(result.block.next_hash);
                                }}
                              >
                                {result.block.next_hash}
                              </span>
                            </p>
                          </Card>
                        </Col>
                      </Row>
                    </Footer>
                    <Footer className='Footer'>
                      <div>{t('popup.trading')}</div>
                      <Row gutter={16} className='CardgutterRow'>
                        <Col span={12}>
                          <Card bordered={false} className='Cardgutter'>
                            {result.block.txs
                              ? result.block.txs.map((items) => {
                                  return (
                                    <p className='block'>
                                      <span>{t('popup.tradingNum')}：</span>{' '}
                                      <span
                                        className='urlclick'
                                        onClick={() => {
                                          this.onSearchShow(items);
                                        }}
                                      >
                                        {items}
                                      </span>
                                    </p>
                                  );
                                })
                              : ''}
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card bordered={false} className='Cardgutter'>
                            {/* <p className="block"><span>手续费</span>0</p>
                                                <p className="block"><span>接收方</span>ZJRX8iqEraWuKAZC4Kf7y28uF1saEAgxf</p>
                                                <p className="block"><span>总金额</span>0</p> */}
                          </Card>
                        </Col>
                      </Row>
                    </Footer>
                  </>
                ) : (
                  ''
                )}
              </>
            </Modal>
          </Layout>
        </PageLayout>
      </>
    );
  }
}

export default withTranslation('brower')(Brower);

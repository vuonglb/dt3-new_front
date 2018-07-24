import React, { Component } from 'react'
import { Row, Col, Input } from 'antd'
import {
  InputNumber,
  Form,
  Collapse,
  Icon,
  Steps,
  Button,
  DatePicker,
  Select,
  Table,
  Tabs,
  Divider,
  message,
  AutoComplete,
} from 'antd'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'

import TestFabricProcessView from './testfabricprocess'
import axios from '../../../axiosInst' //'../../../../../axiosInst'

import { formItemLayout, tailFormItemLayout } from '../../Common/FormStyle'

import moment from 'moment'
import _ from 'lodash'

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane

const FORMAT_SHORT_DATE = 'MM/DD/YYYY'
const FORMAT_LONG_DATE = 'MM/DD/YYYY HH:mm:ss'
const button_size = 'small'

const fabric_type_get_link = 'api/fabric/type/get'
const fabric_color_get_link = 'api/fabric/color/get'
const fabric_import_getsearch_link = 'api/fabric/import/get'

class TestFabricListView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      fabrictype_data: [],
      fabricolor_data: [],
      status_data: [],
      fabricimport_data: [],
      import_row_selected: {},
      import_row_selected_details: [],
      select_size: 'small',

      show_detail: false,
    }
  }

  componentDidMount = () => {
    this.load_fabricolor_data()
    this.load_fabrictype_data()
  }

  showHideDetail = () => {
    const { show_detail } = this.state
    this.setState({ show_detail: !show_detail })
  }

  buttonDoneClick = () => {
    message.success('Processing complete!')
    const { show_detail } = this.state
    this.setState({ show_detail: !show_detail })
  }

  load_fabrictype_data = () => {
    axios
      .get(fabric_type_get_link, { params: {} })
      .then(res => {
        let data = res.data
        let children = []
        let data_uni = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].fabrictype_name) {
            if (data_uni.indexOf(data[i].fabrictype_name) === -1) {
              children.push(
                <Option key={data[i].fabrictype_name}> {data[i].fabrictype_name} </Option>,
              )
              data_uni.push(data[i].fabrictype_name)
            }
          }
        }
        this.setState({ fabrictype_data: data_uni })
      })
      .catch(err => {
        console.log(err)
        this.setState({ fabrictype_data: [] })
      })
  }

  load_fabricolor_data = () => {
    axios
      .get(fabric_color_get_link, { params: {} })
      .then(res => {
        let colors = res.data
        let colors_grid = []
        let data_uni = []
        for (let i = 0; i < colors.length; i++) {
          if (colors[i].fabriccolor_name) {
            if (data_uni.indexOf(colors[i].fabriccolor_name) === -1) {
              colors_grid.push(
                <Option key={colors[i].fabriccolor_name}> {colors[i].fabriccolor_name}</Option>,
              )
              data_uni.push(colors[i].fabriccolor_name)
            }
          }
        }
        this.setState({ fabricolor_data: data_uni })
      })
      .catch(err => {
        this.setState({ fabricolor_data: [] })
      })
  }

  load_for_search_data = searchinfo => {
    console.log('call search')
    axios
      .get(fabric_import_getsearch_link, { params: searchinfo })
      .then(res => {
        this.setState({ fabricimport_data: res.data })
      })
      .catch(err => {
        console.log(err)
        this.setState({ fabrictype_data: [] })
      })
  }

  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (values.from_date) {
        values.from_date = values.from_date.format('YYYY-MM-DD')
      }

      if (values.to_date) {
        let todate = moment(values.to_date).add(1, 'days')
        values.to_date = todate.format('YYYY-MM-DD')
      }
      this.load_for_search_data(values)
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        key: 'declare_date',
        dataIndex: 'declare_date',
        title: 'STK DATE',
        name: 'STK DATE',
        render: (text, row) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_SHORT_DATE)}</span>
        ),
      },
      { key: 'invoice_no', dataIndex: 'invoice_no', title: 'STK', name: 'STK' },
      {
        key: 'create_date',
        dataIndex: 'create_date',
        title: 'CREATE DATE',
        name: 'CREATE DATE',
        render: (text, row) => (
          <span>{text === null ? '' : moment(new Date(text)).format(FORMAT_LONG_DATE)}</span>
        ),
      },
      {
        key: 'record_status',
        dataIndex: 'record_status',
        title: 'STATUS',
        name: 'STATUS',
        render: (text, row, index) => {
          if (text === 'O') {
            return 'Chưa kiểm'
          }
          if (text === 'P') {
            return 'Đang kiểm'
          }
          if (text === 'Q') {
            return 'Đã kiểm xong'
          }
          return 'Không xác định'
        },
      },
    ]
    const { fabrictype_data, current } = this.state
    const select_size = 'small'

    return (
      <div>
        {this.state.show_detail === true ? (
          <TestFabricProcessView
            data={this.state.import_row_selected}
            buttonBackClick={this.showHideDetail}
            buttonDoneClick={this.buttonDoneClick}
          />
        ) : (
          <div>
            <Row>
              <Collapse defaultActiveKey={['1']} className="ant-advanced-search-panel-collapse">
                <Panel header="Search" key="1">
                  <Form>
                    <Row gutter={2}>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                        xl={{ span: 8 }}
                      >
                        <FormItem {...formItemLayout} label="Stk">
                          {getFieldDecorator('invoice_no', {}, {})(<Input />)}
                        </FormItem>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                        xl={{ span: 8 }}
                        style={{ textAlign: 'left' }}
                      >
                        <FormItem {...formItemLayout} label="Type ">
                          {getFieldDecorator('fabric_type', {})(
                            <AutoComplete
                              style={{ width: '100%' }}
                              placeholder="type"
                              dataSource={this.state.fabrictype_data}
                              filterOption={(inputValue, option) =>
                                option.props.children
                                  .toUpperCase()
                                  .indexOf(inputValue.toUpperCase()) !== -1
                              }
                            />,
                          )}
                        </FormItem>
                      </Col>

                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                        xl={{ span: 8 }}
                        style={{ textAlign: 'left' }}
                      >
                        <FormItem {...formItemLayout} label="Color ">
                          {getFieldDecorator('fabric_color', {})(
                            <AutoComplete
                              style={{ width: '100%' }}
                              placeholder="color"
                              dataSource={this.state.fabricolor_data}
                              filterOption={(inputValue, option) =>
                                option.props.children
                                  .toUpperCase()
                                  .indexOf(inputValue.toUpperCase()) !== -1
                              }
                            />,
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={2}>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                        xl={{ span: 8 }}
                        style={{ textAlign: 'left' }}
                      >
                        <FormItem {...formItemLayout} label="From Import Date ">
                          {getFieldDecorator('from_date', {}, {})(
                            <DatePicker format={FORMAT_SHORT_DATE} style={{ width: '100%' }} />,
                          )}
                        </FormItem>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                        xl={{ span: 8 }}
                        style={{ textAlign: 'left' }}
                      >
                        <FormItem {...formItemLayout} label="To Import Date ">
                          {getFieldDecorator('to_date', {}, {})(
                            <DatePicker format={FORMAT_SHORT_DATE} style={{ width: '100%' }} />,
                          )}
                        </FormItem>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                        xl={{ span: 8 }}
                        style={{ textAlign: 'left' }}
                      >
                        <FormItem {...formItemLayout} label="Status">
                          {getFieldDecorator('record_status', {}, {})(<Input />)}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={2}>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                        xl={{ span: 8 }}
                      >
                        <FormItem {...tailFormItemLayout}>
                          <Button
                            icon="search"
                            style={{ backgroundColor: '#0190FE' }}
                            size={button_size}
                            type="primary"
                            onClick={this.handleSearch}
                          >
                            Search
                          </Button>
                        </FormItem>
                      </Col>
                    </Row>
                  </Form>
                </Panel>
              </Collapse>
            </Row>
            <Row gutter={2}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                {' '}
                <Form>
                  <FormItem {...formItemLayout} style={{ marginLeft: '1px' }}>
                    <Button
                      icon="search"
                      size={button_size}
                      onClick={this.showHideDetail}
                      disabled={_.isEmpty(this.state.import_row_selected)}
                    >
                      Process
                    </Button>
                    <Button icon="sync" size={button_size} style={{ marginLeft: 8 }}>
                      Clean
                    </Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row>
              <Table
                rowKey={'_id'}
                size="small"
                bordered
                style={{ marginTop: '5px' }}
                columns={columns}
                dataSource={this.state.fabricimport_data}
                rowClassName={(record, index) => {
                  return index % 2 === 0 ? 'even-row' : 'old-row'
                }}
                onRow={record => {
                  return {
                    onClick: () => {
                      this.setState({ import_row_selected: record })
                    }, // click row
                    onMouseEnter: () => {}, // mouse enter row
                  }
                }}
              />
            </Row>
          </div>
        )}
      </div>
    )
  }
}

const TestFabricListViewWapper = Form.create()(TestFabricListView)
class TestFabric extends Component {
  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Management Import &amp Export" />
        <section className="card">
          <div className="card-body">
            <TestFabricListViewWapper />
          </div>
        </section>
      </Page>
    )
  }
}

export default TestFabric

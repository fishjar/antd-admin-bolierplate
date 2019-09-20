import React, { Component, Fragment, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import DateSelect from '@/components/DateSelect';
import JSONEdit from '@/components/JSONEdit';
import styles from './style.less';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Popconfirm,
  Modal,
} from 'antd';

const modelKey = 'users';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const enumMaps = {
  gender: {
    0: '保密',
    1: '男',
    2: '女',
  },
  bloodType: {
    A: 'A型',
    B: 'B型',
    AB: 'AB型',
    O: 'O型',
  },
};

const ViewModal = ({
  children,
  modalTitle = '编辑',
  modalWith = 720,
  formData: {
    id,
    name,
    nickname,
    gender,
    avatar,
    mobile,
    email,
    homepage,
    birthday,
    height,
    bloodType,
    notice,
    address,
    lives,
    tags,
    luckyNumbers,
    score,
    userNo,
    createdAt,
    updatedAt,
    roles = [],
    groups = [],
    friends = [],
  },
}) => {
  const [visible, setVisible] = useState(false);

  const handleShow = () => {
    setVisible(true);
  };

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <span>
      <span onClick={handleShow}>{children}</span>
      <Modal
        destroyOnClose
        title={modalTitle}
        width={modalWith}
        visible={visible}
        onOk={handleHide}
        onCancel={handleHide}
        footer={null}
      >
        <FormItem {...formLayout} label="ID">
          {id}
        </FormItem>
        <FormItem {...formLayout} label="名称">
          {name}
        </FormItem>
        <FormItem {...formLayout} label="角色">
          {roles.map(item => item.name).join(', ')}
        </FormItem>
        <FormItem {...formLayout} label="组">
          {groups.map(item => item.name).join(', ')}
        </FormItem>
        <FormItem {...formLayout} label="朋友">
          {friends.map(item => item.name).join(', ')}
        </FormItem>
        <FormItem {...formLayout} label="昵称">
          {nickname}
        </FormItem>
        <FormItem {...formLayout} label="性别">
          {enumMaps['gender'][gender]}
        </FormItem>
        <FormItem {...formLayout} label="头像">
          {avatar}
        </FormItem>
        <FormItem {...formLayout} label="手机">
          {mobile}
        </FormItem>
        <FormItem {...formLayout} label="邮箱">
          {email}
        </FormItem>
        <FormItem {...formLayout} label="主页">
          {homepage}
        </FormItem>
        <FormItem {...formLayout} label="生日">
          {birthday && moment(birthday).format('YYYY-MM-DD')}
        </FormItem>
        <FormItem {...formLayout} label="身高(cm)">
          {height}
        </FormItem>
        <FormItem {...formLayout} label="血型(ABO)">
          {enumMaps['bloodType'][bloodType]}
        </FormItem>
        <FormItem {...formLayout} label="备注">
          {notice}
        </FormItem>
        <FormItem {...formLayout} label="地址">
          {address && JSON.stringify(address)}
        </FormItem>
        <FormItem {...formLayout} label="生活轨迹">
          {lives && JSON.stringify(lives)}
        </FormItem>
        <FormItem {...formLayout} label="标签">
          {tags && tags.join(', ')}
        </FormItem>
        <FormItem {...formLayout} label="幸运数字">
          {luckyNumbers && luckyNumbers.join(', ')}
        </FormItem>
        <FormItem {...formLayout} label="积分">
          {score}
        </FormItem>
        <FormItem {...formLayout} label="编号">
          {userNo}
        </FormItem>
        <FormItem {...formLayout} label="创建时间">
          {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </FormItem>
        <FormItem {...formLayout} label="更新时间">
          {moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </FormItem>
      </Modal>
    </span>
  );
};

const EditModal = Form.create()(
  ({
    children,
    modalTitle = '编辑',
    modalWith = 720,
    form,
    formData: {
      id,
      name,
      nickname,
      gender,
      avatar,
      mobile,
      email,
      homepage,
      birthday,
      height,
      bloodType,
      notice,
      intro,
      address,
      lives,
      tags,
      luckyNumbers,
      score,
      roles = [],
      groups = [],
      friends = [],
    },
    dispatch,
    handleRefresh,
  }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allRoles, setAllRoles] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [allFriends, setAllFriends] = useState([]);

    const roleIds = roles.map(item => item.id);
    const groupIds = groups.map(item => item.id);
    const friendIds = friends.map(item => item.id);

    const handleShow = () => {
      setVisible(true);
      dispatch({
        type: 'roles/fetch',
        payload: { pageSize: 0 },
        callback: res => {
          setAllRoles(res.list);
        },
      });
      dispatch({
        type: 'groups/fetch',
        payload: { pageSize: 0 },
        callback: res => {
          setAllGroups(res.list);
        },
      });
      dispatch({
        type: 'users/fetch',
        payload: { pageSize: 0 },
        callback: res => {
          setAllFriends(res.list);
        },
      });
    };

    const handleHide = () => {
      form.resetFields();
      setVisible(false);
      setLoading(false);
    };

    const handleOk = () => {
      form.validateFields((err, fields) => {
        if (err) return;
        console.log(fields);
        setLoading(true);
        if (id) {
          dispatch({
            type: 'users/update',
            payload: {
              id,
              ...fields,
              roles: fields.roleIds.map(key => allRoles.find(item => item.id === key)),
              groups: fields.groupIds.map(key => allGroups.find(item => item.id === key)),
              friends: fields.friendIds.map(key => allFriends.find(item => item.id === key)),
            },
            callback: () => {
              message.success('更新成功');
              handleHide();
            },
          });
        } else {
          dispatch({
            type: 'users/add',
            payload: fields,
            callback: () => {
              message.success('添加成功');
              handleHide();
              handleRefresh();
            },
          });
        }
      });
    };

    return (
      <span>
        <span onClick={handleShow}>{children}</span>
        <Modal
          destroyOnClose
          title={modalTitle}
          width={modalWith}
          visible={visible}
          onOk={handleOk}
          onCancel={handleHide}
          confirmLoading={loading}
        >
          <Form {...formLayout} onSubmit={handleOk}>
            <FormItem label="名称">
              {form.getFieldDecorator('name', {
                initialValue: name,
                rules: [{ required: true, message: '请输入！', min: 3, max: 20 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="关联角色">
              {form.getFieldDecorator('roleIds', {
                initialValue: roleIds,
              })(
                <Select mode="multiple" placeholder="请选择">
                  {allRoles.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="关联组">
              {form.getFieldDecorator('groupIds', {
                initialValue: groupIds,
              })(
                <Select mode="multiple" placeholder="请选择">
                  {allGroups.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="关联朋友">
              {form.getFieldDecorator('friendIds', {
                initialValue: friendIds,
              })(
                <Select mode="multiple" placeholder="请选择">
                  {allFriends.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="昵称">
              {form.getFieldDecorator('nickname', {
                initialValue: nickname,
                rules: [{ max: 64 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="性别">
              {form.getFieldDecorator('gender', {
                initialValue: gender,
              })(
                <Select placeholder="请选择">
                  {Object.entries(enumMaps['gender']).map(([key, val]) => (
                    <Option key={key} value={Number.isNaN(parseInt(key)) ? key : parseInt(key)}>
                      {val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="头像">
              {form.getFieldDecorator('avatar', {
                initialValue: avatar,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="手机">
              {form.getFieldDecorator('mobile', {
                initialValue: mobile,
                rules: [{ max: 16 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="邮箱">
              {form.getFieldDecorator('email', {
                initialValue: email,
                rules: [{ max: 16 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主页">
              {form.getFieldDecorator('homepage', {
                initialValue: homepage,
                rules: [{ max: 16 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="生日">
              {form.getFieldDecorator('birthday', {
                initialValue: birthday,
              })(<DateSelect />)}
            </FormItem>
            <FormItem label="身高(cm)">
              {form.getFieldDecorator('height', {
                initialValue: height,
              })(<InputNumber min={0.01} max={250} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="血型">
              {form.getFieldDecorator('bloodType', {
                initialValue: bloodType,
              })(
                <Select placeholder="请选择">
                  {Object.entries(enumMaps['bloodType']).map(([key, val]) => (
                    <Option key={key} value={Number.isNaN(parseInt(key)) ? key : parseInt(key)}>
                      {val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="备注">
              {form.getFieldDecorator('notice', {
                initialValue: notice,
              })(<TextArea autosize placeholder="请输入" />)}
            </FormItem>
            <FormItem label="介绍">
              {form.getFieldDecorator('intro', {
                initialValue: intro || '',
              })(<ReactQuill placeholder="请输入" />)}
            </FormItem>
            {/* <FormItem label="地址">
              {form.getFieldDecorator('address', {
                initialValue: address,
              })(<JSONEdit placeholder="请输入" />)}
            </FormItem> */}
            <FormItem label="地址-省">
              {form.getFieldDecorator('address.province', {
                initialValue: address && address.province,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="地址-市">
              {form.getFieldDecorator('address.city', {
                initialValue: address && address.city,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="生活轨迹">
              {form.getFieldDecorator('lives', {
                initialValue: lives,
              })(<JSONEdit placeholder="请输入" />)}
            </FormItem>
            <FormItem label="标签">
              {form.getFieldDecorator('tags', {
                initialValue: tags || undefined,
              })(
                <Select mode="tags" tokenSeparators={[',']} placeholder="请输入">
                  {(tags || []).map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="幸运数字">
              {form.getFieldDecorator('luckyNumbers', {
                initialValue: luckyNumbers || undefined,
              })(
                <Select mode="tags" tokenSeparators={[',']} placeholder="请输入">
                  {(luckyNumbers || []).map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="积分">
              {form.getFieldDecorator('score', {
                initialValue: score,
              })(<InputNumber placeholder="请输入" parser={input => input && ~~input} />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  },
);

@connect(({ [modelKey]: data, loading }) => ({
  data,
  loading: loading.models[modelKey],
}))
@Form.create()
class ModelTable extends Component {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = params => {
    const { dispatch } = this.props;
    dispatch({
      type: `${modelKey}/fetch`,
      payload: params,
      callback: () => {
        this.setState({ selectedRows: [] });
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filtersArg,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}__${sorter.order.slice(0, -3)}`;
    }

    this.fetchData(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchData();
  };

  handleRefresh = () => {
    const { formValues } = this.state;
    this.fetchData(formValues);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      this.fetchData(values);
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: `${modelKey}/remove`,
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.handleRefresh();
      },
    });
  };

  handleDeleteMultiple = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows.length) return;
    dispatch({
      type: `${modelKey}/removeBulk`,
      payload: {
        ids: selectedRows.map(item => item.id),
      },
      callback: () => {
        message.success('删除成功');
        this.handleRefresh();
      },
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('gender')(
                <Select allowClear placeholder="请选择">
                  {Object.entries(enumMaps['gender']).map(([key, val]) => (
                    <Option value={key} key={key}>
                      {val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { data, loading, dispatch } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '角色',
        dataIndex: 'roles',
        render: val => val && val.map(item => item.name).join(', '),
      },
      {
        title: '组',
        dataIndex: 'groups',
        render: val => val && val.map(item => item.name).join(', '),
      },
      {
        title: '友',
        dataIndex: 'friends',
        render: val => val && val.map(item => item.name).join(', '),
      },
      {
        title: '性别',
        dataIndex: 'gender',
        filters: Object.entries(enumMaps['gender']).map(([key, val]) => ({
          text: val,
          value: key,
        })),
        render: val => enumMaps['gender'][val],
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        sorter: true,
        render: val => val && moment(val).format('YYYY-MM-DD'),
      },
      {
        title: '地址',
        dataIndex: 'address',
        render: val => val && JSON.stringify(val),
      },
      {
        title: '标签',
        dataIndex: 'tags',
        render: val => val && val.join(', '),
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <ViewModal modalTitle="查看" dispatch={dispatch} formData={record}>
              <a>查看</a>
            </ViewModal>
            <Divider type="vertical" />
            <EditModal modalTitle="编辑" dispatch={dispatch} formData={record}>
              <a>编辑</a>
            </EditModal>
            <Divider type="vertical" />
            <Popconfirm title="确定删除？" onConfirm={() => this.handleDelete(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <EditModal
                modalTitle="新建"
                dispatch={dispatch}
                formData={{}}
                handleRefresh={this.handleRefresh}
              >
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </EditModal>
              {selectedRows.length > 0 && (
                <Popconfirm title="确定删除？" onConfirm={() => this.handleDeleteMultiple()}>
                  <Button icon="delete">删除</Button>
                </Popconfirm>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey={'id'}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ModelTable;

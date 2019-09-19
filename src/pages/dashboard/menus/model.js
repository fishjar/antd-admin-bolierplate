import {
  findAndCountAll,
  findByPk,
  singleCreate,
  bulkCreate,
  bulkUpdate,
  updateByPk,
  bulkDestroy,
  destroyByPk,
  findOne,
  findOrCreate,
} from './service';

const Model = {
  namespace: 'menus',
  state: {
    list: [],
    pagination: {},
  },
  effects: {
    *fetch({ payload = {}, callback }, { call, put }) {
      const response = yield call(findAndCountAll, payload);
      const data = {
        list: response.rows,
        pagination: {
          total: response.count,
          pageSize: parseInt(`${payload.pageSize}`, 10) || 10,
          current: parseInt(`${payload.pageNum}`, 10) || 1,
        },
      };
      yield put({
        type: 'save',
        payload: data,
      });
      callback && callback(data);
    },

    *fetchSingle({ payload, callback }, { call, put }) {
      const response = yield call(findByPk, payload.id);
      callback && callback(response);
    },

    *add({ payload, callback }, { call }) {
      const response = yield call(singleCreate, payload);
      callback && callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(destroyByPk, payload.id);
      callback && callback();
    },

    *removeBulk({ payload, callback }, { call, put }) {
      const response = yield call(bulkDestroy, payload.ids);
      callback && callback();
    },

    *update({ payload = {}, callback }, { call, put }) {
      const response = yield call(updateByPk, payload);
      const { id, ...fields } = payload;
      yield put({
        type: 'pactch',
        payload: {
          ids: [id],
          fields,
        },
      });
      callback && callback();
    },

    *updateBulk({ payload = {}, callback }, { call, put }) {
      const response = yield call(updateByPk, payload);
      const { ids, fields } = payload;
      yield put({
        type: 'pactch',
        payload: {
          ids,
          fields,
        },
      });
      callback && callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    pactch(state, action) {
      return {
        ...state,
        list: state.list.map(item => {
          if (action.payload.ids.includes(item.id)) {
            return { ...item, ...action.payload.fields };
          }
          return item;
        }),
      };
    },
  },
};
export default Model;
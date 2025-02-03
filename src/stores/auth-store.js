import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    userInfo: {
      id: null,
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      groups: [],
      profile: {
        id: null,
        phone_number: "",
        address: null,
        about: "",
        photo: null,
        user: 1
      },
    },
    permissions: {
      pages: [],
      reports: [],
      tables: {},
      is_admin: false,
    },
  }),
  getters: {
    isLogged: (state) => {
      return state.token?.length > 0;
    },
    profile: (state) => {
      if (state.userInfo.profile?.photo) {
        return `${process.env.API_BASE_URL}${state.userInfo.profile.photo}`
      }
      return 'https://cdn.quasar.dev/img/boy-avatar.png';
    },
    getPermissions: (state) => {
      const result = {
          pages: state.permissions.pages,
          reports: state.permissions.reports,
          tables: state.permissions.is_admin ? {
            cashCategory: { r: true, c: true, u: true, d: true, },
            cashSubcategory: { r: true, c: true, u: true, d: true, },
            cash: { r: true, c: true, u: true, d: true, },
            currency: { r: true, c: true, u: true, d: true, },
            unit: { r: true, c: true, u: true, d: true, },
            productCategory: { r: true, c: true, u: true, d: true, },
            productSubcategory: { r: true, c: true, u: true, d: true, },
            product: { r: true, c: true, u: true, d: true, },
            purchases: { r: true, c: true, u: true, d: true, },
            vendor: { r: true, c: true, u: true, d: true, },
            vendorBalance: { r: true, c: true, u: true, d: true, },
            payment: { r: true, c: true, u: true, d: true, },
            sales: { r: true, c: true, u: true, d: true, },
            customer: { r: true, c: true, u: true, d: true, },
            customerBalance: { r: true, c: true, u: true, d: true, },
            collection: { r: true, c: true, u: true, d: true, },
            account: { r: true, c: true, u: true, d: true, },
            journalVoucher: { r: true, c: true, u: true, d: true, },
          } : state.permissions.tables,
          is_admin: state.permissions.is_admin,
      };
      return result;
    },
  },
  actions: {
    async login(credentials) {
      axios.defaults.xsrfCookieName = 'csrftoken';
      axios.defaults.xsrfHeaderName = 'X-CSRFToken';
      const loginApi = axios.create({ baseURL: process.env.API_BASE_URL });
      try {
        api.defaults.headers.common['Authorization'] = null;
        const response = await loginApi.post('/auth/token/login/', credentials);
        const token = response.data.auth_token;
        localStorage.setItem('token', token);
        this.token = token;
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
      } catch (error) {
        localStorage.setItem('token', null);
        this.token = null;
        api.defaults.headers.common['Authorization'] = null;
        console.error(error);
      }
    },
    async logout() {
      try {
        await api.post('/auth/token/logout/');
      } catch (error) {
        console.log(error);
      } finally {
        localStorage.setItem('token', null);
        this.userInfo = {
          id: null,
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          groups: [],
          profile: {
            id: null,
            phone_number: "",
            address: null,
            about: "",
            photo: null,
            user: 1
          },
        };
      }
    },
    async updateInfo(newInfo) {
      const response = await api.post('/auth/user-info/', newInfo, {
        'Content-Type': 'multipart/form-data',
      });
      return response.data;
    },
    async getInfo() {
      try {
        const response = await api.get('/auth/user-info/');
        this.userInfo = response.data;
        if (!this.userInfo.profile) {
          this.userInfo.profile = {
            phone_number: "",
            address: "",
            about: "",
            photo: null,
          }
        }
        this.permissions = {
          pages: JSON.parse(response.data.user_view?.pages || '[]'),
          reports: JSON.parse(response.data.user_view?.reports || '[]'),
          tables: JSON.parse(response.data.user_view?.tables || '{}'),
          is_admin: response.data.user_view?.is_admin || false,
        };
      } catch (error) {
        console.log(error);
        this.userInfo = {
          id: null,
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          groups: [],
          profile: {
            id: null,
            phone_number: "",
            address: null,
            about: "",
            photo: null,
            user: null
          },
        };
        this.permissions = {
          pages: [],
          reports: [],
          tables: {},
          is_admin: false,
        };
      }
    },
    async changePassword(newInfo) {
      try {
        const response = await api.post('/auth/users/set_password/', newInfo);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async heartbeat() {
      try {
        await api.get('/auth/heartbeat/');
      } catch (error) {
        console.log(error);
      }
    },
  },
});

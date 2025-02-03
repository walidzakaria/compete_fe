import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const api = axios.create({ baseURL: process.env.API_BASE_URL });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login/'; // Redirect to login page
      } else if (error.response && error.response.status === 403) {
        const message = localStorage.getItem('locale') === 'en' ? 'You do not have permission to perform this action.' : 'ليس لديك الصلاحية لأداء هذا الإجراء';
        Notify.create({
          type: 'negative',
          message,
          position: 'top-right',
          timeout: 3000,
          progress: true,
          actions: [
            { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
          ],
        });
      }
      return Promise.reject(error);
    }
  );
});

export { axios, api };

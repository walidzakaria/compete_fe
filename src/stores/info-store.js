import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useInfoStore = defineStore('info', {
  state: () => ({
    showResult: false,
    teams: [],
    sectionName: 'اسم الفقرة هنا',
    categories: [],
    session: {
      page: '', time_started: null, user_locked: null, section_title: '',
      question_index: -1, selected_answer: null, interval_number: 1000,
      team_a_result: 0, team_b_result: 0,},
    pressureQuestions: [],
    otherQuestions: [],
  }),
  getters: {
    getShowResult: (state) => state.showResult,
    getTeams: (state) => {
      return state.teams.length !== 2 ? {
        a: {id: null, name: null, score: 0, members: []},
        b: {id: null, name: null, score: 0, members: []},
      } : {
        a: state.teams[0],
        b: state.teams[1],
      };
    },
    getResult: (state) => {
      return `${state.session.team_a_result.toString().padStart(2, '0')} - ${state.session.team_b_result.toString().padStart(2, '0')}`;
    },
    getSectionName: (state) => state.sectionName,
    getCategories: (state) => state.categories,
    getSession: (state) => {
      const session = state.session;
      const dict = {
        'أسئلة عامة': 'general-questions',
        'ضربات جزاء': 'penalties',
        'تحت الضغط': 'under-pressure',
        'المواهب': 'talents',
        'عجلة الحظ': 'wheel',
      };
      session.page = session.page === 'question' ? dict[session.section_title] || session.section_title : session.page;
      return session;
    },
    getUserLocked: (state) => {
      const sessionUser = state.session.user_locked;
      if (sessionUser) {
        const selectedUser = state.teams[0].members.find((m) => m.id === sessionUser) || state.teams[1].members.find((m) => m.id === sessionUser);
        return {id: selectedUser.id, name: `${selectedUser.first_name} ${selectedUser.last_name}`, photo: selectedUser.photo};
      }
      return null;
    },
    getPressureQuestions: (state) => state.pressureQuestions,
    getOtherQuestions: (state) => state.otherQuestions,
  },
  actions: {
    setShowResult(value) {
      this.showResult = value;
    },
    async retrieveTeams() {
      try {
        const response = await api.get('/auth/team/');
        this.teams = response.data;
        console.log('team', this.teams);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async retrieveCategories() {
      try {
        const response = await api.get('/api/questions/wheel-categories/');
        this.categories = response.data;
        console.log('categories', this.categories);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async retrieveSession() {
      try {
        const response = await api.get('/api/questions/process/1/');
        this.session = response.data;
        // console.log('session', this.session);
      } catch (error) {
        console.log(error);
      }
    },
    async buzzMe() {
      try {
        await api.get('/api/questions/process/lock_process/');
      } catch (error) {
        console.log(error);
        throw(error);
      }
    },
    async editSession(sessionInfo) {
      try {
        await api.patch('/api/questions/process/1/', sessionInfo);
      } catch (error) {
        console.log(error);
      }
    },
    async retrievePressureQuestions() {
      try {
        const response = await api.get('/api/questions/pressure-questions/');
        this.pressureQuestions = response.data;
      } catch (error) {
        this.pressureQuestions = [];
        console.log(error);
      }
    },
    async retrieveOtherQuestions() {
      try {
        const response = await api.get('/api/questions/other-questions/');
        this.otherQuestions = response.data;
      } catch (error) {
        this.otherQuestions = [];
        console.log(error);
      }
    },
    async editQuestion(questionInfo) {
      try {
        await api.patch(`/api/questions/${questionInfo.type}-questions/${questionInfo.id}/`, questionInfo);
      } catch (error) {
        console.log(error);
      }
    },
    async retrieveNextQuestion(questionType) {
      try {
        const response = await api.get(`/api/questions/${questionType}-questions/next_question/`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async retrieveQuestion(questionInfo) {
      try {
        const response = await api.get(`/api/questions/${questionInfo.type}-questions/${questionInfo.id}/`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async retrieveCatQuestion(categoryId) {
      try {
        const response = await api.get('/api/questions/wheel-questions/next_question/', {params: {category: categoryId}});
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  },
});

import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      api: 'https://vue3-course-api.hexschool.io/v2',
      path: 'zoechen',
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      axios.post(`${this.api}/admin/signin`,this.user)
      .then((res) => {
        const { token, expired } = res.data; // 取出並寫入 cookie token
        document.cookie = `loginToken=${token};expires=${new Date(expired)}; path=/`;
        // ↑ expires 設置有效時間，並把原本的 unix timestamp 轉型成一般時間格式
        window.location = 'products.html';
      })
      .catch((error) => {
        console.dir(error); // 確認錯誤原因
        alert(error.data.message); // 彈跳錯誤提示
      });
    },
  },
})

app.mount('#app');
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

const api = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'zoechen';

let productModal = {};
let delProductModal = {};

const app = createApp({
  components: {
    pagination
  },
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pagination: {},
    }
  },
  methods: {
    checkLogin(){
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // 取得 token
    axios.defaults.headers.common['Authorization'] = token; // 帶入 header
        axios.post(`${api}/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((error) => {
          console.dir(error); // 確認錯誤原因
          alert(error.data.message); // 彈跳錯誤提示
          window.location = 'index.html' // 重回登入頁面
        });
      },
    getProducts(page = 1) { //參數預設值
        axios.get(`${api}/api/${api_path}/admin/products/?page=${page}`) //？後面叫query
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination; // 儲存分頁資訊
        })
        // .catch((error) => {
        //   alert(error.data.message);
        // });
    },
    openProduct(item) {
      this.tempProduct = item;
    },
    openModal(status, product) {
      console.log(status, product);
      if (status === "new"){
        this.tempProduct = {
          imagesUrl: [],
        } 
        productModal.show();
        this.isNew = true;
      } else if (status === 'edit') {
        this.tempProduct = { ...product };
        productModal.show();
        this.isNew = false;
      }else if (status === 'delete') {
        delProductModal.show();
        this.tempProduct = { ...product };
      }
    },
    delProduct() {
      let url = `${api}/api/${api_path}/admin/product/${this.tempProduct.id}`
      
      axios.delete(url)
        .then((res) => {
          console.log(res);
          this.getProducts();
          delProductModal.hide();
        });
    }
  },
  mounted() {
    this.checkLogin();
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
  }
})

app.component('productModal', {
  props: ['tempProduct'],
  template: '#templateForProductModal',
  methods: {
    updateProduct() {
      let url = `${api}/api/${api_path}/admin/product`
      let method = 'post';
      if (!this.isNew){
        url = `${api}/api/${api_path}/admin/product/${this.tempProduct.id}`
        method = 'put';
      }
      
      axios[method](url , { data: this.tempProduct }) // 依照api格式，tempProduct在data裡面
        .then((res) => {
          console.log(res);
          // this.getProducts(); // 外層的方法
          this.$emit('get-products')
          productModal.hide();
        });
    },
  }
})

app.mount('#app');
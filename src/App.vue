<template>
  <div class="home">
    <button @click="profile">信息</button>&#8195;
    <button @click="logout">注销</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      username: "admin",
      password: "password"
    };
  },
  created() {
    let params = { username: this.username, password: this.password };
    axios.post("/api/users/login", params).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    profile() {
      axios.get("/api/users/profile").then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    logout() {
      axios.post("/api/users/logout").then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>
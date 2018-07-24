/**
 * Created by jianchen on 2018/5/11.
 */
const axios = require('axios');

setInterval(() => {
  axios.post('http://localhost:8001').then((res) => {
    console.log(res.data);
  }).catch((e) => {
    console.log(e)
  })
}, 500);
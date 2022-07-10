import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import login from "@/components/login";
import personalSpace from "@/views/personalSpace";
import mainZhuye from "@/components/personalComponents/mainComponents/mainZhuye";
import mainTougao from "@/components/personalComponents/mainComponents/Tougao";
import mainShoucang from "@/components/personalComponents/mainComponents/mainShoucang";
import mainEditMsg from "@/components/personalComponents/mainComponents/mainEditMsg";
import videoUpload from "@/components/personalComponents/mainComponents/TougaoComponents/videoUpload";
import videoSetMsg from "@/components/personalComponents/mainComponents/TougaoComponents/videoSetMsg";
import mainAddFolder from "@/components/personalComponents/mainComponents/mainAddFolder";
import videoFrame from "@/components/videoFrame";
import mainMyTougao from "@/components/personalComponents/mainComponents/mainMyTougao";
import shoucangFrame from "@/components/personalComponents/mainComponents/shoucangFrame";
import register from "@/components/register";
import adminView from "@/views/adminView";
import adminVanGrid from "@/components/adminComponents/adminVanGrid";
import adminVideoAudit from "@/components/adminComponents/adminVideoAudit";

Vue.use(VueRouter)
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
//上面代码用于解决路由重复跳转产生的错误 --redundant navigation to current location:

const routes = [
  {
    path: '/',
    name: 'menu',
    component: HomeView

  },
  {
    path: '/adminManagement',
    redirect: '/adminManagement/navigation',
    component: adminView,
    meta: {
      isAdmin: true
    },
    children: [
      {
        path: 'navigation',
        component: adminVanGrid
      },
      {
        path: 'videoAudit',
        component: adminVideoAudit
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/videoFrame',
    name:'videoFrame',
    component: videoFrame,
  },
  {
    path: 'addFolder2',
    component: mainAddFolder,
    meta: {
      islogin: true
    }
  },
  {
    path: '/tougao/',
    component: mainTougao,
    redirect:'/tougao/videoUpload',
    meta:{
      islogin: true
    },
    children: [
      {
        path: 'videoUpload',
        component: videoUpload,
        meta:{
          islogin: true
        },
      },
      {
        path: 'videoSetMsg',
        component: videoSetMsg,
        meta:{
          islogin: true
        },
      }
    ]
  },
  {
    path: '/personalSpace/',
    redirect:'/personalSpace/zhuye',
    name: 'personalSpace',
    meta:{
      islogin: true
    },
    component: personalSpace, //二级路由配置
    //注意:下面子路由中加不加‘/’ 的区别：当去到fe的时候加 ‘/'会在地址栏中显示 #/fe;不加 ‘/'的时候回在地址栏中显示#/position/fe
    children: [
      {
        path: 'zhuye',
        component: mainZhuye,
        children: [{
          path: 'shoucangFrame',
          component: shoucangFrame
        }],
        meta:{
          islogin: true
        },
      },
      {
        path: 'shoucang',
        component: mainShoucang,
        meta:{
          islogin: true
        },
      },
      {
        path: 'editMsg',
        component: mainEditMsg,
        meta:{
          islogin: true
        },
      },
      {
        path: 'addFolder',
        component: mainAddFolder,
        meta: {
          islogin: true
        }
      },
      {
        path: 'myTougao',
        component: mainMyTougao,
        meta: {
          islogin: true
        }
      }
    ]
  },

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.islogin) {
    if (!JSON.parse(window.sessionStorage.getItem('cid'))) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
    next()
  } else {
    next()
  }
  //如果本地 存在 token 则 不允许直接跳转到 登录页面
  if(to.fullPath === "/login"){
    if(sessionStorage.getItem('cid')){
      next({
        path:from.fullPath
      });
    }else {
      next();
    }
  }

})
export default router

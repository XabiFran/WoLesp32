import Vue from "vue";
import VueRouter from "vue-router";
import PCs from "../views/PCs.vue";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import state from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Devices",
    component: () => import("../views/Devices.vue"),
    meta: {requiresAuth: true}
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  { path: "/feed", component: () => import("../views/Feed.vue"), /*meta: {requiresAuth: true}*/ },
  //{ path: "/login", component: () => import("../views/Login.vue") },
  //{ path: "/sign-in", component: () => import("../views/SignIn.vue") },
  { path: "/login", component: () => import("../views/Login2.vue") },
  { path: "/sign-up", component: () => import("../views/Signup2.vue") },
  { path: "/PCs", component: () => import("../views/PCs.vue"), meta: {requiresAuth: true}, },
  { path: "/logs", component: () => import("../views/LogView.vue"), meta: {requiresAuth: true}, },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const authenticatedUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresAuth && ! authenticatedUser) next('login')
  else next()

  
  /*if(state.state.currentDevice == null) next('/')
  else next()*/
  
});

export default router;

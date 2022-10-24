import Vue from "vue";
import VueRouter from "vue-router";
import PCs from "../views/PCs.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "PCs",
    component: PCs,
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
  { path: "/feed", component: () => import("../views/Feed.vue") },
  { path: "/login", component: () => import("../views/Login.vue") },
  { path: "/sign-in", component: () => import("../views/SignIn.vue") },
  { path: "/login2", component: () => import("../views/Login2.vue") },
  { path: "/sign-up2", component: () => import("../views/Signup2.vue") },
];

const router = new VueRouter({
  routes,
});

export default router;

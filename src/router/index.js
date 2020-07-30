import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: '/',
    component: ()=> import('../views/RegLogin'),
    redirect: "/login",
    children:[
      {
        path:'/login',
        name:'login',
        component:()=> import('../components/login'),
        meta: {
          title:"登录"
        }
      },
      {
        path:'/register',
        name:'register',
        component:()=> import('../components/register'),
        meta: {
          title:"注册"
        }
      }
    ]

  },
    {
      path:'/home',
      name: 'Home',
      component:()=>import('../views/Main/Main.vue'),
      redirect: "/dashboard",
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component:()=> import('../components/dashboard'),
          meta: {
            breadcrumb: ["主页", "导航"],
            title:"导航"
          }
        },

        {
          path: '/articles',
          name: 'articles',
          component:()=> import('../components/articles'),
          meta: {
            breadcrumb: ["主页", "文章","文章管理"],
            title:"文章管理",
            keepAlive: true,
          }
        },
        {
          path: '/post/:blogId?',
          name: 'post',
          component:()=> import('../components/post'),
          meta: {
            breadcrumb: ["主页", "文章","文章发表"],
            title:"文章发表",
          }
        },
        {
          path: '/tags',
          name: 'tags',
          component:()=> import('../components/TagsOrTypes'),
          meta: {
            breadcrumb: ["主页", "标签管理"],
            title :"标签管理",
          }
        },
        {
          path: '/types',
          name: 'types',
          component:()=> import('../components/TagsOrTypes'),
          meta: {
            breadcrumb: ["主页", "分类管理"],
            title:"分类管理"
          }
        },
      ]
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let title = 'MyBlog';
    title = `${to.meta.title} - ${title}`;
  document.title = title;
  next();
})

export default router

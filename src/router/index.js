import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    name: '数据统计',
    meta: { title: '数据统计', icon: 'list' },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/table',
    name: '教师管理',
    meta: { title: '教师管理', icon: 'user' },
    children: [
      {
        path: 'table',
        name: '教师列表',
        component: () => import('@/views/edu/teacher/list'),
        meta: { title: '教师列表', icon: 'user' }
      },
      {
        path: 'save',
        name: '添加教师',
        component: () => import('@/views/edu/teacher/save'),
        meta: { title: '添加教师', icon: 'eye' }
      },
      {
        path: 'save/:id',
        name: '编辑教师',
        component: () => import('@/views/edu/teacher/save'),
        meta: { title: '编辑教师', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/list',
    name: '学院管理',
    meta: { title: '学院管理', icon: 'tree' },
    children: [
      {
        path: 'list',
        name: '学院信息',
        component: () => import('@/views/edu/subject/list'),
        meta: { title: '学院信息', icon: 'eye' }
      },
      {
        path: 'save',
        name: '添加学院',
        component: () => import('@/views/edu/subject/save'),
        meta: { title: '添加学院', icon: 'form' }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: '课程管理',
    meta: { title: '课程管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/edu/course/list'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: '/info',
        name: '添加课程',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '添加课程', icon: 'eye' }
      },
      {
        path: 'info/:courseId',
        name: 'EduCourseInfoEdit',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '编辑课程基本信息', noCache: true },
        hidden: true
      },
      {
        path: 'info/:id',
        name: 'EduCourseInfoEdit',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '编辑课程基本信息', noCache: true },
        hidden: true
      },
      {
        path: 'chapter/:courseId',
        name: 'EduCourseChapterEdit',
        component: () => import('@/views/edu/course/chapter'),
        meta: { title: '编辑课程大纲', noCache: true },
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'EduCourseChapterEdit',
        component: () => import('@/views/edu/course/chapter'),
        meta: { title: '编辑课程大纲', noCache: true },
        hidden: true
      },
      {
        path: 'publish/:courseId',
        name: 'EduCoursePublishEdit',
        component: () => import('@/views/edu/course/publish'),
        meta: { title: '发布课程', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/list',
    name: '轮播管理',
    meta: { title: '轮播管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '图片列表',
        component: () => import('@/views/banner/list'),
        meta: { title: '图片列表', icon: 'table' }
      },
      {
        path: 'add',
        name: '添加图片',
        component: () => import('@/views/banner/add'),
        meta: { title: '添加图片', icon: 'table' }
      },
    ]
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '数据统计',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '数据统计', icon: 'form' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/linqibin0826',
        meta: { title: '我的主页', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const urls = {
    // 登录
    login: "/user/login",
    // 注册
    register: "/user/save",

    // 分页获取文章
    getArticles :"/article/list",
    //发表文章
    postBlog:'/article',
    //修改文章
    putBlog:'/article',
    //删除文章
    delBlog:'/article/',
    //根据id获取文章
    getArticleById:"/article/",



    // 获取标签
    getTags :"/tag/list",
    //添加标签
    addTag:'/tag',
    //删除标签
    delTag:'/tag/',

    //获取分类
    getTypes:"/type/list",
    //添加分类
    addType:'/type',
    //删除分类
    delType:'/type/',


    //上传图片
    postImg:"/file/upload/img",


    //仪表盘获取访问量
    get_dashboard_views:"/dashboard/blog-statistics/list",
    //仪表盘获取文章访问详情
    get_dashboard_article:"dashboard/blog_ranking/list",

    //搜索
    getSearchList : "/search",


}

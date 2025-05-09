
import global from "../utils/global";

const routerPermission = (router) => {
  router.beforeEach((to, from, next) => {
    if (to.query && to.query.token) {
      global.token = to.query.token;
      next(to.path);
    }
    // 登录验证
    const token = global.token
    if (token) {
      next();
    } else {
      // next()
      const redirectUrl = encodeURIComponent(
        window.location.origin + window.location.pathname + to.href
      );
      window.location.href = `https://sso.hzcando.com/#/?redirectUrl=${redirectUrl}&appId=${global.appId}`;
    }
  });
};

export default routerPermission;

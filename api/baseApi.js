import { get, post, put, del } from "./index";

/**
 * 获取企业列表
 * @param {*} params
 * @returns
 */
export function getEnterpriseList(params) {
  return get("/api/baseInfo/enterprise/list", params);
}

/**
 * 获取企业子级列表
 * @param {*} params
 * @returns
 */
export function getEnterpriseChildren(params) {
  return get("/api/baseInfo/enterprise/children", params);
}

/**
 * 获取员工列表
 * @param {*} params
 * @returns
 */
export function getEmployeeList(params) {
  return get("/api/baseInfo/employee/List", params);
}

/**
 * 获取账户列表
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNum] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @param {string} [params.name] - 卡号/名称
 * @param {number} [params.userId] - 用户ID
 * @param {number} [params.enterpriseId] - 企业ID
 * @returns {Promise}
 */
export function getAccountList(params) {
  return get("/api/smartbusiness/Account/List", params);
}

/**
 * 获取IC卡列表
 * @param {*} params
 * @returns
 */
export function getICCardList(params) {
  return get("/api/smartbusiness/card/List", params);
}
export function getDictTreeList(code) {
  return get("/api/dict/code/tree", {
    pageno: 1,
    pagesize: 1000,
    pid: code,
  });
}
export function getDictList(code) {
  return get("/api/dict/code/children", {
    pageno: 1,
    pagesize: 1000,
    pid: code,
  });
}

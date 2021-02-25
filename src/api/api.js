import { getAction,deleteAction,putAction,postAction,downFile,postActionOut,getActionOutPut} from '@/api/manage'

////根路径
// const doMian = "/jeecg-boot/";
////图片预览请求地址
// const imgView = "http://localhost:8080/jeecg-boot/sys/common/view/";

//角色管理
const addRole = (params)=>postAction("/sys/role/add",params);
const editRole = (params)=>putAction("/sys/role/edit",params);
// const getRoleList = (params)=>getAction("/sys/role/list",params);
// const deleteRole = (params)=>deleteAction("/sys/role/delete",params);
// const deleteRoleList = (params)=>deleteAction("/sys/role/deleteBatch",params);
const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
const queryall = (params)=>getAction("/sys/role/queryall",params);
// 单位转换管理
const addStandardUnitConversion = (params)=>postAction("/master/standardUnitConversion/add",params);
const editStandardUnitConversion = (params)=>putAction("/master/standardUnitConversion/edit",params);
//单位管理
const addUnit = (params)=>postAction("/master/mstUnit/add",params);
const editUnit = (params)=>putAction("/master/mstUnit/edit",params);
//重复校验
const checkUnitCode = (params)=>getAction("/master/unit/checkUnitCode",params);
//批量删除单位信息
const deleteUnitList = (params)=>deleteAction("/master/unit/deleteBatch",params);
const listSelect = (params)=>putAction("/master/mstUnit/listSelect",params);


//用户管理
const addUser = (params)=>postAction("/sys/user/add",params);
const editUser = (params)=>putAction("/sys/user/edit",params);
const queryUserRole = (params)=>getAction("/sys/user/queryUserRole",params);
const getUserList = (params)=>getAction("/sys/user/list",params);
// const deleteUser = (params)=>deleteAction("/sys/user/delete",params);
// const deleteUserList = (params)=>deleteAction("/sys/user/deleteBatch",params);
const frozenBatch = (params)=>putAction("/sys/user/frozenBatch",params);
//验证用户是否存在
const checkOnlyUser = (params)=>getAction("/sys/user/checkOnlyUser",params);
//改变密码
const changPassword = (params)=>putAction("/sys/user/changePassword",params);

//权限管理
const addPermission= (params)=>postAction("/sys/permission/add",params);
const editPermission= (params)=>putAction("/sys/permission/edit",params);
const getPermissionList = (params)=>getAction("/sys/permission/list",params);
/*update_begin author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */
const getSystemMenuList = (params)=>getAction("/sys/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/sys/permission/getSystemSubmenu",params);
/*update_end author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */

// const deletePermission = (params)=>deleteAction("/sys/permission/delete",params);
// const deletePermissionList = (params)=>deleteAction("/sys/permission/deleteBatch",params);
const queryTreeList = (params)=>getAction("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/sys/permission/saveRolePermission",params);
//const queryPermissionsByUser = (params)=>getAction("/sys/permission/queryByUser",params);
const queryPermissionsByUser = (params)=>getAction("/sys/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/sys/permission/queryPermissionRule",params);

// 部门管理
const queryDepartTreeList = (params)=>getAction("/sys/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/sys/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/sys/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/sys/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params);
const queryDepartPermission = (params)=>getAction("/sys/permission/queryDepartPermission",params);
const saveDepartPermission = (params)=>postAction("/sys/permission/saveDepartPermission",params);

// 供应商管理
const addSupp = (params)=>postAction("/master/mstSupplier/add",params);
const editSupp = (params)=>putAction("/master/mstSupplier/edit",params);

//商品单位重复check
const productDuplicateCheck = (params)=>getAction("/master/productUnit/duplicateCheck",params);
const productUnitDuplicateCheck = (params)=>getAction("/master/productUnit/check",params);

//供应商重复check
const supplierDuplicateCheck = (params)=>getAction("/master/productSupplier/supplierCheck",params);

//商品的该供应商重复check
const productSupplierDuplicateCheck = (params)=>getAction("/master/productSupplier/check",params);

//客户重复check
const customerDuplicateCheck = (params)=>getAction("/master/productCustomer/customerCheck",params);
//商品的该客户重复check
const productCustomerDuplicateCheck = (params)=>getAction("/master/productCustomer/check",params);

//客户信息
const addCuto = (params)=>postAction("/master/mstCustomer/add",params);
const editCuto = (params)=>putAction("/master/mstCustomer/edit",params);

//商品信息
const addPdct = (params)=>postAction("/master/mstProduct/add",params);
const editPdct = (params)=>putAction("/master/mstProduct/edit",params);
const queryPdctById = (params)=>getAction("/master/mstProduct/queryById", params);

//订单
const editOrderHeader =(params)=>putAction("/order/orderHeader/editHeader",params);

//订单详细
const editOrderDetail = (params)=>putAction("/order/orderDetail/edit",params);
const addOrderDetail = (params)=>postAction("/order/orderDetail/add",params);

//订单开票
const editOrderInvoice = (params)=>putAction("/arap/invoice/edit",params);
const addOrderInvoice = (params)=>postAction("/arap/invoice/add",params);
const invoiceNumberCheck =(params)=>getAction("/arap/invoice/validate",params);

// 采购进货信息
const addOrderPurchase = (params)=>postAction("/purchase/trPurchaseOrder/add",params);
const editOrderPurchase = (params)=>putAction("/purchase/trPurchaseOrder/edit",params);
// 入库信息
const addReceipt = (params)=>postAction("/purchase/trPurchaseReceipt/add",params);
const editReceipt = (params)=>putAction("/purchase/trPurchaseReceipt/edit",params);
const delReceipt = (params)=>putAction("/purchase/trPurchaseReceipt/delReceipt",params);

// 库存查询
const editStock = (params)=>putAction("/order/stock/edit",params);
const addStock = (params)=>putAction("/order/stock/add",params);
const getStockHistory = (params)=>getAction("/order/stock/historyList",params);

// 发货基本信息
const addShipment = (params)=>putAction("/order/orderShipment/add",params);
const editShipment = (params)=>putAction("/order/orderShipment/edit",params);

//日志管理
//const getLogList = (params)=>getAction("/sys/log/list",params);
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);

//数据字典
const addDict = (params)=>postAction("/sys/dict/add",params);
const editDict = (params)=>putAction("/sys/dict/edit",params);
//const getDictList = (params)=>getAction("/sys/dict/list",params);
const treeList = (params)=>getAction("/sys/dict/treeList",params);
// const delDict = (params)=>deleteAction("/sys/dict/delete",params);
//const getDictItemList = (params)=>getAction("/sys/dictItem/list",params);
const addDictItem = (params)=>postAction("/sys/dictItem/add",params);
const editDictItem = (params)=>putAction("/sys/dictItem/edit",params);

const getDictText = (dictCode, key, params) =>getAction(`/sys/dict/getDictText/${dictCode}/${key}`, params);
//const delDictItem = (params)=>deleteAction("/sys/dictItem/delete",params);
//const delDictItemList = (params)=>deleteAction("/sys/dictItem/deleteBatch",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>getAction(`/sys/dict/getDictItems/${code}`,params);

// 订单新建
const addOrderInput = (params)=>postAction("/order/orderInput/add",params);

//系统通告
const doReleaseData = (params)=>getAction("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/sys/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/sys/loginfo",params);
const getVisitInfo = (params)=>getAction("/sys/visitInfo",params);
//数据日志访问
// const getDataLogList = (params)=>getAction("/sys/dataLog/list",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/sys/user/queryUserByDepId",params);

// 查询用户角色表里的所有信息
const queryUserRoleMap = (params)=>getAction("/sys/user/queryUserRoleMap",params);
// 重复校验
const duplicateCheck = (params)=>getAction("/sys/duplicate/check",params);
// 重复校验
const duplicateNewCheck = (params)=>getAction("/sys/duplicate/newCheck",params);
// 加载分类字典
const loadCategoryData = (params)=>getAction("/sys/category/loadAllData",params);
// 最大编号取得 专用（通过tableId获取 最大编号）
const getNextCode = (tableId, params)=>getAction(`/master/dataNumberControl/getNextCode/${tableId}`,params);
// 定时任务状态
const quartzStatus = (params)=>getAction("/sys/dict/getDictItems/quartz_status",params);
// 获取定时任务
const getJobClasses = (params)=>getAction("/sys/quartzJob/getJobClasses",params);

const download = (params) =>downFile("/sys/job/downloadFile",params)

const getJobLogList = (params) =>getAction("/sys/job/logList",params)

const ouputPost = (params) =>postActionOut("/sys/job/outputFile",params)

const ouputJobMotoDataPost = (params) =>postAction("/sys/job/ouputMotoDataFile",params)

const ouputInvoicePost = (params) =>postActionOut("/sys/invoiceList/outputFile",params)

const ouputMotoDataInvoicePost = (params) =>postAction("/sys/invoiceList/ouputMotoDataFile",params)

const downloadPdf = (params) =>getActionOutPut("/sys/seikyushozensonfunshitsu/downloadPdfFile",params)

const batchJobDelete = (params)=>putAction("/sys/job/delete",params);

const batchJobAll = (params)=>getAction("/sys/job/allJobs",params);

const queryTaskJobs = (params)=>getAction("/sys/task/queryTaskJobs",params);

const queryTaskRecords = (params)=>getAction("/sys/taskRecord/list",params);

const batchTaskDelete = (params)=>putAction("/sys/task/delete",params);

const startTask = (params)=>putAction("/sys/task/start",params);

const stopTask = (params)=>putAction("/sys/task/stop",params);

const runTaskNow = (params)=>putAction("/sys/task/runNow",params);

const stopTaskNow = (params)=>putAction("/sys/task/stopNow",params);

const editBatchSystemConfig = (params)=>putAction("/sys/batchSystemConfig/edit",params);

const batchSystemConfigInfo = (params)=>getAction("/sys/batchSystemConfig/info",params);

const downloadFile = (params)=>downFile("/system/download",params);

const commonProcess = (params)=>postAction("/sys/commonProcess/process",params);

const simpleSave = (params)=>postAction("/sys/commonProcess/simpleSave",params);

const simpleDelete = (params)=>postAction("/sys/commonProcess/simpleDelete",params);

const sqlProcess = (params)=>postAction("/sys/commonProcess/sqlProcess",params);

//项目人员
const checkMember = (params)=>getAction("/pro/projectMember/checkMember",params);
const deleteMember= (params)=>postAction("/pro/projectMember/delete",params);
//项目页面
const addProjectForm = (params)=>postAction("/projectForm/add",params);
const editProjectForm = (params)=>putAction("/projectForm/edit",params);

//项目
const addProject = (params)=>postAction("sysp/projectList/add",params);
const editProject = (params)=>putAction("sysp/projectList/edit",params);
// const getFileName = (params) =>getFileName("/sys/job/getFileName",params)
//客户重复check
const pjNameCheck = (params)=>getAction("sysp/projectList/pjNameCheck",params);
export {
  // imgView,
  // doMian,
  addUnit,
  editUnit,
  checkUnitCode,
  deleteUnitList,
  addStandardUnitConversion,
  editStandardUnitConversion,
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changPassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  getDictText,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  queryDepartPermission,
  saveDepartPermission,
  loadCategoryData,
  supplierDuplicateCheck,
  productUnitDuplicateCheck,
  productDuplicateCheck,
  productSupplierDuplicateCheck,
  customerDuplicateCheck,
  productCustomerDuplicateCheck,
  addSupp,
  editSupp,
  addOrderInput,
  addStock,
  editStock,
  getStockHistory,
  addShipment,
  editShipment,
  addCuto,
  editCuto,
  addPdct,
  editPdct,
  queryPdctById,
  addOrderPurchase,
  editOrderPurchase,
  addReceipt,
  editReceipt,
  delReceipt,
  listSelect,
  editOrderHeader,
  editOrderDetail,
  addOrderDetail,
  editOrderInvoice,
  addOrderInvoice,
  getNextCode,
  invoiceNumberCheck,
  quartzStatus,
  getJobClasses,
  download,
  getJobLogList,
  downloadPdf,
  // getFileName,
  ouputPost,
  ouputInvoicePost,
  ouputMotoDataInvoicePost,
  duplicateNewCheck,
  ouputJobMotoDataPost,
  batchJobDelete,
  batchTaskDelete,
  batchJobAll,
  queryTaskJobs,
  queryTaskRecords,
  startTask,
  stopTask,
  editBatchSystemConfig,
  batchSystemConfigInfo,
  downloadFile,
  runTaskNow,
  stopTaskNow,
  commonProcess,
  simpleSave,
  simpleDelete,
  sqlProcess,
  checkMember,
  deleteMember,
  addProjectForm,
  editProjectForm,
  addProject,
  editProject,
  pjNameCheck

}




/**
 * Created by Administrator on 2014/10/17.
 */
var ajaxResult = function (opts) {
    this.data = opts.data;
    this.code = opts.code||0;//0,1xx,2xxx
    this.status = opts.status||'success';//success,
    this.errorMessage = opts.errorMessage||'';
}
ajaxResult.prototype.isSuccess = function () {
    return this.code == 0;
};
module.exports = ajaxResult;

/**
 * Created by zhigang on 15/1/13.
 */
exports.ErrorCode = {
    Sucess: 0,
    Error: 1

}

exports.SportsIndividual = {
    Basketball: 'basketball',//篮球
    Football: 'football',//足球
    Volleyball: 'volleyball',//排球
    Tennis: 'tennis',//网球
    Badminton: 'badminton',//羽毛球
    TableTennis: 'tabletennis',//乒乓球
    Billiards: 'billiards',//台球
    Swimming: 'swimming',//游泳
    Skiing: 'skiing'//滑雪
}
exports.SportsIndividualCode = {
    basketball: 10,//篮球
    football: 11,//足球
    tennis: 12,//网球
    badminton: 13,//羽毛球
    tabletennis: 14,//乒乓球
    billiards: 15,//台球
    swimming: 16,//游泳
    skiing: 17,//滑雪
    volleyball: 18//排球
}
exports.Gender = {
    Male: 0,
    Famale: 1
}
exports.UserType = {
    Admin: 'admin',
    User: 'user'
};
exports.UserStatus = {
    Inactive: 'inactive',
    Activated: 'activated',
    Deleted: 'deleted'
}
exports.LoginResult = {
    Error: 'error',
    Success: 'success',
    UserNotExist: 'usernotexist',
    InvalidPassword: 'invalidpassword'
}

exports.NoticeType={
    Message:'0',
    Alarm:'1'
}
exports.NoticeState={
    UnRead:'0',
    Read:'1'
}
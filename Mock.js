//模拟接口请求
// 状态：0表示正常、1低电量、2掉线、3倾倒
let data = Mock.mock('http://api.com',[
    {
        coordinate:[110.92377,21.685018],
        id:"0",
        name:"东干道1号",
        status:0
    },
    {
        coordinate:[110.92577,21.685018],
        id:"1",
        name:"东干道2号",
        status:1
    },
    {
        coordinate:[110.92777,21.685018],
        id:"2",
        name:"东干道3号",
        status:2
    },
    {
        coordinate:[110.92977,21.68501],
        id:"3",
        name:"东干道4号",
        status:3
    },
    {
        coordinate:[110.93177,21.685018],
        id:"4",
        name:"东干道5号",
        status:0
    },
    {
        coordinate:[110.93477,21.685018],
        id:"5",
        name:"东干道6号",
        status:3
    },

]);
//————————————————————————————————基础加载
//初始化地图
let map = new BMapGL.Map("container",{
    // minZoom: 16,   
    // maxZoom: 20
});

let markers = [];//点标记对象
let json = [];//请求返回json文件
let CenterMarker = {};   //存储点击之后显示的一个设备，用于指定清除

    // 创建Map实例
map.centerAndZoom(new BMapGL.Point(110.929277,21.685018),17);  // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
let scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
map.addControl(scaleCtrl);
let zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放键控件
map.addControl(zoomCtrl);
let navi3DCtrl = new BMapGL.NavigationControl3D();  // 添加3D控件
map.addControl(navi3DCtrl);

//查找地点
function search_place(){
    let event = window.event || arguments.callee.caller.arguments[0];
    if (event.keyCode == 13)
        {
        //执行事件
        let place = document.getElementsByClassName("search_input")[0].value;
        let local = new BMapGL.LocalSearch(map, {
        renderOptions:{map: map}
        });
        local.search(place);
        }
}
//————————————————————————————————数据渲染
// 开始设备的数据渲染,首先一打开网页要显示全部设备，包括设备id、名称、坐标、状态、

// 数据处理函数，接收数据，渲染列表，渲染地图
function ProcessingData(i,imgSrc){
    // 把坐标分离，传入
    let lng = json[i].coordinate[0];
    let lat = json[i].coordinate[1];
    let Icon = 0;
    Icon = new BMapGL.Icon(imgSrc, new BMapGL.Size(50, 50));//自定义图标
    // 创建ul对象、创建插入li方法、为li添加属性、把li在ul子中渲染。
    let parent = document.getElementById("all_equipment_information"); 
    let li = document.createElement("li");
    li.setAttribute("id",json[i].id);   //li添加id，作用是用于渲染img的定位
    li.setAttribute("onclick","displayInMap()")
    parent.appendChild(li);
    //创建li的对象、定义创建a，img的方法、为img添加路径属性
    let parentLi = document.getElementById(json[i].id); //这里要根据id找到对应元素，所以li必须id
    let a = document.createElement("a");
    let img = document.createElement("img");
    img.setAttribute("src",imgSrc);   //图片路径在调用方法的时候传入。
    parentLi.appendChild(img);    
    a.setAttribute("id",json[i].id);   //为a添加id
    a.innerHTML = json[i].name;   //为a加设备名
    parentLi.appendChild(a);      //创建a
    //添加点标记
    let pt = new BMapGL.Point(lng,lat);
    let marker = new BMapGL.Marker(pt,{
        icon:Icon
    });
    map.addOverlay(marker);  
    markers[i] = marker;   //保存一下点标记对象。
}

//Ajax请求数据，
let xhr = new XMLHttpRequest();
xhr.open("get", "http://api.com", true);
xhr.send(null);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        json = JSON.parse(xhr.responseText);  //拿到返回结果再解析成json。
        //把所有设备开始渲染，
        //for循环应该在ajax里面，不然ajax还没有数据，for就已经走完了。
        for(let i=0;i<json.length;i++){
            switch(json[i].status){  //调用数据渲染函数
                case 0:
                    ProcessingData(i,"/pic/Normal.png")
                    break;
                case 1:
                    ProcessingData(i,"/pic/LowPower.png")
                    break;
                case 2:
                    ProcessingData(i,"/pic/OffLine.png")
                    break;
                case 3:
                    ProcessingData(i,"/pic/Fail.png")
                    break;
            }   
        }
    }
}

//——————————————————————————————————组件逻辑功能
// 打开菜单，通过拉出div
function openMenu(){
    const display = document.getElementById('menu_open').style.left;
    if(display === '-280px'){
        document.getElementById('menu_open').style.left = '20px';
    }else{
        document.getElementById('menu_open').style.left = '-280px';
    }
}

// 打开设备目录的变化
function openMenu_in1(){
    // 三角图标更换
    const img = document.getElementById("menu_in1_img");
    const display = document.getElementById('all_equipment').style.display
    const left = document.getElementById('all_equipment').style.left

    document.getElementById("menu_in1_img").src = img.src.indexOf('open.png') > -1 ? '/pic/menu-close.png': '/pic/menu-open.png'
    //展开列表
    if(display === ''){
        document.getElementById('all_equipment').style.display = 'block';
        
    }else if(display === 'none'){
        document.getElementById('all_equipment').style.display = 'block'

    }else{
        document.getElementById('all_equipment').style.display = 'none'

    }

}
//获取视野高度方法,以container的高度为基准。
function obtainContainerHeight(){
    const containerHeight = document.getElementById('container').style.height;      //获取地图高度
    return containerHeight;
}
//下面两个应该所有控件要写的，直接改变比例值，两种版式
//container垂距100%
function containerEnlarge(){
    document.getElementById('container').style.height = '100%';
    document.getElementById('menu_open').style.height = '80%';
}
//container垂距70%
function containerNarrow(){
    document.getElementById('container').style.height = '70%';
    document.getElementById('menu_open').style.height = '50%';
}

function change_zoom(){
    //获取当前高度
    let ContainerHeight = obtainContainerHeight();  //获取container的高度就知道整体高度
    //判断视野并修改
    if(ContainerHeight === '100%' || ContainerHeight === ''){
        containerNarrow();
    }else{
        containerEnlarge()
    }
}

//点击设备的方法，点击之后改变container高度，为信息栏让出空间。
function displayInMap(){
    let ContainerHeight = obtainContainerHeight();              //获取container的高度就知道整体高度
    if(ContainerHeight === '100%'||ContainerHeight === ''){
        containerNarrow();
    }
}

//事件委托，检测指定id发生的单击事件，target表示一个确定的元素。点击设备跳转到地图指定位置，
document.getElementById('all_equipment').addEventListener("click", function (event) {
    let target = event.target; 
    if(target.tagName === 'A'){  //只有点击到a标签才生效
        //删除前一个具体渲染的元素
        map.removeOverlay(CenterMarker);
        //通过id与数组一一对应，通过id去查找事先数组里的坐标位置。
        let coordinate = json[target.id].coordinate;
        let lng = coordinate[0];
        let lat = coordinate[1];
        CenterMarker = new BMapGL.Marker(new BMapGL.Point(lng, lat));
        map.addOverlay(CenterMarker); //渲染进去
        // 设为中心点
        var point = new BMapGL.Point(lng, lat);
        map.setCenter(point); 
    }
})       


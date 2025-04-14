/******************************************************
 * 模态窗打开/关闭逻辑
 ******************************************************/
const openCreateEventModalBtn = document.getElementById("openCreateEventModal");
const createEventModal = document.getElementById("createEventModal");
const closeCreateEventModalBtn = document.getElementById("closeCreateEventModal");

// 打开模态窗
openCreateEventModalBtn.addEventListener("click", () => {
    createEventModal.style.display = "flex";
    // 可选：等modal显示后再加载/刷新地图
    initCreateEventMap();
});

// 关闭模态窗
closeCreateEventModalBtn.addEventListener("click", () => {
    createEventModal.style.display = "none";
});

// 如果点击了蒙层区域也关闭
createEventModal.addEventListener("click", (event) => {
    if (event.target === createEventModal) {
        createEventModal.style.display = "none";
    }
});

/******************************************************
 * 提交逻辑（仅示例简单输出）
 ******************************************************/
const submitCreateEventBtn = document.getElementById("submitCreateEvent");
submitCreateEventBtn.addEventListener("click", () => {
    // 获取表单内容
    const imageFile = document.getElementById("imageUpload").files[0];
    const selectedCategory = document.querySelector("input[name='category']:checked")?.value;
    const title = document.getElementById("eventTitle").value.trim();
    const content = document.getElementById("eventContent").value.trim();

    // 验证所有必填字段
    if (!imageFile) {
        alert("Please upload an image");
        return;
    }

    if (!selectedCategory) {
        alert("Please select a category");
        return;
    }

    if (!title) {
        alert("Please enter a title");
        return;
    }

    // 获取地图中选择的位置
    const location = geolocationCenter;

    console.log("Image File:", imageFile);
    console.log("Category:", selectedCategory);
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Location:", location);

    // TODO: 发送到后台 /events/create 之类的接口
    alert("Event Created!");
    createEventModal.style.display = "none";
});

/******************************************************
 * Google Map：定位用户当前位置并显示在createEventMap上
 ******************************************************/
let createMap; // 存放地图实例
let geolocationCenter = { lat: 40.7128, lng: -74.0060 }; // 默认纽约坐标

function initCreateEventMap() {
    // 如果地图已创建过，可以选择 refresh 或 return
    if (createMap) return;

    const mapDiv = document.getElementById("createEventMap");
    createMap = new google.maps.Map(mapDiv, {
        center: geolocationCenter,
        zoom: 14,
        disableDefaultUI: true  // 去除地图内置控件
    });

    // 获取用户真实地理位置
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                geolocationCenter = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                createMap.setCenter(geolocationCenter);

                // 在地图上放个标记
                new google.maps.Marker({
                    position: geolocationCenter,
                    map: createMap,
                    title: "You are here"
                });
            },
            (error) => {
                console.warn("Geolocation error:", error);
            }
        );
    }
} 
let map;
// 纽约的坐标
const nyPosition = { lat: 40.768712448459844, lng: -73.98179241229592 };

// 初始化地图
function initMap() {
    // 创建地图并指定容器元素
    map = new google.maps.Map(document.getElementById("map"), {
        center: nyPosition,
        zoom: 12,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    // 添加一些示例事件标记
    addSampleMarkers();
}

// 添加示例事件标记
function addSampleMarkers() {
    const events = [
        { lat: 40.7589, lng: -73.9851, title: "Gun Shot Incident", type: "gun shot" },
        { lat: 40.7128, lng: -74.0060, title: "Traffic Accident", type: "accident" },
        { lat: 40.7282, lng: -73.9942, title: "Street Performance", type: "performance" },
        { lat: 40.7429, lng: -73.9712, title: "Road Closed", type: "road closed" },
        { lat: 40.7831, lng: -73.9712, title: "Food Truck Festival", type: "food truck" }
    ];

    events.forEach(event => {
        const marker = new google.maps.Marker({
            position: { lat: event.lat, lng: event.lng },
            map: map,
            title: event.title,
            // 可以根据事件类型定制图标
            // icon: getIconForEventType(event.type)
        });

        // 为标记添加点击事件
        marker.addListener("click", () => {
            // 在实际应用中，这里可以显示事件详情或跳转到事件详情页
            alert(event.title);
        });
    });
}

// 当DOM加载完成后加载Google Maps API
document.addEventListener("DOMContentLoaded", function () {
    // 检查是否已经加载了Google Maps API
    if (typeof google === 'undefined') {
        // 动态创建Google Maps脚本
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBZ1cnugGu4jiIWn3PipPsmG1Vli9hTEmo&libraries=geometry&callback=initMap&language=en&region=US";
        script.async = true;
        script.defer = true;

        // 如果加载失败，显示错误信息
        script.onerror = function () {
            const mapElement = document.getElementById("map");
            if (mapElement) {
                mapElement.innerHTML = '<div style="text-align:center;padding:50px;">Unable to load map. Please check your internet connection or try again later.</div>';
            }
        };

        // 将脚本添加到文档
        document.body.appendChild(script);
    } else {
        // 如果已经加载了Google Maps API，直接初始化地图
        initMap();
    }
});

// 实用函数：根据事件类型返回不同的图标
// 这个功能可以根据需要扩展
function getIconForEventType(type) {
    const iconBase = "https://maps.google.com/mapfiles/ms/icons/";

    switch (type) {
        case "gun shot":
        case "fight":
        case "stealing":
        case "assaulting":
            return iconBase + "red-dot.png";
        case "traffic jam":
        case "road closed":
        case "accident":
            return iconBase + "yellow-dot.png";
        case "performance":
        case "food truck":
        case "parade":
            return iconBase + "blue-dot.png";
        default:
            return iconBase + "red-dot.png";
    }
} 
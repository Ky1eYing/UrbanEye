// var echarts = require('echarts');

const categoryList = [
    "all category", "gun shot", "fight", "stealing", "assaulting", "traffic jam",
    "road closed", "accident", "performance", "food truck", "parade"
];



document.addEventListener('DOMContentLoaded', async () => {

    const rawData = await getChartStats();

    if (rawData) {

        console.log('api rawData:', rawData);

        // Process the raw data to create series for the chart
        let categoryDataMap = makeCategoryDataMap(rawData);

        drawLineChart(categoryDataMap);

        drawPieChart(categoryDataMap);

    } else {
        console.error('Failed to fetch chart data');
    }
});



async function getChartStats() {
    try {
        const response = await fetch(`api/chart/stats`);
        if (!response.ok) {
            console.error(`Error fetching user events (${response.status}): ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        if (data.code === 200 && data.data) {
            console.log(`Successfully fetched ${data.data.length} events for user`);
            return data.data;
        } else {
            console.error('Error in API response:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when fetching user events:', error);
        return null;
    }
}



// // make data
// function makeSeries(rawData) {


//     // initialize an object to hold the data for each category
//     const categoryDataMap = {};
//     categoryList.forEach(category => {
//         categoryDataMap[category] = [];
//     });

//     // for each day in the raw data, extract the date and count for each category
//     rawData.forEach(day => {
//         const date = day.date;
//         categoryList.forEach(category => {
//             const count = day.categories[category]?.count || 0;
//             categoryDataMap[category].push([date, count]);
//         });
//     });

//     // create the series for the chart
//     const series = categoryList.map(category => ({
//         name: category,
//         type: 'line',
//         // smooth: true,
//         symbol: 'circle',
//         data: categoryDataMap[category]
//     }));

//     return series;
// }

function generateDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    while (current <= new Date(endDate)) {
        dates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

let allDates = [];

function makeCategoryDataMap(rawData) {
    allDates = generateDateRange(rawData[0].date, new Date());

    const dateMap = {};
    rawData.forEach(day => {
        dateMap[day.date] = day;
    });

    const categoryDataMap = {};
    categoryList.forEach(category => {
        categoryDataMap[category] = allDates.map(date => {
            const day = dateMap[date];
            if (!day) return [date, 0];

            if (category === "all category") {
                return [date, day.total || 0];
            } else {
                const count = day.categories?.[category]?.count || 0;
                return [date, count];
            }
        });
    });

    return categoryDataMap;
}


function drawLineChart(categoryDataMap) {
    var chartDom = document.getElementById('line');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: 'Everyday Events Count Chart'
        },
        legend: {
            top: '8%',
            width: '80%',
            left: 'center',
            padding: 10,
            itemGap: 20,
            selected: {
                "all category": true,
                "gun shot": false,
                "fight": false,
                "stealing": false,
                "assaulting": false,
                "traffic jam": false,
                "road closed": false,
                "accident": false,
                "performance": false,
                "food truck": false,
                "parade": false
            }
        },
        grid: {
            top: '25%'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, 0.1]
        },
        dataZoom: [
            {
                type: 'inside',
                start: 80,
                end: 100
            },
            {
                start: 80,
                end: 100
            }
        ],
        series: categoryList.map(category => ({
            name: category,
            type: 'line',
            symbol: 'circle',
            // smooth: true,
            data: categoryDataMap[category]
        }))
    };
    option && myChart.setOption(option);
}


function drawPieChart(categoryDataMap) {
    var chartDom = document.getElementById('pie');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
        tooltip: {
            trigger: 'item'
        },
        title: {
            left: 'center',
            text: 'Events in Category Chart'
        },
        legend: {
            top: '8%',
            width: '80%',
            left: 'center',
            padding: 10,
            itemGap: 15,
            data: categoryList
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '60%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                data: Object.entries(categoryDataMap)
                    .filter(([category]) => category !== "all category")
                    .map(([category, dataArray]) => {
                        const total = dataArray.reduce((sum, [date, count]) => sum + count, 0);
                        return { name: category, value: total };
                    })
                    .sort((a, b) =>  b.value - a.value)
                //   .filter(item => item.value > 0)
            }
        ]
    };
    option && myChart.setOption(option);
}
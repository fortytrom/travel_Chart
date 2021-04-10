const $travelCard_list = document.querySelector('.travelCard_list');
const $search_total = document.querySelector('#search_total');
const $filter = document.querySelector('#filter');
const $search_result = document.querySelector('.search_result');
const $ticketSubmit = document.querySelector('#ticketSubmit');
const $ticketName = document.querySelector('#ticketName');
const $ticketImgUrl = document.querySelector('#ticketImgUrl');
const $ticketArea = document.querySelector('#ticketArea');
const $ticketPrice = document.querySelector('#ticketPrice');
const $ticketRemaining = document.querySelector('#ticketRemaining');
const $ticketIntroduction = document.querySelector('#ticketIntroduction');
const $ticketScore = document.querySelector('#ticketScore');
const form = document.querySelector('.form');
let str = "";
let travelCardData; 
let ajaxUrl = "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json";
let chartColor = ['#26C0C7', '#5151D3', '#E68618',];
let $chart;
let chartLabel;
axios.get(ajaxUrl)
    .then(function (response) {
        travelCardData = response.data;
        init();
})

filter();


// 初始化
function init() {
    printData(travelCardData);
    let initChartData = chartData(travelCardData);
    chartSetting(initChartData);
}


// 點了新增按鈕，表單檢核通過，要觸發新增資料
$ticketSubmit.addEventListener('click', function (e) {
    e.preventDefault()
    let isPass = checkTicketName() * checkTicketImgUrl() * checkTicketArea() * checkTicketPrice() * checkticketScore() * checkticketRemaining();
    if (isPass == 1) {
        addData()
        form.reset();
    }
})

// filter改變的話，顯示對應結果
function filter() {
    $filter.addEventListener('change', function (e) {
        let strFilter = [];
        let nowFilter = e.target.value;
        // 如果選到全部地區的話，要印出全部資料
        if (nowFilter === "全部地區") {
            printData(travelCardData);
            uploadChart(chartData(travelCardData))
            return
        } else {
            // 篩選對應資料
            travelCardData.forEach(function (value) {
                if (nowFilter === value.area) {
                    strFilter.push(value)
                }
            });
            printData(strFilter);
            
            let newAry = []
            chartData(travelCardData).forEach(function (item) {
                if( item[0] != nowFilter){
                    newAry.push(item[0])
                }
            })
            $chart.hide(
                newAry
            );
            $chart.show(
                nowFilter
            );
        }

    })
    
}

// 把資料印在畫面上
function printData(data) {
    let str = "";
    data.forEach(function (value) {
        let content =
            `<li class="item col-12 col-md-6 col-lg-4">
                <div class="g_travelCard">
                    <div class="tag_area">${value.area}</div>
                    <div class="cover">
                        <div class="pb" style="background: url(${value.imgUrl});background-size: cover;">
                        </div>
                    </div>
                    <div class="info">
                        <div class="tag_scroe">${value.rate}</div>
                        <h2 class="info_title">${value.name}</h2>
                        <p class="info_introdution">${value.description}</p>
                        <div class="row font_main align-items-center ">
                            <div class="col-6">
                                <i class="fas fa-exclamation-circle"></i>
                                <span>剩下最後 ${value.rate} 組</span>
                            </div>
                            <div class="col-6 text_right">
                                <span class="g_price">
                                    <span>TWD </span>
                                    <span class="price"><span>$</span><span>${value.price}</span></span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>`
        str += content
    });
    // 資料總數
    $search_total.textContent = data.length;
    // 下方卡片
    $travelCard_list.innerHTML = str;
}

// 處理圖表資料
function chartData(travelCardData) {

    let totalAreaData = {};
    let chartLabel;
    let chartColumnsData = [];

    travelCardData.forEach(function(item){
        if(totalAreaData[item.area] == undefined){
            totalAreaData[item.area] = 1
        }
        else{
            totalAreaData[item.area] += 1
        }
    })
    chartLabel = Object.keys(totalAreaData);

    //組成圖表要的格式 
    for(let i = 0; i < chartLabel.length ; i++){
        chartColumnsData.push( [chartLabel[i],totalAreaData[chartLabel[i]]])
    }
    return chartColumnsData;

}


// 圖表設定
function chartSetting(chartData) {
    $chart = c3.generate({
        bindto: '#chart',
        data: {
            columns: 
                chartData
            ,
            type : 'donut',
        },
        color: {
            pattern: chartColor
        },
        size: {
            height: 200,
            width: 200
        },
        padding: {
            top: 0,
            bottom: 0
        },
        donut: {
            label: {
                show: false
            },
            title: "套票地區比重",
            width: 10
        }
    });  
    return $chart
}


// 圖表更新
function uploadChart(chartData) {
    chartSetting(chartData).load({
        columns: 
            chartData
    });
}

// 圖表隱藏
function hideChart(chartData) {
    chartSetting(chartData).hide({
        columns: 
            chartData
    });
}

// 新增資料
function addData() {
    let inputData = {};
    inputData.name = $ticketName.value.trim()
    inputData.imgUrl = $ticketImgUrl.value.trim()
    inputData.area = $ticketArea.value.trim()
    inputData.group = $ticketRemaining.value.trim()
    inputData.description = $ticketIntroduction.value.trim()
    inputData.rate = $ticketScore.value.trim()
    inputData.price = $ticketPrice.value.trim()
    travelCardData.unshift(inputData)
    printData(travelCardData);
    let initChartData = chartData(travelCardData);
    uploadChart(initChartData)
    $filter.getElementsByTagName('option')[1].selected = 'selected';
}

// 檢核套票名稱不得為空值且不得>10個字
function checkTicketName() {
    let isPass = false;
    let inputValue = $ticketName.value.trim();
    const $ticketNameError = document.querySelector('#ticketName ~ .alert');
    if (inputValue == "") {
        $ticketNameError.textContent = "值不得為空"
        $ticketNameError.setAttribute('style', "display:block;")
    } else if (inputValue.length > 10) {
        $ticketNameError.textContent = "不得超過10個字"
        $ticketNameError.setAttribute('style', "display:block;")
    } else {
        $ticketNameError.setAttribute('style', "display:none;")
        isPass = true
    }
    return isPass
}

// 圖片為必填
function checkTicketImgUrl() {
    let isPass = false;
    let inputValue = $ticketImgUrl.value.trim();
    const $ticketImgUrlError = document.querySelector('#ticketImgUrl ~ .alert');
    if (inputValue == "") {
        $ticketImgUrlError.textContent = "值不得為空"
        $ticketImgUrlError.setAttribute('style', "display:block;")
    } else {
        $ticketImgUrlError.setAttribute('style', "display:none;")
        isPass = true
    }
    return isPass
}

// 需選擇景點地區
function checkTicketArea() {
    let isPass = false;
    let inputValue = $ticketArea.value.trim();
    const $ticketAreaError = document.querySelector('#ticketArea ~ .alert');
    if (inputValue == "請選擇景點地區") {
        $ticketAreaError.textContent = "請選擇景點地區"
        $ticketAreaError.setAttribute('style', "display:block;")
    } else {
        $ticketAreaError.setAttribute('style', "display:none;")
        isPass = true
    }
    return isPass
}

// 輸入金額
function checkTicketPrice() {
    let isPass = false;
    let inputValue = $ticketPrice.value.trim();
    const $ticketPriceError = document.querySelector('#ticketPrice ~ .alert');
    if (isNaN(inputValue) || inputValue == "") {
        $ticketPriceError.textContent = "請輸入數字"
        $ticketPriceError.setAttribute('style', "display:block;")
    } else if (inputValue <= 0) {
        $ticketPriceError.textContent = "請輸入正數"
        $ticketPriceError.setAttribute('style', "display:block;")
    } else {
        $ticketPriceError.setAttribute('style', "display:none;")
        isPass = true
    }
    return isPass
}

// 套票星級
function checkticketScore() {
    let isPass = false;
    let inputValue = $ticketScore.value.trim();
    const $ticketScoreError = document.querySelector('#ticketScore ~ .alert');
    if (isNaN(inputValue) || inputValue == "") {
        $ticketScoreError.textContent = "請輸入數字"
        $ticketScoreError.setAttribute('style', "display:block;")
    } else if (inputValue <= 0 || inputValue >= 10) {
        $ticketScoreError.textContent = "請輸入1~10的數值"
        $ticketScoreError.setAttribute('style', "display:block;")
    } else {
        $ticketScoreError.setAttribute('style', "display:none;")
        isPass = true
    }
    return isPass
}

// 輸入金額
function checkticketRemaining() {
    let isPass = false;
    let inputValue = $ticketRemaining.value.trim();
    const $ticketRemainingError = document.querySelector('#ticketRemaining ~ .alert');
    if (isNaN(inputValue) || inputValue == "") {
        $ticketRemainingError.textContent = "請輸入數字"
        $ticketRemainingError.setAttribute('style', "display:block;")
    } else if (inputValue <= 0) {
        $ticketRemainingError.textContent = "請輸入正數"
        $ticketRemainingError.setAttribute('style', "display:block;")
    } else {
        $ticketRemainingError.setAttribute('style', "display:none;")
        isPass = true
    }
    return isPass
}

// 套票描述
function checkticketIntroduction() {
    let isPass = false;
    let inputValue = $ticketIntroduction.value.trim();
    const $ticketIntroductionError = document.querySelector('#ticketIntroduction ~ .alert');
    if (inputValue.length > 100) {
        $ticketIntroductionError.textContent = "文字不可超過100字"
        $ticketIntroductionError.setAttribute('style', "display:block;")
    } else {
        $ticketIntroductionError.setAttribute('style', "display:none;")
        isPass = true
    }
    return isPass
}


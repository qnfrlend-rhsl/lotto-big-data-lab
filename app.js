const API_URL = "https://script.google.com/macros/s/AKfycbzUe1bbYAgb64loinp_JRB07tOvkdJYhaE5NKiNvl854RRFTT_CSoZquFt0hL5bE47Izg/exec";
let lottoData = [];
// ===============================
// 데이터 가져오기
// ===============================
fetch(API_URL)
.then(res => {
    console.log("GAS 응답 상태:", res.status);
    return res.json();
})
.then(data => {
    console.log("GAS 데이터:", data);
    if(data.success){
        lottoData = data.data;
        document.getElementById("info").innerHTML =
        `
        총 데이터 : ${data.total}회<br>
        최신 회차 : ${lottoData[0]["회차"]}회
        `;
        console.log("로또 데이터 로딩 완료");
        console.log(lottoData);
    }else{
        document.getElementById("info").innerHTML =
        "GAS 데이터 오류";
    }
})
.catch(error=>{
    document.getElementById("info").innerHTML =
    "데이터 불러오기 실패";
    console.log("GAS 오류:",error);
});

// ===============================
// 테스트 버튼
// ===============================
///////////////////////////////////////////////////////////////// 최근 45회 평균 번호 생성코드 시작
function analyze45Average(){
    const recent = lottoData.slice(0,45);
    let count = {};
    for(let i=1;i<=45;i++){
        count[i]=0;
    }
    recent.forEach(row=>{
    for(let i=1;i<=6;i++){
        let num = Number(
            row["번호"+i] ||
            row["번호"+(i+1)] ||
            row[i] ||
            row[String(i)]
        );
        if(num >= 1 && num <=45){
            count[num]++;
        }
      }
    });
    let total = 0;
    for(let i=1;i<=45;i++){
        total += count[i];
    }
    let avg = total / 45;
    let result = [];
    let averageNumbers = [];
    for(let i=1;i<=45;i++){

        /*   //////////////////평균 6회만 나오게 하는 코드이며, 0.5수치를 1수정하면 평균 5,6,7회 번호가 나옴
        if(Math.abs(count[i]-avg)<=0.5){
            result.push(`${i}번 (${count[i]}회)`);
        }*/

        if(count[i] >= 5 && count[i] <= 6){
          result.push(`${i}번 (${count[i]}회)`);
          averageNumbers.push(i);
       }


    }
    let recommendText = "";
    let setCount = 0;
    let tryCount = 0;

    while(setCount < 5 && tryCount < 1000){
    let lottoSet = makeLottoSet(averageNumbers);
    if(checkLottoCondition(lottoSet)){
        setCount++;
        recommendText += 
        `
        ${setCount}세트 :
        ${lottoSet.map(num => 
        `<span class="lotto-ball ball-${getBallColor(num)}">
            ${String(num).padStart(2,"0")}
            </span>`
        ).join("")}
        <br><br>
        `;
    }
    tryCount++;
    }

    // 조건 통과 번호 부족할 경우
    if(setCount < 5){
    recommendText += 
    `조건을 만족하는 번호 조합 생성 실패 (${setCount}세트 생성)<br>`;
    }

    document.getElementById("result").innerHTML = `
    <h3>최근 45회 평균 번호</h3>
    평균 출현 횟수 : ${avg.toFixed(2)}회
    <hr>
    ${result.join("<br>")}
    <hr>

    <h3>🎯 추천 번호 5세트</h3>
    <div id="recommendResult">
    ${recommendText}
    </div>
    `;
}

// ===============================
// 평균권 번호에서 6개 추출
// ===============================
function makeLottoSet(numbers){
    let temp = [...numbers];
    // 번호 섞기
    temp.sort(() => Math.random() - 0.5);
    // 6개 선택
    let lotto = temp.slice(0,6);
    // 오름차순 정렬
    lotto.sort((a,b)=>a-b);
    return lotto;
}
// ===============================
// 로또 조건 검사
// ===============================
function checkLottoCondition(numbers){
    // 홀짝 검사
    let odd = numbers.filter(n => n % 2 === 1).length;
    let even = 6 - odd;
    if(
        !(
            (odd === 3 && even === 3) ||
            (odd === 4 && even === 2) ||
            (odd === 2 && even === 4)
        )
    ){
        return false;
    }
    // 합계 검사
    let sum = numbers.reduce((a,b)=>a+b,0);
    if(sum < 100 || sum > 175){
        return false;
    }
    return true;
}

// ===============================
// 로또볼 색상 구분
// ===============================
function getBallColor(num){

    if(num <= 10){
        return "yellow";
    }

    if(num <= 20){
        return "blue";
    }

    if(num <= 30){
        return "red";
    }

    if(num <= 40){
        return "gray";
    }

    return "green";
}
///////////////////////////////////////////////////////////////// 최근 45회 평균 번호 생성코드 끝
///////////////////////////////////////////////////////////////// 최근 45회 평균 이상 번호 생성코드 시작

function analyze45High(){
    const recent = lottoData.slice(0,45);
    let count = {};
    for(let i=1;i<=45;i++){
        count[i]=0;
    }
    recent.forEach(row=>{
        for(let i=1;i<=6;i++){
            let num = Number(
                row["번호"+i] ||
                row["번호"+(i+1)] ||
                row[i] ||
                row[String(i)]
            );
            if(num >= 1 && num <=45){
                count[num]++;
            }
        }
    });

    let total = 0;
    for(let i=1;i<=45;i++){
        total += count[i];
    }
    let avg = total / 45;
    let result = [];
    let highNumbers = [];

    // 평균 이상 번호 추출
    for(let i=1;i<=45;i++){
        if(count[i] > avg){
            result.push(
                `${i}번 (${count[i]}회)`
            );
            highNumbers.push(i);
        }
    }

    // 추천번호 5세트 생성
    let recommendText = "";
    let setCount = 0;
    let tryCount = 0;

    while(setCount < 5 && tryCount < 1000){
        let lottoSet = makeLottoSet(highNumbers);
        if(checkLottoCondition(lottoSet)){
            setCount++;
            recommendText += 
            `
            ${setCount}세트 :
            ${lottoSet.map(num => 
            `<span class="lotto-ball ball-${getBallColor(num)}">
            ${String(num).padStart(2,"0")}
            </span>`
            ).join("")}
            <br><br>
            `;
        }
        tryCount++;
    }
    // 조건 통과 번호 부족
    if(setCount < 5){
        recommendText += 
        `조건을 만족하는 번호 조합 생성 실패 (${setCount}세트 생성)<br>`;
    }
    document.getElementById("result").innerHTML = `
    <h3>최근 45회 평균 이상 번호</h3>
    평균 출현 횟수 : ${avg.toFixed(2)}회
    <hr>
    ${result.length ? result.join("<br>") : "해당 번호 없음"}
    <hr>
    <h3>🎯 추천 번호 5세트</h3>
    <div id="recommendResult">
    ${recommendText}
    </div>
    `;
}
// ===============================
// 로또볼 색상 구분
// ===============================
function getBallColor(num){

    if(num <= 10){
        return "yellow";
    }

    if(num <= 20){
        return "blue";
    }

    if(num <= 30){
        return "red";
    }

    if(num <= 40){
        return "gray";
    }

    return "green";
}
///////////////////////////////////////////////////////////////// 최근 45회 평균 이상 번호 생성코드 끝
///////////////////////////////////////////////////////////////// 최근 45회 평균 이하 번호 생성코드 시작

function analyze45Low(){
    const recent = lottoData.slice(0,45);
    let count = {};
    for(let i=1;i<=45;i++){
        count[i]=0;
    }
    recent.forEach(row=>{
        for(let i=1;i<=6;i++){
            let num = Number(
                row["번호"+i] ||
                row["번호"+(i+1)] ||
                row[i] ||
                row[String(i)]
            );
            if(num >= 1 && num <=45){
                count[num]++;
            }
        }
    });
    let total = 0;
    for(let i=1;i<=45;i++){
        total += count[i];
    }
    let avg = total / 45;
    let result = [];
    let lowNumbers = [];
    // 평균 이하 번호 추출
    for(let i=1;i<=45;i++){
        if(count[i] < avg){
            result.push(
                `${i}번 (${count[i]}회)`
            );
            lowNumbers.push(i);
        }
    }
    // 추천번호 5세트 생성
    let recommendText = "";
    let setCount = 0;
    let tryCount = 0;
    while(setCount < 5 && tryCount < 1000){
        let lottoSet = makeLottoSet(lowNumbers);
        if(checkLottoCondition(lottoSet)){
            setCount++;
            recommendText += 
           `
           ${setCount}세트 :
           ${lottoSet.map(num => 
           `<span class="lotto-ball ball-${getBallColor(num)}">
            ${String(num).padStart(2,"0")}
            </span>`
           ).join("")}
           <br><br>
           `;
        }
        tryCount++;
    }
    // 조건 통과 번호 부족
    if(setCount < 5){
        recommendText += 
        `조건을 만족하는 번호 조합 생성 실패 (${setCount}세트 생성)<br>`;
    }
    document.getElementById("result").innerHTML = `
    <h3>최근 45회 평균 이하 번호</h3>
    평균 출현 횟수 : ${avg.toFixed(2)}회
    <hr>
    ${result.length ? result.join("<br>") : "해당 번호 없음"}
    <hr>
    <h3>🎯 추천 번호 5세트</h3>
    <div id="recommendResult">
    ${recommendText}
    </div>
    `;
}
// ===============================
// 로또볼 색상 구분
// ===============================
function getBallColor(num){

    if(num <= 10){
        return "yellow";
    }

    if(num <= 20){
        return "blue";
    }

    if(num <= 30){
        return "red";
    }

    if(num <= 40){
        return "gray";
    }

    return "green";
}





function analyzeAllHot(){
    let count = {};
    for(let i=1;i<=45;i++){
        count[i]=0;
    }
    lottoData.forEach(row=>{
        for(let i=1;i<=6;i++){
            let num = Number(
                row["번호"+i] ||
                row[i] ||
                row[String(i)]
            );
            if(num >= 1 && num <=45){
                count[num]++;
            }
        }
    });
    let max = Math.max(...Object.values(count));
    let result = [];
    for(let i=1;i<=45;i++){
        if(count[i] === max){
            result.push(
                `${i}번 (${count[i]}회)`
            );
        }
    }
    document.getElementById("result").innerHTML = `
    <h3>전체 최다 출현 번호</h3>
    최고 출현 횟수 : ${max}회
    <hr>
    ${result.join("<br>")}
    `;
}





function analyzeAllAverage(){
    let count = {};
    for(let i=1;i<=45;i++){
        count[i]=0;
    }
    lottoData.forEach(row=>{
        for(let i=1;i<=6;i++){
            let num = Number(
                row["번호"+i] ||
                row[i] ||
                row[String(i)]
            );
            if(num >= 1 && num <=45){
                count[num]++;
            }
        }
    });
    let total = 0;
    for(let i=1;i<=45;i++){
        total += count[i];
    }
    let avg = total / 45;
    let result = [];
    for(let i=1;i<=45;i++){
        if(Math.abs(count[i]-avg) <= 0.5){
            result.push(
                `${i}번 (${count[i]}회)`
            );
        }
    }
    document.getElementById("result").innerHTML = `
    <h3>전체 평균 출현 번호</h3>
    평균 출현 횟수 : ${avg.toFixed(2)}회
    <hr>
    ${result.length ? result.join("<br>") : "평균 근처 번호 없음"}
    `;
}
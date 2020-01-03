# Web Storage

HTML5에서 웹 스토리지라는 기능이 있습니다.
웹 스토리지는 웹에 있는 스토리지가 아니라 브라우저의 내부 스토리지를 사용할 수 있게끔 제공하고 있는 기능입니다. 
웹 스토리지가 생긴 이유는 쿠키 사용에 대한 불편함과 제약으로 인해 불편함을 해소하고 다양한 기능들을 넣고자 하였기 때문에 HTML5에 WEBStorage라는 기능이 생겼습니다.



## 웹 스토리지의 탄생 배경을 알기 위한 쿠키와 웹 스토리지에 대한 특성



### 쿠키(Cookie)
4KB의 저장 용량
같은 사이트내에서 둘 이상의 탭을 열었을 때, 둘 이상의 트랜젝션 추적에 어려움이 있다.
도메인 내의 모든 페이지에 같이 전달 된다.
암호화 되지 않고 보내기 때문에 보안에 취약하다.
사용자의 로컬에 텍스트로 저장 되어 있어 쉽게 접근이 가능하다.
### 웹 스토리지(WEB STORAGE)
사양에 따르면 크기 제한이 없다. 
서버로 보내지 않는다.(원하면 명시적으로 보낼 수 있다.) 
유효기간이 없다.
JavaScript 객체를 저장할 수 있다.(정확하게는 객체의 복사본이 저장된다.) 
웹 스토리지에는 Session Storage와 Local Storage가 있다.


## 웹 스토리지의 데이터 저장과 반환

WEB STORAGE는 Key와 Value로 데이터를 저장할 수 있습니다. localStorage.setItem("id", "ktko");

WEB STORAGE는 Key로 데이터를 가져올 수 있습니다. localStorage.getItem("id");

웹 스토리지에서 반환되는 데이터는 **문자열**이다.



## 웹 스토리지의 방식과 유효 범위

웹 스토리지는 localStorage와 sessionStorage 두 가지 방식으로 나뉘어져 있습니다.

그리고 방식마다 약간의 차이가 있습니다.



## Session Storage

도메인 마다 스토리지가 생성된다.
유효범위와 보존기간이 있다.
같은 부라우저지만 새로 생성된 창에서는 세션이 달라 서로 다른 스토리지를 가진다.
윈도우 복제로 생성된 윈도우에서는 스토리지도 복제된다.

## Local Storage
도메인마다 스토리지가 생성된다.
보존기간에 제한이 없다. 사용자가 지우지 않는 한 영구적으로 저장된다.
도메인이 다르면 서로의 스토리지에 접근할 수 없다.
도메인이 같으면 소로 같은 스토리지를 사용한다.
쿠키 되신에 고유 설정 정보등을 대신하기 좋다.


## * 웹 스토리지 API

 Method

 Description 

 length

 스토리지에 저장된 데이터의 길이

 key(int)

 해당 인덱스 위치에 있는 데이터(문자열)을 반환 

 getItem(key)

 해당 키 값에 해당하는 데이터(문자열)을 반환 

 setItem(key, value)

 해당 Key 값에 대한 데이터를 저장 

 removeItem(key)

 해당 Key 값에 해당하는 데이터를 삭제 

 clear()

 스토리지에 저장된 모든 데이터를 삭제 


## 웹 스토리지를 활용한 대표적인 기능

sesstionStorage를 활용해서 사용자가 '입력폼'을 입력하다가 페이지에서 벗어난 경우 백업/복구

글쓰기를 하다가 사용자가 창을 벗어난 경우 관련 작성하던 내용 백업/복구용

웹서버에 필수적으로 접근해야 하는 캐쉬용(캐쉬로 먼저 서비스 제공, 차후에 업데이트)

웹페이지의 개인화 설정들에 대한 저장과 제공(캐쉬로 활용)

현재 읽은 글의 히스토리 저장(카운팅, 읽은글 표시 등으로 활용)

Canvas나 이미지에 대한 임시 저장 기능(base64로 변환)

웹페이지간 정보 전달(웹서버를 경유하지 않고 정보 로컬에 유지)


```
<html>
<head>
<style>
.list li {
    cursor: pointer;
}

.list li:hover:after, .list li.fav:after {
    content: ' \2605';
    color: rgb(155, 203, 125);
}

.list li.fav:hover:after {
    content: ' \2606';
}
</style>
</head>
<body>
    <ul class="list">
        <li id="pancakes">Pancakes</li>
        <li id="donuts">Donuts</li>
        <li id="cupcakes">Cupcakes</li>
        <li id="icecream">Icecream</li>
        <li id="cookies">Cookies</li>
        <li id="chocolate">Chocolate</li>
    </ul>
    <script>
        var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.forEach(function(favorite) {
            document.getElementById(favorite).className = 'fav';
        });

        document.querySelector('.list').addEventListener('click', function(e) {
            var id = e.target.id;
            var item = e.target;
            var index = favorites.indexOf(id);

            //if (!id) return;

            if (index == -1) {
                favorites.push(id);
                item.className = 'fav';

            } else {
                favorites.splice(index, 1);
                item.className = '';
            }

            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    </script>

</body>

</html>

```

```
<html>
<body>
    <input type="text" id="text" />
    <div id="log">
</body>
<script>
(function () {
    var text = localStorage.getItem("inputLog") || "";
    var divLog = document.getElementById("log");
    var inputText = document.getElementById("text");
    
    if (text) {
        divLog.innerHTML = text;
    }
    
    inputText.addEventListener("change", function () {
        if(inputText.value == "clear"){
            inputText.value = "";
            localStorage.clear();
            divLog.innerHTML = "";
            text = "";
            return;
        }
        
        text += inputText.value + "<br/>";
        divLog.innerHTML = text;
        localStorage.setItem("inputLog", text);
        inputText.value = "";
    });
}());
</script>
</html>

```

출처 : http://unikys.tistory.com/352


웹앱에서 네이티브 안드로이드와 직접 통신 없이 바로 기기 내부에 값을 저장하여 들고 오기 위한 방법을 찾다 차장님이 알려주심


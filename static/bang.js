
const tableBody = document.querySelector('tbody');
const prevPageLink = document.getElementById('prevPage');
const nextPageLink = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const itemsPerPage = 10; // Số hàng mỗi trang
let currentPage = 1;



function displayData(page) {

    tableBody.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
        
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/get-data';
    var data = { 'start': startIndex, 'end': endIndex };
    var jsonData = JSON.stringify(data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Xử lý dữ liệu trả về tại đây
            var responseData = JSON.parse(xhr.responseText);
            console.log(responseData.length);
            for(var i = 0; i < responseData.length; i++) {
                var item = responseData[i]
                const id = item.id;
                const temperature = item.temperature;
                const humidity = item.humidity;
                const light = item.light;
                const time = item.time;
                const gmtNow = new Date(time);
                const haNoiNow = new Date(gmtNow.getTime());
                const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedTime = new Intl.DateTimeFormat('en-US', options).format(haNoiNow);


                const row = document.createElement('tr');
                var cell = document.createElement('td');
                cell.textContent = id;
                row.appendChild(cell);


                cell = document.createElement('td');
                cell.textContent = temperature;
                row.appendChild(cell)

                cell = document.createElement('td');
                cell.textContent = light;
                row.appendChild(cell)

                cell = document.createElement('td');
                cell.textContent = humidity;
                row.appendChild(cell)
                
                var cell = document.createElement('td');
                cell.textContent = formattedTime;
                row.appendChild(cell);
                

                tableBody.appendChild(row);
            }
        }
    };

    xhr.send(jsonData);

    currentPageSpan.textContent = page;
    prevPageLink.disabled = page === 1;
}

prevPageLink.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayData(currentPage);
    }
});

nextPageLink.addEventListener('click', () => {
    currentPage++;
    displayData(currentPage);
});

// Hiển thị trang đầu tiên khi tải trang
displayData(currentPage);

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const criteria = document.getElementById("criteria");
const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");

searchButton.addEventListener("click", function () {
    const selectedCriteria = criteria.value;
    const searchText = searchInput.value;
    const start = startDate.value;
    const end = endDate.value;

    const data = {
        'condition': searchText,
        'orderby': selectedCriteria,
        'startDate': start,
        'endDate': end
    };

    console.log(data); // Xem dữ liệu gửi đi trong console

    // Gửi yêu cầu tìm kiếm
    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/search-data';
    const jsonData = JSON.stringify(data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onload = function () {
        if (xhr.status === 200) {
            // Xử lý kết quả tìm kiếm
            const responseData = JSON.parse(xhr.responseText);
            tableBody.innerHTML = '';
            responseData.forEach(item => {
                const row = document.createElement('tr');
                
                const cells = [
                    item.id,
                    item.temperature,
                    item.light,
                    item.humidity,
                    new Intl.DateTimeFormat('en-US', {
                        day: '2-digit', month: '2-digit', year: 'numeric', 
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    }).format(new Date(item.time))
                ];

                cells.forEach(text => {
                    const cell = document.createElement('td');
                    cell.textContent = text;
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });
        }
    };

    prevPageLink.disabled = true;
    nextPageLink.disabled = true;
    xhr.send(jsonData);
});

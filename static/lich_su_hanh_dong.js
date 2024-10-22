
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
    var url = 'http://localhost:3000/api/get-history';
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
                var id = item.id;
                const time = item.time;
                const client_name = item.client_name;
                const action_name = item.action_name;
                const state = item.state;

                const gmtNow = new Date(time);
                const haNoiNow = new Date(gmtNow.getTime());
                const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedTime = new Intl.DateTimeFormat('en-US', options).format(haNoiNow);

                const row = document.createElement('tr');

                var cell = document.createElement('td');
                cell.textContent = id;
                row.appendChild(cell);
                

                cell = document.createElement('td');
                cell.textContent = client_name;
                row.appendChild(cell)

                cell = document.createElement('td');
                cell.textContent = action_name;
                row.appendChild(cell)

                cell = document.createElement('td');
                cell.textContent = state;
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
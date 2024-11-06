    const tableBody = document.querySelector('tbody');
    const prevPageLink = document.getElementById('prevPage');
    const nextPageLink = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const itemsPerPage = 10; // Số hàng mỗi trang
    let currentPage = 1;

    // Hàm hiển thị dữ liệu
    function displayData(page, startDate = '', endDate = '') {
        tableBody.innerHTML = '';
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        var xhr = new XMLHttpRequest();
        var url = 'http://localhost:3000/api/get-history';
        var data = { 'start': startIndex, 'end': endIndex, 'start_date': startDate, 'end_date': endDate };
        var jsonData = JSON.stringify(data);

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Xử lý dữ liệu trả về tại đây
                var responseData = JSON.parse(xhr.responseText);
                console.log(responseData.length);
                for (var i = 0; i < responseData.length; i++) {
                    var item = responseData[i];
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
                    row.appendChild(cell);

                    cell = document.createElement('td');
                    cell.textContent = action_name;
                    row.appendChild(cell);

                    cell = document.createElement('td');
                    cell.textContent = state;
                    row.appendChild(cell);

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

    // Hàm tìm kiếm theo thời gian
    function searchByDate() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (startDate && endDate) {
            currentPage = 1; // Đặt lại trang hiện tại về 1 khi tìm kiếm
            displayData(currentPage, startDate, endDate);
        } else {
            alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
        }
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

    // Thêm sự kiện cho nút tìm kiếm
    document.getElementById('searchBtn').addEventListener('click', searchByDate);

    // Hiển thị trang đầu tiên khi tải trang
    displayData(currentPage);

    // let currentDate = new Date();
    // let lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth-1, currentDate.getDate);
    // document.getElementById('start-date').value = lastMonth
    // document.getElementById('end-date').value = currentDate
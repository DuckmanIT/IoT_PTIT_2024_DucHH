function changeStatus(led_number, led_bg) {
    let stt = document.getElementById(led_number).innerHTML;
    if (stt == "On") {
        document.getElementById(led_bg).classList = "btn btn-outline-secondary p-2 m-2";
        document.getElementById(led_number).innerHTML = "Off";
        document.getElementById(led_number).classList = "badge bg-outline-dark";
        document.getElementById(led_bg).title = "Turn on!";
    } else {
        document.getElementById(led_bg).classList = "btn btn-success p-2 m-2";
        document.getElementById(led_number).innerHTML = "On";
        document.getElementById(led_number).classList = "badge bg-danger";
        document.getElementById(led_bg).title = "Turn off!";
    }
    
}

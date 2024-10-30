app.post('/api/get-history', (req, res) => {
    const start = req.body.start;
    const end = req.body.end;
    const startDate = req.body.start_date; // Thêm tham số start_date
    const endDate = req.body.end_date; // Thêm tham số end_date

    const dataToGet = {
        start: start,
        end: end,
        start_date: startDate, // Thêm tham số vào đối tượng
        end_date: endDate      // Thêm tham số vào đối tượng
    };

    database.getHistory(dataToGet, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.json(results);
    });
});
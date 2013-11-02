var $ = jQuery;
$(function () {
    var doc = $(document);


    test('$.fn.spreadsheet', function () {
        var table = $('#demo-section').find('.ss-table');
        ok(table.has('caption').has('thead').size() == 1);

        var tbody = table.find('tbody');
        var cellData = tbody.find('tr').eq(2).find('td').eq(3).data();
        equal(cellData.row, 2);
        equal(cellData.col, 3);
    });
});
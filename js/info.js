function splitCamelCase(string) {
	return (string || '').replace(/([A-Z])/g, ' $1').replace(/(^.)|(\s.)/g, function (str) { return str.toUpperCase(); });
};

$(function () {
	// Add asteroid info
	$('#asteroid-name').on('keydown', function (event) {
		if (event.keyCode === 13) {
			$('#asteroid-info').find('.info').html('Loading...');
			$.ajax({
				url: '/asteroid',
				type: 'GET',
				dataType: 'json',
				data: { key: $(this).val() },
				success: function (response) {
					var html = '<table>';
					html += _.reduce(response, function (memo, value, key) {
						return memo + '<tr><td>' + splitCamelCase(key) + ':</td><td>' + value + '</td></tr>';
					}, '');
					html += '</table>';
					$('#asteroid-info').find('.info').html(html);
				},
				error: function () {
					$('#asteroid-info').find('.info').html('Could not find asteroid.');
				}
			});
		}
	});
});

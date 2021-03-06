var _ = require('lodash');
var Promise = require('bluebird');
var dateFormat = require('dateformat');
var TogglClient = require('toggl-api');
var toggl = new TogglClient({
	apiToken: require('./apikey')
});
Promise.promisifyAll(toggl);

toggl.getWorkspacesAsync()
	.then(function (result) {
		return Promise.props({
			workspaces: result,
			tasks: toggl.getTimeEntriesAsync()
		});
	})
	.then(function (result) {
		var days = {};
		for(var i = 0; i < result.tasks.length; i++) {
			var task = result.tasks[i];
			var key = getDayFromDate(task.start);
			var duration = calculateDuration(task);

			if (!days[key]) {
				days[key] = 0;
			}
			days[key] += duration;
		}
		printFormatted(days);

	});

function getDayFromDate(dateStr) {
	var date = new Date(dateStr);
	return dateFormat(date, 'dddd - dd.m.yy');
}

function calculateDuration(task) {
	var start = new Date(task.start).getTime();
	var stop;
	if (task.stop) {
		stop = new Date(task.stop).getTime();
	} else {
		stop = new Date().getTime();
	}
	
	return stop - start;
}

function printFormatted(days) {
	_.each(days, function(millis, day) {
		var hours = millis /1000/60/60;
		hours = Math.round(hours * 100) / 100;
		console.log(day + ': ' + hours + 'h');
	});
}
var TogglClient = require('toggl-api');
var toggl = new TogglClient({
	apiToken: '395f9c471d2ef2ab82415afaeb963321'
});

toggl.getWorkspaces(function (result) {
	console.log(result);
});
/***********************************
	Survey commands for
	spacialgaze.psim.us
	coded by HoeenHero
	Multi-Surveys
	coded by Insist and Arrays
	Credit to Arrays and wgc
***********************************/
'use strict';

class Survey {
	constructor(room, question, allowHTML) {
		if (room.surveyNumber) {
			room.surveyNumber++;
		} else {
			room.surveyNumber = 1;
		}
		this.room = room;
		this.surveyArray = [{
			room: room,
			surveyNum: room.surveyNumber,
			question: question,
			allowHTML: allowHTML,
			repliers: {},
			replierIps: {},
			totalReplies: 0,
			timeout: null,
			timeoutMins: 0,
		}];
	}

	answer(user, reply, number) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.surveyArray[number].repliers || ip in this.surveyArray[number].replierIps) {
			return user.sendTo(this.room, "You have already answered this survey.");
		}

		this.surveyArray[number].repliers[userid] = reply;
		this.surveyArray[number].replierIps[ip] = reply;
		this.surveyArray[number].totalReplies++;

		this.updateTo(user, number, true);
	}

	blankanswer(user, reply, number) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.surveyArray[number].repliers || ip in this.surveyArray[number].replierIps) {
			//this.updateTo(user, true);
			//Do nothing.
		} else {
			this.surveyArray[number].repliers[userid] = 0;
			this.surveyArray[number].replierIps[ip] = 0;
		}

		this.updateTo(user, number, true);
	}

	generateQuestion(number) {
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[number].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[number].allowHTML ? this.surveyArray[number].question : Chat.escapeHTML(this.surveyArray[number].question))}</strong></p>`;
		output += `<div style="margin-top: 3px">Please note that anyone can see what you reply.</div>`;
		output += `<div style="margin-top: 5px"><button class="button" value="/survey answer" name="send" title="Answer the survey."><strong>Answer the survey</strong></button></div>`;
		output += `<div style="margin-top: 7px; padding-left: 12px"><button class="button" value="/survey results ${this.surveyArray[number].surveyNum}" name="send" title="View results - you will not be able to answer the survey after viewing results"><small>(View Results)</small></button><small>(you will not be able to answer the survey after viewing results)</small></div>`;
		output += `</div>`;
		return output;
	}

	update(number) {
		for (let i in this.room.users) {
			let thisUser = this.room.users[i];
			if (thisUser.userid in this.surveyArray[number].repliers || thisUser.latestIp in this.surveyArray[number].replierIps) {
				thisUser.sendTo(this.room, `|uhtml|survey${this.surveyArray[number].surveyNum}|<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[number].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[number].allowHTML ? this.surveyArray[number].question : Chat.escapeHTML(this.surveyArray[number].question))}</strong></p>Thank you for answering the survey.<br/><div style="margin-top: 7px; padding-left: 12px"><button value="/survey results ${this.surveyArray[number].surveyNum}" class="button" name="send" title="Show results - view all replies"><small>(View Results)</small></div></div>`);
			}
		}
	}

	display() {
		for (let u in this.surveyArray) {
			let toAnswer = this.generateQuestion(u);
			for (let i in this.room.users) {
				let thisUser = this.room.users[i];
				if (thisUser.userid in this.surveyArray[u].repliers) {
					thisUser.sendTo(this.room, `|uhtml|survey${this.surveyArray[u].surveyNum}|<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[u].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[u].allowHTML ? this.surveyArray[u].question : Chat.escapeHTML(this.surveyArray[u].question))}</strong></p>Thank you for answering the survey.<br/><div style="margin-top: 7px; padding-left: 12px"><button class="button" value="/survey results ${this.surveyArray[u].surveyNum}" name="send" title="Show results - view all replies"><small>(View Results)</small></div></div>`);
				} else if (thisUser.latestIp in this.surveyArray[u].replierIps) {
					thisUser.sendTo(this.room, `|uhtml|survey${this.surveyArray[u].surveyNum}|<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[u].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[u].allowHTML ? this.surveyArray[u].question : Chat.escapeHTML(this.surveyArray[u].question))}</strong></p>Thank you for answering the survey.<br/><div style="margin-top: 7px; padding-left: 12px"><button class="button" value="/survey results ${this.surveyArray[u].surveyNum}" name="send" title="Show results - view all replies"><small>(View Results)</small></div></div>`);
				} else {
					thisUser.sendTo(this.room, `|uhtml|survey${this.surveyArray[u].surveyNum}|${toAnswer}`);
				}
			}
		}
	}

	displayTo(user, connection) {
		for (let u in this.surveyArray) {
			if (!connection) connection = user;
			if (user.userid in this.surveyArray[u].repliers) {
				connection.sendTo(this.room, `|uhtml|survey${this.surveyArray[u].surveyNum}|<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[u].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[u].allowHTML ? this.surveyArray[u].question : Chat.escapeHTML(this.surveyArray[u].question))}</strong></p>Thank you for answering the survey.<br/><div style="margin-top: 7px; padding-left: 12px"><button value="/survey results ${this.surveyArray[u].surveyNum}" class="button" name="send" title="Show results - view all replies"><small>(View Results)</small></div></div>`, u);
			} else if (user.latestIp in this.surveyArray[u].replierIps) {
				connection.sendTo(this.room, `|uhtml|survey${this.surveyArray[u].surveyNum}|<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[u].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[u].allowHTML ? this.surveyArray[u].question : Chat.escapeHTML(this.surveyArray[u].question))}</strong></p>Thank you for answering the survey.<br/><div style="margin-top: 7px; padding-left: 12px"><button value="/survey results ${this.surveyArray[u].surveyNum}" class="button" name="send" title="Show results - view all replies"><small>(View Results)</small></div></div>`, u);
			} else {
				connection.sendTo(this.room, `|uhtml|survey${this.surveyArray[u].surveyNum}|${this.generateQuestion(u)}`);
			}
		}
	}

	displaySpecific(number) {
		for (let i in this.room.users) {
			let toAnswer = this.generateQuestion(number);
			let thisUser = this.room.users[i];
			if (thisUser.userid in this.surveyArray[number].repliers) {
				thisUser.sendTo(this.room, `|uhtml|survey${this.surveyArray[number].surveyNum}|${this.surveyArray[number].repliers[thisUser.userid]}`);
			} else if (thisUser.latestIp in this.surveyArray[number].replierIps) {
				thisUser.sendTo(this.room, `|uhtml|survey${this.surveyArray[number].surveyNum}|${this.surveyArray[number].replierIps[thisUser.latestIp]}`);
			} else {
				thisUser.sendTo(this.room, `|uhtml|survey${this.surveyArray[number].surveyNum}|${toAnswer}`);
			}
		}
	}

	displaySpecificTo(user, connection, number) {
		if (!connection) connection = user;
		if (user.userid in this.surveyArray[number].repliers) {
			connection.sendTo(this.room, `|uhtml|survey${this.surveyArray[number].surveyNum}|${this.generateResults(false, number)}`);
		} else if (user.latestIp in this.surveyArray[number].replierIps) {
			connection.sendTo(this.room, `|uhtml|survey${this.surveyArray[number].surveyNum}|${this.generateResults(false, number)}`);
		} else {
			connection.sendTo(this.room, `|uhtml|survey${this.surveyArray[number].surveyNum}|${this.generateResults(false, number)}`);
		}
	}

	generateResults(ended, number) {
		let icon = `<span style="border:1px solid #${(ended ? '777;color:#555' : '6A6;color:#484')};border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i>${(ended ? `Survey-${this.surveyArray[number].surveyNum} ended` : `Survey-${this.surveyArray[number].surveyNum}`)}</span>`;
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0">${icon} <strong style="font-size:11pt">${(this.surveyArray[number].allowHTML ? this.surveyArray[number].question : Chat.escapeHTML(this.surveyArray[number].question))}</strong></p>`;
		for (let i in this.surveyArray[number].repliers) {
			if (this.surveyArray[number].repliers[i]) output += `<div>${Server.nameColor(i, true)}: <i>"${Chat.formatText(this.surveyArray[number].repliers[i])}"</i><div><br/>`;
		}
		if (!ended) output += `<div style="margin-top: 7px; padding-left: 12px"><button value="/survey hideresults ${this.surveyArray[number].surveyNum}" class="button" name="send" title="Hide results - hide the results."><small>(Hide Results)</small></div>`;
		output += `</div>`;
		return output;
	}

	hasReplied(user, number) {
		let userid = user.userid;
		let userIp = user.latestIp;
		if (userid in this.surveyArray[number].repliers) return true;
		if (userIp in this.surveyArray[number].replierIps) return true;
		return false;
	}

	updateTo(user, number, getResults) {
		let results = this.generateResults(false, number);
		if (user.userid in this.surveyArray[number].repliers) {
			if (getResults) {
				user.sendTo(this.room, `|uhtmlchange|survey${this.surveyArray[number].surveyNum}|${results}`, number);
			} else {
				user.sendTo(this.room, `|uhtmlchange|survey${this.surveyArray[number].surveyNum}|<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[number].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[number].allowHTML ? this.surveyArray[number].question : Chat.escapeHTML(this.surveyArray[number].question))}</strong></p>Thank you for answering the survey.<br/><div style="margin-top: 7px; padding-left: 12px"><button class="button" value="/survey results ${this.surveyArray[number].surveyNum}" name="send" title="Show results - view all replies"><small>(View Results)</small></div></div>`, number);
			}
		} else if (user.latestIp in this.surveyArray[number].replierIps) {
			if (getResults) {
				user.sendTo(this.room, `|uhtmlchange|survey${this.surveyArray[number].surveyNum}|${results}`, number);
			} else {
				user.sendTo(this.room, `|uhtmlchange|survey${this.surveyArray[number].surveyNum}|<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Survey-${this.surveyArray[number].surveyNum}</span> <strong style="font-size:11pt">${(this.surveyArray[number].allowHTML ? this.surveyArray[number].question : Chat.escapeHTML(this.surveyArray[number].question))}</strong></p>Thank you for answering the survey.<br/><div style="margin-top: 7px; padding-left: 12px"><button class="button" value="/survey results ${this.surveyArray[number].surveyNum}" name="send" title="Show results - view all replies"><small>(View Results)</small></div></div>`, number);
			}
		}
	}

	onConnect(user, connection, number) {
		this.displayTo(user, connection, number);
	}

	end(number) {
		let results = this.generateResults(true, number);

		this.room.send(`|uhtmlchange|survey${this.surveyArray[number].surveyNum}|<div class="infobox">(The survey has ended &ndash; scroll down to see the results)</div>`);
		this.room.add(`|html|${results}`);
	}

	obtain(number) {
		for (let u in this.surveyArray) {
			if (this.surveyArray[u].surveyNum === number) return u;
		}
	}
}

function validateAnswer(room, message) {
	if (!room) return true;
	if (!room.banwordRegex) {
		if (room.banwords && room.banwords.length) {
			room.banwordRegex = new RegExp(`(?:\\b|(?!\\w))(?:${room.banwords.join('|')})(?:\\b|\\B(?!\\w))`, `i`);
		} else {
			room.banwordRegex = true;
		}
	}
	if (!message) return true;
	if (room.banwordRegex !== true && room.banwordRegex.test(message)) {
		return false;
	}
	return true;
}

exports.commands = {
	sa: function (target, room, user) {
		this.parse(`/survey answer ${target}`);
	},
	sahelp: function (target, room, user) {
		this.parse('/help survey answer');
	},
	survey: {
		htmlcreate: 'new',
		create: 'new',
		new: function (target, room, user, connection, cmd, message) {
			if (!target) return this.parse('/help survey new');
			if (target.length > 300) return this.errorReply("Survey too long.");
			const supportHTML = cmd === 'htmlcreate';
			if (room.survey && room.survey.surveyArray[0] && room.survey.surveyArray[1] && room.survey.surveyArray[2] && room.survey.surveyArray[3] && room.survey.surveyArray[4]) return this.errorReply("Only 5 surveys at a time!");
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			let allowHTML = toId(cmd) === 'htmlcreate';
			if (allowHTML && !user.can('declare', null, room)) return false;
			if (room.survey && room.surveyNumber) room.surveyNumber++;
			if (room.survey && room.survey.surveyArray[0] && room.survey.surveyArray[1] && room.survey.surveyArray[2] && room.survey.surveyArray[3] && !room.survey.surveyArray[4]) {
				room.survey.surveyArray[4] = {
					room: room,
					surveyNum: room.surveyNumber,
					question: target,
					supportHTML: supportHTML,
					repliers: {},
					replierIps: {},
					timeout: null,
					timeoutMins: 0,
				};
				room.survey.displaySpecific(4);
			}
			if (room.survey && room.survey.surveyArray[0] && room.survey.surveyArray[1] && room.survey.surveyArray[2] && !room.survey.surveyArray[3]) {
				room.survey.surveyArray[3] = {
					room: room,
					surveyNum: room.surveyNumber,
					question: target,
					supportHTML: supportHTML,
					repliers: {},
					replierIps: {},
					timeout: null,
					timeoutMins: 0,
				};
				room.survey.displaySpecific(3);
			}

			if (room.survey && room.survey.surveyArray[0] && room.survey.surveyArray[1] && !room.survey.surveyArray[2]) {
				room.survey.surveyArray[2] = {
					room: room,
					surveyNum: room.surveyNumber,
					question: target,
					supportHTML: supportHTML,
					repliers: {},
					replierIps: {},
					timeout: null,
					timeoutMins: 0,
				};
				room.survey.displaySpecific(2);
			}

			if (room.survey && room.survey.surveyArray[0] && !room.survey.surveyArray[1]) {
				room.survey.surveyArray[1] = {
					room: room,
					surveyNum: room.surveyNumber,
					question: target,
					supportHTML: supportHTML,
					repliers: {},
					replierIps: {},
					timeout: null,
					timeoutMins: 0,
				};
				room.survey.displaySpecific(1);
			}

			if (room.survey && !room.survey.surveyArray[0]) {
				room.survey.surveyArray[0] = {
					room: room,
					surveyNum: room.surveyNumber,
					question: target,
					supportHTML: supportHTML,
					repliers: {},
					replierIps: {},
					timeout: null,
					timeoutMins: 0,
				};
				room.survey.displaySpecific(0);
			}
			if (!room.survey) {
				room.survey = new Survey(room, target, supportHTML);
				room.survey.display();
			}

			this.logEntry(`${user.name} used ${message}.`);
			return this.privateModCommand(`(A survey was started by ${user.name}.)`);
		},
		newhelp: ["/survey create [question] - Create a survey. Requires % @ # & ~"],

		answer: function (target, room, user) {
			if (!room.survey) return this.errorReply("There is no survey running in the room.");
			if (!target) return this.parse('/help survey answer');
			let targets = target.split(',');
			for (let u in targets) targets[u] = targets[u].trim();
			if (targets[0].length > 600) return this.errorReply('Your answer is too long.');
			if (!validateAnswer(room, targets[0])) return this.errorReply('Your answer contained a banned phrase.');
			let targ = Chat.escapeHTML(targets[1]);
			let number = parseInt(targ);
			let num = room.survey.obtain(number);
			if (!num) return this.errorReply("Not a survey number!");
			if (targets[0] === 'blank') {
				room.survey.blankanswer(user, number);
				return;
			}
			room.survey.answer(user, targets[0], num);
		},
		answerhelp: ["/survey answer [answer], [survey number] or /sa [answer], [survey number] - Answers the survey [survey answer] survey with [answer]."],

		results: function (target, room, user) {
			if (!room.survey) return this.errorReply("There is no survey running in the room.");
			let num = room.survey.obtain(parseInt(target));
			if (!num) return this.errorReply("Not a survey number!");
			if (room.survey.surveyArray[num].surveyNum === parseInt(target)) return room.survey.blankanswer(user, false, num);
		},
		resultshelp: ["/survey results [survey number] - View the results of the specified survey. You can't go back and answer if you haven't already."],

		hideresults: function (target, room, user) {
			if (!room.survey) return this.errorReply("There is no survey running in the room.");
			let num = room.survey.obtain(parseInt(target));
			if (!num) return this.errorReply("Not a survey number!");
			if (room.survey.surveyArray[num].surveyNum === parseInt(target)) {
				if (room.survey.hasReplied(user, num)) {
					return room.survey.updateTo(user, num, false);
				} else {
					return this.errorReply('You can hide the results if you can\'t view them.');
				}
			}
		},
		hideresultshelp: ["/survey hideresults [survey number] - Hide the results of the specified survey. You can't do this if you haven't answered yet."],

		display: function (target, room, user, connection) {
			if (!room.survey) return this.errorReply("There is no survey running in the room.");
			if (!this.runBroadcast()) return;
			room.update();

			let num = room.survey.obtain(parseInt(target));
			if (num) {
				if (this.broadcasting) {
					room.survey.displayTo(user, connection, num);
				} else {
					room.survey.displaySpecificTo(user, connection, num);
				}
			} else {
				if (!num && this.broadcasting) {
					room.survey.display();
				} else {
					room.survey.displayTo(user, connection);
				}
			}
		},
		displayhelp: ["/survey display [survey id number] - Displays the survey. Id number is optional and only displays the survey with the id number."],

		delete: 'remove',
		remove: function (target, room, user) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.survey) return this.errorReply("There is no survey running in the room.");
			if (!target) return this.errorReply("Please select an answer to remove.");
			target = toId(target);
			let num = room.survey.obtain(parseInt(target));
			if (!num) return this.errorReply("Not a survey number!");
			if (!user.userid in this.surveyArray[num].repliers || user.latestIp in this.surveyArray[num].replierIps) return this.errorReply(`The user ${target} has not responded to this survey.`);
			for (let i in room.survey.replierIps) {
				if (room.survey.replierIps[i] === room.survey.repliers[target]) {
					room.survey.replierIps[i] = 0;
					room.survey.repliers[target] = 0;
					break;
				}
			}
			room.survey.update(num);
			this.sendReply(`${target}'s answer was removed.`);
		},
		removehelp: ["/survey remove [user], [survey number] - Removes a user's reply and prevents them from sending in a new one for the specified survey. Requires: % @ # & ~"],

		close: 'end',
		stop: 'end',
		end: function (target, room, user) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return;
			if (!room.survey) return this.errorReply("There is no survey running in this room.");
			let num = room.survey.obtain(parseInt(target));
			if (!num) return this.errorReply("Not a survey number!");

			if (room.survey.surveyArray[num].surveyNum === parseInt(target) && room.survey.surveyArray[num].timeout) clearTimeout(room.survey.surveyArray[num].timeout);
			if (room.survey.surveyArray[num].surveyNum === parseInt(target)) room.survey.end(num);
			if (room.survey.surveyArray[num].surveyNum === parseInt(target)) delete room.survey.surveyArray[num];

			return this.privateModCommand(`(A survey was ended by ${user.name}.)`);
		},
		endhelp: ["/survey end [survey id number] - Ends a survey and displays the results. Requires: % @ * # & ~"],

		timer: function (target, room, user) {
			if (!room.survey) return this.errorReply("There is no survey running in this room.");
			let targets = target.split(",");
			for (let u = 0; u < targets.length; u++) targets[u] = targets[u].trim();
			if (!targets[1]) return this.errorReply("/survey timer (clear/ time amount), (survey number)");
			let num = room.survey.obtain(parseInt(targets[1]));
			if (targets[0]) {
				if (!this.can('minigame', null, room)) return false;
				if (targets[0] === 'clear') {
					if (room.survey.surveyArray[num] && !room.survey.surveyArray[num].timeout) return this.errorReply("There is no timer to clear.");
					clearTimeout(room.survey.surveyArray[num].timeout);
					room.survey.surveyArray[num].timeout = null;
					room.survey.surveyArray[num].timeoutMins = 0;
					return this.add("The survey timer was turned off.");
				}
				let timeout = parseFloat(target);
				if (isNaN(timeout) || timeout <= 0 || timeout > 0x7FFFFFFF) return this.errorReply("Invalid time given.");
				if (room.survey.surveyArray[num] && room.survey.surveyArray[num].timeout) clearTimeout(room.survey.surveyArray[num].timeout);
				room.survey.surveyArray[num].timeoutMins = timeout;
				room.survey.surveyArray[num].timeout = setTimeout(() => {
					room.survey.end(num);
					delete room.survey.surveyArray[num];
				}, (timeout * 60000));
				room.add(`The survey timer was turned on: the survey ${room.survey.surveyArray[num].surveyNum} will end in ${timeout} minute(s).`);
				return this.privateModCommand(`(The survey timer for survey ${room.survey.surveyArray[num].surveyNum} was set to ${timeout} minute(s) by ${user.name}.)`);
			} else {
				if (!this.runBroadcast()) return;
				if (room.survey.surveyArray[num].timeout) {
					return this.sendReply(`The survey timer for ${room.survey.surveyArray[num].surveyNum} is on and will end in ${room.survey.surveyArray[num].timeoutMins} minute(s).`);
				} else {
					return this.sendReply(`The survey timer for ${room.survey.surveyArray[num].surveyNum} is off.`);
				}
			}
		},
		timerhelp: ["/survey timer [minutes], [survey id number] - Sets the survey to automatically end after [minutes] minutes. Requires: % @ * # & ~", "/survey timer clear - Clears the survey's timer. Requires: % @ * # & ~"],

		'': function (target, room, user) {
			return this.parse('/help survey');
		},
	},
	surveyhelp: [
		"/survey allows rooms to run their own surveys. These surveys are limited to five surveys at a time per room.",
		"Accepts the following commands:",
		"/survey create [question] - Create a survey. Allows up to 5 surveys. Requires % @ # & ~",
		"/survey answer [answer], [survey id number] - Answers the specified survey.",
		"/survey results [survey id number] - View the results of the specified survey. You can't go back and answer if you haven't already.",
		"/survey display [survey id number] - Display the specified survey.",
		"/survey remove [user], [survey id number] - Removes a user's reply from the specified survey and prevents them from sending in a new one for this survey. Requires: % @ # & ~",
		"/survey end [survey id number] - Ends the specified survey and displays the results. Requires: % @ # & ~",
		"/survey timer [time in minutes], [survey id number] - Sets a timer for the specified survey to automatically end. Require % @ # & ~",
	],
};

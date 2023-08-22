import { generateGUID } from './../scripts.js';
import alarmIcon from '@assets/icons/clock-alarm-svgrepo-com.svg';
const datetimeStr = (d = new Date()) => `${d.toLocaleDateString(`se`, { year: `numeric`, month: `2-digit`, day: `2-digit` })} ${d.toLocaleTimeString('se')}`;
const monthNumberFromString = (str) => new Date(`${str} 01 2000`).toLocaleDateString(`en`, { month: `2-digit` }); // monthNumberFromString(`jan`) returns 01

const defaultAlarm = Object.freeze({ on: true, body: 'Time up', ontimeleft: 0, unit: 'hours', notified: 0 })

export class Countdown {
	constructor({ title = '', finishDate, finishTime = '17:30:00', onComplete, onChange, id, repeat = 'yearly', alarms = [structuredClone(defaultAlarm)], finished = false, order } = {}) {	// alarm = { on: true, title: 'Alarm' }, reminders = []
		this.order = order
		this.finished = finished
		this.title = title;
		this.id = id ? id : generateGUID();
		this.dateObject;
		this.timeleft = { d: 0, h: 0, m: 0, s: 0, ms: 0, timeStr: '99:99:99' };

		this.repeat = repeat;

		this.alarms = alarms
		this.finishTime = finishTime;
		this.finishDate = (finishDate) ? finishDate : this.setDefault();
		//if (!finishDate) this.finishDate = this.setDefault();
		this.finishDate = typeof finishDate == 'string' ? this.finishDate : this.finishDate.toISOString().split('T')[0];
		this.onChange = (onChange) ? onChange : () => { }
		this.onComplete = onComplete;
		this.intervalId = null;

		this.updateTime();
		this.getTimeLeft();
	}
	setDefault() {
		let date = new Date(Date.now());
		date.setDate(date.getDate() + 1);
		return date;
	}
	addAlarm = () => {
		this.alarms.push(structuredClone(defaultAlarm))
		this.onChange()
	}
	removeAlarm(i) {
		this.alarms.splice(i, 1)
		this.onChange()
	}
	changeAlarmTime(i, value, unit) {
		this.onChange()
	}
	updateTime() {
		let datetime = new Date(this.finishDate);
		const [hours, minutes, seconds] = this.finishTime.split(':');
		if (hours) datetime.setHours(parseInt(hours));
		if (minutes) datetime.setMinutes(parseInt(minutes));
		if (seconds) datetime.setSeconds(parseInt(seconds));
		this.dateObject = datetime;
	}

	getTimeLeft() {
		let now = Date.now()
		let msLeft = this.dateObject - now;
		const totalSeconds = Math.floor(msLeft / 1000);
		this.timeleft = {
			d: Math.floor(totalSeconds / 86400).toString(),
			h: Math.floor((totalSeconds % 86400) / 3600).toString().padStart(2, '0'),
			m: Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0'),
			s: Math.floor(totalSeconds % 60).toString().padStart(2, '0'),
			//ms:(ms % 1000).toString().padStart(3, '0')
		};
		if (this.finished && msLeft <= 0) return
		this.finished = false
		this.timeleft.timeStr = `${this.timeleft.h}:${this.timeleft.m}:${this.timeleft.s}`;


		for (let i = 0; i < this.alarms.length; i++) {
			let { on, ontimeleft, body } = this.alarms[i];
			if (typeof ontimeleft == 'string') ontimeleft = parseInt(ontimeleft)
			let s = ontimeleft
			if (!this.alarms[i].unit) this.alarms[i].unit = 'hours'

			if (this.alarms[i].unit[0] == 's') s = s
			else if (this.alarms[i].unit[0] == 'm') s = s * 60
			else if (this.alarms[i].unit[0] == 'h') s = s * 60 * 60
			else if (this.alarms[i].unit[0] == 'd') s = s * 24 * 60 * 60
			else if (this.alarms[i].unit[0] == 'w') s = s * 24 * 60 * 60 * 7

			if (totalSeconds < s) {
				this.runAlarm(this.alarms[i]);
			}
		}
		if (totalSeconds <= 0) this.timeup()
		return msLeft;
	}
	timeup() {
		//console.log('this.timeleft.s<0', this.timeleft.s, totalSeconds);
		//this.runAlarm(this.alarms[0]);
		//let now = new Date();
		let arr = [
			['yearly', 'FullYear'],
			['monthly', 'Month'],
			['daily', 'Date'],
			['hourly', 'Hours'],
			['minutely', 'Minutes'],
			['secondly', 'Seconds'],
		];

		if ((this.repeat = 'Once')) {
			this.finished = true
		} else {
			for (let i = 0; i < arr.length; i++) {
				if (this.repeat == arr[i][0]) {
					this.dateObject['set' + arr[i][1]](now['get' + arr[i][1]]() + 1);
					break;
				} else {
					this.dateObject['get' + arr[i][1]](now['get' + arr[i][1]]());
				}
			}
			this.finishDate = this.dateObject.toLocaleDateString(`se`, { year: `numeric`, month: `2-digit`, day: `2-digit` });
			this.finishTime = this.dateObject.toLocaleTimeString('se');
		}
		this.updateTime();

		if (typeof this.onComplete == 'function') this.onComplete();
	}

	async getNotificationPermission() {
		if (!('Notification' in window)) {
			alert('This browser does not support desktop notification');
		} else if (Notification.permission === 'granted') {
			return true
		} else if (Notification.permission !== 'denied') {
			return await Notification.requestPermission().then((permission) => {
				if (permission === 'granted') return true
				else return false
			});
		} else {
			return false
		}
	}
	async runAlarm(alarm) {
		if (!alarm.on || alarm.notified > 0) return;
		console.log('runAlarm', alarm.notified, alarm);
		if (!await this.getNotificationPermission()) return



		// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API#browser_compatibility
		const defaultOptions = {
			body: `${this.title}`,
			lang: 'en-US',
			icon: alarmIcon,
			requireInteraction: true,

			//tag: 'abc',
			//renotify: true,
			//image: img,
			//badge: img,
			//vibrate: true,
			//silent: false,
			//actions: [{action:'action', title:'title', icon: pizza}, {action:'action', title:'title', icon: pizza}, ], 	// Firefox: Not supported, 	Brave: Uncaught TypeError: Failed to construct 'Notification': Actions are only supported for persistent notifications shown using ServiceWorkerRegistration.showNotification().
		};

		const options = Object.assign(defaultOptions,
			Object.entries(alarm).reduce((a, [key, value]) => {
				if (defaultOptions[key] != undefined) a[key] = value;
				return a;
			}, {})
		);
		const notification = new Notification(this.title, options);

		if (alarm.notified == undefined) alarm.notified = 0
		alarm.notified += 1

		const onClick = (e) => console.log('onClick', e);
		const onClose = (e) => console.log('onClose', e);
		const onError = (e) => console.log('onError', e);
		const onShow = (e) => console.log('onShow', e);
		notification.addEventListener('click', onClick);
		notification.addEventListener('close', onClose);
		notification.addEventListener('error', onError);
		notification.addEventListener('show', onShow);

		console.log('notification', options, notification);
	}
}

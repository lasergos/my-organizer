function Task (text, index, priority){
			this.text = text;
			this.index = index;
			this.priority = priority;
			this.readyState = false;
			this.startTime = Date.now() ;  //  +''
			this.endTime = Date.now() ;
			this.comMessage = 'Задача еще не выполнена';
		};

var Collection = (function () {
	var tasks = [];

	
	var $menu,  //переменная для ссылки на контекстное меню
		cont,
		marker = false;
	
	return {
		get allTasks () {
			console.log(tasks);
		},

		init: function (container) {
			cont = container;
			getStorage();
			setContextMenu();
			container.addEventListener('contextmenu', showContextMenu);
		},

		add: function (task){
			if(task instanceof Task){
				tasks.push(task);
				addStorage(tasks);
				createTask(task);
			}
		},

		toggleCompleted: function (e){ //переключение состояния задачи
			if ($(e.target).is('I')) {
				var task = findTask(e),
					$li = $(e.target).parents('li');

				if (task.readyState == false) {
					task.readyState = true;
					taskTime (task);
				} else{
					task.readyState = false;
					task.comMessage = 'Задача еще не выполнена';
				} 
				var elem = createItem (task);
				// replaceTask (elem, $li);
				$li.replaceWith(elem);
				restoreStorage();
			}
		},

		toggleCompletedAll: function (e){
			var $toggleAll = $("#toggle-all");

			delLi();
			tasks.forEach(function (task){
				if (marker === false){
					task.readyState = true;
					$toggleAll.removeClass('fa-square-o');
					$toggleAll.addClass('fa-check-square-o');
					taskTime (task);
				} else {
					task.readyState = false;
					$toggleAll.removeClass('fa-check-square-o');
					$toggleAll.addClass('fa-square-o');
					task.comMessage = 'Задача еще не выполнена';
				}
				createTask(task);
			});
			restoreStorage();

			if (marker === false) {
				marker = true;
			} else{
				marker = false;
			}
		},

		delTask: function (e){
			if ($(e.target).is('SPAN')) {
				var $li = $(e.target).parents('li'),
					$id = $li.attr('id');
					arr = tasks;

				tasks.forEach(function (task, i){
					if(task.index == $id){
						arr.splice(i, 1);
						$li.remove();
					}
				});
				restoreStorage();
			}
		},

		editText:  function (e){
			var $textarea = $(e.target),
				task = findTask(e);

			if ($textarea.is("TEXTAREA")){
				$textarea.removeAttr('readonly');
				$textarea.removeClass('textareaReadOnly');
				$textarea.addClass('textarea');

				$textarea.on('blur', function (){
					$textarea.attr('readonly', true);
					$textarea.addClass('textareaReadOnly');
					$textarea.removeClass('textarea');
					task.text = $textarea.val();
					restoreStorage();
				});
			}
		},
		priorityTask: function (e){
			contextMenuTask = findTask(e);
			contextMenuLi = e.target.parentElement.parentElement.parentElement;
			target = e.target;
			contextMenuControl (e);
			// console.log('contextmenu сработало');
		},

		setPreiority: function (task, li, valuePriority){
			if (valuePriority == 'highPriority') {
				contextMenuTask.priority = 'highPriority';
			} else if (valuePriority == 'mediumPriority'){
				contextMenuTask.priority = 'mediumPriority';
			}else if (valuePriority == 'lowPriority'){
				contextMenuTask.priority = 'lowPriority';
			}
			var elem = createItem (task),
				$li = $(li);
			$li.replaceWith(elem);
			// replaceTask (elem, li); 
			restoreStorage(); 
		},
		hideCompletedTask: function (){
			var button = document.querySelector('#hideCompleted');
			if (button.textContent == 'Скрыть выполненные') {
			delLi();
				tasks.forEach( function(task){
					if (task.readyState === false){
						createTask(task);
					}
				});
			}
			if (button.textContent == 'Показать выполненные'){
				delLi();
				tasks.forEach( function(task){
					createTask(task);
				});
			}
			if (button.textContent == 'Скрыть выполненные') {
				button.textContent = 'Показать выполненные';
			} else{
				button.textContent = 'Скрыть выполненные';
			}
		},
		hideNotCompletedTask: function (){
			var button = document.querySelector('#onlyCompleted');
			if (button.textContent == 'Только выполненные') {
				delLi();
				tasks.forEach( function(task){
					if (task.readyState === true) {
						createTask(task);
					}
				});
			}
			if (button.textContent == 'Все задачи'){
				delLi();
				tasks.forEach( function(task){
					createTask(task);
				});
			}
			
			if (button.textContent == 'Только выполненные') {
				button.textContent = 'Все задачи';
			} else{
				button.textContent = 'Только выполненные';
			}
		},
		delCompletedTask: function (){
			delLi();	

			var arr = tasks;
			for (var i = arr.length-1; i >=0; i--) {
				if (arr[i].readyState === true) {
					arr.splice(i, 1);
				}
			};
			tasks.forEach(function(task){
				createTask(task);
			});
			restoreStorage();
		},
		sortPriority: function (e){
			if(e.target.tagName == 'BUTTON') {
				sortPriority(e);
			} else restoreTasks(e);
			
		},
	}      
/**
* Collection Off	
*/
	function taskTime (task) {
		task.endTime = Date.now() ;
		var difference = +task.endTime - +task.startTime,
			diff = {
				year: 0,
				month: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0
			},
			time = {
				year: (365*24*60*60*1000),
				month: (30*24*60*60*1000),
				days: (24*60*60*1000),
				hours: (60*60*1000),
				minutes: (60*1000),
				seconds: 1000,
			},
			keys = ['year', 'month', 'days', 'hours', 'minutes', 'seconds'];
		
		for (var i = 0; i < 6; i++) {
			var key = keys[i];
			if (difference > time[key]) {
				diff[key] = Math.floor(difference/time[key]);
				difference -= (diff[key] * time[key]);
			}
		};	
		showTime(diff, keys, task);
	}

	function showTime(diff, keys, task){
		var text = 'На выполнение задачи затрачено: ',
			unit_1 = ['год', 'месяц', 'день', 'час', 'минута', 'секунда'] ,
			unit_2 = ['года', 'месяца', 'дня', 'часа', 'минуты', 'секунды'] ,
			unit_3 = ['лет', 'месяцев', 'дней', 'часовы', 'минут', 'секунд'] ;
		for (var i = 0; i < 6; i++) {
			var key = keys[i];
			
			if (diff[key] !== 0) {
				if (diff[key] == 1 || diff[key] == 21 || diff[key] == 31 || diff[key] == 41 || diff[key] == 51) {
					text += diff[key] + unit_1[i] + ', ';
				}else if (diff[key] == 2 || diff[key] == 3 || diff[key] == 4 || diff[key] == 22 || diff[key] == 23 || diff[key] == 24 || diff[key] == 32 || diff[key] == 33 || diff[key] == 34 || diff[key] == 44 || diff[key] == 52 || diff[key] == 53 || diff[key] == 54){
					text += diff[key] + unit_2[i] + ', ';
				}else {
					text += diff[key] + unit_3[i] + ', ';
				}
			}
		}
		task.comMessage = text;
	}
/*
if (difference > time.year) {
			diff.year = Math.floor(difference/time.year);
			difference -= (diff.year * time.year);
		}
		if (difference > time.month) {
			diff.month = Math.floor(difference/time.month);
			difference -= (diff.month * time.month);
		}
		if (difference > time.day) {
			diff.days = Math.floor(difference/time.day);
			difference -= (diff.days * time.day);
		}
		if (difference > time.hour) {
			diff.hours = Math.floor(difference/time.hour);
			difference -= (diff.hours * time.hour);
		}
		if (difference > time.minute) {
			diff.minutes = Math.floor(difference/time.minute);
			difference -= (diff.minutes * time.minute);
		}
		if (difference > time.second) {
			diff.seconds = Math.floor(difference/time.second);
		}*/
	/*	
	var date_ = new Date(difference);
	var end = new Date(+task.endTime);
	var start = new Date(+task.startTime);
	var diff = {
		year: 0,
		month: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	};
	// year = month = week = day = hour = minute = second = 0;
	diff.year = date_.getFullYear();
	diff.month = date_.getMonth();
	// diff.week = date_.getWeek();
	diff.days = date_.getDate();
	diff.hours = date_.getHours();
	diff.minutes = date_.getMinutes();
	diff.seconds = date_.getSeconds();
	diff.year = end.getFullYear() - start.getFullYear();
	diff.month = end.getMonth() - start.getMonth();
	diff.days = end.getDate() - start.getDate();
	diff.hours = end.getHours() - start.getHours();
	diff.minutes = date_.getMinutes();   //end.getMinutes() - start.getMinutes();
	diff.seconds = date_.getSeconds();   // end.getSeconds() - start.getSeconds();
	*/
	// diff.seconds = new Date(+task.endTime - +task.startTime).getSeconds();   // end.getSeconds() - start.getSeconds();
	// diff.seconds = (end - start).getSeconds();   // end.getSeconds() - start.getSeconds();
	// return diff;
		// showTime(year, month, week, day, hour, minute, second, task);
		// task.comMessage = 'На выполнение задачи затрачено: ' + year + ' лет ' + month + ' месяцев ' + week + ' недель ' + day + ' дней ' + hour + ' часов ' + minute + ' минут ' + second + ' секунд';
	/**/
/*
		if (diff.year !== 0) {
			if (diff.year == 1 || diff.year == 21) {
				text += diff.year + ' год ';
			}else if (diff.year == 2 || diff.year == 3 || diff.year == 4){
				text += diff.year + ' года ';
			}else {
				text += diff.year + ' лет ';
			}
		}
		if (diff.month !== 0) {
			if (diff.month == 1) {
				text += diff.month + ' месяц ';
			}else if (diff.month == 2 || diff.month == 3 || diff.month == 4){
				text += diff.month + ' месяца ';
			}else {
				text += diff.month + ' месяцев ';
			}
		}
		if (diff.days !== 0) {
			if (diff.days == 1 || diff.days == 21 || diff.days == 31) {
				text += diff.days + ' день ';
			}else if (diff.days == 2 || diff.days == 3 || diff.days == 4 || diff.days == 22 || diff.days == 23 || diff.days == 24){
				text += diff.days + ' дня ';
			}else {
				text += diff.days + ' дней ';
			}
		}
		if (diff.hours !== 0) {
			if (diff.hours == 1 || diff.hours == 21) {
				text += diff.hours + ' час ';
			}else if (diff.hours == 2 || diff.hours == 3 || diff.hours == 4 || diff.hours == 22 || diff.hours == 23 || diff.hours == 24){
				text += diff.hours + ' часа ';
			}else {
				text += diff.hours + ' часов ';
			}
		}
		if (diff.minutes !== 0) {
			if (diff.minutes == 1 || diff.minutes == 21 || diff.minutes == 31 || diff.minutes == 41 || diff.minutes == 51) {
				text += diff.minutes + ' минута ';
			}else if (diff.minutes == 2 || diff.minutes == 3 || diff.minutes == 4 || diff.minutes == 22 || diff.minutes == 23 || diff.minutes == 24 || diff.minutes == 32 || diff.minutes == 33 || diff.minutes == 34 || diff.minutes == 42 || diff.minutes == 43 || diff.minutes == 44 || diff.minutes == 52 || diff.minutes == 53 || diff.minutes == 54){
				text += diff.minutes + ' минуты ';
			}else {
				text += diff.minutes + ' минут ';
			}
		}
		if (diff.seconds !== 0) {
			if (diff.seconds == 1 || diff.seconds == 21 || diff.seconds == 31 || diff.seconds == 41 || diff.seconds == 51) {
				text += diff.seconds + ' секунда ';
			}else if (diff.seconds == 2 || diff.seconds == 3 || diff.seconds == 4 || diff.seconds == 22 || diff.seconds == 23 || diff.seconds == 24 || diff.seconds == 32 || diff.seconds == 33 || diff.seconds == 34 || diff.seconds == 42 || diff.seconds == 43 || diff.seconds == 44 || diff.seconds == 52 || diff.seconds == 53 || diff.seconds == 54){
				text += diff.seconds + ' секунды ';
			}else {
				text += diff.seconds + ' секунд ';
			}
		}*/
	
	/*
	function createItem (task){
		var li = document.createElement('li'),
			row = document.createElement('div'),
			divBeginning = document.createElement('div'),
			divMiddle = document.createElement('div'),
			divEnd = document.createElement('div'),
			i = document.createElement('i'),
			textarea = document.createElement('textarea'),
			span = document.createElement('span');

		li.setAttribute('id', task.index);
		li.classList.add('li');
		row.classList.add('row');
		divBeginning.classList.add('col-xs-1', 'beginning');
		row.insertBefore(divBeginning, null);

		if (task.readyState == false) {
			i.classList.add('fa', 'fa-square-o', 'fa-lg');           
		} else{
		i.classList.add('fa', 'fa-check-square-o', 'fa-lg');
			li.classList.add('completed');
		} 
	    divBeginning.insertBefore(i, null);

		divMiddle.classList.add('col-xs-10', 'middle');
		row.insertBefore(divMiddle, null);

		textarea.classList.add('textareaReadOnly');

		if (task.priority === 'highPriority') {
			textarea.classList.add('highPriority'); 
		} else if (task.priority === 'mediumPriority') {
			textarea.classList.add('mediumPriority');
		} else textarea.classList.add('lowPriority');
		textarea.setAttribute('readonly', true);                       
		divMiddle.insertBefore(textarea, null);

		divEnd.classList.add('col-xs-1', 'end');
		row.insertBefore(divEnd, null);

		span.classList.add('glyphicon', 'glyphicon-remove');
		divEnd.insertBefore(span, null);

		li.appendChild(row);
		

		textarea.textContent = task.text;
		return li;
	}
	*/

	/**/
	function createItem (task){
		var $li = $('<li id='+ task.index +' class="li"></li>'),
			$row = $('<div class="row"></div>'),
			$beginning = $('<div class="col-xs-1 beginning"></div>'),
			$middle = $('<div class="col-xs-10 middle"></div>'),
			$textarea = $('<textarea class="textareaReadOnly" readonly="true"></textarea>'),
			$p = $('<p class="time">' + task.comMessage + '</p>'),
			$end = $('<div class="col-xs-1 end"></div>');
		$li.append($row);
		$row.append($beginning);

		if (task.readyState == false) {
			var $i = $('<i class="fa fa-square-o fa-lg"></i>');
		} else{
			var $i = $('<i class="fa fa-check-square-o fa-lg"></i>');
			$li.addClass('completed');
		} 
		$($beginning).append($i);
		$($row).append($middle);
		$($middle).append($textarea);

		if (task.priority === 'highPriority') {
			$($textarea).addClass('highPriority');
		} else if (task.priority === 'mediumPriority') {
			$($textarea).addClass('mediumPriority');
		} else $($textarea).addClass('lowPriority');
		$($middle).append($p);
		$($row).append($end);
		$($end).append('<span class="glyphicon glyphicon-remove"></span>');
		$($textarea).text(task.text);
		setRows ($textarea ,task.text);
		return $li;
	}

	function setRows (item, text){
		var arr = text.split('\n');
		rows = arr.length;
		item.attr('rows', rows);
	}

	function createTask(task){
		var li = createItem (task);
		$('#todo-list').append(li);
	}

	function showContextMenu (e){
		if (e.target.tagName !== 'TEXTAREA') return false;
		e.preventDefault();
		var contextMenuTask,
			contextMenuLi;
		toggleMenuOff();
		
		Collection.priorityTask(e);
	}

	// function replaceTask (elem, li){  //перерисовка задачи
	// 	$(li).replaceWith(elem);
	// }
	/*function replaceTask (elem, $li){  //перерисовка задачи
		// var next = li.nextElementSibling;
		// 	cont.removeChild(li);
		// 	cont.insertBefore(elem, next);
		// 	return;
	}*/

	function findTask (e){   //поиск задачи
		var id = e.target.parentElement.parentElement.parentElement.id,
			task;
		tasks.forEach(function (elem){
			if(elem.index === id) task = elem;
		});	
		return task;
	}

	function toggleCompleted (e){ //переключение состояния задачи
		var task = findTask(e);

		if (task.readyState == false) {
			task.readyState = true;
		} else task.readyState = false;
	}
	/**
	* контекстное меню
	*/
	function contextMenuControl (e){
		if (target.tagName !== 'TEXTAREA') return false;
			if ($menu.is('.active')) {  
				toggleMenuOff();
			}else{
				toggleMenuOn();
				positionMenu(e);
			};
		document.addEventListener('click', toggleMenuOff);  // для клика вне меню
		document.addEventListener('keyup', function (e){    //для нажатой Esc
			if ( e.keyCode === 27 ) {
				toggleMenuOff();
			}
		});
	}
	/**
	* функции для отрисовки контекстного меню
	*/
	/*
	function setContextMenu (){
		menu = document.createElement('nav');
		var ul = document.createElement('ul'),
			li_high = document.createElement('li'),
			span_high = document.createElement('span'),
			i_high = document.createElement('i'),
			span_highVal = document.createElement('span'),
			li_medium = document.createElement('li'),
			span_medium = document.createElement('span'),
			i_medium = document.createElement('i'),
			span_mediumVal = document.createElement('span'),
			li_low = document.createElement('li'),
			span_low = document.createElement('span'),
			i_low = document.createElement('i'),
			span_lowVal = document.createElement('span');

		menu.setAttribute('id', 'context-menu');
		menu.classList.add('context-menu');
		ul.classList.add('context-menu_items');
		menu.appendChild(ul);

		li_high.classList.add('context-menu_item');
		span_high.setAttribute('id', 'high');
		span_high.classList.add('context-menu_link');
		i_high.classList.add('fa', 'fa-circle');
		ul.appendChild(li_high);
		li_high.appendChild(span_high);
		span_high.appendChild(i_high);
		span_highVal.classList.add('context-menu_value');
		span_highVal.textContent = "Высокий приоритет";
		span_high.appendChild(span_highVal);

		li_medium.classList.add('context-menu_item');
		span_medium.setAttribute('id', 'medium');
		span_medium.classList.add('context-menu_link');
		i_medium.classList.add('fa', 'fa-circle');
		ul.appendChild(li_medium);
		li_medium.appendChild(span_medium);
		span_medium.appendChild(i_medium);
		span_mediumVal.classList.add('context-menu_value');
		span_mediumVal.textContent = "Средний приоритет";
		span_medium.appendChild(span_mediumVal);

		li_low.classList.add('context-menu_item');
		span_low.setAttribute('id', 'low');
		span_low.classList.add('context-menu_link');
		i_low.classList.add('fa', 'fa-circle');
		span_low.appendChild(i_low);
		span_lowVal.classList.add('context-menu_value');
		span_lowVal.textContent = "Низкий приоритет";
		span_low.appendChild(span_lowVal);
		li_low.appendChild(span_low);
		ul.appendChild(li_low);

		menu.addEventListener("click", choosePriority);

		document.body.appendChild(menu);
	}
*/
	/**/
	function setContextMenu (){
		$menu = $('<nav class="context-menu" id = "context-menu"></nav>');
		var $ul = $("<ul class='context-menu_items'></ul>"),
			$li_high = $("<li class='context-menu_item'></li>"),
			$span_high = $("<span id='high' class='context-menu_link'>Высокий приоритет</span>"),
			$i_high = $("<i  class='fa fa-circle'></i>"),
			// $span_highVal = $(""),
			$li_medium = $("<li class='context-menu_item'></li>"),
			$span_medium = $("<span id='medium' class='context-menu_link'>Средний приоритет</span>"),
			$i_medium = $("<i  class='fa fa-circle'></i>"),
			// $span_mediumVal = $(""),
			$li_low = $("<li class='context-menu_item'></li>"),
			$span_low = $("<span id='low' class='context-menu_link'>Низкий приоритет</span>"),
			$i_low = $("<i  class='fa fa-circle'></i>");
			// $span_lowVal = $("");

		$menu.append($ul);
		$ul.append($li_high);
		$($li_high).append($span_high);
		$($span_high).prepend($i_high);

		$($ul).append($li_medium);
		$($li_medium).append($span_medium);

		$($span_medium).prepend($i_medium);

		$($ul).append($li_low);
		$($li_low).append($span_low);
		$($span_low).prepend($i_low);

		$($menu).append();
		
		$($menu).on("click", choosePriority);

		$(document.body).append($menu);
	}


	/**
	* функции для отображения, скрытия контекстного меню
	*/
	function toggleMenuOn() {
		$menu.addClass('active');
	}

	function toggleMenuOff() {
		$menu.removeClass('active');
	}

	/**
	* функция для позиционирования контекстного меню
	*/
	function getPosition(e) { 
		var posx = 0;
		var posy = 0;

		if (!e) var e = window.event;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + 
							document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + 
							document.documentElement.scrollTop;
		}
		return {
			x: posx,
			y: posy
		}	
	}

	var menuPosition,
		menuPositionX,
		menuPositionY;

	function positionMenu(e) {
		menuPosition = getPosition(e);
		menuPositionX = menuPosition.x + "px";
		menuPositionY = menuPosition.y + "px";

		$menu.css('left', menuPositionX);
		$menu.css('top', menuPositionY);
	}

	function choosePriority(event){  //выбор задачи
		var high = document.querySelector('#high'),
			medium = document.querySelector('#medium'),
			low = document.querySelector('#low'),
			valuePriority;
		if (event.target == high) {
			valuePriority = 'highPriority';
		} else if (event.target == medium){
			valuePriority = 'mediumPriority';
		}else if (event.target == low){
			valuePriority = 'lowPriority';
		}
		Collection.setPreiority(contextMenuTask, contextMenuLi, valuePriority);
	}
	/**
	* функция для удаления списка задач Li
	*/
	function delLi(){
		var liAll = document.querySelectorAll('.li');
		for (var i = 0; i < liAll.length; i++){
			var li = liAll[i];
			cont.removeChild(li);
		}
	}

	function sortPriority(e){
		var highPriority = document.querySelector('#highPriority'),
			mediumPriority = document.querySelector('#mediumPriority'),
			lowPriority = document.querySelector('#lowPriority');
		delLi();

		if (e.target == highPriority) {
			tasks.forEach(function(task){
				if (task.priority == "highPriority") {
					createTask(task);
				}
			});
			tasks.forEach(function(task){
				if (task.priority !== "highPriority") {
					createTask(task);
				}
			});
		} else if (e.target == mediumPriority) {
			tasks.forEach(function(task){
				if (task.priority == "mediumPriority") {
					createTask(task);
				}
			});
			tasks.forEach(function(task){
				if (task.priority !== "mediumPriority") {
					createTask(task);
				}
			});
		} else if (e.target == lowPriority){
			tasks.forEach(function(task){
				if (task.priority == "lowPriority") {
					createTask(task);
				}
			});
			tasks.forEach(function(task){
				if (task.priority !== "lowPriority") {
					createTask(task);
				}
			});
		}
		// console.log('сортировка работает');
	}

	function restoreTasks(e){
		delLi();
		tasks.forEach(function(task){
			createTask(task);
		});
	}

	/**
	* функции для работы с LokalStorage через библиотеку Storage.js
	*/
	function addStorage(tasks) {
		storage.add('tasks',tasks);
	}

	function getStorage() {
		if (storage.get('tasks')){
			tasks = storage.get('tasks');
			restoreTasks();
		}
	}

	function restoreStorage(){
		storage.remove('tasks');
		storage.add('tasks',tasks);
	}

})(); //конец модуля


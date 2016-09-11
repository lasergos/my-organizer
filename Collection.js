function Task (text, index, priority){
			this.text = text;
			this.index = index;
			this.priority = priority;
			this.readyState = false;
			this.startTime = Date.now() + '';
			this.endTime = Date.now() + '';
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
		task.endTime = Date.now() + '';
		var difference = +task.endTime - +task.startTime,
			yearPow = 365*24*60*60*1000,
			monthPow = 30*24*60*60*1000,
			weekPow = 7*24*60*60*1000,
			dayPow = 24*60*60*1000,
			hourPow = 60*60*1000,
			minutePow = 60*1000,
			secondPow = 1000,
			year = month = week = day = hour = minute = second = 0;
		if (difference > yearPow) {
			year = Math.floor(difference/yearPow);
			difference -= (year * yearPow);
		}
		if (difference > monthPow) {
			month = Math.floor(difference/monthPow);
			difference -= (month * monthPow);
		}
		if (difference > weekPow) {
			week = Math.floor(difference/weekPow);
			difference -= (week * weekPow);
		}
		if (difference > dayPow) {
			day = Math.floor(difference/dayPow);
			difference -= (day * dayPow);
		}
		if (difference > hourPow) {
			hour = Math.floor(difference/hourPow);
			difference -= (hour * hourPow);
		}
		if (difference > minutePow) {
			minute = Math.floor(difference/minutePow);
			difference -= (minute * minutePow);
		}
		if (difference > secondPow) {
			second = Math.floor(difference/secondPow);
		}
		showTime(year, month, week, day, hour, minute, second, task);
		// task.comMessage = 'На выполнение задачи затрачено: ' + year + ' лет ' + month + ' месяцев ' + week + ' недель ' + day + ' дней ' + hour + ' часов ' + minute + ' минут ' + second + ' секунд';
	}

	function showTime(year, month, week, day, hour, minute, second, task){
		var text = 'На выполнение задачи затрачено: ';
		if (year !== 0) {
			if (year == 1 || year == 21) {
				text += year + ' год ';
			}else if (year == 2 || year == 3 || year == 4){
				text += year + ' года ';
			}else {
				text += year + ' лет ';
			}
		}
		if (month !== 0) {
			if (month == 1) {
				text += month + ' месяц ';
			}else if (month == 2 || month == 3 || month == 4){
				text += month + ' месяца ';
			}else {
				text += month + ' месяцев ';
			}
		}
		if (week !== 0) {
			if (week == 1) {
				text += week + ' неделя ';
			}else if (week == 2 || week == 3 || week == 4){
				text += week + ' недели ';
			}
		}
		if (day !== 0) {
			if (day == 1 || day == 21 || day == 31) {
				text += day + ' день ';
			}else if (day == 2 || day == 3 || day == 4 || day == 22 || day == 23 || day == 24){
				text += day + ' дня ';
			}else {
				text += day + ' дней ';
			}
		}
		if (hour !== 0) {
			if (hour == 1 || hour == 21) {
				text += hour + ' час ';
			}else if (hour == 2 || hour == 3 || hour == 4 || hour == 22 || hour == 23 || hour == 24){
				text += hour + ' часа ';
			}else {
				text += hour + ' часов ';
			}
		}
		if (minute !== 0) {
			if (minute == 1 || minute == 21 || minute == 31 || minute == 41 || minute == 51) {
				text += minute + ' минута ';
			}else if (minute == 2 || minute == 3 || minute == 4 || minute == 22 || minute == 23 || minute == 24 || minute == 32 || minute == 33 || minute == 34 || minute == 42 || minute == 43 || minute == 44 || minute == 52 || minute == 53 || minute == 54){
				text += minute + ' минуты ';
			}else {
				text += minute + ' минут ';
			}
		}
		if (second !== 0) {
			if (second == 1 || second == 21 || second == 31 || second == 41 || second == 51) {
				text += second + ' секунда ';
			}else if (second == 2 || second == 3 || second == 4 || second == 22 || second == 23 || second == 24 || second == 32 || second == 33 || second == 34 || second == 42 || second == 43 || second == 44 || second == 52 || second == 53 || second == 54){
				text += second + ' секунды ';
			}else {
				text += second + ' секунд ';
			}
		}
		task.comMessage = text;
	}
	
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
		return $li;
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
		$($span_high).append($i_high);

		$($ul).append($li_medium);
		$($li_medium).append($span_medium);
		$($span_medium).append($i_medium);

		$($ul).append($li_low);
		$($li_low).append($span_low);
		$($span_low).append($i_low);

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
		// menuPosition = getPosition(e);
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

	/*function removeStorage(tasks) {
		storage.remove('tasks');
	}*/

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


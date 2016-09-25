function Task (text, index, priority){
			this.text = text;
			this.index = index;
			this.priority = priority;
			this.readyState = false;
			this.startTime = Date.now() ;  
			this.endTime = Date.now() ;
			this.comMessage = 'Задача еще не выполнена';
		};

var Collection = (function () {
	var tasks = [],
		$menu,  //переменная для ссылки на контекстное меню
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
	/**
	*  Задачи, пункты напоминаний
	*/
	/**
	*  создание пункта напоминания
	*/
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
	/**
	*  Организация многострочной структуры текста в пункте напоминания
	*/	
	function setRows (item, text){
		var arr = text.split('\n');
		rows = arr.length;
		item.attr('rows', rows);
	}
	/**
	*  отрисовка пункта задачи
	*/
	function createTask(task){
		var li = createItem (task);
		$('#todo-list').append(li);
	}
	/**
	*  поиск задачи
	*/
	function findTask (e){  
		var id = e.target.parentElement.parentElement.parentElement.id,
			task;
		tasks.forEach(function (elem){
			if(elem.index === id) task = elem;
		});	
		return task;
	}
	/**
	*  переключение состояния задачи
	*/
	function toggleCompleted (e){ 
		var task = findTask(e);
		if (task.readyState == false) {
			task.readyState = true;
		} else task.readyState = false;
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
	/**
	*   функция отрисовки всех задач
	*/
	function restoreTasks(e){
		delLi();
		tasks.forEach(function(task){
			createTask(task);
		});
	}
	/*
	*  Задачи, пункты напоминаний
	**/
	/**
	*  расчет времени на выполнение задачи
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
	/**
	* демонстрация сообщения затраченного времени
	*/
	function showTime(diff, keys, task){
		var text = 'На выполнение задачи затрачено: ',
			unit_1 = ['год', 'месяц', 'день', 'час', 'минута', 'секунда'] ,
			unit_2 = ['года', 'месяца', 'дня', 'часа', 'минуты', 'секунды'] ,
			unit_3 = ['лет', 'месяцев', 'дней', 'часов', 'минут', 'секунд'] ;
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
	/**
	* Контекстное меню приоритета задач
	*/
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
	*  Контекстное меню приоритетов
	*/
	function showContextMenu (e){
		if (e.target.tagName !== 'TEXTAREA') return false;
		e.preventDefault();
		var contextMenuTask,
			contextMenuLi;
		toggleMenuOff();
		Collection.priorityTask(e);
	}
	/**
	* функции для создания контекстного меню
	*/
	function setContextMenu (){
		$menu = $('<nav class="context-menu" id = "context-menu"></nav>');
		var $ul = $("<ul class='context-menu_items'></ul>"),
			$li_high = $("<li class='context-menu_item'></li>"),
			$span_high = $("<span id='high' class='context-menu_link'>Высокий приоритет</span>"),
			$i_high = $("<i  class='fa fa-circle'></i>"),
			$li_medium = $("<li class='context-menu_item'></li>"),
			$span_medium = $("<span id='medium' class='context-menu_link'>Средний приоритет</span>"),
			$i_medium = $("<i  class='fa fa-circle'></i>"),
			$li_low = $("<li class='context-menu_item'></li>"),
			$span_low = $("<span id='low' class='context-menu_link'>Низкий приоритет</span>"),
			$i_low = $("<i  class='fa fa-circle'></i>");

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
	* функция сортировки задач по приоритету
	*/
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
	}
	/*
	* Контекстное меню приоритета задач
	**/
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
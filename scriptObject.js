(function (Collection, window, document, undefined) {
var $text = $(".textarea"),
	ol = document.querySelector("#todo-list"),
	count = 1,
	target,
	textareaAll,
	rez;

Collection.init(ol);
/**
* проверка localStorage на наличие индекса count
*/
if (storage.get('count')){
	count = storage.get('count');
}

function clearField (){
	$text.val('');
}

$("#addReminder").on('click', function (e) {
	if ($text.val() !== "") {
		var task = new Task($text.val(), 'index_' + count++, 'mediumPriority');
		Collection.add(task);
		$text.val('');
		storage.add('count',count); //добавление в localStorage индекса count
	}
});
$("#clear").on('click', clearField);
$("#todo-list").on('click', function (e){
	Collection.toggleCompleted(e);
});
$("#toggle-all").on('click', function (e){
	Collection.toggleCompletedAll(e);
});
$("#todo-list").on('click', function (e){
	Collection.delTask(e);
});
$("#todo-list").on('dblclick', function (e){
	Collection.editText(e);
});
$('#hideCompleted').on('click', function (){
	Collection.hideCompletedTask();
});
$('#onlyCompleted').on('click', function (e){
	Collection.hideNotCompletedTask();
});
$('#delCompleted').on('click', function (e){
	Collection.delCompletedTask();
});
$('#prioritySel').on('click', function (e){
	Collection.sortPriority(e);
});
})(Collection, window, document);

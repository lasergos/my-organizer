var storage = (function (){
	function serialize(obj) {
		return JSON.stringify(obj);
	}

	function deserialize(str) {
		return JSON.parse(str);
	}

	return {
		add:function(keyName, objectName){
			localStorage.setItem(keyName, serialize(objectName));
		},

		get: function(keyName){
			return deserialize(localStorage.getItem(keyName));
		},

		getAll: function(){
			var len = localStorage.length,
				arr = [];
			for (var i = 0; i < len; i++) {
				try{
					var j = localStorage.key(i),
						k = deserialize(localStorage.getItem(j)); //ругается если не объект JSON
						arr.push(k);
				} catch (e){continue;}
				
				
			}
			return arr;
		},

		remove: function (keyName) {
			localStorage.removeItem(keyName);
		},

		clear: function () {
			localStorage.clear();
		},
	}
})();
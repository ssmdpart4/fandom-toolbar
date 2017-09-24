void (function(mw, $, window, FandomToolbar){
	$.extend(FandomToolbar, {
		create: function create(){
			var config = typeof arguments[0] === 'function' ? arguments[0].apply(this, []) : (typeof arguments[0] === 'object' ? arguments[0] : {});
			$.extend(this, {
				userName: mw.config.get('wgUserName'),
				items: config.items || [],
				grouped: config.grouped || false,
				collapsed: config.collapsed || null,
				collapsible: config.collapsible || null
			});
			return this;
		},
		parse: function parse(data){
			var lines = data.split(/\n/g),
				isGrouped = null,
				obj = null;
			lines = lines.map(function(line){
				return line.trim();
			});
			isGrouped = lines.some(function(line){
				var regex = /\_(?:\s+|)([\w\d\-\s\&\?\.]+)(?:\s+|)\_/gi;
				return regex.test(line);
			});
			if (isGrouped === true){
				obj = {};
				var json = '{',
					singularItems = [];
				if (/\_(?:\s+|)([\w\d\-\s\&\?\.]+)(?:\s+|)\_/gi.test(lines[0]) === false){
					for (var j = 0, l = lines.length; j < l; j++){
						if (/\_(?:\s+|)([\w\d\-\s\&\?\.]+)(?:\s+|)\_/gi.test(_line)) break;
						var _line = lines[j];
						singularItems[singularItems.length] = _line;
					}
					lines = lines.filter(function(line){
						return singularItems.indexOf(line) === -1;
					});
				}
				lines.forEach(function(line, index){
					var heading_regex = /\_(?:\s+|)([\w\d\-\s\&\?\.]+)(?:\s+|)\_/gi;
					if (heading_regex.test(line)){
						if (index > 0 && index < lines.length - 1){
							json += ', \n';
						}
						json += '"' + line.replace(heading_regex, '$1').trim() + '": ';
					} else {
						json += '"' + line.trim() + '"';
					}
				});
				json += '}';
				obj = {
					singularItems: singularItems,
					groupedItems: JSON.parse(json)
				};
			} else {
				obj = [];
				obj = Array.apply(obj, lines.map(function(line){
					return line.trim();
				}));
			}
			return {
				then: function(callback){
					callback.apply(window, [obj]);
				},
				value: obj
				toString: function(){
					return JSON.stringify(obj);
				}
			};
		}
	});
})(this.mediaWiki, this.jQuery, this, this.FandomToolbar = this.FandomToolbar || {});

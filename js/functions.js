// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/**
* FUNCTION UMAZUMA
*/
$(function(){
	/**
	*	Serialisation d'un formulaire en objet javascript (JSON)
	*  ====================================
	*	$('form').submit(function(e) {
	*		e.preventDefault();
	*    	return $('form').toJSON();
	*	});
	*	====================================
	*/
	$.fn.toJSON = function(options) {
		options = $.extend({}, options);	
		var self = this,
			json = {},
			push_counters = {},
			patterns = {
				"validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
				"key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
				"push":     /^$/,
				"fixed":    /^\d+$/,
				"named":    /^[a-zA-Z0-9_]+$/
			};	
		this.build = function(base, key, value){
			base[key] = value;
			return base;
		};	
		this.push_counter = function(key){
			if(push_counters[key] === undefined){
				push_counters[key] = 0;
			}
			return push_counters[key]++;
		};
		$.each($(this).serializeArray(), function(){
			// skip invalid keys
			if(!patterns.validate.test(this.name)){
				return;
			}
			var k,
				keys = this.name.match(patterns.key),
				merge = this.value,
				reverse_key = this.name;
			while((k = keys.pop()) !== undefined){
				// adjust reverse_key
				reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');
				// push
				if(k.match(patterns.push)){
					merge = self.build([], self.push_counter(reverse_key), merge);
				}
				// fixed
				else if(k.match(patterns.fixed)){
					merge = self.build([], k, merge);
				}
				// named
				else if(k.match(patterns.named)){
					merge = self.build({}, k, merge);
				}
			}
			json = $.extend(true, json, merge);
		});	
		return json;
	}
	
	/*
	++++++++++++++++++++++++++++++++++++++++++++++++++++++
	* OBJET UMA DE GESTION DES DONNES STOCKEES LOCALEMENT
	++++++++++++++++++++++++++++++++++++++++++++++++++++++
	*/
	var uma = {
		
		/*
		* URL des données remote
		*/
		remote : '/web',	
		/*
		* Recupération d'un script et mise en action
		* Peut se tropuver dans le localstorage ou en ligne
		*/
		get_script : function($script){
			// tester si le script est déjà démarré
			$sc = localStorage.getItem('js_'+$script);
			if(!!$sc){
				eval($sc);
				eval($script+'_start()');
			}else if(navigator.onLine){
				// si non faire une requete et stocker	
				$this = this;			
				$.get(this.remote+'/javascript/'+$script+'/'+Math.random(), function($datas){
					$this.store_script($script, $datas);
					eval($datas);
					eval($script+'_start()');
				});
			}else{
				alert('Pas de connexion active');	
			}
			
			
		},
		
		/*
		* Recupération d'un template et appel de la fonction de callback
		* Peut se trouver dans le localstorage ou en ligne
		*/
		get_template : function($template, $callback){
			
			// tester si le script est déjà démarré
			$sc = localStorage.getItem('tmp_'+$template);
			if(!!$sc){
				$callback($sc);
			}else if(navigator.onLine){
				// si non faire une requete et stocker	
				$this = this;			
				$.get(this.remote+'/views/'+$template+'/'+Math.random(), function($datas){
					$this.store_template($template, $datas);
					$callback($datas);
				});
			}else{
				alert('Pas de connexion active');	
			}
			
		},
		
		/*
		* Recupération des données en passant la classe et la méthodes
		* Peut se trouver dans le localstorage ou en ligne
		*/
		get_datas : function($class, $method, $callback){
			
			// tester si le script est déjà démarré
			$sc = localStorage.getItem('data_'+$class+'_'+$method);
			if(!!$sc){
				$callback($sc);
			}else if(navigator.onLine){
				// si non faire une requete et stocker	
				$this = this;			
				$.get(this.remote+'/utilities/'+$class+'/'+$method+'/'+Math.random(), function($datas){
					$this.store_datas($class, $method, $datas);
					$callback($datas);
				});
			}else{
				alert('Pas de connexion active');	
			}
		},
		
		/*
		*
		*/
		store_script : function($script, $datas){
			localStorage.setItem('js_'+$script, $datas);
		},
		
		/*
		*
		*/	
		store_template : function($template, $datas){	
			localStorage.setItem('tmp_'+$template, $datas);
		},
		
		/*
		*
		*/
		store_datas : function($class, $method, $datas){
			localStorage.setItem('data_'+$class+'_'+$method, $datas)
		},
		
		
		/*
		* Gestion des formulaires
		*/
		map_form : function($form_name, $datas){
			
			/*console.log($form_name);
			console.log($datas);*/
			console.log($datas);
		},
		
	};
	
	/*
	++++++++++++++++++++++++++++++++++++++++++++++++++++++
	* FIN OBJET
	++++++++++++++++++++++++++++++++++++++++++++++++++++++
	*/

	
	
});

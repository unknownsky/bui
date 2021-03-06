/**
 * @fileOverview 异步进度条
 * @author dengbin
 * @ignore
 */

define('bui/progressbar/load',function(require){

	var Base = require('bui/progressbar/base'),
	 	notStarted = 0,
		hasStarted = 1,
		hasEnded = 2;
	/**
	 * 异步加载进度条
	 * @extends BUI.ProgressBar.Base
	 * @class  BUI.ProgressBar.Load
	 */
	var loadProgressBar = Base.extend({
		/**
	     * @protected
	     * @ignore
	     */
		bindUI : function () {
			var _self = this;

			_self.on('afterPercentChange',function (ev) {
				if(_self.isLoading()){
					var percent = _self.get('percent');
					if(percent == 100 ){
						_self.onCompleted();
					}
					_self.onChange();
				}
			});

		},
		/**
		 * 开始
		 */
		start : function  () {
			var _self = this;
			if(!_self.isLoading()){
				_self.onstart();
			}
		},
		/**
		 * 完成
		 */
		complete : function(){
			var _self = this;
			clearTimeout(_self.get('t'));
			_self.set('percent',100);
			
		},
		/**
		 * 取消
		 */
		cancle : function(){
			var _self = this;
			clearTimeout(_self.get('t'));
			if(_self.get('percent')){
				_self.set('percent',0);
			}
			_self.set('status',notStarted);
		},
		/**
		 * 开始
		 * @protected
		 */
		onstart : function(){
			var _self = this,
				cfg = _self.get('cfg');

			_self.set('percent',0);
			_self.set('status',hasStarted);
			
			_self.fire('start',cfg);
			_self._startLoad();
		},
		/**
		 * 加载变化
		 * @protected
		 */
		onChange : function(){
			var _self = this;
			_self.fire('loadchange');
		},

		/**
		 * 完成
		 * @protected
		 */
		onCompleted : function(){
			var _self = this;
			_self.set('status',hasEnded);
			_self.fire('completed');
			
		},
		isLoading : function  () {
			return this.get('status') === hasStarted;
		},
		isCompleted : function () {
			return this.get('status') === hasEnded;
		},
		_startLoad : function () {
			var _self = this,
				ajaxCfg = _self.get('ajaxCfg'),
				interval = _self.get('interval'),
				t;
			ajaxCfg.success = function(data){
				var percent = data.percent;
				_self.set('percent',percent);
				if(percent < 100 && _self.isLoading()){
					t = setTimeout(function(){
						$.ajax(ajaxCfg);
					},interval);
					_self.set('t',t);
				}
			};
			$.ajax(ajaxCfg);
			
		}
	},{
		ATTRS : {
			/**
			 * 进度条状态
			 * 0： 未开始
			 * 1 ： 已开始
			 * 2 ： 以结束
			 * @type {Number}
			 */
			status : {
				value : 0
			},
			/**
			 * ajax配置项
			 * @type {Object}
			 */
			ajaxCfg : {

			},
			/**
			 * 发送请求时间间隔
			 * @type {number}
			 */
			interval : {
				value : 500
			},
			/**  
	        * 当数据加载完成后
	        * @name BUI.ProgressBar.Load  
	        * @event  
	        * @param {jQuery.Event} e  事件对象，包含加载数据时的参数
	        */
			events : {
				value : [
					'start',
					'loadchange',
					'completed'
				]
			}
		}
	},{
		xclass : 'progress-bar-load'
	});

	return loadProgressBar;
});

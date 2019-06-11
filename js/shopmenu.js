define("components/balance_tip/models/balance", ["require", "backbone", "core/utils"], function(e) {
		var t = e("backbone"),
			i = e("core/utils");
		return t.Model.extend({
			url: window._global.url.www + "/pay/recharge/teambalance.json",
			defaults: {
				balance: ""
			},
			fetch: function() {
				var e = this;
				this.toJSON();
				return i.ajax({
					url: this.url
				}).done(function(t) {
					e.set(t), e.trigger("sync")
				})
			}
		})
	}), define("text!components/balance_tip/templates/balance.html", [], function() {
		return '<div class="balance-info">\n    <h2>\n        <span class="remind-icon">店铺余额不足，请尽快充值</span>\n    </h2>\n    <p class="tips">\n        自2015年10月22日起，有赞已启用新的交易手续费补贴计划。\n        <a href="http://bbs.youzan.com/forum.php?mod=viewthread&tid=218612&page=1&extra=" target="_blank">了解详情</a>\n    </p>\n    <p class="tips">\n        截至目前，由于您的店铺余额不足，已有<span><%= Math.abs(balance) %>元</span>交易手续费未缴纳。现已暂停提供在线导入/导出、开放接口（API）等服务。请及时充值店铺余额，以免影响服务。\n    </p>\n    <a href="<%= _global.url.www %>/trade/newsettlement#rechargeMoney" class="btn btn-block btn-red">立即充值</a>\n</div>\n'
	}), define("components/balance_tip/app", ["require", "backbone", "jquery", "underscore", "./models/balance", "text!./templates/balance.html"], function(e) {
		var t = e("backbone"),
			i = e("jquery"),
			n = e("underscore"),
			a = e("./models/balance"),
			s = e("text!./templates/balance.html");
		return t.View.extend({
			className: "shop-balance-tip hide",
			template: n.template(s),
			initialize: function() {
				this.model = new a, this.model.fetch(), this.listenTo(this.model, "sync", this.render)
			},
			render: function() {
				var e = this;
				this.model.get("balance") < 0 && (e.$el.html(e.template(this.model.toJSON())), i("body").append(e.$el), e.$el.show())
			}
		})
	}), define("components/message/message_bot_lite", ["require", "components/notice_center/app", "components/balance_tip/app", "jquery", "underscore"], function(e) {
		var t = e("components/notice_center/app"),
			i = e("components/balance_tip/app"),
			n = (e("jquery"), e("underscore"), {
				init: function() {
					setTimeout(function() {
						new t, "/dashboard/index" !== window._global.query_path && new i
					}, 1e3)
				}
			});
		return n
	}), define("models/edit", ["backbone"], function(e) {
		var t = window._,
			i = e.Model.extend({
				defaults: function() {
					return {
						nav: [{
							menu_id: 0,
							title: "标题",
							link_id: "",
							link_title: "",
							link_type: "",
							link_url: "",
							link_news: "",
							link_content: "",
							active_menu: 0,
							second: []
						}]
					}
				},
				addFirstNav: function() {
					var e = this,
						t = "标题",
						i = 0;
					this.collection.addMenu({
						title: t,
						parent_id: i
					}, function(i) {
						var n = e.get("nav");
						n.push({
							menu_id: i,
							title: t,
							link_id: "",
							link_title: "",
							link_type: "",
							link_url: "",
							link_news: "",
							link_content: "",
							active_menu: 0,
							second: []
						}), e.set("nav", n), e.trigger("change:allNav")
					})
				},
				addSecondNav: function(e) {
					var t = this,
						i = t.get("nav"),
						n = "标题",
						a = i[e].menu_id;
					this.collection.addMenu({
						title: n,
						parent_id: a
					}, function(a) {
						i[e].second.push({
							menu_id: a,
							title: n,
							link_id: "",
							link_title: "",
							link_type: "",
							link_url: "",
							link_news: "",
							link_content: ""
						}), i[e].active_menu = i[e].second.length - 1, t.set("nav", i), t.trigger("change:allNav")
					})
				},
				delFirstNav: function(e) {
					var t = this,
						i = t.get("nav"),
						n = i[e].menu_id;
					this.collection.deleteMenu({
						id: n
					}, function(n) {
						i.splice(e, 1), t.set("nav", i), t.trigger("change:allNav")
					})
				},
				delSecondNav: function(e, t) {
					var i = this,
						n = i.get("nav"),
						a = n[e].second[t].menu_id;
					this.collection.deleteMenu({
						id: a
					}, function(a) {
						n[e].second.splice(t, 1), n[e].active_menu = n[e].second.length - 1, i.set("nav", n), i.trigger("change:allNav")
					})
				},
				editFirstNav: function(e, t) {
					var i = this,
						n = i.get("nav"),
						a = n[e].menu_id;
					this.collection.updateMenu({
						id: a,
						title: t
					}, function(a) {
						n[e].title = t, i.set("nav", n), i.trigger("change:allNav")
					})
				},
				editSecondNav: function(e, t, i) {
					var n = this,
						a = n.get("nav"),
						s = a[e].second[t].menu_id;
					this.collection.updateMenu({
						id: s,
						title: i
					}, function(s) {
						a[e].second[t].title = i, n.set("nav", a), n.trigger("change:allNav")
					})
				},
				chooseFirstLink: function(e, t) {
					var i = this,
						n = i.get("nav"),
						a = n[e].menu_id,
						s = n[e];
					s.link_id = t.id || "", s.link_title = t.title, s.link_type = t.type, s.link_url = t.url, s.link_news = t.news || "", s.link_content = t.content || "", this.collection.updateMenuReply({
						id: a,
						reply: s
					}, function(e) {
						i.set("nav", n), i.trigger("change:allNav")
					})
				},
				chooseSecondLink: function(e, t, i) {
					var n = this,
						a = n.get("nav"),
						s = a[e].second[t].menu_id,
						o = a[e].second[t];
					o.link_id = i.id || "", o.link_title = i.title, o.link_type = i.type, o.link_url = i.url, o.link_news = i.news || "", o.link_content = i.content || "", this.collection.updateMenuReply({
						id: s,
						reply: o
					}, function(e) {
						n.set("nav", a), n.trigger("change:allNav")
					})
				},
				chooseTxtEdit: function(e, i, n) {
					var a = this,
						s = this.get("nav"),
						o = s[i],
						l = s[i].menu_id;
					t.isNull(n) || t.isUndefined(n) || (o = o.second[n], l = s[i].second[n].menu_id), o.link_id = e.id || "", o.link_title = e.title || "", o.link_type = e.type, o.link_url = e.url || "", o.link_news = e.news || "", o.link_content = e.content, this.collection.updateMenuReply({
						id: l,
						reply: o
					}, function(e) {
						a.set("nav", s), a.trigger("change:allNav")
					})
				},
				chooseImage: function(e, t, i) {
					this.chooseTxtEdit(e, t, i)
				},
				setActiveMenu: function(e, t) {
					var i = this.get("nav");
					i[e].active_menu = t, this.set({
						nav: i
					}), this.trigger("change:allNav")
				}
			});
		return i
	}), define("collections/edit", ["require", "backbone", "models/edit", "core/utils"], function(e) {
		var t = e("backbone"),
			i = e("models/edit"),
			n = e("core/utils"),
			a = window.jQuery,
			s = window._,
			o = t.Collection.extend({
				model: i,
				sync: function() {
					var e = window.location.pathname + "/sync.json";
					return this._validate() ? (n.successNotify("正在发布，请稍后。"), void a.ajax({
						url: e,
						type: "PUT",
						dataType: "json",
						success: function(e) {
							0 == e.code ? (window.router.navigate("", {
								trigger: !0
							}), n.successNotify("发布成功。")) : n.errorNotify(e.msg ? e.msg : "发布失败。")
						}
					}).fail(function() {
						n.errorNotify("系统错误。")
					}).always(function() {
						a(".form-actions .btn").button("reset")
					})) : (n.errorNotify("有菜单没有回复内容，请修改后重新提交。"), void a(".form-actions .btn").button("reset"))
				},
				_validate: function() {
					for (var e = this.at(0).get("nav"), t = e.length - 1; t >= 0; t--)
						if (0 === e[t].second.length) {
							for (var i in e[t])
								if ("link_type" == i && "" == e[t][i]) return !1
						} else
							for (var n = e[t].second.length - 1; n >= 0; n--)
								for (var a in e[t].second[n])
									if ("link_type" == a && "" == e[t].second[n][a]) return !1;
					return !0
				},
				fetch: function(e) {
					e = e || {};
					var t = this;
					a.getJSON(window.location.pathname + "/detail.json", function(a) {
						if (t.reset(), 0 === a.code) {
							var o = a.data.data;
							s.isEmpty(o) || s.isArray(o) && 0 === o.length ? t.add(i.prototype.defaults()) : t.add(o), e.success(a)
						} else n.errorNotify(a.msg ? a.msg : "获取菜单失败。")
					}).fail(function() {
						n.errorNotify("系统错误。")
					})
				},
				addMenu: function(e, t) {
					var i = window.location.pathname + "/add.json";
					n.successNotify("正在创建，请稍后。"), a.ajax({
						url: i,
						type: "POST",
						data: e,
						dataType: "json",
						success: function(e) {
							0 == e.code ? (n.successNotify("创建成功。"), t && t(e.data)) : n.errorNotify(e.msg ? e.msg : "创建失败。")
						}
					}).fail(function() {
						n.errorNotify("系统错误。")
					}).always(function() {})
				},
				deleteMenu: function(e, t) {
					var i = window.location.pathname + "/delete.json";
					n.successNotify("正在删除，请稍后。"), a.ajax({
						url: i,
						type: "DELETE",
						data: e,
						dataType: "json",
						success: function(e) {
							0 == e.code ? (n.successNotify("删除成功。"), t && t(e.data)) : n.errorNotify(e.msg ? e.msg : "删除失败。")
						}
					}).fail(function() {
						n.errorNotify("系统错误。")
					}).always(function() {})
				},
				updateMenu: function(e, t) {
					var i = window.location.pathname + "/title.json";
					n.successNotify("正在更新，请稍后。"), a.ajax({
						url: i,
						type: "PUT",
						data: e,
						dataType: "json",
						success: function(e) {
							0 == e.code ? (n.successNotify("更新成功。"), t && t(e.data)) : n.errorNotify(e.msg ? e.msg : "更新失败。")
						}
					}).fail(function() {
						n.errorNotify("系统错误。")
					}).always(function() {})
				},
				updateMenuReply: function(e, t) {
					var i = window.location.pathname + "/reply.json";
					n.successNotify("正在更新，请稍后。"), a.ajax({
						url: i,
						type: "PUT",
						data: e,
						dataType: "json",
						success: function(e) {
							0 == e.code ? (n.successNotify("更新成功。"), t && t(e.data)) : n.errorNotify(e.msg ? e.msg : "更新失败。")
						}
					}).fail(function() {
						n.errorNotify("系统错误。")
					}).always(function() {})
				}
			});
		return new o
	}), define("views/smile_list", [], function() {
		var e = ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "酷", "冷汗", "抓狂", "吐", "偷笑", "可爱", "白眼", "傲慢", "饥饿", "困", "惊恐", "流汗", "憨笑", "大兵", "奋斗", "咒骂", "疑问", "嘘", "晕", "折磨", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓", "咖啡", "饭", "猪头", "玫瑰", "凋谢", "嘴唇", "爱心", "心碎", "蛋糕", "闪电", "炸弹", "刀", "足球", "瓢虫", "便便", "月亮", "太阳", "礼物", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK", "爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头", "回头", "跳绳", "挥手", "激动", "街舞", "献吻", "左太极", "右太极"];
		return e
	}), define("views/base", ["require", "backbone", "views/smile_list"], function(e) {
		var t = e("backbone"),
			i = e("views/smile_list"),
			n = t.View.extend({
				parse: function(e) {
					var t = $(".msgContainer").length > 0 ? $(".msgContainer") : $('<pre class="msgContainer hide"></pre>').appendTo($("body"));
					return t.html(e), t.find("img").each(function(e, t) {
						var n = $(t),
							a = n.attr("src");
						if (a) {
							var s = a.match(/\/(\d*)\.gif/);
							if (s) {
								var o = s[1],
									l = "[" + i[Number(o) - 1] + "]";
								n.replaceWith(l)
							}
						} else n.remove()
					}), t.find("a").each(function(e, t) {
						var i = $(t),
							n = i.html();
						(n.indexOf("&gt;") >= 0 || n.indexOf("&lt;") >= 0) && i.html(n.replace(/&lt;/g, "＜").replace(/&gt;/g, "＞"))
					}), t.html()
				}
			});
		return n
	}), define("text!templates/nav.html", [], function() {
		return '<% for (var i = 0; i < nav.length; i++) { %>\n    <div class="nav-field js-first-field" data-id="<%= i %>">\n        <div class="close-modal js-del-first">×</div>\n        <div class="field-wrap clearfix js-field-wrap">\n            <div class="menu-titles">\n                <div class="h4">一级菜单：</div>\n                <ul class="first-nav-field">\n                    <li class="js-first-field-li js-menu-li clearfix <% if (nav[i].second.length === 0 || nav[i].active_menu === -1) { %> active <% } %>" data-id="-1">\n                        <span class="h5"><%= nav[i].title %></span>\n                        <span class="opts">\n                            <a href="javascript:void(0);" class="js-edit-first">编辑</a>\n                        </span>\n                    </li>\n                </ul>\n\n                <div class="h4">二级菜单：</div>\n                <ul class="sec-nav-field">\n                <% for (var n = 0; n < nav[i].second.length; n++) { %>\n                    <li class="js-second-field js-menu-li clearfix <% if (n === nav[i].active_menu) { %> active <% } %>" data-id="<%= n %>">\n                        <span class="h5"><%= n+1 %>. <%= nav[i].second[n].title %></span>\n                        <span class="opts">\n                            <a href="javascript:void(0);" class="js-edit-second">编辑</a> -\n                            <a href="javascript:void(0);" class="js-del-second">删除</a>\n                        </span>\n                    </li>\n                <% } %>\n                </ul>\n\n                <div class="add-second-nav">\n                    <a href="javascript:void(0);" class="js-add-second">+ 添加二级菜单</a>\n                </div>\n            </div>\n\n            <div class="menu-main">\n                <div class="menu-content" style="min-height:<%= 80 + nav[i].second.length * 38 %>px">\n                    <div class="link-to js-link-to <% if (nav[i].second.length > 0 && nav[i].active_menu !== -1) { %> hide <% } %>" data-id="-1">\n                        <% if (nav[i].second.length > 0) { %>\n                            <span class="died-link-to">使用二级菜单后主回复已失效。</span>\n                        <% } else { %>\n                            <%\n                                var firstNav = nav[i],\n                                    link_id = firstNav.link_id,\n                                    link_title = firstNav.link_title,\n                                    link_type = firstNav.link_type,\n                                    link_url = firstNav.link_url,\n                                    link_news = firstNav.link_news,\n                                    link_content = firstNav.link_content;\n                            %>\n\n                            <!-- 相同代码 -->\n                            <% if (link_type !== \'\' && link_type !== \'news\' && link_type !== \'articles\' && link_type !== \'text\') { %>\n                                <% if (link_url !== \'\' && link_type !== \'search\' && link_type !== \'checkin\') { %>\n                                    <a href="<%= link_url %>" target="_blank" class="new-window">\n                                <% } %>\n                                    <% if (link_type === \'feature\') { %>\n                                        [微页面]\n                                    <% } else if (link_type === \'category\') { %>\n                                        [微页面分类]\n                                    <% } else if (link_type === \'topic\') { %>\n                                        [专题]\n                                    <% } else if (link_type === \'tag\') { %>\n                                        [商品标签]\n                                    <% } else if (link_type === \'goods\') { %>\n                                        [商品]\n                                    <% } else if (link_type === \'activity\') { %>\n                                        [活动]\n                                    <% } else if (link_type === \'homepage\') { %>\n                                        [店铺主页]\n                                    <% } else if (link_type === \'usercenter\') { %>\n                                        [会员主页]\n                                    <% } else if (link_type === \'cart\') { %>\n                                        [购物车]\n                                    <% } else if (link_type === \'search\') { %>\n                                        [搜索]\n                                    <% } else if (link_type === \'checkin\') { %>\n                                        [签到]\n                                    <% } else if (link_type === \'survey\') { %>\n                                        [投票调查]\n                                    <% } else if (link_type === \'url\') { %>\n                                        [外链]\n                                    <% } %>\n                                <% if (link_title !== \'\') { %>\n                                    <%= link_title %>\n                                <% } %>\n                                <% if (link_url !== \'\' && link_type !== \'search\' && link_type !== \'checkin\') { %>\n                                    </a>\n                                <% } %>\n                            <% } else if (link_type === \'news\' || link_type === \'articles\') { %>\n                                <%\n                                    var link_title = link_title.split(\'\\\\n\');\n                                %>\n                                <% if (link_title.length > 1) { %>\n                                    <div class="ng ng-multiple">\n                                        <% for (var index in link_news) { %>\n                                            <div class="ng-item">\n                                                <span class="label label-success">图文<%= Number(index) + 1 %></span>\n                                                <div class="ng-title">\n                                                    <a href="<%= link_news[index].url %>" class="new_window" target="_blank">\n                                                        <%= link_news[index].title %>\n                                                    </a>\n                                                </div>\n                                            </div>\n                                        <% } %>\n                                    </div>\n                                <% } else { %>\n                                    <div class="ng ng-single">\n                                        <div class="ng-item">\n                                            <div class="ng-title">\n                                                <a href="<%= link_news[0].url %>" target="_blank" class="new-window">\n                                                    <%= link_news[0].title %>\n                                                </a>\n                                            </div>\n                                        </div>\n                                        <div class="ng-item view-more">\n                                            <a href="<%= link_news[0].url %>" target="_blank" class="clearfix new-window">\n                                                <span class="pull-left">阅读全文</span>\n                                                <span class="pull-right">&gt;</span>\n                                            </a>\n                                        </div>\n                                    </div>\n                                <% } %>\n                            <% } else if (link_type === \'text\') { %>\n                                <%= link_content %>\n                            <% } %>\n                            <% if (link_type === \'image\') { %>\n                                <div class="choose-image js-choose-image">\n                                    <a href="<%= _global.url.img %>/get?attachment_id=<%= link_id %>" target="_blank">\n                                        <img src="<%= _global.url.img %>/get?attachment_id=<%= link_id %>&kdt_id=<%= _global.kdt_id %>" />\n                                    </a>\n                                </div>\n                            <% } %>\n                            <!-- 相同代码 end -->\n\n                        <% } %>\n                    </div>\n\n                    <% if (nav[i].second.length > 0) { %>\n                        <% for (var n = 0; n < nav[i].second.length; n++) { %>\n                            <%\n                                var secondNav = nav[i].second[n],\n                                    link_id = secondNav.link_id,\n                                    link_title = secondNav.link_title,\n                                    link_type = secondNav.link_type,\n                                    link_url = secondNav.link_url,\n                                    link_news = secondNav.link_news,\n                                    link_content = secondNav.link_content;\n                            %>\n                            <div class="link-to js-link-to <% if (n !== nav[i].active_menu) { %> hide <% } %>" data-id="<%= n %>">\n\n                                <!-- 相同代码 -->\n                                <% if (link_type !== \'\' && link_type !== \'news\' && link_type !== \'text\' && link_type !== \'articles\') { %>\n                                    <% if (link_url !== \'\' && link_type !== \'search\' && link_type !== \'checkin\') { %>\n                                        <a href="<%= link_url %>" target="_blank" class="new-window">\n                                    <% } %>\n                                        <% if (link_type === \'feature\') { %>\n                                            [微页面]\n                                        <% } else if (link_type === \'category\') { %>\n                                            [微页面分类]\n	                                    <% } else if (link_type === \'topic\') { %>\n	                                        [专题]\n                                        <% } else if (link_type === \'tag\') { %>\n                                            [商品标签]\n                                        <% } else if (link_type === \'goods\') { %>\n                                            [商品]\n                                        <% } else if (link_type === \'activity\') { %>\n                                            [活动]\n                                        <% } else if (link_type === \'homepage\') { %>\n                                            [店铺主页]\n                                        <% } else if (link_type === \'usercenter\') { %>\n                                            [会员主页]\n                                        <% } else if (link_type === \'cart\') { %>\n                                            [购物车]\n                                        <% } else if (link_type === \'search\') { %>\n                                            [搜索]\n                                        <% } else if (link_type === \'checkin\') { %>\n                                            [签到]\n                                        <% } else if (link_type === \'survey\') { %>\n                                            [投票调查]\n                                        <% } else if (link_type === \'url\') { %>\n                                            [外链]\n                                        <% } %>\n                                    <% if (link_title !== \'\') { %>\n                                        <%= link_title %>\n                                    <% } %>\n                                    <% if (link_url !== \'\' && link_type !== \'search\' && link_type !== \'checkin\') { %>\n                                        </a>\n                                    <% } %>\n                                <% } else if (link_type === \'news\' || link_type === \'articles\') { %>\n                                    <%\n                                        var link_title = link_title.split(\'\\\\n\');\n                                    %>\n                                    <% if (link_title.length > 1) { %>\n                                        <div class="ng ng-multiple">\n                                            <% for (var index in link_news) { %>\n                                                <div class="ng-item">\n                                                    <span class="label label-success">图文<%= Number(index) + 1 %></span>\n                                                    <div class="ng-title">\n                                                        <a href="<%= link_news[index].url %>" class="new_window" target="_blank">\n                                                            <%= link_news[index].title %>\n                                                        </a>\n                                                    </div>\n                                                </div>\n                                            <% } %>\n                                        </div>\n                                    <% } else { %>\n                                        <% if(link_news[0]) { %>\n                                            <div class="ng ng-single">\n                                                <div class="ng-item">\n                                                    <div class="ng-title">\n                                                        <a href="<%= link_news[0].url %>" target="_blank" class="new-window">\n                                                            <%= link_news[0].title %>\n                                                        </a>\n                                                    </div>\n                                                </div>\n                                                <div class="ng-item view-more">\n                                                    <a href="<%= link_news[0].url %>" target="_blank" class="clearfix new-window">\n                                                        <span class="pull-left">阅读全文</span>\n                                                        <span class="pull-right">&gt;</span>\n                                                    </a>\n                                                </div>\n                                            </div>\n                                        <% } else { %>\n                                            <span class="c-gray">内容错误，请重新设置</span>\n                                        <% } %>\n                                    <% } %>\n                                <% } else if (link_type === \'text\') { %>\n                                    <%= link_content %>\n                                <% } %>\n                                <% if (link_type === \'image\') { %>\n                                    <div class="choose-image js-choose-image">\n								        <a href="<%= _global.url.img %>/get?attachment_id=<%= link_id %>" target="_blank">\n								            <img src="<%= _global.url.img %>/get?attachment_id=<%= link_id %>&kdt_id=<%= _global.kdt_id %>" />\n								        </a>\n								    </div>\n                                <% } %>\n                                <!-- 相同代码 end -->\n\n                            </div>\n\n                        <% } %>\n                    <% } %>\n\n                </div>\n\n                <div class="select-link js-select-link <% if (nav[i].second.length > 0 && nav[i].active_menu === -1) { %> hide <% } %>">\n                    <span class="change-txt">回复内容：</span>\n                    <span class="main-link">\n                        <a class="js-modal-txt" data-type="txt" href="javascript:void(0);">一般信息</a> -\n                        <% if (window.location.pathname.indexOf(\'sinaweibo/menu\') > -1) { %>\n                            <a class="js-modal-articles" data-type="articles" href="javascript:void(0);">图文素材</a> -\n                        <% } else { %>\n                            <a class="js-modal-news" data-type="news" href="javascript:void(0);">图文素材</a> -\n                        <% } %>\n                        <a class="js-modal-magazine" data-type="feature" href="javascript:void(0);">微页面</a> -\n                        <a class="js-modal-goods" data-type="goods" href="javascript:void(0);">商品</a> -\n                    </span>\n                    <div class="opts dropdown hover">\n                        <a class="dropdown-toggle" href="javascript:void(0);">其他<i class="caret"></i></a>\n                        <ul class="dropdown-menu">\n                            <% if (window.location.pathname.indexOf(\'sinaweibo/menu\') > -1) { %>\n                                <li>\n                                    <a class="js-modal-homepage" data-type="homepage" href="javascript:void(0);">店铺主页</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-links" data-type="link" href="javascript:void(0);">自定义外链</a>\n                                </li>\n                            <% } else if (_global.team_status.weixin_server == 1 || _global.team_status.weixin_oldsub == 1 || _global.team_status.weixin_certsub == 1) { %>\n                                <li>\n                                    <a class="js-modal-activity" data-type="activity" href="javascript:void(0);">活动</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-homepage" data-type="homepage" href="javascript:void(0);">店铺主页</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-usercenter" data-type="usercenter" href="javascript:void(0);">会员主页</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-cart" data-type="cart" href="javascript:void(0);">购物车</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-search" data-type="search" href="javascript:void(0);">搜索</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-checkin" data-type="checkin" href="javascript:void(0);">签到</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-survey" data-type="survey" href="javascript:void(0);">投票调查</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-links" data-type="link" href="javascript:void(0);">自定义外链</a>\n                                </li>\n\n                                <% } else { %>\n                                <li>\n                                    <a class="js-modal-homepage" data-type="homepage" href="javascript:void(0);">店铺主页</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-usercenter" data-type="usercenter" href="javascript:void(0);">会员主页</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-survey" data-type="survey" href="javascript:void(0);">投票调查</a>\n                                </li>\n                                <li>\n                                    <a class="js-modal-links" data-type="link" href="javascript:void(0);">自定义外链</a>\n                                </li>\n                            <% } %>\n                        </ul>\n                    </div>\n                    <div class="editor-image js-editor-image"></div>\n                    <div class="hide editor-place js-editor-place"></div>\n                </div>\n\n            </div>\n\n        </div>\n    </div>\n<% } %>\n\n<% if (nav.length > 0) { %>\n    <div class="add-first-nav">\n        <a href="javascript:void(0);" class="js-add-first">+ 添加一级菜单</a>\n    </div>\n<% } else { %>\n    <div class="add-first-nav no-data">\n        还没有设置任何菜单。\n        <a href="javascript:void(0);" class="js-add-first">+ 添加一级菜单</a>\n    </div>\n<% } %>\n'
	}), define("components/pop/base", ["backbone", "jqueryui"], function(e, t) {
		var i = e.View.extend({
			className: "popover left",
			initialize: function(e) {
				window.__components__pop && window.__components__pop.hide && window.__components__pop.hide(), window.__components__pop = this, this.callback = e.callback, this.target = e.target, this.trigger = e.trigger, e.notAutoHide || this.autoHide()
			},
			render: function() {
				return this.$el.html(this.template({})), this.onRender && this.onRender(), this
			},
			autoHide: function() {
				var e = this;
				$(document).on("click", function(t) {
					e.isShow() && 0 === e.$el.has(t.target).length && t.target !== e.trigger[0] && e.hide()
				})
			},
			setCallback: function(e) {
				this.callback = e
			},
			setTarget: function(e) {
				this.target = e
			},
			setTrigger: function(e) {
				this.trigger = e
			},
			isShow: function() {
				var e = this.$el.css("display");
				return "none" === e ? !1 : !0
			},
			hide: function() {
				return this.$el.hide(), this.remove(), window.__components__pop = null, this.$el
			},
			show: function() {
				return this.$el.show(), this.$el
			},
			toggle: function() {
				return this.$el.toggle(), this.$e
			},
			positioning: function() {
				var e = this,
					t = e.options.className;
				e.$el.show(), -1 !== t.indexOf("left") ? e.$el.position({
					of: e.target,
					my: "right center",
					at: "left center",
					collision: "none"
				}) : -1 !== t.indexOf("bottom") ? e.$el.position({
					of: e.target,
					my: "center top",
					at: "center bottom",
					collision: "none"
				}) : -1 !== t.indexOf("top") ? e.$el.position({
					of: e.target,
					my: "center bottom",
					at: "center top",
					collision: "none"
				}) : e.$el.position({
					of: e.target,
					my: "left center",
					at: "right center",
					collision: "none"
				}), e.el.className = e.options.className
			},
			reset: function(e) {
				var t = e.callback,
					i = e.target,
					n = e.trigger;
				this.setCallback(t), this.setTarget(i), this.setTrigger(n), this.positioning(), this.show()
			},
			triggerCallback: function() {
				this.callback.call(this), this.hide()
			}
		});
		return i
	}), define("text!components/pop/templates/link.html", [], function() {
		return '<div class="arrow"></div>\n<div class="popover-inner popover-link">\n    <div class="popover-content">\n        <div class="form-inline">\n            <input type="text" class="link-placeholder js-link-placeholder" placeholder="<%= content %>">\n            <button type="button" class="btn btn-primary js-btn-confirm" data-loading-text="确定"> 确定</button>\n            <button type="reset" class="btn js-btn-cancel">取消</button>\n        </div>\n    </div>\n</div>\n'
	}), define("components/pop/link", ["backbone", "components/pop/base", "text!components/pop/templates/link.html", "core/utils"], function(e, t, i, n) {
		return t.extend({
			template: _.template(i),
			className: "popover popover-link-wrap bottom",
			events: {
				"click .js-btn-cancel": "hide",
				"click .js-btn-confirm": "triggerCallback",
				"keydown .js-link-placeholder": function(e) {
					e.keyCode === n.keyCode.ENTER && this.triggerCallback()
				}
			},
			initialize: function(e) {
				this.content = e.content || "链接地址：http://example.com", this.callback = e.callback, this.target = e.target, this.trigger = e.trigger, e.notAutoHide || this.autoHide()
			},
			render: function(e) {
				return this.$el.html(this.template({
					content: this.content
				})), this
			},
			positioning: function() {
				this.$el.show().position({
					of: this.target,
					my: "center top+5",
					at: "center bottom",
					collision: "none"
				}), this.$(".js-link-placeholder").focus()
			},
			reset: function(e) {
				var t = e.callback,
					i = e.target,
					n = e.trigger,
					a = e.content || "链接地址：http://example.com";
				this.$(".js-link-placeholder").attr("placeholder", a), this.setCallback(t), this.setTarget(i), this.setTrigger(n), this.positioning(), this.clearInput(), this.show()
			},
			triggerCallback: function() {
				var e = n.urlCheck(this.$(".js-link-placeholder").val());
				this.callback.call(this, e), this.hide()
			},
			clearInput: function() {
				this.$(".js-link-placeholder").val("")
			}
		})
	}), define("components/pop/atom/link", ["require", "backbone", "components/pop/link"], function(e) {
		var t = (e("backbone"), e("components/pop/link"));
		return {
			initialize: function(e) {
				var i = e.target = $(e.target),
					n = (e.className, e.type, e.callback),
					a = e.trigger = $(e.trigger || i),
					s = (e.data, e.notAutoHide || !1, e.content || ""),
					o = e.appendTarget || "body",
					l = new t({
						callback: n,
						target: i,
						trigger: a,
						content: s
					});
				return l.render().$el.appendTo(o), l.positioning(), l
			}
		}
	}), define("text!components/modal/1.0.0/templates/modal.html", [], function() {
		return '<% if (type === \'goods\' || type === \'fenxiao_goods\') { %>\n<div class="modal fade hide js-goods-modal">\n    <div class="modal-header">\n        <a class="close js-news-modal-dismiss" data-dismiss="modal">×</a>\n        <!-- 顶部tab -->\n        <ul class="module-nav modal-tab">\n\n        </ul>\n    </div>\n    <div class="modal-body">\n        <div class="tab-content">\n\n        </div>\n    </div>\n    <div class="modal-footer clearfix">\n        <div style="display:none;" class="js-confirm-choose pull-left">\n            <input type="button" class="btn btn-primary" value="确定使用">\n        </div>\n        <div class="pagenavi">\n\n        </div>\n    </div>\n</div>\n<% } else { %>\n<div class="modal fade hide js-modal">\n    <div class="modal-header">\n        <a class="close js-news-modal-dismiss" data-dismiss="modal">×</a>\n        <!-- 顶部tab -->\n        <ul class="module-nav modal-tab">\n\n        </ul>\n    </div>\n    <div class="modal-body">\n        <div class="tab-content">\n\n        </div>\n    </div>\n    <div class="modal-footer">\n        <div style="display:none;" class="js-confirm-choose pull-left">\n            <input type="button" class="btn btn-primary" value="确定使用">\n        </div>\n        <div class="pagenavi">\n\n        </div>\n    </div>\n</div>\n<% } %>\n'
	}), define("text!components/modal/1.0.0/templates/modal_link.html", [], function() {
		return '    <a href="<%= link %>" target="_blank" class="new_window"><%= text %></a>\n    <% if (!isLast) { %>-<% } %>'
	}), define("text!components/modal/1.0.0/templates/modal_pane.html", [], function() {
		return '<% if (type !== \'image\') { %>\n<table class="table">\n    <% if(type === \'activity\' || type === "survey") { %>\n    <colgroup>\n        <col class="modal-col-title">\n        <col class="modal-col-time">\n        <col class="modal-col-action">\n    </colgroup>\n    <% } else { %>\n    <colgroup>\n        <col class="modal-col-title">\n        <col class="modal-col-time" span="2">\n        <col class="modal-col-action">\n    </colgroup>\n    <% } %>\n    <!-- 表格头部 -->\n    <thead>\n\n    </thead>\n    <!-- 表格数据区 -->\n    <tbody>\n\n    </tbody>\n</table>\n<% } else { %>\n<div class="module-header"></div>\n<ul class="module-body clearfix"></ul>\n<% } %>\n'
	}), define("text!components/modal/1.0.0/templates/modal_row.html", [], function() {
		return '<% if (type === \'image\') { %>\n    <div class="js-choose" title="<%= attachment_title %>">\n        <p class="image-size"><%= attachment_title.slice(0, 5) %><br><%= (size / 1000).toFixed(1) %> KB</p>\n        <img src="<%= window._global.url.imgqn %>/<%= thumb_url %>" width="60" height="60" />\n    </div>\n    <label class="multi-select-container hide">\n        <input type="checkbox" class="multi-select js-multi-select">\n    </label>\n<% } else if([\'guang_activity\', \'activity\', \'survey\', \'grab\', \'guaguale\', \'wheel\', \'zodiac\', \'crazyguess\'].indexOf(type) != -1) { %>\n    <td class="title">\n        <div class="td-cont">\n            <a target="_blank" class="new_window" href="<%= link %>"><%= title %></a>\n        </div>\n    </td>\n    <td class="time">\n        <div class="td-cont">\n            <span><%= start_time %></span>\n        </div>\n    </td>\n    <td class="time">\n        <div class="td-cont">\n            <span><%= end_time %></span>\n        </div>\n    </td>\n    <td class="opts">\n        <div class="td-cont">\n            <button class="btn js-choose" href="#" data-id="<%= data_id %>" data-url="<%= data_url %>" data-page-type="<%= type %>" data-cover-attachment-id="<%= data_cover_attachment_id %>" data-cover-attachment-url="<%= data_cover_attachment_url %>" data-title="<%= data_title %>" data-alias="<%= data_alias %>">选取</button>\n        </div>\n    </td>\n<% } else  if([\'mpNews\', \'news\', \'multiNews\', \'articles\', \'fenxiao_imagetext\', \'fenxiao_enterprise_imagetext\'].indexOf(type) !== -1) { %>\n    <td class="title">\n        <div class="td-cont">\n        <% if (news && news.length > 1) { %>\n            <div class="ng ng-multiple">\n            <% for (var index in news) { %>\n                <% if (news[index] && news.hasOwnProperty(index)) { %>\n                    <% if (news[index].title.indexOf(\'　　点此查看更多\') !== -1) { %>\n                        <div class="ng-item">\n                            <div class="ng-title">\n                                <a href="javascript:;" target="_blank" class="new_window" title=""><%=news[index] %></a>\n                            </div>\n                        </div>\n                    <% } else { %>\n                    <div class="ng-item">\n                        <span class="label label-success">图文<%=Number(index) + 1%></span>\n                        <div class="ng-title">\n                            <a href="<%= news[index] && news[index].url %>" class="new_window" title="<%=news[index].title %>">\n                                <%=news[index].title %>\n                            </a>\n                        </div>\n                    </div>\n                    <% } %>\n                    <% } %>\n            <% } %>\n            </div>\n        <% } else { %>\n            <div class="ng ng-single">\n                <div class="ng-item">\n                    <div class="ng-title">\n                        <a href="<%= news[0] && news[0].url %>" target="_blank" class="new-window" title="<%= news[0] &&news[0].title %>"><%= news[0] && news[0].title %></a>\n                    </div>\n                </div>\n                <div class="ng-item view-more">\n                    <a href="<%= news[0] && news[0].url %>" class="clearfix new-window">\n                        <span class="pull-left">阅读全文</span>\n                        <span class="pull-right">&gt;</span>\n                    </a>\n                </div>\n            </div>\n        <% } %>\n        </div>\n    </td>\n\n    <td class="time">\n        <div class="td-cont">\n            <span><%= time %></span>\n        </div>\n    </td>\n    <td class="opts">\n        <div class="td-cont">\n            <button class="btn js-choose" href="#" data-id="<%= data_id %>" data-url="<%= data_url %>" data-page-type="<%= type %>" data-cover-attachment-id="<%= data_cover_attachment_id %>" data-cover-attachment-url="<%= data_cover_attachment_url %>" data-title="<%= data_title %>" data-alias="<%= data_alias %>">选取</button>\n        </div>\n    </td>\n<% } else if (type === \'goods\' || type === \'recommend_goods\') { %>\n    <td class="title">\n        <div class="td-cont">\n            <a target="_blank" class="new_window" href="<%= link %>" data-cover-attachment-url="<%= data_cover_attachment_url %>"><%= title %></a>\n        </div>\n    </td>\n\n    <td class="time">\n        <div class="td-cont">\n            <span><%= time %></span>\n        </div>\n    </td>\n    <td class="opts">\n        <div class="td-cont">\n            <% if (str_lock) { %>\n                <span class="err-msg"><%= str_lock %></span>\n            <% } else { %>\n                <button class="btn js-choose" href="javascript:void(0);">选取</button>\n            <% } %>\n        </div>\n    </td>\n<% } else if (type === \'fenxiao_goods\') { %>\n    <td class="title">\n        <div class="td-cont">\n            <a target="_blank" class="new_window" href="<%= link %>" data-cover-attachment-url="<%= data_cover_attachment_url %>"><%= title %></a>\n        </div>\n    </td>\n\n    <td class="time">\n        <div class="td-cont">\n            <span><%= time %></span>\n        </div>\n    </td>\n    <td class="privilege">\n        <div class="td-cont">\n            <span><%= privilege %></span>\n        </div>\n    </td>\n    <td class="opts">\n        <div class="td-cont">\n            <% if (str_lock) { %>\n                <span class="err-msg"><%= str_lock %></span>\n            <% } else { %>\n                <button class="btn js-choose" href="javascript:void(0);">选取</button>\n            <% } %>\n        </div>\n    </td>\n<% } else if (type === \'tradeincard\') { %>\n    <td class="">\n        <div class="td-cont">\n            <span><%= name %></span>\n        </div>\n    </td>\n\n    <td class="">\n        <div class="td-cont">\n            <span><%= value %></span>\n        </div>\n    </td>\n    <td class="">\n        <div class="td-cont">\n            <span>\n                <% if(at_least) { %>\n                    满<%= at_least %>元可用\n                <% } else { %>\n                    无限制\n                <% } %>\n\n            </span>\n        </div>\n    </td>\n    <td class="opts">\n        <div class="td-cont">\n            <button class="btn js-choose" href="javascript:void(0);">选取</button>\n        </div>\n    </td>\n<% } else if (type === \'storelist\') { %>\n    <td class="title">\n        <div class="td-cont">\n            <span><%= name %></span>\n        </div>\n    </td>\n    <td>\n        <div class="td-cont">\n            <span><%- area %><%- address %></span>\n        </div>\n    </td>\n    <td class="opts">\n        <div class="td-cont">\n            <button class="btn js-choose" href="javascript:void(0);" data-id="<%= id %>" data-name="<%= name %>" data-address="<%- address %>">选取</button>\n        </div>\n    </td>\n<% } else { %>\n    <td class="title">\n        <div class="td-cont">\n            <a target="_blank" class="new_window" href="<%= link %>"><%= title %></a>\n        </div>\n    </td>\n\n    <td class="time">\n        <div class="td-cont">\n            <span><%= time %></span>\n        </div>\n    </td>\n    <td class="opts">\n        <div class="td-cont">\n            <button class="btn js-choose" href="#" data-id="<%= data_id %>" data-url="<%= data_url %>" data-page-type="<%= type %>" data-cover-attachment-id="<%= data_cover_attachment_id %>" data-cover-attachment-url="<%= data_cover_attachment_url %>" data-title="<%= data_title %>" data-alias="<%= data_alias %>">选取</button>\n        </div>\n    </td>\n<% } %>\n'
	}), define("text!components/modal/1.0.0/templates/modal_tab.html", [], function() {
		return '<a href="#js-module-<%= type %>" data-type="<%= type %>" class="js-modal-tab"><%= tab %></a><% if (!isLast) { %> | <% } %>\n'
	}), define("text!components/modal/1.0.0/templates/modal_thead.html", [], function() {
		return '    <% if (type === \'image\') { %>\n    <p class="help-inline">点击图片即可选中 <a class="js-update" href="javascript:void(0);">刷新</a></p>\n    <form class="form-search search-box">\n        <div class="input-append">\n            <input class="input-small js-modal-search-input" type="text"/>\n			<a href="javascript:void(0);" class="btn js-fetch-page js-modal-search" data-action-type="search">搜</a>\n        </div>\n    </form>\n    <% } else if ([\'guang_activity\', \'activity\', \'survey\', \'grab\', \'guaguale\', \'wheel\', \'zodiac\', \'crazyguess\'].indexOf(type) != -1) { %>\n    <tr>\n        <th class="title">\n            <div class="td-cont">\n                <span><%= title %></span> <a class="js-update" href="javascript:void(0);">刷新</a>\n            </div>\n        </th>\n        <th class="time">\n            <span></span>\n        </th>\n        <th class="time">\n            <div class="td-cont">\n                <span>有效时间</span>\n            </div>\n        </th>\n        <th class="opts">\n            <div class="td-cont">\n                <form class="form-search">\n                    <div class="input-append">\n                        <input class="input-small js-modal-search-input" type="text"/><a href="javascript:void(0);" class="btn js-fetch-page js-modal-search" data-action-type="search">搜</a>\n                    </div>\n                </form>\n            </div>\n        </th>\n    </tr>\n    <% } else if(type === \'tradeincard\') { %>\n    <tr>\n        <th class="">\n            <div class="td-cont">\n                <span>名称</span> <a class="js-update" href="javascript:void(0);">刷新</a>\n            </div>\n        </th>\n        <th>\n            <div class="td-cont">面值</div>\n        </th>\n        <th style="width: 30%;">\n            <div class="td-cont">使用条件</div>\n        </th>\n        <th class="opts">\n            <div class="td-cont">\n                <form class="form-search">\n                    <div class="input-append">\n                        <input class="input-small js-modal-search-input" type="text"/><a href="javascript:void(0);" class="btn js-fetch-page js-modal-search" data-action-type="search">搜</a>\n                    </div>\n                </form>\n            </div>\n        </th>\n    </tr>\n    <% } else if(type === \'storelist\') { %>\n        <tr>\n            <th width="30%">\n                <div class="td-cont">\n                    <span>门店名称</span> <a class="js-update" href="javascript:void(0);">刷新</a>\n                </div>\n            </th>\n            <th width="50%">\n                <div class="td-cont">地址</div>\n            </th>\n            <th width="20%">\n                <div class="td-cont">\n                    <form class="form-search">\n                        <div class="input-append">\n                            <input class="input-small js-modal-search-input" type="text"/><a href="javascript:void(0);" class="btn js-fetch-page js-modal-search" data-action-type="search">搜</a>\n                        </div>\n                    </form>\n                </div>\n            </th>\n        </tr>\n    <% } else if (type === \'fenxiao_goods\') {%>\n        <tr>\n            <th class="title">\n                <div class="td-cont">\n                    <span><%= title %></span> <a class="js-update" href="javascript:void(0);">刷新</a>\n                </div>\n            </th>\n            <th class="time">\n                <div class="td-cont">\n                    <span><%= time %></span>\n                </div>\n            </th>\n            <th class="privilege">\n                <div class="td-cont">\n                    <span>分销权限</span>\n                </div>\n            </th>\n            <th class="opts">\n                <div class="td-cont">\n                    <form class="form-search">\n                        <div class="input-append">\n                            <input class="input-small js-modal-search-input" type="text"/><a href="javascript:void(0);" class="btn js-fetch-page js-modal-search" data-action-type="search">搜</a>\n                        </div>\n                    </form>\n                </div>\n            </th>\n        </tr>\n    <% } else {%>\n    <tr>\n        <th class="title">\n            <div class="td-cont">\n                <span><%= title %></span> <a class="js-update" href="javascript:void(0);">刷新</a>\n            </div>\n        </th>\n        <th class="time">\n            <div class="td-cont">\n                <span><%= time %></span>\n            </div>\n        </th>\n        <th class="opts">\n            <div class="td-cont">\n                <form class="form-search">\n                    <div class="input-append">\n                        <input class="input-small js-modal-search-input" type="text"/><a href="javascript:void(0);" class="btn js-fetch-page js-modal-search" data-action-type="search">搜</a>\n                    </div>\n                </form>\n            </div>\n        </th>\n    </tr>\n    <% } %>\n'
	}), define("text!components/modal/1.0.0/templates/modal_dropdown.html", [], function() {
		return '    <a href="javascript:void(0);" data-toggle="dropdown" data-hover="dropdown" data-delay="200">+新建营销活动<b class="caret"></b></a>\n    <ul class="dropdown-menu">\n        <li><a href="/v2/apps/cards#create" target="_blank">刮刮卡</a></li>\n        <li><a href="/v2/apps/wheel#create" target="_blank">幸运大抽奖</a></li>\n        <li><a href="/v2/apps/zodiac#create" target="_blank">生肖翻翻看</a></li>\n        <li><a href="/v2/apps/crazyguess#create" target="_blank">疯狂猜猜猜</a></li>\n    </ul>\n'
	}), define("text!components/modal/1.0.0/templates/modal_static.html", [], function() {
		return '<div class="get-web-img">\n    <form class="form-horizontal" action="<%= window._global.url.img %>/download" method="post">\n        <div class="control-group">\n            <label class="control-label">网络图片：</label>\n            <div class="controls">\n                <input type="text" name="attachment_url" class="get-web-img-input js-web-img-input" placeholder="请贴入网络图片地址">\n                <a href="javascript:;" class="btn js-preview-img">提取</a>\n            </div>\n            <div class="controls preview-container js-download-img">\n            </div>\n        </div>\n    </form>\n</div>\n<div class="upload-local-img">\n    <div class="form-horizontal">\n        <div class="control-group">\n            <label class="control-label">本地图片：</label>\n            <div class="controls preview-container js-upload-img">\n            </div>\n            <div class="controls">\n                <div class="fileinput-button">\n                    <a href="javascript:;" data-toggle-text="重新选择..." class="control-action">添加图片...</a>\n                    <input class="js-fileupload fileupload" type="file" name="upload_file[]" data-url="<%= window._global.url.img + \'/uploadmultiple?format=json\' %>" multiple>\n                </div>\n                <p class="help-desc">最大支持 1 MB 的图片( jpg / gif / png )</p>\n            </div>\n        </div>\n    </div>\n</div>\n'
	}), define("text!components/modal/1.0.0/templates/modal_static_footer.html", [], function() {
		return '<div class="form-action">\n    <button type="button" class="btn btn-primary js-confirm-upload-image" data-loading-text="正在上传...">确定使用</button>\n    <a href="javascript:void(0);" data-dismiss="modal" class="btn btn-cancel">取消</a>\n</div>\n'
	}),
	function(e) {
		"function" == typeof define && define.amd ? define("fileupload", ["jquery", "jqueryui"], e) : e(window.jQuery)
	}(function(e) {
		e.support.fileInput = !(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent) || e('<input type="file">').prop("disabled")), e.support.xhrFileUpload = !(!window.XMLHttpRequestUpload || !window.FileReader), e.support.xhrFormDataFileUpload = !!window.FormData, e.support.blobSlice = window.Blob && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice), e.widget("blueimp.fileupload", {
			options: {
				dropZone: e(document),
				pasteZone: e(document),
				fileInput: void 0,
				replaceFileInput: !0,
				paramName: void 0,
				singleFileUploads: !0,
				limitMultiFileUploads: void 0,
				sequentialUploads: !1,
				limitConcurrentUploads: void 0,
				forceIframeTransport: !1,
				redirect: void 0,
				redirectParamName: void 0,
				postMessage: void 0,
				multipart: !0,
				maxChunkSize: void 0,
				uploadedBytes: void 0,
				recalculateProgress: !0,
				progressInterval: 100,
				bitrateInterval: 500,
				autoUpload: !0,
				messages: {
					uploadedBytes: "Uploaded bytes exceed file size"
				},
				i18n: function(t, i) {
					return t = this.messages[t] || t.toString(), i && e.each(i, function(e, i) {
						t = t.replace("{" + e + "}", i)
					}), t
				},
				formData: function(e) {
					return e.serializeArray()
				},
				add: function(t, i) {
					(i.autoUpload || i.autoUpload !== !1 && e(this).fileupload("option", "autoUpload")) && i.process().done(function() {
						i.submit()
					})
				},
				processData: !1,
				contentType: !1,
				cache: !1
			},
			_specialOptions: ["fileInput", "dropZone", "pasteZone", "multipart", "forceIframeTransport"],
			_blobSlice: e.support.blobSlice && function() {
				var e = this.slice || this.webkitSlice || this.mozSlice;
				return e.apply(this, arguments)
			},
			_BitrateTimer: function() {
				this.timestamp = Date.now ? Date.now() : (new Date).getTime(), this.loaded = 0, this.bitrate = 0, this.getBitrate = function(e, t, i) {
					var n = e - this.timestamp;
					return (!this.bitrate || !i || n > i) && (this.bitrate = (t - this.loaded) * (1e3 / n) * 8, this.loaded = t, this.timestamp = e), this.bitrate
				}
			},
			_isXHRUpload: function(t) {
				return !t.forceIframeTransport && (!t.multipart && e.support.xhrFileUpload || e.support.xhrFormDataFileUpload)
			},
			_getFormData: function(t) {
				var i;
				return "function" == typeof t.formData ? t.formData(t.form) : e.isArray(t.formData) ? t.formData : "object" === e.type(t.formData) ? (i = [], e.each(t.formData, function(e, t) {
					i.push({
						name: e,
						value: t
					})
				}), i) : []
			},
			_getTotal: function(t) {
				var i = 0;
				return e.each(t, function(e, t) {
					i += t.size || 1
				}), i
			},
			_initProgressObject: function(t) {
				var i = {
					loaded: 0,
					total: 0,
					bitrate: 0
				};
				t._progress ? e.extend(t._progress, i) : t._progress = i
			},
			_initResponseObject: function(e) {
				var t;
				if (e._response)
					for (t in e._response) e._response.hasOwnProperty(t) && delete e._response[t];
				else e._response = {}
			},
			_onProgress: function(e, t) {
				if (e.lengthComputable) {
					var i, n = Date.now ? Date.now() : (new Date).getTime();
					if (t._time && t.progressInterval && n - t._time < t.progressInterval && e.loaded !== e.total) return;
					t._time = n, i = Math.floor(e.loaded / e.total * (t.chunkSize || t._progress.total)) + (t.uploadedBytes || 0), this._progress.loaded += i - t._progress.loaded, this._progress.bitrate = this._bitrateTimer.getBitrate(n, this._progress.loaded, t.bitrateInterval), t._progress.loaded = t.loaded = i, t._progress.bitrate = t.bitrate = t._bitrateTimer.getBitrate(n, i, t.bitrateInterval), this._trigger("progress", e, t), this._trigger("progressall", e, this._progress)
				}
			},
			_initProgressListener: function(t) {
				var i = this,
					n = t.xhr ? t.xhr() : e.ajaxSettings.xhr();
				n.upload && (e(n.upload).bind("progress", function(e) {
					var n = e.originalEvent;
					e.lengthComputable = n.lengthComputable, e.loaded = n.loaded, e.total = n.total, i._onProgress(e, t)
				}), t.xhr = function() {
					return n
				})
			},
			_isInstanceOf: function(e, t) {
				return Object.prototype.toString.call(t) === "[object " + e + "]"
			},
			_initXHRData: function(t) {
				var i, n = this,
					a = t.files[0],
					s = t.multipart || !e.support.xhrFileUpload,
					o = t.paramName[0];
				t.headers = t.headers || {}, t.contentRange && (t.headers["Content-Range"] = t.contentRange), s && !t.blob && this._isInstanceOf("File", a) || (t.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(a.name) + '"'), s ? e.support.xhrFormDataFileUpload && (t.postMessage ? (i = this._getFormData(t), t.blob ? i.push({
					name: o,
					value: t.blob
				}) : e.each(t.files, function(e, n) {
					i.push({
						name: t.paramName[e] || o,
						value: n
					})
				})) : (n._isInstanceOf("FormData", t.formData) ? i = t.formData : (i = new FormData, e.each(this._getFormData(t), function(e, t) {
					i.append(t.name, t.value)
				})), t.blob ? i.append(o, t.blob, a.name) : e.each(t.files, function(e, a) {
					(n._isInstanceOf("File", a) || n._isInstanceOf("Blob", a)) && i.append(t.paramName[e] || o, a, a.name)
				})), t.data = i) : (t.contentType = a.type, t.data = t.blob || a), t.blob = null
			},
			_initIframeSettings: function(t) {
				var i = e("<a></a>").prop("href", t.url).prop("host");
				t.dataType = "iframe " + (t.dataType || ""), t.formData = this._getFormData(t), t.redirect && i && i !== location.host && t.formData.push({
					name: t.redirectParamName || "redirect",
					value: t.redirect
				})
			},
			_initDataSettings: function(e) {
				this._isXHRUpload(e) ? (this._chunkedUpload(e, !0) || (e.data || this._initXHRData(e), this._initProgressListener(e)), e.postMessage && (e.dataType = "postmessage " + (e.dataType || ""))) : this._initIframeSettings(e)
			},
			_getParamName: function(t) {
				var i = e(t.fileInput),
					n = t.paramName;
				return n ? e.isArray(n) || (n = [n]) : (n = [], i.each(function() {
					for (var t = e(this), i = t.prop("name") || "files[]", a = (t.prop("files") || [1]).length; a;) n.push(i), a -= 1
				}), n.length || (n = [i.prop("name") || "files[]"])), n
			},
			_initFormSettings: function(t) {
				t.form && t.form.length || (t.form = e(t.fileInput.prop("form")), t.form.length || (t.form = e(this.options.fileInput.prop("form")))), t.paramName = this._getParamName(t), t.url || (t.url = t.form.prop("action") || location.href), t.type = (t.type || t.form.prop("method") || "").toUpperCase(), "POST" !== t.type && "PUT" !== t.type && "PATCH" !== t.type && (t.type = "POST"), t.formAcceptCharset || (t.formAcceptCharset = t.form.attr("accept-charset"))
			},
			_getAJAXSettings: function(t) {
				var i = e.extend({}, this.options, t);
				return this._initFormSettings(i), this._initDataSettings(i), i
			},
			_getDeferredState: function(e) {
				return e.state ? e.state() : e.isResolved() ? "resolved" : e.isRejected() ? "rejected" : "pending"
			},
			_enhancePromise: function(e) {
				return e.success = e.done, e.error = e.fail, e.complete = e.always, e
			},
			_getXHRPromise: function(t, i, n) {
				var a = e.Deferred(),
					s = a.promise();
				return i = i || this.options.context || s, t === !0 ? a.resolveWith(i, n) : t === !1 && a.rejectWith(i, n), s.abort = a.promise, this._enhancePromise(s)
			},
			_addConvenienceMethods: function(t, i) {
				var n = this,
					a = function(t) {
						return e.Deferred().resolveWith(n, [t]).promise()
					};
				i.process = function(e, t) {
					return (e || t) && (i._processQueue = this._processQueue = (this._processQueue || a(this)).pipe(e, t)), this._processQueue || a(this)
				}, i.submit = function() {
					return "pending" !== this.state() && (i.jqXHR = this.jqXHR = n._trigger("submit", t, this) !== !1 && n._onSend(t, this)), this.jqXHR || n._getXHRPromise()
				}, i.abort = function() {
					return this.jqXHR ? this.jqXHR.abort() : n._getXHRPromise()
				}, i.state = function() {
					return this.jqXHR ? n._getDeferredState(this.jqXHR) : this._processQueue ? n._getDeferredState(this._processQueue) : void 0
				}, i.progress = function() {
					return this._progress
				}, i.response = function() {
					return this._response
				}
			},
			_getUploadedBytes: function(e) {
				var t = e.getResponseHeader("Range"),
					i = t && t.split("-"),
					n = i && i.length > 1 && parseInt(i[1], 10);
				return n && n + 1
			},
			_chunkedUpload: function(t, i) {
				t.uploadedBytes = t.uploadedBytes || 0;
				var n, a, s = this,
					o = t.files[0],
					l = o.size,
					r = t.uploadedBytes,
					d = t.maxChunkSize || l,
					c = this._blobSlice,
					p = e.Deferred(),
					m = p.promise();
				return this._isXHRUpload(t) && c && (r || l > d) && !t.data ? i ? !0 : r >= l ? (o.error = t.i18n("uploadedBytes"), this._getXHRPromise(!1, t.context, [null, "error", o.error])) : (a = function() {
					var i = e.extend({}, t),
						m = i._progress.loaded;
					i.blob = c.call(o, r, r + d, o.type), i.chunkSize = i.blob.size, i.contentRange = "bytes " + r + "-" + (r + i.chunkSize - 1) + "/" + l, s._initXHRData(i), s._initProgressListener(i), n = (s._trigger("chunksend", null, i) !== !1 && e.ajax(i) || s._getXHRPromise(!1, i.context)).done(function(n, o, d) {
						r = s._getUploadedBytes(d) || r + i.chunkSize, m + i.chunkSize - i._progress.loaded && s._onProgress(e.Event("progress", {
							lengthComputable: !0,
							loaded: r - i.uploadedBytes,
							total: r - i.uploadedBytes
						}), i), t.uploadedBytes = i.uploadedBytes = r, i.result = n, i.textStatus = o, i.jqXHR = d, s._trigger("chunkdone", null, i), s._trigger("chunkalways", null, i), l > r ? a() : p.resolveWith(i.context, [n, o, d])
					}).fail(function(e, t, n) {
						i.jqXHR = e, i.textStatus = t, i.errorThrown = n, s._trigger("chunkfail", null, i), s._trigger("chunkalways", null, i), p.rejectWith(i.context, [e, t, n])
					})
				}, this._enhancePromise(m), m.abort = function() {
					return n.abort()
				}, a(), m) : !1
			},
			_beforeSend: function(e, t) {
				0 === this._active && (this._trigger("start"), this._bitrateTimer = new this._BitrateTimer, this._progress.loaded = this._progress.total = 0, this._progress.bitrate = 0), this._initResponseObject(t), this._initProgressObject(t), t._progress.loaded = t.loaded = t.uploadedBytes || 0, t._progress.total = t.total = this._getTotal(t.files) || 1, t._progress.bitrate = t.bitrate = 0, this._active += 1, this._progress.loaded += t.loaded, this._progress.total += t.total
			},
			_onDone: function(t, i, n, a) {
				var s = a._progress.total,
					o = a._response;
				a._progress.loaded < s && this._onProgress(e.Event("progress", {
					lengthComputable: !0,
					loaded: s,
					total: s
				}), a), o.result = a.result = t, o.textStatus = a.textStatus = i, o.jqXHR = a.jqXHR = n, this._trigger("done", null, a)
			},
			_onFail: function(e, t, i, n) {
				var a = n._response;
				n.recalculateProgress && (this._progress.loaded -= n._progress.loaded, this._progress.total -= n._progress.total), a.jqXHR = n.jqXHR = e, a.textStatus = n.textStatus = t, a.errorThrown = n.errorThrown = i, this._trigger("fail", null, n)
			},
			_onAlways: function(e, t, i, n) {
				this._trigger("always", null, n)
			},
			_onSend: function(t, i) {
				i.submit || this._addConvenienceMethods(t, i);
				var n, a, s, o, l = this,
					r = l._getAJAXSettings(i),
					d = function() {
						return l._sending += 1, r._bitrateTimer = new l._BitrateTimer, n = n || ((a || l._trigger("send", t, r) === !1) && l._getXHRPromise(!1, r.context, a) || l._chunkedUpload(r) || e.ajax(r)).done(function(e, t, i) {
							l._onDone(e, t, i, r)
						}).fail(function(e, t, i) {
							l._onFail(e, t, i, r)
						}).always(function(e, t, i) {
							if (l._onAlways(e, t, i, r), l._sending -= 1, l._active -= 1, r.limitConcurrentUploads && r.limitConcurrentUploads > l._sending)
								for (var n = l._slots.shift(); n;) {
									if ("pending" === l._getDeferredState(n)) {
										n.resolve();
										break
									}
									n = l._slots.shift()
								}
							0 === l._active && l._trigger("stop")
						})
					};
				return this._beforeSend(t, r), this.options.sequentialUploads || this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending ? (this.options.limitConcurrentUploads > 1 ? (s = e.Deferred(), this._slots.push(s), o = s.pipe(d)) : (this._sequence = this._sequence.pipe(d, d), o = this._sequence), o.abort = function() {
					return a = [void 0, "abort", "abort"], n ? n.abort() : (s && s.rejectWith(r.context, a), d())
				}, this._enhancePromise(o)) : d()
			},
			_onAdd: function(t, i) {
				var n, a, s, o, l = this,
					r = !0,
					d = e.extend({}, this.options, i),
					c = d.limitMultiFileUploads,
					p = this._getParamName(d);
				if ((d.singleFileUploads || c) && this._isXHRUpload(d))
					if (!d.singleFileUploads && c)
						for (s = [], n = [], o = 0; o < i.files.length; o += c) s.push(i.files.slice(o, o + c)), a = p.slice(o, o + c), a.length || (a = p), n.push(a);
					else n = p;
				else s = [i.files], n = [p];
				return i.originalFiles = i.files, e.each(s || i.files, function(a, o) {
					var d = e.extend({}, i);
					return d.files = s ? o : [o], d.paramName = n[a], l._initResponseObject(d), l._initProgressObject(d), l._addConvenienceMethods(t, d), r = l._trigger("add", t, d)
				}), r
			},
			_replaceFileInput: function(t) {
				var i = t.clone(!0);
				e("<form></form>").append(i)[0].reset(), t.after(i).detach(), e.cleanData(t.unbind("remove")), this.options.fileInput = this.options.fileInput.map(function(e, n) {
					return n === t[0] ? i[0] : n
				}), t[0] === this.element[0] && (this.element = i)
			},
			_handleFileTreeEntry: function(t, i) {
				var n, a = this,
					s = e.Deferred(),
					o = function(e) {
						e && !e.entry && (e.entry = t), s.resolve([e])
					};
				return i = i || "", t.isFile ? t._file ? (t._file.relativePath = i, s.resolve(t._file)) : t.file(function(e) {
					e.relativePath = i, s.resolve(e)
				}, o) : t.isDirectory ? (n = t.createReader(), n.readEntries(function(e) {
					a._handleFileTreeEntries(e, i + t.name + "/").done(function(e) {
						s.resolve(e)
					}).fail(o)
				}, o)) : s.resolve([]), s.promise()
			},
			_handleFileTreeEntries: function(t, i) {
				var n = this;
				return e.when.apply(e, e.map(t, function(e) {
					return n._handleFileTreeEntry(e, i)
				})).pipe(function() {
					return Array.prototype.concat.apply([], arguments)
				})
			},
			_getDroppedFiles: function(t) {
				t = t || {};
				var i = t.items;
				return i && i.length && (i[0].webkitGetAsEntry || i[0].getAsEntry) ? this._handleFileTreeEntries(e.map(i, function(e) {
					var t;
					return e.webkitGetAsEntry ? (t = e.webkitGetAsEntry(), t && (t._file = e.getAsFile()), t) : e.getAsEntry()
				})) : e.Deferred().resolve(e.makeArray(t.files)).promise()
			},
			_getSingleFileInputFiles: function(t) {
				t = e(t);
				var i, n, a = t.prop("webkitEntries") || t.prop("entries");
				if (a && a.length) return this._handleFileTreeEntries(a);
				if (i = e.makeArray(t.prop("files")), i.length) void 0 === i[0].name && i[0].fileName && e.each(i, function(e, t) {
					t.name = t.fileName, t.size = t.fileSize
				});
				else {
					if (n = t.prop("value"), !n) return e.Deferred().resolve([]).promise();
					i = [{
						name: n.replace(/^.*\\/, "")
					}]
				}
				return e.Deferred().resolve(i).promise()
			},
			_getFileInputFiles: function(t) {
				return t instanceof e && 1 !== t.length ? e.when.apply(e, e.map(t, this._getSingleFileInputFiles)).pipe(function() {
					return Array.prototype.concat.apply([], arguments)
				}) : this._getSingleFileInputFiles(t)
			},
			_onChange: function(t) {
				var i = this,
					n = {
						fileInput: e(t.target),
						form: e(t.target.form)
					};
				this._getFileInputFiles(n.fileInput).always(function(e) {
					n.files = e, i.options.replaceFileInput && i._replaceFileInput(n.fileInput), i._trigger("change", t, n) !== !1 && i._onAdd(t, n)
				})
			},
			_onPaste: function(t) {
				var i = t.originalEvent && t.originalEvent.clipboardData && t.originalEvent.clipboardData.items,
					n = {
						files: []
					};
				return i && i.length && (e.each(i, function(e, t) {
					var i = t.getAsFile && t.getAsFile();
					i && n.files.push(i)
				}), this._trigger("paste", t, n) === !1 || this._onAdd(t, n) === !1) ? !1 : void 0
			},
			_onDrop: function(e) {
				e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
				var t = this,
					i = e.dataTransfer,
					n = {};
				i && i.files && i.files.length && (e.preventDefault(), this._getDroppedFiles(i).always(function(i) {
					n.files = i, t._trigger("drop", e, n) !== !1 && t._onAdd(e, n)
				}))
			},
			_onDragOver: function(t) {
				t.dataTransfer = t.originalEvent && t.originalEvent.dataTransfer;
				var i = t.dataTransfer;
				if (i) {
					if (this._trigger("dragover", t) === !1) return !1; - 1 !== e.inArray("Files", i.types) && (i.dropEffect = "copy", t.preventDefault())
				}
			},
			_initEventHandlers: function() {
				this._isXHRUpload(this.options) && (this._on(this.options.dropZone, {
					dragover: this._onDragOver,
					drop: this._onDrop
				}), this._on(this.options.pasteZone, {
					paste: this._onPaste
				})), e.support.fileInput && this._on(this.options.fileInput, {
					change: this._onChange
				})
			},
			_destroyEventHandlers: function() {
				this._off(this.options.dropZone, "dragover drop"), this._off(this.options.pasteZone, "paste"), this._off(this.options.fileInput, "change")
			},
			_setOption: function(t, i) {
				var n = -1 !== e.inArray(t, this._specialOptions);
				n && this._destroyEventHandlers(), this._super(t, i), n && (this._initSpecialOptions(), this._initEventHandlers())
			},
			_initSpecialOptions: function() {
				var t = this.options;
				void 0 === t.fileInput ? t.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]') : t.fileInput instanceof e || (t.fileInput = e(t.fileInput)), t.dropZone instanceof e || (t.dropZone = e(t.dropZone)), t.pasteZone instanceof e || (t.pasteZone = e(t.pasteZone))
			},
			_getRegExp: function(e) {
				var t = e.split("/"),
					i = t.pop();
				return t.shift(), new RegExp(t.join("/"), i)
			},
			_isRegExpOption: function(t, i) {
				return "url" !== t && "string" === e.type(i) && /^\/.*\/[igm]{0,3}$/.test(i)
			},
			_initDataAttributes: function() {
				var t = this,
					i = this.options;
				e.each(e(this.element[0].cloneNode(!1)).data(), function(e, n) {
					t._isRegExpOption(e, n) && (n = t._getRegExp(n)), i[e] = n
				})
			},
			_create: function() {
				this._initDataAttributes(), this._initSpecialOptions(), this._slots = [], this._sequence = this._getXHRPromise(!0), this._sending = this._active = 0, this._initProgressObject(this), this._initEventHandlers()
			},
			active: function() {
				return this._active
			},
			progress: function() {
				return this._progress
			},
			add: function(t) {
				var i = this;
				t && !this.options.disabled && (t.fileInput && !t.files ? this._getFileInputFiles(t.fileInput).always(function(e) {
					t.files = e, i._onAdd(null, t)
				}) : (t.files = e.makeArray(t.files), this._onAdd(null, t)))
			},
			send: function(t) {
				if (t && !this.options.disabled) {
					if (t.fileInput && !t.files) {
						var i, n, a = this,
							s = e.Deferred(),
							o = s.promise();
						return o.abort = function() {
							return n = !0, i ? i.abort() : (s.reject(null, "abort", "abort"), o)
						}, this._getFileInputFiles(t.fileInput).always(function(e) {
							if (!n) {
								if (!e.length) return void s.reject();
								t.files = e, i = a._onSend(null, t).then(function(e, t, i) {
									s.resolve(e, t, i)
								}, function(e, t, i) {
									s.reject(e, t, i)
								})
							}
						}), this._enhancePromise(o)
					}
					if (t.files = e.makeArray(t.files), t.files.length) return this._onSend(null, t)
				}
				return this._getXHRPromise(!1, t && t.context)
			}
		})
	}),
	function(e) {
		"function" == typeof define && define.amd ? define("fileupload_process", ["jquery", "fileupload"], e) : e(window.jQuery)
	}(function(e) {
		var t = e.blueimp.fileupload.prototype.options.add;
		e.widget("blueimp.fileupload", e.blueimp.fileupload, {
			options: {
				processQueue: [],
				add: function(i, n) {
					var a = e(this);
					n.process(function() {
						return a.fileupload("process", n)
					}), t.call(this, i, n)
				}
			},
			processActions: {},
			_processFile: function(t) {
				var i = this,
					n = e.Deferred().resolveWith(i, [t]),
					a = n.promise();
				return this._trigger("process", null, t), e.each(t.processQueue, function(e, t) {
					var n = function(e) {
						return i.processActions[t.action].call(i, e, t)
					};
					a = a.pipe(n, t.always && n)
				}), a.done(function() {
					i._trigger("processdone", null, t), i._trigger("processalways", null, t)
				}).fail(function() {
					i._trigger("processfail", null, t), i._trigger("processalways", null, t)
				}), a
			},
			_transformProcessQueue: function(t) {
				var i = [];
				e.each(t.processQueue, function() {
					var n = {},
						a = this.action,
						s = this.prefix === !0 ? a : this.prefix;
					e.each(this, function(i, a) {
						"string" === e.type(a) && "@" === a.charAt(0) ? n[i] = t[a.slice(1) || (s ? s + i.charAt(0).toUpperCase() + i.slice(1) : i)] : n[i] = a
					}), i.push(n)
				}), t.processQueue = i
			},
			processing: function() {
				return this._processing
			},
			process: function(t) {
				var i = this,
					n = e.extend({}, this.options, t);
				return n.processQueue && n.processQueue.length && (this._transformProcessQueue(n), 0 === this._processing && this._trigger("processstart"), e.each(t.files, function(t) {
					var a = t ? e.extend({}, n) : n,
						s = function() {
							return i._processFile(a)
						};
					a.index = t, i._processing += 1, i._processingQueue = i._processingQueue.pipe(s, s).always(function() {
						i._processing -= 1, 0 === i._processing && i._trigger("processstop")
					})
				})), this._processingQueue
			},
			_create: function() {
				this._super(), this._processing = 0, this._processingQueue = e.Deferred().resolveWith(this).promise()
			}
		})
	}),
	function(e) {
		"function" == typeof define && define.amd ? define("fileupload_validate", ["jquery", "fileupload_process"], e) : e(window.jQuery)
	}(function(e) {
		e.blueimp.fileupload.prototype.options.processQueue.push({
			action: "validate",
			always: !0,
			acceptFileTypes: "@",
			maxFileSize: "@",
			minFileSize: "@",
			maxNumberOfFiles: "@",
			disabled: "@disableValidation"
		}), e.widget("blueimp.fileupload", e.blueimp.fileupload, {
			options: {
				getNumberOfFiles: e.noop,
				messages: {
					maxNumberOfFiles: "Maximum number of files exceeded",
					acceptFileTypes: "File type not allowed",
					maxFileSize: "File is too large",
					minFileSize: "File is too small"
				}
			},
			processActions: {
				validate: function(t, i) {
					if (i.disabled) return t;
					var n = e.Deferred(),
						a = this.options,
						s = t.files[t.index];
					return "number" === e.type(i.maxNumberOfFiles) && (a.getNumberOfFiles() || 0) + t.files.length > i.maxNumberOfFiles ? s.error = a.i18n("maxNumberOfFiles") : !i.acceptFileTypes || i.acceptFileTypes.test(s.type) || i.acceptFileTypes.test(s.name) ? i.maxFileSize && s.size > i.maxFileSize ? s.error = a.i18n("maxFileSize") : "number" === e.type(s.size) && s.size < i.minFileSize ? s.error = a.i18n("minFileSize") : delete s.error : s.error = a.i18n("acceptFileTypes"), s.error || t.files.error ? (t.files.error = !0, n.rejectWith(this, [t])) : n.resolveWith(this, [t]), n.promise()
				}
			}
		})
	}), define("components/modal/1.0.0/modal", ["backbone", "jqueryui", "text!components/modal/1.0.0/templates/modal.html", "text!components/modal/1.0.0/templates/modal_link.html", "text!components/modal/1.0.0/templates/modal_pane.html", "text!components/modal/1.0.0/templates/modal_row.html", "text!components/modal/1.0.0/templates/modal_tab.html", "text!components/modal/1.0.0/templates/modal_thead.html", "text!components/modal/1.0.0/templates/modal_dropdown.html", "text!components/modal/1.0.0/templates/modal_static.html", "text!components/modal/1.0.0/templates/modal_static_footer.html", "core/utils", "fileupload_validate"], function(e, t, i, n, a, s, o, l, r, d, c, p) {
		$.ajaxSetup({
			cache: !1
		});
		var m = e.Model.extend({
				defaults: {
					tab: "",
					isLink: !1,
					type: "",
					text: "",
					link: "",
					groupID: null,
					isDropdown: !1
				}
			}),
			u = e.Collection.extend({
				model: m
			}),
			h = e.View.extend({
				tagName: "li",
				className: function() {
					return this.model.get("isLink") ? "link-group link-group-" + this.model.get("groupID") : this.model.get("isDropdown") ? "link-group dropdown link-group-" + this.model.get("groupID") : void 0
				},
				template: _.template(o),
				linkTemplate: _.template(n),
				dropdownTemplate: _.template(r),
				render: function() {
					var e = this.model.toJSON(),
						t = this.model.get("groupID");
					return _.isNumber(this.model.get("groupID")) && _.isEqual(_.last(this.model.collection.where({
						groupID: t
					})), this.model) ? _.extend(e, {
						isLast: !0
					}) : _.extend(e, {
						isLast: !1
					}), this.model.collection.where({
						isLink: !1,
						isDropdown: !1
					}).length === this.model.collection.length && this.model.collection.indexOf(this.model) === this.model.collection.length - 1 && _.extend(e, {
						isLast: !0
					}), this.model.get("isLink") ? this.$el.html(this.linkTemplate(e)) : this.model.get("isDropdown") ? this.$el.html(this.dropdownTemplate(e)) : this.$el.html(this.template(e)), this.options.hide && this.$el.hide(), this
				}
			}),
			v = e.Model.extend({
				defaults: {
					title: "",
					time: "",
					type: ""
				}
			}),
			f = e.View.extend({
				tagName: "tr",
				template: _.template(l),
				render: function() {
					return this.$el.html(this.template(this.model.toJSON())), this
				}
			}),
			g = e.Model.extend({}),
			y = e.View.extend({
				tagName: function() {
					return "image" === this.model.get("type") ? "li" : "tr"
				},
				template: _.template(s),
				events: {
					"click .js-choose": function(e) {
						if (this.parent.multiChoose) this.toggle();
						else {
							var t = this.model.attributes;
							"guaguale" == t.type && (t.type = "activity", t._real_type = "guaguale"), "wheel" == t.type && (t.type = "activity", t._real_type = "wheel"), "zodiac" == t.type && (t.type = "activity", t._real_type = "zodiac"), "crazyguess" == t.type && (t.type = "activity", t._real_type = "crazyguess"), "mpNews" == t.type && (t.type = "news"), S.chooseItemCallback(t)
						}
						e.stopPropagation()
					},
					"click .js-multi-select": "toggleImage"
				},
				initialize: function(e) {
					this.parent = e.parent;
					var t = this.model.get("time"),
						i = t.split(" ");
					this.model.set("time", i.join("<br>"))
				},
				toggleImage: function(e) {
					this.toggle(!0)
				},
				toggle: function(e) {
					var t = this.$(".js-choose");
					t.toggleClass("btn-primary"), t.hasClass("btn-primary") ? (t.data("view", this), e || t.html("取消")) : e || t.html("选取"), this.toggleConfirm()
				},
				toggleConfirm: function() {
					this.parent.$(".js-choose.btn-primary").length > 0 ? this.parent.$(".js-confirm-choose").show() : this.parent.$(".js-confirm-choose").hide()
				},
				render: function() {
					return this.$el.html(this.template(this.model.toJSON())), "image" === this.model.get("type") && this.parent.multiChoose ? this.$(".multi-select-container").show() : this.$(".multi-select-container").hide(), this
				}
			}),
			w = e.Model.extend({
				defaults: {
					type: "",
					data: [],
					pageNavi: ""
				},
				getType: function(e) {
					var t = e.slice(1).split("-"),
						i = this.get("type");
					return i === t[t.length - 1]
				},
				fetch: function(e, t, i) {
					var n = this,
						a = this.get("type"),
						s = S.url[a];
					_.isUndefined(s) || ("cards" != a && (s += s.indexOf("?") >= 0 ? "&v=2" : "?v=2"), _.isUndefined(e) || (s += "&keyword=" + e), _.isUndefined(t) || (s += "&p=" + t), window._global.imageSize && "image" === a && (s += "&size=" + window._global.imageSize), $.getJSON(s, function(e) {
						var t = e.data;
						if (0 === +e.errcode || 0 === +e.code) {
							var s = t.data_list,
								o = t.page_view,
								l = t.data_type;
							n.set({
								type: a,
								data: s,
								pageNavi: o,
								dataType: l
							})
						} else p.errorNotify(e.errmsg);
						_.isFunction(i) && i()
					}))
				}
			}),
			k = e.Collection.extend({
				model: w,
				fetch: function(e, t) {
					var i = this,
						n = S.url[e];
					if (_.isUndefined(n)) return void i.add({
						type: e
					}, {
						callback: t
					});
					"cards" != e && (n += n.indexOf("?") >= 0 ? "&v=2" : "?v=2"), window._global.imageSize && "image" === e && (n += "&size=" + window._global.imageSize);
					var a;
					_.isFunction(t) ? a = t : i.reset(), $.getJSON(n, function(t) {
						var n = t.data;
						if (0 === +t.errcode || 0 === +t.code) {
							var s = n.data_list,
								o = n.page_view,
								l = n.data_type;
							i.add({
								type: e,
								data: s,
								pageNavi: o,
								dataType: l
							}, {
								callback: a
							})
						} else p.errorNotify(t.errmsg)
					})
				}
			}),
			b = e.View.extend({
				tagName: "div",
				id: function() {
					return "js-module-" + this.model.get("type")
				},
				className: function() {
					return "tab-pane module-" + this.model.get("type")
				},
				template: _.template(a),
				events: {
					"click .js-modal-search": function(e) {
						var t = this,
							i = t.search.val() || void 0;
						t.model.get("type"), $(e.target);
						t.model.getType(t.parent.tab.find("li.active a").attr("href")) && ("image" === t.model.get("type") ? t.$(".module-header").addClass("loading") : t.parent.loading(), t.model.fetch(i, void 0, function() {
							"image" === t.model.get("type") ? t.$(".module-header").removeClass("loading") : t.parent.done()
						}))
					},
					"keydown .js-modal-search-input": function(e) {
						13 === e.keyCode && (this.$(".js-modal-search").trigger("click"), e.preventDefault())
					},
					"click .js-update": "update"
				},
				initialize: function(e) {
					e = e || {}, this.parent = e.parent;
					var t = this;
					this.parent.$(".pagenavi").on("click", function(e) {
						var i = $(e.target),
							n = i.data("page-num");
						e.preventDefault(), i.hasClass("js-confirm-upload-image") || i.hasClass("btn-cancel") || e.stopPropagation(), i.hasClass("fetch_page") && !i.hasClass("active") && t.model.getType(t.parent.tab.find("li.active a").attr("href")) && t.searchKeyword(n)
					}), this.parent.$(".pagenavi").on("keydown", ".goto-input", function(e) {
						e.keyCode === p.keyCode.ENTER && t.model.getType(t.parent.tab.find("li.active a").attr("href")) && (t.searchKeyword(Number(e.target.innerText)), e.preventDefault())
					}), this.parent.$(".pagenavi").on("click", ".goto-btn", function(e) {
						if (t.model.getType(t.parent.tab.find("li.active a").attr("href"))) {
							var i = t.parent.$(".pagenavi .goto-input");
							t.searchKeyword(+i.text())
						}
					}), this.parent.tabLink.on("active:tab", function(e) {
						var i = e.target,
							n = i.getAttribute("href");
						n && t.model.getType(n) && t.renderPageNavi()
					}), "image" === this.model.get("type") && this.parent.$el.on("show", function() {
						t.renderRow()
					}), this.listenTo(this.model, "change:data", this.renderRow), this.listenTo(this.model, "change:pageNavi", this.renderPageNavi)
				},
				update: function() {
					var e = this;
					"image" === e.model.get("type") ? e.$(".module-header").addClass("loading") : e.parent.loading(), this.model.fetch(void 0, void 0, function() {
						"image" === e.model.get("type") ? e.$(".module-header").removeClass("loading") : e.parent.done()
					})
				},
				searchKeyword: function(e) {
					var t = this;
					isNaN(e) && (e = 1);
					var i = t.search.val() || void 0;
					"image" === t.model.get("type") ? t.$(".module-header").addClass("loading") : t.parent.loading(), t.model.fetch(i, e, function() {
						"image" === t.model.get("type") ? t.$(".module-header").removeClass("loading") : t.parent.done()
					})
				},
				render: function() {
					var e = this;
					this.modelData = this.model.toJSON(), this.$el.html(this.template(this.modelData)), this.thead = new v({
						title: "标题",
						time: "创建时间",
						type: e.model.get("type")
					}), this.renderThead(), this.renderRow(), this.search = this.$(".js-modal-search-input");
					var t = this.parent.tab.find("li.active a");
					return t.length > 0 && this.model.getType(t.attr("href")) && this.renderPageNavi(this.modelData.pageNavi), this
				},
				renderThead: function() {
					var e, t = this;
					e = "image" === this.model.get("type") ? this.$(".module-header") : this.$("thead"), e.empty();
					var i = new f({
						el: e,
						model: t.thead
					});
					i.render()
				},
				renderRow: function() {
					var e, t = this,
						i = this.model.get("data"),
						n = this.model.get("type"),
						a = this.model.get("dataType");
					e = "image" === n ? t.$(".module-body") : t.$("tbody"), e.empty(), _.each(i, function(s) {
						var o;
						"news" === n || "mpNews" === n ? (i = [], _.each(s.news_list, function(e) {
							i.push(e.title)
						}), o = i.join("\\n")) : o = s.title;
						var l = new y({
							model: new g({
								title: s.title || "",
								name: s.name || "",
								time: s.created_time || s.created_at || "",
								link: s.url || "",
								data_url: s.url || "",
								data_cover_attachment_id: s.cover_attachment_id || "",
								data_cover_attachment_url: s.cover_attachment_url || "",
								data_title: o || "",
								data_alias: s.alias || "",
								data_price: s.price || "",
								data_buy_url: s.buy_url || "",
								data_type: a || "",
								width: s.width || "",
								height: s.height || "",
								type: n || "",
								data_id: s.id || s._id || "",
								start_time: s.valid_start_time || s.start_time || "",
								end_time: s.valid_end_time || s.end_time || "",
								news: s.news_list || "",
								attachment_url: s.attachment_url || "",
								attachment_title: s.attachment_title || "",
								attachment_id: s.attachment_id || "",
								thumb_url: s.thumb_url || "",
								multiChoose: t.parent.multiChoose || !1,
								id: s.id || s._id || "",
								image_url: s.image_url || "",
								size: s.attachment_size || "",
								at_least: s.at_least || "",
								is_at_least: s.is_at_least || "",
								value: s.value,
								feature_num: s.num || "",
								feature_hot_per: s.hot_per || "",
								feature_img_url: s.img_url || "",
								feature_intro: s.intor || "",
								area: s.area || "",
								address: s.address || "",
								stock_num: s.stock_num || "",
								min_retail_price: s.min_retail_price || "",
								max_retail_price: s.max_retail_price || "",
								str_lock: s.str_lock || "",
								privilege: s.privilege || ""
							}),
							parent: t.parent
						});
						e.append(l.render().el)
					}), i.length || (this.parent.trigger("empty", this), e.append($('<tr><td colspan="100"><div class="no-result">没有相关数据</div></td></tr>'))), "image" === this.model.get("type") ? this.$(".module-header").removeClass("loading") : this.parent.done()
				},
				renderPageNavi: function() {
					var e = this.model.get("pageNavi");
					this.parent.$(".pagenavi").html(e), this.parent.done()
				}
			}),
			j = e.View.extend({
				tagName: "div",
				id: function() {
					return "js-module-" + this.model.get("type")
				},
				className: function() {
					return "tab-pane module-" + this.model.get("type")
				},
				events: {
					"click .js-preview-img": "previewImage"
				},
				template: _.template(d),
				footerTemplate: _.template(c),
				initialize: function(e) {
					var t = this;
					e = e || {}, this.parent = e.parent, this.parent.tabLink.on("active:tab", function(e) {
						var i = e.target,
							n = i.getAttribute("href");
						n && t.model.getType(n) && t.renderFooter()
					}), this.parent.$el.on("click", function(e) {
						if (e.target === $(".js-confirm-upload-image")[0]) {
							$(e.target).button("loading");
							var i = t.downloadImage();
							if (i) return;
							var n = $(".js-fileupload");
							t.uploadFiles ? n.fileupload("send", {
								files: t.uploadFiles
							}).success(function(e, i, n) {
								var a = [],
									s = [];
								if (_.each(e, function(e, t) {
										"success" === e.status ? s.push(e.success_msg) : a.push({
											index: t + 1,
											msg: e.failed_msg
										})
									}), s.length > 1 ? t.parent.multiChoose ? S.chooseItemCallback(s) : S.chooseItemCallback(s[0]) : 1 === s.length && S.chooseItemCallback(s[0]), a.length > 0) {
									var o = _.reduce(a, function(e, t) {
										return "size" === t.msg.upload_file ? e + "第" + t.index + " 张图片大于 1MB 上传失败；" : e + "第" + t.index + " 张图片上传失败（请联系客服）；"
									}, "");
									p.errorNotify(o)
								}
								t.clearDownload()
							}) : (p.errorNotify("至少选择一张图片。"), t.clearDownload())
						}
					})
				},
				render: function() {
					return this.$el.html(this.template(this.model.attributes)), this
				},
				renderFooter: function() {
					this.parent.$(".pagenavi").html(this.footerTemplate(this.model.attributes)), this.uploadImage()
				},
				uploadImage: function() {
					var e = this;
					if (!e.initUploadImage) {
						e.initUploadImage = !0;
						var t = $(".js-fileupload");
						t.fileupload({
							dataType: "json",
							add: function() {},
							xhrFields: {
								withCredentials: !0
							}
						}).fileupload("option", {
							formData: {
								media_type: "image",
								v: "2",
								mp_id: window._global.kdt_id
							},
							maxFileSize: 1e6,
							acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
						}).on("change", function(t) {
							var i = t.target.files.length;
							if (0 !== i) {
								if (i > 10) return void p.errorNotify("一次只能选择 10 张图片。");
								var n = $(".js-upload-img");
								n.empty(), _.each(t.target.files, function(e) {
									var t = new FileReader;
									t.onload = function(e) {
										n.append($("<img>").attr("src", e.target.result))
									}, t.readAsDataURL(e)
								}), e.uploadFiles = t.target.files
							}
						})
					}
				},
				previewImage: function() {
					var e = $(".js-web-img-input").val();
					if ("" === $.trim(e)) return void $(".js-web-img-input").focus();
					this.model.set("src", e);
					var t = this.$(".js-download-img"),
						i = $("<img>").on("load", function() {
							t.removeClass("loading")
						}).attr("src", e);
					t.html(i).addClass("loading")
				},
				downloadImage: function() {
					var e = this;
					if ("" !== $.trim(this.model.get("src"))) {
						var t = {
							attachment_url: this.model.get("src"),
							media_type: "image",
							v: 2,
							mp_id: window._global.kdt_id
						};
						return $.ajax({
							url: window._global.url.img + "/download?format=json",
							type: "POST",
							data: t,
							dataType: "json",
							xhrFields: {
								withCredentials: !0
							}
						}).done(function(e) {
							e.success && S.chooseItemCallback(e.success)
						}).always(function() {
							e.clearDownload()
						}).fail(function() {
							p.errorNotify("网络出现错误啦。")
						}), !0
					}
				},
				clearDownload: function() {
					this.$(".js-download-img").html(""), this.$(".js-upload-img").html(""), this.$(".js-web-img-input").val(""), this.uploadFiles = null, this.model.set("src", "");
					var e = $(".js-confirm-upload-image");
					e.button("reset")
				}
			}),
			x = e.View.extend({
				initialize: function(e) {
					e = e || {}, this.type = e.type, this.multiChoose = e.multiChoose || !1, this.tab = this.$(".modal-tab"), this.tabContent = this.$(".tab-content"), this.modalBody = this.$(".modal-body"), this.listenTo(I[e.type], "add", this.addTabs), this.listenTo(N[e.type], "add", this.addPanes), this.listenTo(N[e.type], "reset", this.reset), I[e.type].add(e.list), this.tabList = e.tab;
					var t = this,
						i = this.tabLink = this.tab.find(".js-modal-tab"),
						n = function(e) {
							var n = $(e.target),
								a = i.index(n);
							t.tab.find(".link-group").css({
								display: "none"
							}), t.tab.find(".link-group-" + a).css({
								display: "inline-block"
							}), t.tabContent.find("#" + n.attr("href").substring(1)).length > 0 && n.tab("show").trigger("active:tab"), e.preventDefault(), e.stopPropagation()
						};
					i.on("click", n), i.one("click", function(e) {
						var i = $(e.target),
							n = i.data("type");
						t.loading(), N[t.options.type] && N[t.options.type].fetch(n, function() {
							i.tab("show").trigger("active:tab")
						})
					}), this.$el.on("click", ".js-confirm-choose .btn", function() {
						var e = [];
						t.$(".js-choose.btn-primary").each(function(t, i) {
							e.push($(i).data("view").model.attributes)
						}), S.chooseItemCallback(e)
					}), this.on("hide", function() {
						"image" === t.type && this.$(".js-multi-select:checked").prop("checked", !1), t.$(".js-choose.btn-primary").each(function(e, i) {
							"image" === t.type ? $(i).data("view").toggle(!0) : $(i).data("view").toggle()
						})
					}), this.on("show", function() {
						for (var e = !0, t = 0; t < i.length; t++) {
							var n = $(i[t]);
							if (n.parent("li").hasClass("active")) {
								n.trigger("click"), e = !1;
								break
							}
						}
						e && i.first().trigger("click")
					})
				},
				addTabs: function(e) {
					var t = {
						model: e
					};
					!_.isUndefined(this.options.hide) && "" !== e.type && _.indexOf(this.options.hide, e.get("type")) >= 0 && _.extend(t, {
						hide: !0
					});
					var i = new h(t);
					this.tab.append(i.render().$el)
				},
				addPanes: function(e, t, i) {
					var n, a = this,
						s = _.isUndefined(S.url[e.get("type")]);
					n = s ? new j({
						model: e,
						parent: a
					}) : new b({
						model: e,
						parent: a
					}), this.tabContent.append(n.render().$el), _.isFunction(i.callback) && i.callback(), this.done()
				},
				reset: function() {
					this.tabContent.empty()
				},
				update: function() {
					var e = this;
					this.loading(), _.each(this.tabList, function(t) {
						N[e.type] && N[e.type].fetch(t, !0)
					})
				},
				loading: function() {
					this.modalBody.addClass("loading")
				},
				done: function() {
					this.modalBody.removeClass("loading"), this.$(".js-confirm-choose").hide()
				},
				fetchAll: function() {
					var e = this;
					_.each(this.options.tab, function(t) {
						N[e.options.type] && N[e.options.type].fetch(t)
					})
				}
			}),
			N = {},
			I = {},
			T = e.Model.extend({
				defaults: {
					type: "other"
				}
			}),
			C = e.View.extend({
				template: _.template(i),
				render: function() {
					return $(this.template(this.model.attributes)).appendTo("body")
				}
			}),
			S = {},
			F = {};
		return {
			initialize: function(e) {
				if (F[e.type]) return _.isArray(e.hide) && e.hide.length > 0 ? F[e.type].find(".modal-tab li:not(.link-group)>a").each(function(t, i) {
					var n = $.trim($(i).attr("href").replace("#js-module-", ""));
					e.hide.indexOf(n) >= 0 && $(i).parent("li").hide()
				}) : F[e.type].find(".modal-tab li:not(.link-group)").removeAttr("style"), e.multiChoose ? F[e.type].app.multiChoose = !0 : F[e.type].app.multiChoose = !1, F[e.type];
				_.isUndefined(S.url) && (S.url = e.url || {
					goods: window._global.url.www + "/showcase/goods/shortList.json",
					topic: "//koudaitong.com/v1/topic/list/get",
					category: window._global.url.www + "/showcase/category/shortList.json",
					component: window._global.url.www + "/showcase/component/shortList.json",
					feature_category: window._global.url.www + "/showcase/category/shortList.json",
					survey: window._global.url.www + "/apps/vote/selectList.json",
					image: window._global.url.www + "/showcase/attachment/alert.json?media_type=1",
					article: "//koudaitong.com/v1/article/list/get",
					tag: window._global.url.www + "/showcase/tag/shortList.json",
					goods_tag: window._global.url.www + "/showcase/tag/shortList.json",
					f_category: window._global.url.www + "/showcase/category/shortList.json",
					tag_feature: window._global.url.www + "/showcase/tag/shortList.json",
					tag_feature_2: window._global.url.www + "/showcase/feature/shortList.json",
					news: "//koudaitong.com/v1/news/list/get",
					mpNews: window._global.url.www + "/weixin/imagetext/minilist.json",
					activity: "//koudaitong.com/v1/activity/list/modal",
					guaguale: window._global.url.www + "/apps/cards/shortlist.json",
					wheel: window._global.url.www + "/apps/wheel/shortlist.json",
					zodiac: window._global.url.www + "/apps/zodiac/shortlist.json",
					crazyguess: window._global.url.www + "/apps/crazyguess/shortlist.json",
					grab: window._global.url.www + "/apps/grab/shortList.json",
					guang_activity: "//koudaitong.com/v1/activity/list/modal?is_guangyiguang=1",
					feature: window._global.url.www + "/showcase/feature/shortList.json",
					articles: window._global.url.www + "/sinaweibo/articles/atricleselectionlist.json",
					tradeincard: window._global.url.www + "/ump/tradeincard/listForSelection.json",
					storelist: window._global.url.www + "/setting/teamphysical/storelist.json",
					recommend_goods: window._global.url.fenxiao + "/pinjian/activity/goodsList.json",
					fenxiao_goods: window._global.url.fenxiao + "/supplier/goods/shortlist.json",
					fenxiao_imagetext: window._global.url.fenxiao + "/supplier/imagetext/shortlist.json",
					fenxiao_enterprise_imagetext: window._global.url.fenxiao + "/supplier/imagetext/shortlist.json"
				}, _.each(S.url, function(e, t) {
					N[t] = new k, I[t] = new u
				})), S.chooseItemCallback = function() {
					e.chooseItemCallback.apply(i, arguments), i.modal("hide"), a.trigger("hide")
				} || function() {};
				var t = new C({
						model: new T({
							type: e.type
						})
					}),
					i = t.render();
				i.view = t, i.on("show", function(e) {
					var t = $(e.target);
					t.hasClass("modal") && a.trigger("show")
				}), i.setChooseItemCallback = function(e) {
					return S.chooseItemCallback = null, S.chooseItemCallback = function() {
						e.apply(i, arguments), i.modal("hide"), a.trigger("hide")
					}, this
				};
				var n;
				switch (e.type) {
					case "mass_news":
						n = {
							list: [{
								tab: "微信图文",
								type: "mpNews"
							}, {
								link: window._global.url.www + "/weixin/imagetext#list",
								text: "微信图文素材管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["mpNews"],
							type: "news"
						};
						break;
					case "news":
						n = {
							list: [{
								tab: "高级图文",
								type: "news"
							}, {
								tab: "微信图文",
								type: "mpNews"
							}, {
								link: window._global.url.www + "/weixin/advancednews#list",
								text: "高级图文素材管理",
								isLink: !0,
								groupID: 0
							}, {
								link: window._global.url.www + "/weixin/imagetext#list",
								text: "微信图文素材管理",
								isLink: !0,
								groupID: 1
							}],
							tab: ["news", "mpNews"],
							type: "news"
						};
						break;
					case "fenxiao_imagetext":
						n = {
							list: [{
								tab: "图文素材",
								type: "fenxiao_imagetext"
							}, {
								link: "/supplier/imagetext",
								text: "图文素材管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["fenxiao_imagetext"],
							type: "fenxiao_imagetext"
						};
						break;
					case "fenxiao_enterprise_imagetext":
						n = {
							list: [{
								tab: "图文素材",
								type: "fenxiao_enterprise_imagetext"
							}, {
								link: "/supplier/enterprise/imagetext/index",
								text: "图文素材管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["fenxiao_enterprise_imagetext"],
							type: "fenxiao_enterprise_imagetext"
						};
						break;
					case "articles":
						n = {
							list: [{
								tab: "新浪微博图文素材",
								type: "articles"
							}, {
								link: window._global.url.www + "/sinaweibo/articles",
								text: "新浪微博图文素材管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["articles"],
							type: "articles"
						};
						break;
					case "tag":
						n = {
							list: [{
								tab: "商品分组",
								type: "goods_tag"
							}, {
								link: "/v2/showcase/tag",
								text: "分组管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["goods_tag"],
							type: "goods_tag"
						};
						break;
					case "tag_feature":
						n = {
							list: [{
								tab: "商品分组",
								type: "tag_feature"
							}, {
								tab: "微页面",
								type: "tag_feature_2"
							}, {
								link: "/v2/showcase/tag",
								text: "分组管理",
								isLink: !0,
								groupID: 0
							}, {
								link: "/v2/showcase/feature#create",
								text: "新建微页面",
								isLink: !0,
								groupID: 1
							}, {
								link: "/v2/showcase/feature#list&is_display=0",
								text: "草稿管理",
								isLink: !0,
								groupID: 1
							}],
							tab: ["tag_feature", "tag_feature_2"],
							type: "tag_feature"
						};
						break;
					case "feature":
						n = {
							list: [{
								tab: "微页面",
								type: "feature"
							}, {
								tab: "微页面分类",
								type: "category"
							}, {
								link: "/v2/showcase/feature#create",
								text: "新建微页面",
								isLink: !0,
								groupID: 0
							}, {
								link: "/v2/showcase/feature#list&is_display=0",
								text: "草稿管理",
								isLink: !0,
								groupID: 0
							}, {
								link: "/v2/showcase/category",
								text: "分类管理",
								isLink: !0,
								groupID: 1
							}],
							tab: ["feature", "category"],
							type: "feature"
						};
						break;
					case "feature_only":
						n = {
							list: [{
								tab: "微页面",
								type: "feature"
							}, {
								link: "/v2/showcase/feature#create",
								text: "新建微页面",
								isLink: !0,
								groupID: 0
							}, {
								link: "/v2/showcase/feature#list&is_display=0",
								text: "草稿管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["feature"],
							type: "feature"
						};
						break;
					case "category":
						n = {
							list: [{
								tab: "微页面分类",
								type: "f_category"
							}, {
								link: "/v2/showcase/category",
								text: "分类管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["f_category"],
							type: "f_category"
						};
						break;
					case "feature_category":
						n = {
							list: [{
								tab: "微页面分类",
								type: "feature_category"
							}, {
								link: "/v2/showcase/category",
								text: "分类管理",
								isLink: !0,
								groupID: 0
							}],
							tab: ["feature_category"],
							type: "feature_category"
						};
						break;
					case "activity":
						n = {
							list: [{
								tab: "刮刮卡",
								type: "guaguale"
							}, {
								tab: "幸运大抽奖",
								type: "wheel"
							}, {
								tab: "生肖翻翻看",
								type: "zodiac"
							}, {
								tab: "疯狂猜",
								type: "crazyguess"
							}, {
								link: "/v2/apps/cards#create",
								text: "新建刮刮卡",
								groupID: 0,
								isLink: !0
							}, {
								link: "/v2/apps/wheel#create",
								text: "新建幸运大抽奖",
								groupID: 1,
								isLink: !0
							}, {
								link: "/v2/apps/zodiac#create",
								text: "新建生肖翻翻看",
								groupID: 2,
								isLink: !0
							}, {
								link: "/v2/apps/crazyguess#create",
								text: "新建疯狂猜",
								groupID: 3,
								isLink: !0
							}],
							tab: ["activity"],
							type: "activity"
						};
						break;
					case "grab":
						n = {
							list: [{
								tab: "抢楼活动",
								type: "grab"
							}, {
								link: _global.url.www + "/apps/grab/create",
								text: "新建抢楼活动",
								groupID: 0,
								isLink: !0
							}],
							tab: ["grab"],
							type: "grab"
						};
						break;
					case "guang_activity":
						n = {
							list: [{
								tab: "刮刮乐",
								type: "guaguale"
							}, {
								tab: "幸运大抽奖",
								type: "wheel"
							}, {
								tab: "翻翻看",
								type: "zodiac"
							}, {
								tab: "疯狂猜",
								type: "crazyguess"
							}, {
								link: "/v2/apps/cards#create",
								text: "新建刮刮乐",
								groupID: 0,
								isDropdown: !0
							}, {
								link: "/v2/apps/wheel#create",
								text: "新建幸运大抽奖",
								groupID: 1,
								isDropdown: !0
							}, {
								link: "/v2/apps/zodiac#create",
								text: "新建翻翻看",
								groupID: 2,
								isDropdown: !0
							}, {
								link: "/v2/apps/crazyguess#create",
								text: "新建疯狂猜",
								groupID: 3,
								isDropdown: !0
							}],
							tab: ["guang_activity"],
							type: "guang_activity"
						};
						break;
					case "goods":
						n = {
							list: [{
								tab: "已上架商品",
								type: "goods"
							}, {
								tab: "商品分组",
								type: "tag"
							}, {
								link: "/v2/showcase/goods/edit",
								text: "新建商品",
								isLink: !0,
								groupID: 0
							}, {
								link: "/v2/showcase/goods#list&is_display=0",
								text: "草稿管理",
								isLink: !0,
								groupID: 0
							}, {
								link: "/v2/showcase/tag",
								text: "分组管理",
								isLink: !0,
								groupID: 1
							}],
							tab: ["goods", "tag"],
							type: "goods"
						};
						break;
					case "fenxiao_goods":
						n = {
							list: [{
								tab: "已上架商品",
								type: "fenxiao_goods"
							}, {
								link: _global.url.fenxiao + "/supplier/goods/create",
								text: "新建商品",
								isLink: !0,
								groupID: 0
							}],
							tab: ["fenxiao_goods"],
							type: "fenxiao_goods"
						};
						break;
					case "recommend_goods":
						n = {
							list: [{
								tab: "掌柜推荐商品",
								type: "recommend_goods"
							}, {
								link: _global.url.fenxiao + "/supplier/goods/create",
								text: "新建商品",
								isLink: !0,
								groupID: 0
							}],
							tab: ["recommend_goods"],
							type: "recommend_goods"
						};
						break;
					case "survey":
						n = {
							list: [{
								tab: "投票调查",
								type: "survey"
							}, {
								link: "/v2/apps/vote#create",
								text: "新建投票调查",
								groupID: 0,
								isLink: !0
							}],
							tab: ["survey"],
							type: "survey"
						};
						break;
					case "storelist":
						n = {
							list: [{
								tab: "线下门店",
								type: "storelist"
							}, {
								link: "/v2/setting/store#physical_store",
								text: "新建线下门店",
								groupID: 0,
								isLink: !0
							}],
							tab: ["storelist"],
							type: "storelist"
						};
						break;
					case "component":
						n = {
							list: [{
								tab: "自定义页面模块",
								type: "component"
							}, {
								link: "/v2/showcase/component#create",
								text: "新建自定义页面模块",
								groupID: 0,
								isLink: !0
							}],
							tab: ["component"],
							type: "component"
						};
						break;
					case "image":
						n = {
							list: [{
								tab: "用过的图片",
								type: "image"
							}, {
								tab: "新图片",
								type: "uploadImage"
							}],
							tab: ["image", "uploadImage"],
							type: "image"
						};
						break;
					case "tradeincard":
						n = {
							list: [{
								tab: "优惠券",
								type: "tradeincard"
							}, {
								link: "/v2/ump/tradeincard#add",
								text: "新建优惠券",
								groupID: 0,
								isLink: !0
							}],
							tab: ["tradeincard"],
							type: "tradeincard"
						};
						break;
					default:
						n = e.config
				}
				_.extend(n, {
					modal: i,
					hide: e.hide || [],
					multiChoose: e.multiChoose || !1
				}), e.size && (window._global.imageSize = e.size || !1);
				var a = new x(_.extend({}, {
					el: i
				}, n));
				return i.app = a, F[e.type] = i, i
			}
		}
	}), define("core/emoticon_bot", ["require", "jquery"], function(e) {
		var t = e("jquery"),
			i = [{
				key: "[微笑]",
				val: "01"
			}, {
				key: "[撇嘴]",
				val: "02"
			}, {
				key: "[色]",
				val: "03"
			}, {
				key: "[发呆]",
				val: "04"
			}, {
				key: "[得意]",
				val: "05"
			}, {
				key: "[流泪]",
				val: "06"
			}, {
				key: "[害羞]",
				val: "07"
			}, {
				key: "[闭嘴]",
				val: "08"
			}, {
				key: "[睡]",
				val: "09"
			}, {
				key: "[大哭]",
				val: "10"
			}, {
				key: "[尴尬]",
				val: "11"
			}, {
				key: "[发怒]",
				val: "12"
			}, {
				key: "[调皮]",
				val: "13"
			}, {
				key: "[呲牙]",
				val: "14"
			}, {
				key: "[惊讶]",
				val: "15"
			}, {
				key: "[难过]",
				val: "16"
			}, {
				key: "[酷]",
				val: "17"
			}, {
				key: "[冷汗]",
				val: "18"
			}, {
				key: "[抓狂]",
				val: "19"
			}, {
				key: "[吐]",
				val: "20"
			}, {
				key: "[偷笑]",
				val: "21"
			}, {
				key: "[愉快]",
				val: "22"
			}, {
				key: "[白眼]",
				val: "23"
			}, {
				key: "[傲慢]",
				val: "24"
			}, {
				key: "[饥饿]",
				val: "25"
			}, {
				key: "[困]",
				val: "26"
			}, {
				key: "[惊恐]",
				val: "27"
			}, {
				key: "[流汗]",
				val: "28"
			}, {
				key: "[憨笑]",
				val: "29"
			}, {
				key: "[悠闲]",
				val: "30"
			}, {
				key: "[奋斗]",
				val: "31"
			}, {
				key: "[咒骂]",
				val: "32"
			}, {
				key: "[疑问]",
				val: "33"
			}, {
				key: "[嘘]",
				val: "34"
			}, {
				key: "[晕]",
				val: "35"
			}, {
				key: "[疯了]",
				val: "36"
			}, {
				key: "[衰]",
				val: "37"
			}, {
				key: "[骷髅]",
				val: "38"
			}, {
				key: "[敲打]",
				val: "39"
			}, {
				key: "[再见]",
				val: "40"
			}, {
				key: "[擦汗]",
				val: "41"
			}, {
				key: "[抠鼻]",
				val: "42"
			}, {
				key: "[鼓掌]",
				val: "43"
			}, {
				key: "[糗大了]",
				val: "44"
			}, {
				key: "[坏笑]",
				val: "45"
			}, {
				key: "[左哼哼]",
				val: "46"
			}, {
				key: "[右哼哼]",
				val: "47"
			}, {
				key: "[哈欠]",
				val: "48"
			}, {
				key: "[鄙视]",
				val: "49"
			}, {
				key: "[委屈]",
				val: "50"
			}, {
				key: "[快哭了]",
				val: "51"
			}, {
				key: "[阴险]",
				val: "52"
			}, {
				key: "[亲亲]",
				val: "53"
			}, {
				key: "[吓]",
				val: "54"
			}, {
				key: "[可怜]",
				val: "55"
			}, {
				key: "[菜刀]",
				val: "56"
			}, {
				key: "[西瓜]",
				val: "57"
			}, {
				key: "[啤酒]",
				val: "58"
			}, {
				key: "[篮球]",
				val: "59"
			}, {
				key: "[乒乓]",
				val: "60"
			}, {
				key: "[咖啡]",
				val: "61"
			}, {
				key: "[饭]",
				val: "62"
			}, {
				key: "[猪头]",
				val: "63"
			}, {
				key: "[玫瑰]",
				val: "64"
			}, {
				key: "[凋谢]",
				val: "65"
			}, {
				key: "[嘴唇]",
				val: "66"
			}, {
				key: "[爱心]",
				val: "67"
			}, {
				key: "[心碎]",
				val: "68"
			}, {
				key: "[蛋糕]",
				val: "69"
			}, {
				key: "[闪电]",
				val: "70"
			}, {
				key: "[炸弹]",
				val: "71"
			}, {
				key: "[刀]",
				val: "72"
			}, {
				key: "[足球]",
				val: "73"
			}, {
				key: "[瓢虫]",
				val: "74"
			}, {
				key: "[便便]",
				val: "75"
			}, {
				key: "[月亮]",
				val: "76"
			}, {
				key: "[太阳]",
				val: "77"
			}, {
				key: "[礼物]",
				val: "78"
			}, {
				key: "[拥抱]",
				val: "79"
			}, {
				key: "[强]",
				val: "80"
			}, {
				key: "[弱]",
				val: "81"
			}, {
				key: "[握手]",
				val: "82"
			}, {
				key: "[胜利]",
				val: "83"
			}, {
				key: "[抱拳]",
				val: "84"
			}, {
				key: "[勾引]",
				val: "85"
			}, {
				key: "[拳头]",
				val: "86"
			}, {
				key: "[差劲]",
				val: "87"
			}, {
				key: "[爱你]",
				val: "88"
			}, {
				key: "[NO]",
				val: "89"
			}, {
				key: "[OK]",
				val: "90"
			}, {
				key: "[爱情]",
				val: "91"
			}, {
				key: "[飞吻]",
				val: "92"
			}, {
				key: "[跳跳]",
				val: "93"
			}, {
				key: "[发抖]",
				val: "94"
			}, {
				key: "[怄火]",
				val: "95"
			}, {
				key: "[转圈]",
				val: "96"
			}, {
				key: "[磕头]",
				val: "97"
			}, {
				key: "[回头]",
				val: "98"
			}, {
				key: "[跳绳]",
				val: "99"
			}, {
				key: "[投降]",
				val: "100"
			}, {
				key: "[激动]",
				val: "101"
			}, {
				key: "[乱舞]",
				val: "102"
			}, {
				key: "[献吻]",
				val: "103"
			}, {
				key: "[左太极]",
				val: "104"
			}, {
				key: "[右太极]",
				val: "105"
			}],
			n = [{
				key: "/::)",
				val: "01"
			}, {
				key: "/::~",
				val: "02"
			}, {
				key: "/::B",
				val: "03"
			}, {
				key: "/::|",
				val: "04"
			}, {
				key: "/:8-)",
				val: "05"
			}, {
				key: "/::<",
				val: "06"
			}, {
				key: "/::$",
				val: "07"
			}, {
				key: "/::X",
				val: "08"
			}, {
				key: "/::Z",
				val: "09"
			}, {
				key: "/::'(",
				val: "10"
			}, {
				key: "/::-|",
				val: "11"
			}, {
				key: "/::@",
				val: "12"
			}, {
				key: "/::P",
				val: "13"
			}, {
				key: "/::D",
				val: "14"
			}, {
				key: "/::O",
				val: "15"
			}, {
				key: "/::(",
				val: "16"
			}, {
				key: "/::+",
				val: "17"
			}, {
				key: "/:--b",
				val: "18"
			}, {
				key: "/::Q",
				val: "19"
			}, {
				key: "/::T",
				val: "20"
			}, {
				key: "/:,@P",
				val: "21"
			}, {
				key: "/:,@-D",
				val: "22"
			}, {
				key: "/::d",
				val: "23"
			}, {
				key: "/:,@o",
				val: "24"
			}, {
				key: "/::g",
				val: "25"
			}, {
				key: "/:|-)",
				val: "26"
			}, {
				key: "/::!",
				val: "27"
			}, {
				key: "/::L",
				val: "28"
			}, {
				key: "/::>",
				val: "29"
			}, {
				key: "/::,@",
				val: "30"
			}, {
				key: "/:,@f",
				val: "31"
			}, {
				key: "/::-S",
				val: "32"
			}, {
				key: "/:?",
				val: "33"
			}, {
				key: "/:,@x",
				val: "34"
			}, {
				key: "/:,@@",
				val: "35"
			}, {
				key: "/::8",
				val: "36"
			}, {
				key: "/:,@!",
				val: "37"
			}, {
				key: "/:!!!",
				val: "38"
			}, {
				key: "/:xx",
				val: "39"
			}, {
				key: "/:bye",
				val: "40"
			}, {
				key: "/:wipe",
				val: "41"
			}, {
				key: "/:dig",
				val: "42"
			}, {
				key: "/:handclap",
				val: "43"
			}, {
				key: "/:&-(",
				val: "44"
			}, {
				key: "/:B-)",
				val: "45"
			}, {
				key: "/:<@",
				val: "46"
			}, {
				key: "/:@>",
				val: "47"
			}, {
				key: "/::-O",
				val: "48"
			}, {
				key: "/:>-|",
				val: "49"
			}, {
				key: "/:P-(",
				val: "50"
			}, {
				key: "/::'|",
				val: "51"
			}, {
				key: "/:X-)",
				val: "52"
			}, {
				key: "/::*",
				val: "53"
			}, {
				key: "/:@x",
				val: "54"
			}, {
				key: "/:8*",
				val: "55"
			}, {
				key: "/:pd",
				val: "56"
			}, {
				key: "/:<W>",
				val: "57"
			}, {
				key: "/:beer",
				val: "58"
			}, {
				key: "/:basketb",
				val: "59"
			}, {
				key: "/:oo",
				val: "60"
			}, {
				key: "/:coffee",
				val: "61"
			}, {
				key: "/:eat",
				val: "62"
			}, {
				key: "/:pig",
				val: "63"
			}, {
				key: "/:rose",
				val: "64"
			}, {
				key: "/:fade",
				val: "65"
			}, {
				key: "/:showlove",
				val: "66"
			}, {
				key: "/:heart",
				val: "67"
			}, {
				key: "/:break",
				val: "68"
			}, {
				key: "/:cake",
				val: "69"
			}, {
				key: "/:li",
				val: "70"
			}, {
				key: "/:bome",
				val: "71"
			}, {
				key: "/:kn",
				val: "72"
			}, {
				key: "/:footb",
				val: "73"
			}, {
				key: "/:ladybug",
				val: "74"
			}, {
				key: "/:shit",
				val: "75"
			}, {
				key: "/:moon",
				val: "76"
			}, {
				key: "/:sun",
				val: "77"
			}, {
				key: "/:gift",
				val: "78"
			}, {
				key: "/:hug",
				val: "79"
			}, {
				key: "/:strong",
				val: "80"
			}, {
				key: "/:weak",
				val: "81"
			}, {
				key: "/:share",
				val: "82"
			}, {
				key: "/:v",
				val: "83"
			}, {
				key: "/:@)",
				val: "84"
			}, {
				key: "/:jj",
				val: "85"
			}, {
				key: "/:@@",
				val: "86"
			}, {
				key: "/:bad",
				val: "87"
			}, {
				key: "/:lvu",
				val: "88"
			}, {
				key: "/:no",
				val: "89"
			}, {
				key: "/:ok",
				val: "90"
			}, {
				key: "/:love",
				val: "91"
			}, {
				key: "/:<L>",
				val: "92"
			}, {
				key: "/:jump",
				val: "93"
			}, {
				key: "/:shake",
				val: "94"
			}, {
				key: "/:<O>",
				val: "95"
			}, {
				key: "/:circle",
				val: "96"
			}, {
				key: "/:kotow",
				val: "97"
			}, {
				key: "/:turn",
				val: "98"
			}, {
				key: "/:skip",
				val: "99"
			}, {
				key: "/:oY",
				val: "100"
			}, {
				key: "/:#-0",
				val: "101"
			}, {
				key: "/:hiphot",
				val: "102"
			}, {
				key: "/:kiss",
				val: "103"
			}, {
				key: "/:<&",
				val: "104"
			}, {
				key: "/:&>",
				val: "105"
			}],
			a = [{
				key: "/微笑",
				val: "01"
			}, {
				key: "/撇嘴",
				val: "02"
			}, {
				key: "/色",
				val: "03"
			}, {
				key: "/发呆",
				val: "04"
			}, {
				key: "/得意",
				val: "05"
			}, {
				key: "/流泪",
				val: "06"
			}, {
				key: "/害羞",
				val: "07"
			}, {
				key: "/闭嘴",
				val: "08"
			}, {
				key: "/睡",
				val: "09"
			}, {
				key: "/大哭",
				val: "10"
			}, {
				key: "/尴尬",
				val: "11"
			}, {
				key: "/发怒",
				val: "12"
			}, {
				key: "/调皮",
				val: "13"
			}, {
				key: "/呲牙",
				val: "14"
			}, {
				key: "/惊讶",
				val: "15"
			}, {
				key: "/难过",
				val: "16"
			}, {
				key: "/酷",
				val: "17"
			}, {
				key: "/冷汗",
				val: "18"
			}, {
				key: "/抓狂",
				val: "19"
			}, {
				key: "/吐",
				val: "20"
			}, {
				key: "/偷笑",
				val: "21"
			}, {
				key: "/可爱",
				val: "22"
			}, {
				key: "/白眼",
				val: "23"
			}, {
				key: "/傲慢",
				val: "24"
			}, {
				key: "/饥饿",
				val: "25"
			}, {
				key: "/困",
				val: "26"
			}, {
				key: "/惊恐",
				val: "27"
			}, {
				key: "/流汗",
				val: "28"
			}, {
				key: "/憨笑",
				val: "29"
			}, {
				key: "/大兵",
				val: "30"
			}, {
				key: "/奋斗",
				val: "31"
			}, {
				key: "/咒骂",
				val: "32"
			}, {
				key: "/疑问",
				val: "33"
			}, {
				key: "/嘘",
				val: "34"
			}, {
				key: "/晕",
				val: "35"
			}, {
				key: "/折磨",
				val: "36"
			}, {
				key: "/衰",
				val: "37"
			}, {
				key: "/骷髅",
				val: "38"
			}, {
				key: "/敲打",
				val: "39"
			}, {
				key: "/再见",
				val: "40"
			}, {
				key: "/擦汗",
				val: "41"
			}, {
				key: "/抠鼻",
				val: "42"
			}, {
				key: "/鼓掌",
				val: "43"
			}, {
				key: "/糗大了",
				val: "44"
			}, {
				key: "/坏笑",
				val: "45"
			}, {
				key: "/左哼哼",
				val: "46"
			}, {
				key: "/右哼哼",
				val: "47"
			}, {
				key: "/哈欠",
				val: "48"
			}, {
				key: "/鄙视",
				val: "49"
			}, {
				key: "/委屈",
				val: "50"
			}, {
				key: "/快哭了",
				val: "51"
			}, {
				key: "/阴险",
				val: "52"
			}, {
				key: "/亲亲",
				val: "53"
			}, {
				key: "/吓",
				val: "54"
			}, {
				key: "/可怜",
				val: "55"
			}, {
				key: "/菜刀",
				val: "56"
			}, {
				key: "/西瓜",
				val: "57"
			}, {
				key: "/啤酒",
				val: "58"
			}, {
				key: "/篮球",
				val: "59"
			}, {
				key: "/乒乓",
				val: "60"
			}, {
				key: "/咖啡",
				val: "61"
			}, {
				key: "/饭",
				val: "62"
			}, {
				key: "/猪头",
				val: "63"
			}, {
				key: "/玫瑰",
				val: "64"
			}, {
				key: "/凋谢",
				val: "65"
			}, {
				key: "/示爱",
				val: "66"
			}, {
				key: "/爱心",
				val: "67"
			}, {
				key: "/心碎",
				val: "68"
			}, {
				key: "/蛋糕",
				val: "69"
			}, {
				key: "/闪电",
				val: "70"
			}, {
				key: "/炸弹",
				val: "71"
			}, {
				key: "/刀",
				val: "72"
			}, {
				key: "/足球",
				val: "73"
			}, {
				key: "/瓢虫",
				val: "74"
			}, {
				key: "/便便",
				val: "75"
			}, {
				key: "/月亮",
				val: "76"
			}, {
				key: "/太阳",
				val: "77"
			}, {
				key: "/礼物",
				val: "78"
			}, {
				key: "/拥抱",
				val: "79"
			}, {
				key: "/强",
				val: "80"
			}, {
				key: "/弱",
				val: "81"
			}, {
				key: "/握手",
				val: "82"
			}, {
				key: "/胜利",
				val: "83"
			}, {
				key: "/抱拳",
				val: "84"
			}, {
				key: "/勾引",
				val: "85"
			}, {
				key: "/拳头",
				val: "86"
			}, {
				key: "/差劲",
				val: "87"
			}, {
				key: "/爱你",
				val: "88"
			}, {
				key: "/NO",
				val: "89"
			}, {
				key: "/OK",
				val: "90"
			}, {
				key: "/爱情",
				val: "91"
			}, {
				key: "/飞吻",
				val: "92"
			}, {
				key: "/跳跳",
				val: "93"
			}, {
				key: "/发抖",
				val: "94"
			}, {
				key: "/怄火",
				val: "95"
			}, {
				key: "/转圈",
				val: "96"
			}, {
				key: "/磕头",
				val: "97"
			}, {
				key: "/回头",
				val: "98"
			}, {
				key: "/跳绳",
				val: "99"
			}, {
				key: "/挥手",
				val: "100"
			}, {
				key: "/激动",
				val: "101"
			}, {
				key: "/街舞",
				val: "102"
			}, {
				key: "/献吻",
				val: "103"
			}, {
				key: "/左太极",
				val: "104"
			}, {
				key: "/右太极",
				val: "105"
			}],
			s = t({});
		return s.baseUrl = _global.url.cdn_static + "/vendor/ueditor/build/dialogs/emotion/images/qq/", s.decode = function(e, t, s) {
			var o, l, r, d = this,
				t = t || ".gif";
			if (!d.faceTagsData_1 || s) {
				o = d.faceTagsData_1 = {};
				for (var c = 0, p = i.length; p > c; c++) o[i[c].key] = '<img src="' + d.baseUrl + i[c].val + t + '" unselectable="on">'
			} else o = d.faceTagsData_1;
			if (!d.faceTagsData_2 || s) {
				l = d.faceTagsData_2 = {};
				for (var c = 0, p = n.length; p > c; c++) l[n[c].key] = '<img src="' + d.baseUrl + n[c].val + t + '" unselectable="on">'
			} else l = d.faceTagsData_2;
			if (!d.faceTagsData_3 || s) {
				r = d.faceTagsData_3 = {};
				for (var c = 0, p = a.length; p > c; c++) r[a[c].key] = '<img src="' + d.baseUrl + a[c].val + t + '" unselectable="on">'
			} else r = d.faceTagsData_3;
			var m = e;
			if (-1 === m.indexOf("/") && -1 === m.indexOf("[")) return m;
			m = m.replace(/\&lt;/gi, "<"), m = m.replace(/\&gt;/gi, ">");
			var u = [].concat(e.match(/\/.{1}/g), e.match(/\/.{2}/g), e.match(/\/.{3}/g), e.match(/\/.{4}/g), e.match(/\/.{5}/g), e.match(/\/.{6}/g), e.match(/\/.{7}/g), e.match(/\/.{8}/g), e.match(/\/.{9}/g), e.match(/\/.{10}/g)),
				h = [],
				v = [];
			if (u) {
				for (var c = 0, f = u.length; f > c; c++) {
					var g = u[c];
					l[g] && h.push(u[c])
				}
				for (var _ = 0, y = h.length; y > _; _++) e = e.replace(h[_], l[h[_]]);
				for (var c = 0, f = u.length; f > c; c++) {
					var g = u[c];
					r[g] && v.push(u[c])
				}
				for (var _ = 0, y = v.length; y > _; _++) e = e.replace(v[_], r[v[_]])
			}
			return e = e.replace(/\[[^\[\]]+\]/gi, function(e) {
				return o[e] ? o[e] : ""
			})
		}, s
	}), define("views/nav", ["require", "backbone", "views/base", "text!templates/nav.html", "components/popover/confirm/app", "components/popover/rename/app", "components/pop/atom/link", "components/modal/1.0.0/modal", "core/utils", "core/emoticon_bot"], function(e) {
		var t = (e("backbone"), e("views/base")),
			i = e("text!templates/nav.html"),
			n = e("components/popover/confirm/app"),
			a = e("components/popover/rename/app"),
			s = e("components/pop/atom/link"),
			o = e("components/modal/1.0.0/modal"),
			l = e("core/utils");
		window.EmoticonBot = e("core/emoticon_bot");
		var r = ".js-first-field",
			d = ".js-second-field",
			c = ".js-name-input",
			p = ".js-editor-wrap",
			m = t.extend({
				el: ".js-first-nav-fields",
				template: _.template(i),
				events: {
					"click .js-add-second": "addSecondNav",
					"click .js-del-first": "delFirstNav",
					"click .js-del-second": "delSecondNav",
					"click .js-edit-first": "editFirstNav",
					"click .js-edit-second": "editSecondNav",
					"click .js-modal-news, .js-modal-articles, .js-modal-magazine, .js-modal-goods, .js-modal-activity, .js-modal-survey": "chooseLink",
					"click .js-modal-homepage, .js-modal-usercenter, .js-modal-checkin, .js-modal-search, .js-modal-cart": "chooseStaticLink",
					"click .js-modal-links": "chooseOtherLink",
					"click .js-modal-txt": "chooseTxt",
					"click .js-menu-li": "triggerMenu"
				},
				initialize: function(e) {
					var t, i = this;
					i.appView = e.appView, this.listenTo(this.model, "change:allNav", this.refresh), this.render(), $(".js-field-wrap").each(function() {
						t = $(this).find(".js-second-field").size() > 0 ? $(this).find(".js-second-field:first") : $(this).find(".js-first-field-li"), i.activeMenu(t)
					})
				},
				render: function() {
					var e = this.model.toJSON();
					return this.$el.html(this.template(e)), this.sortable(), this
				},
				sortable: function() {
					var e = this;
					this.$(".sec-nav-field").sortable({
						axis: "y",
						placeholder: "sortable-placeholder",
						connectWith: ".sec-nav-field",
						start: function(e, t) {
							var i = +t.item.parents(".js-first-field").data("id"),
								n = +t.item.index();
							t.item.data("startPos", [i, n])
						},
						stop: function(t, i) {
							var n = i.item.parents(".js-first-field"),
								a = i.item.data("startPos"),
								s = [+n.data("id"), i.item.index()];
							if (a[0] !== s[0] || a[1] !== s[1]) return n.find(".sec-nav-field li").size() > 5 ? (l.errorNotify("最多只能添加 5 个二级菜单。"), void e.render()) : void e.sort(a, s)
						}
					})
				},
				sort: function(e, t) {
					var i = this.model.toJSON().nav,
						n = i[e[0]].second.splice(e[1], 1)[0];
					i[t[0]].second.splice(t[1], 0, n), i[t[0]].active_menu = t[1], this.model.set({
						nav: i
					}), this.appView.saveOrder(), this.render()
				},
				refresh: function() {
					this.render(), $(p).hide()
				},
				triggerMenu: function(e) {
					var t = $(e.target).parents("li").size() > 0 ? $(e.target).parents("li") : $(e.target);
					this.activeMenu(t)
				},
				activeMenu: function(e) {
					var t = e.data("id"),
						i = e.parents(r).data("id");
					e.parents(".menu-titles").find("li.active").removeClass("active"), e.addClass("active"), e.parents(r).find(".js-link-to").hide(), e.parents(r).find(".js-link-to[data-id=" + t + "]").show(), this.model.setActiveMenu(i, t)
				},
				delFirstNav: function(e) {
					var t = this,
						i = $(e.target).parents(r).data("id");
					new n({
						of: e.target,
						data: {
							title: "确定删除？",
							className: "pop-shopnav-del"
						},
						callback: function() {
							t.model.delFirstNav(i)
						}
					}), t.showCloseBtn(".pop-shopnav-del", e.target)
				},
				addSecondNav: function(e) {
					var t = $(e.target),
						i = t.parents(r).data("id"),
						n = this.$el.find(r + "[data-id=" + i + "]");
					n.find(d).size() < 5 ? this.model.addSecondNav(i) : l.errorNotify("最多只能添加 5 个二级菜单。")
				},
				delSecondNav: function(e) {
					var t = this,
						i = $(e.target),
						a = i.parents(r).data("id"),
						s = i.parents(d).data("id");
					new n({
						of: e.target,
						data: {
							className: "pop-shopnav-del",
							title: "确定删除？"
						},
						callback: function() {
							t.model.delSecondNav(a, s)
						}
					}), t.showCloseBtn(".pop-shopnav-del", e.target)
				},
				editFirstNav: function(e) {
					var t = this,
						i = ($(e.target), $(e.target).parents(r).data("id")),
						n = this.model.get("nav"),
						s = n[i].title;
					new a({
						of: e.target,
						arrow: "top-center",
						data: {
							html: s
						},
						callback: function() {
							var e = $.trim($(c).val());
							e && e !== s && t.model.editFirstNav(i, e)
						}
					}), $(c).focus().val(s).select(), $(c).attr("maxlength", "15"), t.showCloseBtn(".pop-shopnav-edit", e.target)
				},
				editSecondNav: function(e) {
					var t = this,
						i = $(e.target),
						n = i.parents(r).data("id"),
						s = i.parents(d).data("id"),
						o = this.model.get("nav"),
						l = o[n].second[s].title;
					new a({
						of: e.target,
						arrow: "top-center",
						data: {
							html: l
						},
						callback: function() {
							var e = $.trim($(c).val());
							e && e !== l && t.model.editSecondNav(n, s, e)
						}
					}), $(c).focus().val(l).select(), $(c).attr("maxlength", "15"), t.showCloseBtn(".pop-shopnav-edit", e.target)
				},
				showCloseBtn: function(e, t) {
					var i = $(t).parents(r);
					$(e).hover(function() {
						i.find(".js-del-first").show(), i.addClass("hover")
					}, function() {
						i.find(".js-del-first").hide(), i.removeClass("hover")
					})
				},
				chooseLink: function(e) {
					var t, i = this,
						n = $(e.target),
						a = n.parents(r),
						s = a.data("id"),
						l = a.find(d + ".active").data("id"),
						c = n.data("type"),
						p = {};
					"activity" === c && (c = "guang_activity", t = "activity"), o.initialize({
						type: c
					}).setChooseItemCallback(function(e) {
						p = {
							id: e.data_id,
							type: t || e.type,
							title: e.data_title,
							url: e.data_url,
							news: e.news
						}, "guaguale" == e._real_type && (p.type = "cards"), "wheel" == e._real_type && (p.type = "wheel"), "zodiac" == e._real_type && (p.type = "zodiac"), "crazyguess" == e._real_type && (p.type = "crazyguess"), _.isNull(l) || _.isUndefined(l) ? i.model.chooseFirstLink(s, p) : i.model.chooseSecondLink(s, l, p)
					}).modal("show")
				},
				chooseStaticLink: function(e) {
					var t = this,
						i = $(e.target),
						n = i.parents(r),
						a = n.data("id"),
						s = n.find(d + ".active").data("id"),
						o = i.data("type"),
						c = {};
					l.getStaticUrl(o, function(e) {
						c = {
							id: "",
							type: o,
							title: "",
							url: e
						}, _.isNull(s) || _.isUndefined(s) ? t.model.chooseFirstLink(a, c) : t.model.chooseSecondLink(a, s, c)
					})
				},
				chooseOtherLink: function(e) {
					var t = this,
						i = $(e.target),
						n = i.parents(r),
						a = n.data("id"),
						o = n.find(d + ".active").data("id"),
						l = i.data("type"),
						c = {},
						p = i.parents(".dropdown").find(".dropdown-toggle");
					s.initialize({
						target: p,
						trigger: i,
						callback: function(e) {
							c = {
								id: "",
								type: "link" === l ? "url" : l,
								title: e,
								url: e
							}, _.isNull(o) || _.isUndefined(o) ? t.model.chooseFirstLink(a, c) : t.model.chooseSecondLink(a, o, c)
						}
					}), t.showCloseBtn(".popover-link-wrap", e.target)
				},
				chooseTxt: function(e) {
					var t = $(e.target),
						i = t.parents(r).find(".js-choose-image"),
						n = t.parents(r).find(".js-editor-image"),
						a = t.parents(".js-select-link").find(".js-editor-place");
					$(".js-editor-place").not(a).hide(), "none" === a.css("display") ? (a.show(), $(p).show().css({
						top: a.offset().top,
						left: a.offset().left
					}), i.size() > 0 && n.show().html('<img src="' + $("img", i).attr("src") + '" />')) : (a.hide(), n.hide(), $(p).hide()), $(window).off("resize").on("resize", function() {
						$(p).css({
							left: a.offset().left
						})
					}), this.showCloseBtn(p, e.target), this.chooseTxtEdit(e.target), this._toggleEditor(!0)
				},
				_toggleEditor: function(e) {
					e ? (window.ueditor.enable(), window.ueditor.iframe.style.visibility = "visible", this.$(".js-editor-image").html("")) : (window.ueditor.disable(), window.ueditor.iframe.style.visibility = "hidden")
				},
				chooseTxtEdit: function(e) {
					var t, i, n = this,
						a = $(e),
						s = a.parents(r).find(".js-editor-image"),
						o = a.parents(r),
						c = o.data("id"),
						p = o.find(d + ".active").data("id"),
						m = a.data("type"),
						u = _.isNull(p) || _.isUndefined(p) ? this.model.get("nav")[c].link_content : this.model.get("nav")[c].second[p].link_content;
					u = "undefined" == typeof u ? "" : u, u = u.replace(/\<br\s*\/?\>/gi, "\n");
					var h = window.EmoticonBot.decode(u, ".gif", !0);
					h = h.replace(/\r|\n/g, "<br />"), window.ueditor.setContent(h), window.ueditor.focus(!0), $("body").off("click", ".js-btn-save").on("click", ".js-btn-save", function() {
						if (i) n.chooseImage(e, i);
						else {
							var a = n.parse(UE.utils.trim(window.ueditor.getPlainTxtButLink()));
							a = UE.utils.html(a), t = {
								id: "",
								type: "txt" === m ? "text" : m,
								title: "",
								url: "",
								content: a
							}, n.model.chooseTxtEdit(t, c, p)
						}
					}), $("body").off("click", ".js-btn-close").on("click", ".js-btn-close", function() {
						a.trigger("click")
					}), window.NC.off("ueditorChooseImage").on("ueditorChooseImage", function(e) {
						e = e[0];
						var t = Math.ceil(e.size / 1024);
						return t > 1024 ? void l.errorNotify("最大支持 1 MB 的图片") : (i = e, s.show().html('<img src="' + _global.url.img + "/get?attachment_id=" + e.attachment_id + "&kdt_id=" + _global.kdt_id + '" />'), void n._toggleEditor(!1))
					})
				},
				chooseImage: function(e, t) {
					var i = $(e),
						n = i.parents(r),
						a = n.data("id"),
						s = n.find(d + ".active").data("id"),
						o = {
							id: t.attachment_id,
							type: "image",
							title: "",
							url: "",
							content: ""
						};
					this.model.chooseImage(o, a, s)
				}
			});
		return m
	}), define("text!templates/show.html", [], function() {
		return '<div class="nav-menu clearfix has-menu-<%= nav.length %>">\n    <i class="menu-ico"></i>\n    <% for (var i = 0; i < nav.length; i++) { %>\n        <div class="divide">&nbsp;</div>\n        <div class="one" data-id="<%= i %>">\n            <a class="mainmenu js-mainmenu"\n                <% if (nav[i].second.length > 0) { %>\n                    href="javascript:void(0);"\n                <% } else { %>\n                    <%\n                        var firstNav = nav[i],\n                            link_title = firstNav.link_title,\n                            link_type = firstNav.link_type,\n                            link_url = firstNav.link_url;\n                    %>\n\n                    <% if (link_type !== \'\' && link_type !== \'news\' && link_type !== \'text\' && link_type !== \'articles\' && link_type !== \'image\') { %>\n                        <% if (link_url !== \'\' && link_type !== \'search\' && link_type !== \'checkin\') { %>\n                            href="<%= link_url %>" target="_blank"\n                        <% } else { %>\n                            href="javascript:void(0);"\n                        <% } %>\n                    <% } else { %>\n                        href="javascript:void(0);"\n                    <% } %>\n                    <% if (link_type === \'text\') { %>\n                        data-type="text"\n                    <% } %>\n                    <% if (link_type === \'image\') { %>\n                        data-type="image"\n                    <% } %>\n                    <% if (link_type === \'news\') { %>\n                        data-type="news"\n                    <% } %>\n                    <% if (link_type === \'articles\') { %>\n                        data-type="articles"\n                    <% } %>\n                    <% if (link_type === \'search\') { %>\n                        data-type="search"\n                    <% } %>\n                    <% if (link_type === \'checkin\') { %>\n                        data-type="checkin"\n                    <% } %>\n\n                <% } %>\n            >\n                    <% if (nav[i].second.length > 0) { %>\n                        <i class="arrow-weixin"></i>\n                    <% } %>\n                    <span class="mainmenu-txt"><%= nav[i].title %></span>\n            </a>\n            <% if (nav[i].second.length > 0) { %>\n                <div class="submenu js-submenu">\n                    <span class="arrow before-arrow"></span>\n                    <span class="arrow after-arrow"></span>\n                    <ul>\n                        <% for (var n = 0; n < nav[i].second.length; n++) { %>\n                            <li>\n                                <a\n                                    class="js-submneu-a"\n                                    data-id="<%= n %>"\n                                    <%\n                                        var secondNav = nav[i].second[n],\n                                            link_title = secondNav.link_title,\n                                            link_type = secondNav.link_type,\n                                            link_url = secondNav.link_url;\n                                    %>\n\n                                    <% if (link_type !== \'\' && link_type !== \'news\' && link_type !== \'text\' && link_type !== \'image\') { %>\n                                        <% if (link_url !== \'\' && link_type !== \'search\' && link_type !== \'checkin\') { %>\n                                            href="<%= link_url %>" target="_blank"\n                                        <% } else { %>\n                                            href="javascript:void(0);"\n                                        <% } %>\n                                    <% } else { %>\n                                        href="javascript:void(0);"\n                                    <% } %>\n                                    <% if (link_type === \'text\') { %>\n                                        data-type="text"\n                                    <% } %>\n                                    <% if (link_type === \'image\') { %>\n                                        data-type="image"\n                                    <% } %>\n                                    <% if (link_type === \'news\') { %>\n                                        data-type="news"\n                                    <% } %>\n                                    <% if (link_type === \'search\') { %>\n                                        data-type="search"\n                                    <% } %>\n                                    <% if (link_type === \'checkin\') { %>\n                                        data-type="checkin"\n                                    <% } %>\n\n                                >\n                                    <%= nav[i].second[n].title %>\n                                </a>\n                            </li>\n                            <% if (n != nav[i].second.length-1) { %>\n                                <li class="line-divide"></li>\n                            <% } %>\n                        <% } %>\n                    </ul>\n                </div>\n            <% } %>\n        </div>\n    <% } %>\n</div>\n'
	}), define("text!templates/show_txt.html", [], function() {
		return '<div class="pre-item clearfix">\n	<div class="pre-avatar">\n        <img src="<%= _global.url.cdn_static %>/image/2.png" />\n    </div>\n	<div class="pre-content">\n        <span class="before-arrow"></span>\n        <span class="middle-arrow"></span>\n        <span class="after-arrow"></span>\n        <div class="content-inner">\n            <% if (link_type === \'text\') { %>\n                <%= window.EmoticonBot.decode(link_content, \'.png\', true).replace(/\\n/gi, \'<br />\') %>\n            <% } else if (link_type === \'search\') { %>\n                已进入搜索模式，请输入你要找的商品名。（退出搜索请输入“x”）\n            <% } else if (link_type === \'checkin\') { %>\n                签到成功！<br>您已连续签到 1 次。<br><br><a href="javascript:void(0);">&gt;点此查看规则</a>\n            <% } else if (link_type === \'image\') { %>\n	            <% if (link_id != 0) { %>\n	                <a href="<%= _global.url.img %>/get?attachment_id=<%= link_id %>" target="_blank">\n	                    <img alt="图片" width="100" src="<%= _global.url.img %>/get?attachment_id=<%= link_id %>&kdt_id=<%= _global.kdt_id %>">\n	                </a>\n	            <% } %>\n            <% } %>\n        </div>\n	</div>\n</div>\n'
	}), define("text!templates/show_news.html", [], function() {
		return '<%\n    var link_title = link_title.split(\'\\\\n\');\n%>\n<% if (link_title.length > 1) { %>\n    <div class="pre-item pre-multiple-news">\n        <div class="news-header">\n            <% if (link_news[0].cover_attachment_id != 0) { %>\n                <a class="news-pic loading js-news-pic" href="<%= link_news[0].url %>" target="_blank">\n                    <img width="100%" src="<%= _global.url.img %>/get?attachment_id=<%= link_news[0].cover_attachment_id %>&kdt_id=<%= _global.kdt_id %>">\n                </a>\n            <% } %>\n        </div>\n        <ul class="news-list">\n            <% for (var index in link_news) { %>\n                <% if (index != 0) { %>\n                    <li>\n                        <a href="<%= link_news[index].url %>" class="news-list-title new_window" target="_blank">\n                            <%= link_news[index].title %>\n                        </a>\n                        <% if (link_news[index].cover_attachment_id != 0) { %>\n                            <a class="news-list-pic js-news-list-pic" href="<%= link_news[index].url %>" target="_blank">\n                                <img width="100%" src="<%= _global.url.img %>/get?attachment_id=<%= link_news[index].cover_attachment_id %>&kdt_id=<%= _global.kdt_id %>">\n                            </a>\n                        <% } %>\n                    </li>\n                <% } %>\n            <% } %>\n        </ul>\n    </div>\n<% } else { %>\n    <div class="pre-item pre-single-news">\n        <div class="news-header">\n            <h4>\n                <a href="<%= link_news[0].url %>" target="_blank">\n                    <%= link_news[0].title %>\n                </a>\n            </h4>\n            <p class="meta"><%= link_news[0].created_time %></p>\n        </div>\n        <div class="news-content">\n            <% if (link_news[0].cover_attachment_id != 0) { %>\n                <a class="news-pic loading js-news-pic" href="<%= link_news[0].url %>" target="_blank">\n                    <img width="100%" src="<%= _global.url.img %>/get?attachment_id=<%= link_news[0].cover_attachment_id %>&kdt_id=<%= _global.kdt_id %>">\n                </a>\n            <% } %>\n            <div class="news-digest">\n                <%= link_news[0].digest %>\n            </div>\n        </div>\n        <div class="news-footer">\n            <a class="news-more clearfix" href="<%= link_news[0].url %>" target="_blank">\n                <em>阅读全文</em>\n                <i>›</i>\n            </a>\n        </div>\n    </div>\n<% } %>\n'
	}), define("views/show", ["require", "backbone", "views/base", "text!templates/show.html", "text!templates/show_txt.html", "text!templates/show_news.html"], function(e) {
		var t = (e("backbone"), e("views/base")),
			i = e("text!templates/show.html"),
			n = e("text!templates/show_txt.html"),
			a = e("text!templates/show_news.html"),
			s = t.extend({
				el: ".js-show-nav",
				template: _.template(i),
				events: {
					"click .js-mainmenu, .js-submneu-a": "clickMenu"
				},
				initialize: function() {
					this.listenTo(this.model, "change", this.render), this.listenTo(this.model, "change:allNav", this.render), this.render()
				},
				render: function() {
					var e = this.model.toJSON();
					this.$el.html(this.template(e))
				},
				clickMenu: function(e) {
					var t = this.model.toJSON(),
						i = $(".js-show-list"),
						s = $(e.target),
						o = s.parents(".one"),
						l = s.hasClass(".js-mainmenu") ? s : o.find(".js-mainmenu"),
						r = o.data("id"),
						d = s.data("id"),
						c = t.nav[r],
						p = l.data("type"),
						m = {};
					if ($(".js-submenu").hide(), "undefined" != typeof d && (c = c.second[d], p = s.data("type")), m = {
							link_id: c.link_id,
							link_title: c.link_title,
							link_type: c.link_type,
							link_url: c.link_url,
							link_news: c.link_news,
							link_content: c.link_content
						}, ("text" === p || "search" === p || "checkin" === p) && (i.append(_.template(n, m)), i.animate({
							scrollTop: i[0].scrollHeight
						})), "image" === p && (i.append(_.template(n, m)), i.animate({
							scrollTop: i[0].scrollHeight
						})), "news" === p || "articles" === p) {
						i.append(_.template(a, m)), i.animate({
							scrollTop: i[0].scrollHeight
						});
						var u = i.find(".js-news-pic:last");
						$("img", u).on("load", function() {
							var e = $(this),
								t = e.height(),
								i = u.height();
							e.css({
								top: (i - t) / 2 + "px"
							})
						})
					}
				}
			});
		return s
	}), define("views/edit", ["require", "backbone", "views/base", "views/nav", "views/show", "core/utils"], function(e) {
		var t = (e("backbone"), e("views/base")),
			i = e("views/nav"),
			n = e("views/show"),
			a = e("core/utils"),
			s = t.extend({
				el: ".app-sidebar",
				events: {
					"click .js-add-first": "addFirstNav"
				},
				initialize: function(e) {
					this.render(e)
				},
				render: function(e) {
					this.addFirst = new i(e), this.addShow = new n(e)
				},
				addFirstNav: function() {
					var e = this.$el.find(".js-first-nav-fields");
					e.find(".js-first-field").size() < 3 ? this.model.addFirstNav() : a.errorNotify("最多只能添加 3 个一级菜单。")
				}
			});
		return s
	}), define("app", ["require", "backbone", "collections/edit", "views/edit", "core/utils", "vendor/nprogress"], function(e) {
		var t = e("backbone"),
			i = e("collections/edit"),
			n = e("views/edit"),
			a = e("core/utils"),
			s = e("vendor/nprogress"),
			o = window._global,
			l = window.jQuery,
			r = window.UE,
			d = window._,
			c = {
				autoClearinitialContent: !1,
				wordCount: !0,
				elementPathEnabled: !1,
				maximumWords: 500,
				initialContent: "",
				initialFrameWidth: 296,
				initialFrameHeight: 120,
				autoHeightEnabled: !1,
				plainLink: !0,
				autoLink: !1,
				autoFloatEnabled: !1
			};
		(1 == o.team_status.weixin_server || 1 == o.team_status.weixin_oldsub) && window.location.pathname.indexOf("sinaweibo/menu") < 0 ? c.toolbars = [
			["emotion", "link", "chooseimage"]
		] : c.toolbars = [
			["emotion", "link"]
		], window.ueditor = r.getEditor("js-editor", c);
		var p = t.View.extend({
			el: ".app-design",
			events: {
				"click .js-submit": "save",
				"click .js-btn-confirm": "save",
				"click .js-mainmenu": "showSubmenu"
			},
			initialize: function() {
				var e = this;
				i.fetch({
					success: function(e) {
						0 === e.code ? 0 == e.data.valid ? (l("#no-menu").removeClass("hide"), s.done()) : 1 == e.data.valid ? l(".js-switch").switcher("on") : l(".js-switch").switcher("off") : (a.errorNotify("请求失败。"), s.done())
					}
				}), e.listenTo(i, "add", e.render), a.fixedButton(e, i), l("body").on("click", function() {
					l(".js-submenu:visible").hide(), l(".nav-on-top-hide").hide(), l(".js-open-navmenu .caret").removeClass("up-arrow")
				}), l("body").on("click", ".js-show-nav", function(e) {
					e.stopPropagation()
				}), l("body").on("click", ".js-submenu", function(e) {
					e.stopPropagation()
				}), l("body").on("click", ".js-switch", function() {
					e.switchNav(this)
				}), l("body").on("mouseover", ".js-first-field", function() {
					var e = l(this);
					e.find(".js-del-first").show(), e.addClass("hover")
				}).on("mouseout", ".js-first-field", function() {
					var e = l(this);
					e.find(".js-del-first").hide(), e.removeClass("hover")
				}), l("body").on("click", ".js-select-link a:not(.js-modal-txt)", function() {
					l(".js-editor-place").hide(), l(".js-editor-image").hide(), l(".js-editor-wrap").hide()
				})
			},
			render: function(e) {
				l(".js-app-board").show(), l(".js-app-design").show(), l(".app__content").removeClass("loading"), this.appEdit = new n({
					model: e,
					appView: this
				}), s.done(), this.sortable()
			},
			save: function(e) {
				this.$(".form-actions .js-submit").button("loading"), i.sync()
			},
			sortable: function() {
				var e = this;
				this.$(".js-first-nav-fields").sortable({
					axis: "y",
					cursor: "move",
					items: "> .js-first-field",
					handle: ".first-nav-field",
					placeholder: "sortable-placeholder",
					delay: 150,
					start: function(e, t) {
						t.item.data("startPos", t.item.index())
					},
					stop: function(t, n) {
						var a = n.item.data("startPos"),
							s = n.item.index();
						if (a !== s) {
							var o = [];
							d.each(i.at(0).get("nav"), function(e, t, i) {
								a > s ? t === s ? o.push(i[a]) : t > s && a >= t ? o.push(i[t - 1]) : o.push(e) : t === s ? o.push(i[a]) : s > t && t >= a ? o.push(i[t + 1]) : o.push(e)
							}), i.at(0).set("nav", o), e._changeId(), e.saveOrder()
						}
					}
				})
			},
			_changeId: function() {
				this.$(".js-first-nav-fields .js-first-field").each(function(e, t) {
					var i = l(t);
					i.data("id", e)
				})
			},
			showSubmenu: function(e) {
				var t = l(e.target),
					i = t.parents(".one"),
					n = t.hasClass(".js-mainmenu") ? t : i.find(".js-mainmenu"),
					a = i.find(".js-submenu"),
					s = a.find(".arrow"),
					o = (a.outerWidth() - n.outerWidth()) / 2,
					r = a.outerWidth() / 2;
				0 === a.size() ? l(".js-submenu:visible").hide() : (a.css({
					left: n.position().left - o
				}), s.css({
					left: r - s.outerWidth() / 2
				}), l(".js-submenu:visible").not(a).hide(), a.toggle())
			},
			switchNav: function(e) {
				var t = l(e),
					i = t.switcher("val") ? 0 : 1;
				t.switcher("loading"), l.ajax({
					url: window.location.pathname + "/switch.json",
					type: "PUT",
					data: {
						switch_to: i
					},
					dataType: "json",
					success: function(e) {
						0 === e.code ? 1 == i ? t.switcher("on") : 0 == i && t.switcher("off") : a.errorNotify(e.msg ? e.msg : "请求失败。")
					}
				}).always(function() {
					l(".js-first-field"), t.switcher("reset")
				}).fail(function() {
					a.errorNotify("系统错误。")
				})
			},
			saveOrder: function() {
				var e = i.at(0).get("nav");
				a.successNotify("正在更新保存排序"), l.ajax({
					url: window.location.pathname + "/order.json",
					type: "PUT",
					data: {
						menus: e
					},
					dataType: "json",
					success: function(e) {
						0 === e.code ? a.successNotify("保存排序成功") : a.errorNotify(e.msg ? e.msg : "请求失败。")
					}
				}).always(function() {}).fail(function() {
					a.errorNotify("系统错误。")
				})
			}
		});
		return {
			initialize: function(e) {
				return new p(e)
			}
		}
	}), define("text!templates/app.html", [], function() {
		return '<div class="app-preview">\n    <div class="app-entry">\n        <div class="app-header">\n            <div class="app-field">\n                <h5 class="title"><%= window._global.mp_data.mp_nickname || window._global.sinaweibo_info.name %></h5>\n            </div>\n        </div>\n        <div class="app-fields">\n            <div class="app-fields-inner js-show-list">\n\n            </div>\n        </div>\n        <div class="app-footer nav-on-bottom style-2 js-show-nav">\n\n        </div>\n    </div>\n</div>\n<div class="app-sidebar">\n    <div class="js-nav">\n        <div class="js-first-nav-fields">\n\n        </div>\n    </div>\n</div>\n<div class="pin"></div>\n<div class="app-actions">\n    <div style="position:relative;">\n        <div class="form-actions text-center">\n            <div>\n                <input class="btn btn-primary js-submit" type="submit" value="提交修改" data-loading-text="请稍候...">\n            </div>\n        </div>\n    </div>\n</div>\n'
	}), define("routers/router", ["require", "backbone", "app", "text!templates/app.html", "core/utils", "vendor/nprogress", "components/page_help/help"], function(e) {
		var t = e("backbone"),
			i = e("app"),
			n = e("text!templates/app.html"),
			a = (e("core/utils"), e("vendor/nprogress")),
			s = e("components/page_help/help"),
			o = t.Router.extend({
				routes: {
					"": "edit"
				},
				edit: function(e) {
					a.start(), window.AppEdit && window.AppEdit.remove(), $(".js-app-design").html(_.template(n)), $(".app__content").addClass("loading"), s("shop_menu"), window.AppEdit = i.initialize()
				}
			});
		return o
	}), define("core/reqres", ["require", "backbone", "backbone.wreqr"], function(e) {
		var t = e("backbone");
		e("backbone.wreqr");
		return window.RS ? window.RS : (window.RS = new t.Wreqr.RequestResponse, window.RS)
	}), define("text!components/image/2.0.0/templates/layout.html", [], function() {
		return '<div class="modal-header">\n    <a class="close" data-dismiss="modal">×</a>\n    <!-- 顶部tab -->\n    <ul class="module-nav modal-tab js-modal-tab">\n        <li class="js-modal-tab-item js-modal-tab-image active">\n            <a href="javascript:;" data-pane="image">用过的图片</a>\n            <span>|</span>\n        </li>\n        <li class="js-modal-tab-item js-modal-tab-icon">\n            <a href="javascript:;" data-pane="icon">图标库</a>\n            <span>|</span>\n        </li>\n        <li class="js-modal-tab-item js-modal-tab-upload">\n            <a href="javascript:;" data-pane="upload">新图片</a>\n        </li>\n    </ul>\n</div>\n<div class="tab-pane js-tab-pane js-tab-pane-image js-image-region"></div>\n<div class="tab-pane js-tab-pane js-tab-pane-icon js-icon-region hide"></div>\n<div class="tab-pane js-tab-pane js-tab-pane-upload js-upload-region hide"></div>\n\n'
	}), define("components/image/2.0.0/models/image_list", ["require", "components/list/models/list", "core/utils"], function(e) {
		var t, i = e("components/list/models/list"),
			n = e("core/utils");
		return t = n.isFenxiao() ? _global.url.fenxiao + "/showcase/attachment/alert.json?media_type=1&v=2" : _global.url.www + "/showcase/attachment/alert.json?media_type=1&v=2", i.extend({
			url: t,
			selectedModels: [],
			isSelected: function(e) {
				return _.some(this.selectedModels, function(t) {
					return t.get("attachment_id") === e.get("attachment_id")
				})
			},
			toggleSelected: function(e) {
				this.isSelected(e) ? (this.selectedModels = _.reject(this.selectedModels, function(t) {
					return t.get("attachment_id") === e.get("attachment_id")
				}), this.trigger("unselect", this.selectedModels.length, e)) : (this.selectedModels.push(e), this.trigger("select", this.selectedModels.length, e))
			},
			clean: function() {
				this.selectedModels = []
			},
			getSelectedImages: function() {
				return _.map(this.selectedModels, function(e) {
					return e.toJSON()
				})
			},
			parse: function(e) {
				var t = e.data_list;
				return e.page = e.page_view, delete e.data_list, delete e.page_view, this.get("items").reset(t, {
					silent: !0
				}), e
			}
		})
	}), define("components/image/2.0.0/views/image_item", ["require", "underscore", "core/reqres", "core/event", "core/utils", "components/list/views/list_item"], function(e) {
		var t = (e("underscore"), e("core/reqres")),
			i = e("core/event"),
			n = e("core/utils"),
			a = e("components/list/views/list_item");
		return a.extend({
			tagName: "li",
			className: function() {
				return " widget-image-item"
			},
			events: {
				click: "toggleSelect"
			},
			templateHelpers: {
				fullfillImage: n.fullfillImage
			},
			onBeforeRender: function() {
				this.appOptions = t.request("widget:image:app:options")
			},
			onRender: function() {
				this.$el.toggleClass("selected", this.isSelected())
			},
			toggleSelect: function() {
				var e = +this.model.get("attachment_size") || 0;
				return e && this.appOptions.maxSize < e ? (n.clearNotify(), void n.errorNotify("图片不能大于 " + this.appOptions.maxSizeText)) : this.appOptions.multiChoose ? (this.layout.model.toggleSelected(this.model), void this.$el.toggleClass("selected")) : void i.trigger("widget:image:select:finish", [this.model.toJSON()])
			},
			isSelected: function() {
				return this.layout.model.isSelected(this.model)
			}
		})
	}), define("components/image/2.0.0/views/image_filter", ["require", "underscore", "core/utils", "components/list/views/list_filter"], function(e) {
		var t = e("underscore"),
			i = (e("core/utils"), e("components/list/views/list_filter"));
		return i.extend({
			events: t.extend({}, i.prototype.events, {
				"click .js-refresh": "refresh"
			}),
			refresh: function() {
				this.model.fetch()
			}
		})
	}), define("components/image/2.0.0/views/image_footer", ["require", "underscore", "core/utils", "components/list/views/list_footer"], function(e) {
		var t = e("underscore"),
			i = (e("core/utils"), e("components/list/views/list_footer"));
		return i.extend({
			events: t.extend({}, i.prototype.events, {
				"click .js-choose-image": "chooseImage"
			}),
			modelEvents: {
				unselect: "select",
				select: "select"
			},
			onRender: function() {
				this.select(this.model.selectedModels.length)
			},
			select: function(e, t) {
				this.$(".js-choose-image").toggleClass("hide", !e)
			},
			chooseImage: function() {
				var e = this.model.getSelectedImages();
				e && e.length && window.NC.trigger("widget:image:select:finish", e)
			}
		})
	}), define("text!components/image/2.0.0/templates/image.html", [], function() {
		return '<div class="modal-body">\n\n    <div class="js-list-filter-region clearfix ui-box" style="position: relative; min-height: 28px;">\n\n    </div>\n\n    <div class="ui-box">\n        <ul class="js-list-body-region widget-image-list"></ul>\n        <div class="js-list-empty-region"></div>\n    </div>\n\n</div>\n<div class="modal-footer js-list-footer-region">\n\n</div>\n'
	}), define("text!components/image/2.0.0/templates/image_item.html", [], function() {
		return '<div class="js-choose" title="<%= attachment_title %>">\n    <p class="image-size"><%= attachment_title.slice(0, 5) %><br><%= (attachment_size / 1000).toFixed(1) %> KB</p>\n    <div class="widget-image-item-content" style="background-image: url(<%= fullfillImage(thumb_url) %>)"></div>\n    <% if(+width && +height) { %>\n    <div class="widget-image-meta">\n        <%= width + \'x\' + height %>\n    </div>\n    <% } %>\n    <div class="selected-style"><i class="icon-ok icon-white"></i></div>\n</div>\n'
	}), define("text!components/image/2.0.0/templates/image_filter.html", [], function() {
		return '<div class="widget-image-refresh">\n    <span>点击图片即可选中</span>\n    <a href="javascript:;" class="js-refresh">刷新</a>\n</div>\n<div class="js-list-search ui-search-box">\n    <input class="txt" type="text" placeholder="搜索" value="<%= keyword %>">\n</div>\n'
	}), define("text!components/image/2.0.0/templates/image_footer.html", [], function() {
		return '<div class="pull-left">\n    <a href="javascript:;" class="ui-btn ui-btn-primary js-choose-image hide">确定使用</a>\n</div>\n<div class="pagenavi"><%= page %></div>\n'
	}), define("components/image/2.0.0/views/image", ["require", "underscore", "core/utils", "components/list/views/list", "components/image/2.0.0/models/image_list", "components/image/2.0.0/views/image_item", "components/image/2.0.0/views/image_filter", "components/image/2.0.0/views/image_footer", "text!components/image/2.0.0/templates/image.html", "text!components/image/2.0.0/templates/image_item.html", "text!components/image/2.0.0/templates/image_filter.html", "text!components/image/2.0.0/templates/image_footer.html"], function(e) {
		var t = e("underscore"),
			i = (e("core/utils"), e("components/list/views/list"));
		return i.extend({
			defaults: {
				ListModel: e("components/image/2.0.0/models/image_list"),
				ListItemView: e("components/image/2.0.0/views/image_item"),
				ListFilterView: e("components/image/2.0.0/views/image_filter"),
				ListFooterView: e("components/image/2.0.0/views/image_footer"),
				listTemplate: t.template(e("text!components/image/2.0.0/templates/image.html")),
				listItemTemplate: t.template(e("text!components/image/2.0.0/templates/image_item.html")),
				listFilterTemplate: t.template(e("text!components/image/2.0.0/templates/image_filter.html")),
				listFooterTemplate: t.template(e("text!components/image/2.0.0/templates/image_footer.html"))
			},
			clean: function() {
				this.model.clean()
			},
			setHash: function() {}
		})
	}), define("components/image/2.0.0/models/icon_list", ["require", "components/image/2.0.0/models/image_list"], function(e) {
		var t = e("components/image/2.0.0/models/image_list");
		return t.extend({
			url: _global.url.www + "/common/ironDb/list.json",
			defaults: _.extend({}, t.prototype.defaults, {
				style: "0",
				color: "0",
				image_type: "0"
			}),
			parse: function(e) {
				var t = e.list;
				return delete e.list, this.get("items").reset(t, {
					silent: !0
				}), e
			}
		})
	}), define("components/image/2.0.0/views/icon_filter", ["require", "underscore", "core/utils", "components/list/views/list_filter"], function(e) {
		var t = e("underscore"),
			i = e("core/utils"),
			n = e("components/list/views/list_filter");
		return n.extend({
			events: t.extend({}, n.prototype.events, {
				"change input": "filter"
			}),
			updateModel: i.updateModel,
			filter: function(e) {
				this.model.set("p", 1, {
					silent: !0
				}), this.updateModel(e), this.render(), this.refresh()
			},
			refresh: function() {
				this.model.fetch()
			}
		})
	}), define("text!components/image/2.0.0/templates/icon_filter.html", [], function() {
		return '<div class="widget-image-filter">\n    <span class="c-gray">风格: </span>\n    <label class="radio inline <%= style == 0 ? \'checked\' : \'\' %>">\n        <input type="radio" name="style" value="0" <%= style == 0 ? \'checked\' : \'\' %>>\n        <span>全部</span>\n    </label>\n    <label class="radio inline <%= style == 1 ? \'checked\' : \'\' %>">\n        <input type="radio" name="style" value="1" <%= style == 1 ? \'checked\' : \'\' %>>\n        <span>普通</span>\n    </label>\n    <label class="radio inline <%= style == 2 ? \'checked\' : \'\' %>">\n        <input type="radio" name="style" value="2" <%= style == 2 ? \'checked\' : \'\' %>>\n        <span>简约</span>\n    </label>\n</div>\n<div class="widget-image-filter">\n    <span class="c-gray">颜色: </span>\n    <label class="radio inline <%= color == 0 ? \'checked\' : \'\' %>">\n        <input type="radio" name="color" value="0" <%= color == 0 ? \'checked\' : \'\' %>>\n        <span>全部</span>\n    </label>\n    <label class="radio inline <%= color == 1 ? \'checked\' : \'\' %>">\n        <input type="radio" name="color" value="1" <%= color == 1 ? \'checked\' : \'\' %>>\n        <span>白色</span>\n    </label>\n    <label class="radio inline <%= color == 2 ? \'checked\' : \'\' %>">\n        <input type="radio" name="color" value="2" <%= color == 2 ? \'checked\' : \'\' %>>\n        <span>灰色</span>\n    </label>\n</div>\n<div class="widget-image-filter">\n    <span class="c-gray">类型: </span>\n    <label class="radio inline <%= image_type == 0 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="0" <%= image_type == 0 ? \'checked\' : \'\' %>>\n        <span>全部</span>\n    </label>\n    <label class="radio inline <%= image_type == 1 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="1" <%= image_type == 1 ? \'checked\' : \'\' %>>\n        <span>常规</span>\n    </label>\n    <label class="radio inline <%= image_type == 2 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="2" <%= image_type == 2 ? \'checked\' : \'\' %>>\n        <span>购物</span>\n    </label>\n    <label class="radio inline <%= image_type == 3 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="3" <%= image_type == 3 ? \'checked\' : \'\' %>>\n        <span>交通</span>\n    </label>\n    <label class="radio inline <%= image_type == 4 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="4" <%= image_type == 4 ? \'checked\' : \'\' %>>\n        <span>商务</span>\n    </label>\n    <label class="radio inline <%= image_type == 5 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="5" <%= image_type == 5 ? \'checked\' : \'\' %>>\n        <span>食物</span>\n    </label>\n    <label class="radio inline <%= image_type == 6 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="6" <%= image_type == 6 ? \'checked\' : \'\' %>>\n        <span>娱乐</span>\n    </label>\n    <label class="radio inline <%= image_type == 7 ? \'checked\' : \'\' %>">\n        <input type="radio" name="image_type" value="7" <%= image_type == 7 ? \'checked\' : \'\' %>>\n        <span>美妆</span>\n    </label>\n</div>\n\n\n'
	}), define("components/image/2.0.0/views/icon", ["require", "underscore", "core/utils", "components/image/2.0.0/views/image", "components/image/2.0.0/models/icon_list", "components/image/2.0.0/views/image_item", "components/image/2.0.0/views/icon_filter", "components/image/2.0.0/views/image_footer", "text!components/image/2.0.0/templates/image.html", "text!components/image/2.0.0/templates/image_item.html", "text!components/image/2.0.0/templates/icon_filter.html", "text!components/image/2.0.0/templates/image_footer.html"], function(e) {
		var t = e("underscore"),
			i = (e("core/utils"), e("components/image/2.0.0/views/image"));
		return i.extend({
			defaults: {
				ListModel: e("components/image/2.0.0/models/icon_list"),
				ListItemView: e("components/image/2.0.0/views/image_item"),
				ListFilterView: e("components/image/2.0.0/views/icon_filter"),
				ListFooterView: e("components/image/2.0.0/views/image_footer"),
				listTemplate: t.template(e("text!components/image/2.0.0/templates/image.html")),
				listItemTemplate: t.template(e("text!components/image/2.0.0/templates/image_item.html")),
				listFilterTemplate: t.template(e("text!components/image/2.0.0/templates/icon_filter.html")),
				listFooterTemplate: t.template(e("text!components/image/2.0.0/templates/image_footer.html"))
			}
		})
	}), define("text!components/image/2.0.0/templates/upload.html", [], function() {
		return '<div class="js-upload-network-region"></div>\n<div class="js-upload-local-region"></div>'
	}), define("text!components/image/2.0.0/templates/upload_network.html", [], function() {
		return '<div class="modal-body">\n    <div class="get-web-img js-get-web-img">\n        <form class="form-horizontal" onsubmit="return false;">\n            <div class="control-group">\n                <label class="control-label">网络图片：</label>\n                <div class="controls">\n                    <input type="text" name="attachment_url" class="get-web-img-input js-web-img-input" placeholder="请贴入网络图片地址" value="<%= attachment_url %>">\n                    <input type="button" class="btn js-upload-network-img" data-loading-text="提取中..." value="提取">\n                </div>\n                <div class="controls preview-container">\n                    <% if(attachment_url) { %>\n                        <img src="<%= attachment_url %>" alt="">\n                    <% } %>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>\n'
	}), define("components/image/2.0.0/models/upload_network", ["require", "underscore", "backbone", "core/utils"], function(e) {
		var t = (e("underscore"), e("backbone")),
			i = e("core/utils");
		return t.Model.extend({
			url: window._global.url.img + "/download?format=json",
			defaults: {
				attachment_url: "",
				media_type: "image",
				v: 2,
				mp_id: window._global.kdt_id
			},
			sync: function() {
				return i.ajax({
					url: this.url,
					type: "POST",
					data: this.toJSON(),
					xhrFields: {
						withCredentials: !0
					}
				})
			}
		})
	}), define("components/image/2.0.0/views/upload_network", ["require", "underscore", "backbone", "marionette", "core/reqres", "core/event", "core/utils", "text!components/image/2.0.0/templates/upload_network.html", "components/image/2.0.0/models/upload_network"], function(e) {
		var t = e("underscore"),
			i = (e("backbone"), e("marionette")),
			n = e("core/reqres"),
			a = e("core/event"),
			s = e("core/utils"),
			o = e("text!components/image/2.0.0/templates/upload_network.html"),
			l = e("components/image/2.0.0/models/upload_network");
		return i.ItemView.extend({
			template: t.template(o),
			ui: {
				upload: ".js-upload-network-img"
			},
			events: {
				"blur .js-web-img-input": "updateModel",
				"click @ui.upload": "uploadNetworkImage"
			},
			updateModel: s.updateModel,
			initialize: function() {
				this.model = new l
			},
			onBeforeRender: function() {
				this.appOptions = n.request("widget:image:app:options")
			},
			uploadNetworkImage: function(e) {
				if (!this.model.get("attachment_url")) return void this.$(".js-web-img-input").eq(0).focus();
				var t = this;
				this.render(), this.ui.upload.button("loading"), this.model.sync().always(function() {
					t.ui.upload.button("reset")
				}).done(function(e) {
					var i = e.success;
					return i ? i.attachment_size > t.appOptions.maxSize ? (s.clearNotify(), void s.errorNotify("图片不能大于 " + t.appOptions.maxSizeText)) : void a.trigger("widget:image:select:finish", [i]) : void s.errorNotify("出错了，请重试")
				}).fail(function() {
					s.errorNotify("出错了，请检查网络图片地址")
				})
			}
		})
	}), define("text!components/image/2.0.0/templates/upload_local.html", [], function() {
		return '<div class="modal-body">\n    <div class="upload-local-img">\n        <form class="form-horizontal">\n            <div class="control-group">\n                <label class="control-label">本地图片：</label>\n                <div class="controls">\n                    <div class="control-action">\n                        <ul class="js-upload-image-list upload-image-list clearfix ui-sortable">\n                            <li class="fileinput-button js-add-image">\n                                <a class="fileinput-button-icon" href="javascript:;">+</a>\n                                <input class="js-fileupload-input fileupload" type="file" <%= multiUpload ? \'multiple\' : \'\' %>>\n                            </li>\n                        </ul>\n                        <p class="help-desc">最大支持 <%= maxSizeText %> 的图片( jpg / gif / png )，不能选中大于 <%= maxSizeText %> 的图片</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </form>\n</div>\n<div class="modal-footer">\n    <div class="modal-action pull-right">\n        <input type="button" class="btn btn-primary js-upload-image" data-loading-text="上传中..." value="确定上传">\n    </div>\n</div>\n'
	}), define("components/image/2.0.0/collections/upload_local", ["require", "underscore", "jquery", "core/reqres", "backbone", "core/utils"], function(e) {
		var t = (e("underscore"), e("jquery")),
			i = e("core/reqres"),
			n = e("backbone"),
			a = e("core/utils");
		return n.Collection.extend({
			url: "//up.qbox.me",
			sync: function() {
				var e = this,
					n = t.Deferred();
				return this.appOptions = i.request("widget:image:app:options"), this.getToken().done(function(t) {
					e.upload(t.uptoken).done(function() {
						n.resolve()
					}).fail(function() {
						n.reject()
					})
				}).fail(function(e) {
					n.reject(e || "获取token失败，请重试")
				}), n.promise()
			},
			getToken: function() {
				return a.ajax({
					url: this.appOptions.uploadURL,
					type: "POST",
					dataType: this.appOptions.dataType,
					data: {
						kdt_id: window._global.kdt_id,
						scope: this.appOptions["private"] ? _global.js.qn_private : _global.js.qn_public
					}
				})
			},
			upload: function(e) {
				var i = this,
					n = this.map(function(n) {
						var s = new FormData;
						return s.append("token", e), s.append("file", n.get("file")), a.ajax({
							url: i.url,
							type: "POST",
							data: s,
							processData: !1,
							contentType: !1,
							xhr: function() {
								var e = t.ajaxSettings.xhr();
								return e.upload.addEventListener("progress", function(e) {
									n.trigger("upload:progress", Math.ceil(e.loaded / e.total * 100))
								}, !1), e
							}
						}).done(function(e) {
							n.set("image", e)
						})
					});
				return t.when.apply(null, n)
			},
			swapImages: function(e, t) {
				var i = this.models,
					n = i.splice(e, 1)[0];
				return i.splice(t, 0, n), i
			}
		})
	}), define("text!components/image/2.0.0/templates/upload_local_item.html", [], function() {
		return '<img src="<%= src %>">\n<a href="javascript:;" class="close-modal small js-remove-image">×</a>\n'
	}), define("components/image/2.0.0/views/upload_local_item", ["require", "underscore", "backbone", "marionette", "core/utils", "text!components/image/2.0.0/templates/upload_local_item.html"], function(e) {
		var t = e("underscore"),
			i = (e("backbone"), e("marionette")),
			n = (e("core/utils"), e("text!components/image/2.0.0/templates/upload_local_item.html"));
		return i.ItemView.extend({
			tagName: "li",
			template: t.template(n),
			className: "upload-preview-img sort",
			events: {
				"click .js-remove-image": "removeImage"
			},
			modelEvents: {
				"upload:progress": "progress"
			},
			removeImage: function() {
				this.model.destroy()
			},
			progress: function(e) {}
		})
	}), define("components/image/2.0.0/views/upload_local", ["require", "underscore", "core/reqres", "core/event", "marionette", "core/utils", "jqueryui", "text!components/image/2.0.0/templates/upload_local.html", "components/image/2.0.0/collections/upload_local", "components/image/2.0.0/views/upload_local_item"], function(e) {
		var t = e("underscore"),
			i = e("core/reqres"),
			n = e("core/event"),
			a = e("marionette"),
			s = e("core/utils");
		e("jqueryui");
		var o = e("text!components/image/2.0.0/templates/upload_local.html"),
			l = e("components/image/2.0.0/collections/upload_local"),
			r = e("components/image/2.0.0/views/upload_local_item");
		return a.CompositeView.extend({
			template: t.template(o),
			itemView: r,
			itemViewContainer: ".js-upload-image-list",
			events: {
				"change .js-fileupload-input": "selectFile",
				"click .js-upload-image": "upload"
			},
			initialize: function() {
				this.collection = new l, this.appOptions = i.request("widget:image:app:options"), this.listenTo(this.collection, "add remove reset sort", this.toggleAddBtn)
			},
			serializeData: function() {
				return this.appOptions
			},
			onRender: function() {
				var e = this;
				return this.$(".js-upload-image-list").sortable({
					items: "> .sort",
					cursor: "move",
					start: function(e, t) {
						t.item.data("startPos", t.item.index())
					},
					stop: function(t, i) {
						var n = i.item.data("startPos"),
							a = i.item.index();
						n !== a && e.collection.swapImages(n, a)
					}
				}), this
			},
			selectFile: function(e) {
				var i = e.target.files,
					n = this;
				t.each(i, function(e) {
					e.size > n.appOptions.maxSize || e.name.match(/(\.|\/)(gif|jpe?g|png)$/i) && n.previewAndAdd(e)
				}), $(e.target).val("")
			},
			previewAndAdd: function(e) {
				var t = new FileReader,
					i = this;
				t.onload = function(t) {
					i.collection.add({
						src: t.target.result,
						file: e
					})
				}, t.readAsDataURL(e)
			},
			upload: function(e) {
				if (0 !== this.collection.length) {
					var t = this,
						i = $(e.target);
					i.button("loading"), this.collection.sync().done(function() {
						s.successNotify("上传成功");
						var e = t.collection.map(function(e) {
							return e.get("image")
						});
						n.trigger("widget:image:select:finish", e)
					}).fail(function(e) {
						i.button("reset"), s.errorNotify(e || "上传失败，请重试"), n.trigger("widget:image:select:error", e)
					})
				}
			},
			toggleAddBtn: function() {
				this.appOptions.multiUpload || this.$(".js-add-image").toggleClass("hide", this.collection.length > 0)
			},
			appendBuffer: function(e, t) {
				e.$(".fileinput-button").before(t)
			},
			appendHtml: function(e, t) {
				e.isBuffering ? (e.elBuffer.appendChild(t.el), e._bufferedChildren.push(t)) : e.$(".fileinput-button").before(t.el)
			}
		})
	}), define("components/image/2.0.0/views/upload", ["require", "underscore", "core/reqres", "core/event", "marionette", "core/utils", "text!components/image/2.0.0/templates/upload.html", "components/image/2.0.0/views/upload_network", "components/image/2.0.0/views/upload_local"], function(e) {
		var t = e("underscore"),
			i = e("core/reqres"),
			n = (e("core/event"), e("marionette")),
			a = (e("core/utils"), e("text!components/image/2.0.0/templates/upload.html")),
			s = e("components/image/2.0.0/views/upload_network"),
			o = e("components/image/2.0.0/views/upload_local");
		return n.Layout.extend({
			template: t.template(a),
			regions: {
				networkRegion: ".js-upload-network-region",
				localRegion: ".js-upload-local-region"
			},
			initialize: function(e) {
				this.options = e || {}
			},
			onBeforeRender: function() {
				this.appOptions = i.request("widget:image:app:options")
			},
			onRender: function() {
				this.appOptions.hideDownload ? this.networkRegion.close() : this.networkRegion.show(new s), this.localRegion.show(new o)
			},
			clean: function() {}
		})
	}), define("components/image/2.0.0/views/layout", ["require", "underscore", "core/reqres", "core/event", "marionette", "core/utils", "text!components/image/2.0.0/templates/layout.html", "components/image/2.0.0/views/image", "components/image/2.0.0/views/icon", "components/image/2.0.0/views/upload"], function(e) {
		var t = e("underscore"),
			i = e("core/reqres"),
			n = e("core/event"),
			a = e("marionette"),
			s = (e("core/utils"), e("text!components/image/2.0.0/templates/layout.html")),
			o = e("components/image/2.0.0/views/image"),
			l = e("components/image/2.0.0/views/icon"),
			r = e("components/image/2.0.0/views/upload"),
			d = {
				multiChoose: !0,
				multiUpload: !0,
				onlyUpload: !1,
				tabActive: "image",
				maxSize: 1024,
				hideDownload: !1,
				hideIconList: !1,
				uploadURL: _global.url.www + "/common/qiniu/upToken.json",
				dataType: void 0,
				"private": !1,
				callback: function() {}
			};
		return a.Layout.extend({
			className: "widget-image modal fade hide",
			template: t.template(s),
			regions: {
				imageRegion: ".js-image-region",
				iconRegion: ".js-icon-region",
				uploadRegion: ".js-upload-region"
			},
			events: {
				"click .js-modal-tab-item a": "switchTab"
			},
			initialize: function(e) {
				var t = this;
				this.setOptions(e), this.listenTo(n, "widget:image:select:finish", this.chooseImages), this.listenTo(n, "widget:image:select:error", this.chooseImagesError), i.setHandler("widget:image:app:options", function() {
					return t.options
				}), this.render()
			},
			setOptions: function(e) {
				e = e || {}, this.options = t.extend({}, d, e), this.options.onlyUpload && (this.options.tabActive = "upload"), void 0 === e.multiUpload && (this.options.multiUpload = this.options.multiChoose);
				var i = +this.options.maxSize;
				i % 1024 === 0 ? this.options.maxSizeText = i / 1024 + " MB" : this.options.maxSizeText = i + " KB", this.options.maxSize = 1024 * this.options.maxSize
			},
			show: function() {
				this.$el.modal("show"), this.cleanViews(), this.renderTab(), this.renderViews()
			},
			cleanViews: function() {
				this.imageView && this.imageView.clean(), this.iconView && this.iconView.clean(), this.uploadView && this.uploadView.clean()
			},
			renderViews: function() {
				this.options.onlyUpload || (this.renderImageView(), this.renderIconView()), this.renderUploadView()
			},
			renderImageView: function() {
				this.imageView || (this.imageView = new o), this.imageRegion.show(this.imageView)
			},
			renderIconView: function() {
				this.options.hideIconList || (this.iconView || (this.iconView = new l), this.iconRegion.show(this.iconView))
			},
			renderUploadView: function() {
				this.uploadView || (this.uploadView = new r), this.uploadRegion.show(this.uploadView)
			},
			renderTab: function() {
				this.options.onlyUpload ? (this.$(".js-modal-tab-item").addClass("hide"), this.$(".js-modal-tab-upload").removeClass("hide")) : (this.$(".js-modal-tab-item").removeClass("hide"), this.$(".js-modal-tab-icon").toggleClass("hide", this.options.hideIconList));
				var e = this.options.tabActive.toLowerCase();
				this._switchTab(e)
			},
			switchTab: function(e) {
				var t = $(e.currentTarget),
					i = t.data("pane");
				this._switchTab(i)
			},
			_switchTab: function(e) {
				this.$(".js-modal-tab-item").removeClass("active"), this.$(".js-modal-tab-" + e).addClass("active"), this.$(".js-tab-pane").addClass("hide"), this.$(".js-tab-pane-" + e).removeClass("hide")
			},
			chooseImages: function(e) {
				this.options.callback(e), this.$el.modal("hide")
			},
			chooseImagesError: function(e) {
				this.options.onFail && this.options.onFail(e)
			}
		})
	}), define("components/image/2.0.0/app", ["require", "components/image/2.0.0/views/layout"], function(e) {
		var t = e("components/image/2.0.0/views/layout");
		return {
			widget: "image",
			version: "2.0.0",
			initialize: function(e) {
				this._initialized ? this._app.setOptions(e) : (this._initialized = !0, this._app = new t(e)), this._app.show()
			}
		}
	}), define("text!components/ueditor_plugins/emotion/templates/normal.html", [], function() {
		return '<% for(var i=1,len=sum,pos;i<=len;i++){ %>\n    <div><span class="<%= wrapClass %>" style="background-position:left <%= (i-1)*(-35)%>px" data-imgSrc="<%=imgFolder%><%=imgName%><%= i= i<10 ? \'0\'+i:i %>.gif" data-pos="<%= pos=i%12<=6 ? \'posRight\' : \'posLeft\' %>"></span></div>\n<%};%>'
	}), define("text!components/ueditor_plugins/emotion/templates/pp.html", [], function() {
		return '<% for(var i=1,len=sum,pos;i<=len;i++){ %>\n    <div><span class="<%= wrapClass %>" style="background-position:left <%= (i-1)*(-25)%>px" data-imgSrc="<%=imgFolder%><%=imgName%><%= i= i<10 ? \'0\'+i:i %>.gif" data-pos="<%= pos=i%15<=6 ? \'posRight\' : \'posLeft\' %>"></span></div>\n<%};%>'
	}), define("text!components/ueditor_plugins/emotion/templates/qq.html", [], function() {
		return '<% for(var i=1,len=sum,pos;i<=len;i++){ %>\n    <div><span class="<%= wrapClass %>" style="background-position:<%= (i-1)*(-24)%>px 50%" data-imgSrc="<%=imgFolder%><%=imgName%><%= i= i<10 ? \'0\'+i:i %>.gif" data-pos="<%= pos=i%15<=6 ? \'posRight\' : \'posLeft\' %>"></span></div>\n<%};%>'
	}), define("tpl!components/ueditor_plugins/emotion/templates/app", [], function() {
		return function(obj) {
			var __p = "";
			Array.prototype.join;
			with(obj || {}) __p += '<div class="ui-popover-inner">\n    <div class="wrapper">\n        <div class="emotion-close js-emotion-close">X</div>\n        <div class="emotion-head"></div>\n        <div class="emotion-content"></div>\n    </div>\n    <div class="emotion-tabIconReview">\n        <img class=\'emotion-faceReview\'/>\n    </div>\n</div>\n';
			return __p
		}
	}), define("components/ueditor_plugins/emotion/app", ["require", "underscore", "jquery", "components/popover/_base/app", "text!./templates/normal.html", "text!./templates/pp.html", "text!./templates/qq.html", "tpl!./templates/app"], function(e) {
		var t = e("underscore"),
			i = e("jquery"),
			n = e("components/popover/_base/app"),
			a = e("text!./templates/normal.html"),
			s = e("text!./templates/pp.html"),
			o = e("text!./templates/qq.html");
		return n.extend({
			className: "ui-popover widget-ueditor-emotion",
			template: e("tpl!./templates/app"),
			events: {
				"click  .emotion-head span": "tabIndex",
				"mouseenter .emotion-list-wrapper span": "showImg",
				"mouseleave .emotion-list-wrapper": "hideImg",
				"click .emotion-list-wrapper span": "selectImg",
				"click .js-emotion-close": "popClose"
			},
			initialize: function(e) {
				e = e || {};
				var i = e.tabs || ["Choice", "Tuzki", "Lvdouwa", "Bobo", "BabyCat", "Bubble", "Youa", "Qq"];
				this.showViews = {
					Choice: e.ChoiceName || {
						name: "精选",
						whichTpl: "normal",
						tplInfo: "Choice"
					},
					Tuzki: e.TuzkiName || {
						name: "兔斯基",
						whichTpl: "normal",
						tplInfo: "Tuzki"
					},
					Lvdouwa: e.LvdouwaName || {
						name: "绿豆蛙",
						whichTpl: "normal",
						tplInfo: "Lvdouwa"
					},
					Bobo: e.BoboName || {
						name: "波波",
						whichTpl: "normal",
						tplInfo: "Bobo"
					},
					BabyCat: e.BabyCatName || {
						name: "北鼻猫",
						whichTpl: "normal",
						tplInfo: "BabyCat"
					},
					Bubble: e.BubbleName || {
						name: "泡泡",
						whichTpl: "pp",
						tplInfo: "Bubble"
					},
					Youa: e.YouaName || {
						name: "有啊",
						whichTpl: "normal",
						tplInfo: "Youa"
					},
					Qq: e.QqName || {
						name: "QQ",
						whichTpl: "qq",
						tplInfo: "Qq"
					}
				}, this.finallShowViews = t.pick(this.showViews, i), this.tpl_map = {
					normal: e.normal || a,
					pp: e.ppTpl || s,
					qq: e.qqTpl || o
				}, this.finallTpl = t.extend(this.tpl_map, e.addTpl), this.tplInfo = {
					Choice: e.ChoiceTplInfo || {
						wrapClass: "jd",
						sum: 84,
						imgFolder: "jx2/",
						imgName: "j_00"
					},
					Tuzki: e.TuzkiTplInfo || {
						wrapClass: "tsj",
						sum: 40,
						imgFolder: "tsj/",
						imgName: "t_00"
					},
					Lvdouwa: e.LvdouwaTplInfo || {
						wrapClass: "ldw",
						sum: 52,
						imgFolder: "ldw/",
						imgName: "w_00"
					},
					Bobo: e.Bobo || {
						wrapClass: "bb",
						sum: 63,
						imgFolder: "bobo/",
						imgName: "b_00"
					},
					BabyCat: e.BabyCat || {
						wrapClass: "cat",
						sum: 20,
						imgFolder: "babycat/",
						imgName: "C_00"
					},
					Bubble: e.Bubble || {
						wrapClass: "pp",
						sum: 50,
						imgFolder: "face/",
						imgName: "i_f_"
					},
					Youa: e.Youa || {
						wrapClass: "youa",
						sum: 44,
						imgFolder: "youa/",
						imgName: "y_00"
					},
					Qq: e.Qq || {
						wrapClass: "qq",
						sum: 105,
						imgFolder: "qq/",
						imgName: ""
					}
				}, this.finallTplInfo = t.extend(this.tplInfo, e.addInfo);
				var l = t.size(this.finallShowViews);
				this.instanceActive(l), n.prototype.initialize.apply(this, arguments)
			},
			onRender: function() {
				this.initialFirst()
			},
			instanceActive: function(e) {
				this.instance = [!0];
				for (var t = 0; e > t; t++) this.instance.push(!1)
			},
			initialFirst: function() {
				var e = this;
				t.each(this.finallShowViews, function(t) {
					e.$(".emotion-head").append('<span class="tag tag-big"  data-view="' + t.whichTpl + '" data-info="' + t.tplInfo + '">' + t.name + "</span>"), e.$(".emotion-content").append('<div class="emotion-list-wrapper hide clearfix"></div>')
				}), e.$(".emotion-head").find("span").eq(0).addClass("tag-green");
				var i = e.$(".emotion-head").find("span").eq(0).data("view"),
					n = e.$(".emotion-head").find("span").eq(0).data("info");
				e.$(".emotion-content > div").eq(0).html(e.renderView(i, n)).show()
			},
			renderView: function(e, i) {
				var n = this;
				return t.template(n.finallTpl[e], n.finallTplInfo[i])
			},
			tabIndex: function(e) {
				var t = this,
					n = i(e.target),
					a = n.data("view"),
					s = n.data("info"),
					o = n.index();
				n.addClass("tag-green").siblings("span").removeClass("tag-green"), t.showSwitch(o, a, s)
			},
			showSwitch: function(e, t, i) {
				var n = this;
				n.$(".emotion-content > div").eq(e).show().siblings("div").hide(), n.instance[e] || (n.instance[e] = !0, n.$(".emotion-content > div").eq(e).html(n.renderView(t, i)))
			},
			showImg: function(e) {
				var t = i(e.target),
					n = t.data("imgsrc"),
					a = t.data("pos"),
					s = "posRight" == a ? "posLeft" : "posRight",
					o = this.$(".emotion-tabIconReview").children("img");
				this.showPop(a, s);
				var l = window._global.url.cdn_static;
				l = l.replace(/^\/\//, "https://"), this.imgSrc = l + "/image/ueditor_emotion/" + n, o.attr("style", "background-image:url(" + this.imgSrc + ")")
			},
			showPop: function(e, t) {
				var i = this.$(".emotion-tabIconReview");
				i.removeClass(t).addClass(e).show()
			},
			hideImg: function() {
				var e = this.$(".emotion-tabIconReview");
				e.hide()
			},
			selectImg: function() {
				return this.close(), this.options.callback(this.imgSrc)
			},
			popClose: function() {
				this.close()
			}
		})
	}), define("text!components/ueditor_plugins/video/templates/app.html", [], function() {
		return '<div class="modal-header">\n    <a class="close" data-dismiss="modal">×</a>\n    <h4>视频插入视频</h4>\n</div>\n<div class="modal-body">\n    <div class="video-content">\n        <strong>为了在微信中有更好的体验，推荐使用<a href="http://v.qq.com" target="_blank">腾讯视频</a>。</strong>\n        <div>\n            <p>\n                <label for="videoUrl">视频地址</label>\n                <input type="text" id="videoUrl" placeholder="复制视频地址到这里">\n            </p>\n        </div>\n        <div id="preview"><span>预览区</span></div>\n    </div>\n</div>\n<div class="modal-footer">\n        <input class="btn btn-primary js-btn-save" type="button" value="确 定">\n        <input class="btn" data-dismiss="modal" type="button" value="取消">\n</div>\n\n'
	}), define("components/ueditor_plugins/video/app", ["require", "jquery", "backbone", "core/utils", "text!./templates/app.html"], function(e) {
		var t = e("jquery"),
			i = e("backbone"),
			n = e("core/utils"),
			a = e("text!./templates/app.html"),
			s = n.fullfillImage("public_files/2015/09/10/04eeb56eb29cbfbe29d67042be4d21ed.jpg", "!730x0.jpg", {
				toWebp: !1
			}),
			o = n.fullfillImage("public_files/2015/09/10/1640ba3f20b22d4b35a62d72831e8110.jpg", "!730x0.jpg", {
				toWebp: !1
			});
		return i.View.extend({
			className: "modal fade hide widget-ueditor-video",
			defaults: {
				callback: function() {}
			},
			events: {
				hidden: "hidden",
				"keyup #videoUrl": "previewVideo",
				"paste #videoUrl": "previewVideo",
				"click .js-btn-save": "saveVideo"
			},
			initialize: function(e) {
				var e = e || {};
				this.callback = e.callback, this.type = null, this.width = e.width || 620, this.height = e.height || .75 * this.width, this.imgWidth = e.imgWidth || 300, this.imgHeight = e.imgHeight || 225, this.iframeUrl = "", this.render()
			},
			render: function() {
				return this.$el.html(a), this.show(), this
			},
			show: function() {
				this.$el.modal("show")
			},
			previewVideo: function(e) {
				"paste" == e.type ? setTimeout(this._previewVideo.bind(this, e), 1) : this._previewVideo(e)
			},
			_previewVideo: function(e) {
				var i = t("#videoUrl"),
					n = (t("#preview"), t.trim(i.val()));
				this.iframeUrl = this.processUrl(n), this.renderIframe()
			},
			processUrl: function(e) {
				if (e) {
					var t, i;
					if (!(window.parent._global.controller.toLowerCase().indexOf("imagetext") >= 0)) {
						if (e.indexOf("v.qq.com") >= 0) {
							if (t = e.match(/vid\=([^\&]*)($|\&)/), t ? i = "https://v.qq.com/iframe/player.html?vid=" + t[1] + "&tiny=0&auto=0" : (t = e.match(/\/([0-9a-zA-Z]+).html/), t && (i = "https://v.qq.com/iframe/player.html?vid=" + t[1] + "&tiny=0&auto=0")), !t) return
						} else if (e.indexOf("v.youku.com") >= 0) t = e.match(/id_(.*)\.html/),
							i = "http://player.youku.com/embed/" + t[1];
						else if (e.indexOf("//player.youku.com/embed/") >= 0) i = e.match(/src=\"([^"]*)\"/)[1];
						else {
							if (!(e.indexOf("tudou.com") >= 0)) return;
							t = e.match(/\/([\w\-]*)\.html/)[1], i = "http://www.tudou.com/programs/view/html5embed.action?code=" + t
						}
						return i
					}
					if (e.indexOf("v.qq.com") >= 0) {
						if (t = e.match(/vid\=([^\&]*)($|\&)/), t ? i = "https://v.qq.com/iframe/player.html?vid=" + t[1] + "&tiny=0&auto=0" : (t = e.match(/\/([0-9a-zA-Z]+).html/), t && (i = "https://v.qq.com/iframe/player.html?vid=" + t[1] + "&tiny=0&auto=0")), !t) return;
						this.iframeUrl = i
					}
				}
			},
			renderIframe: function(e) {
				if (e = e || this.iframeUrl) {
					var t = '<iframe src="' + e + '" width="' + this.width + '" height="' + this.height + '" allowfullscreen="true" ></ifame>';
					(this.isYouku() || this.isTudou()) && (t = '<img src="' + this.getSiteLogoImage() + '" />'), this.$("#preview").html(t)
				} else window.parent._global.controller.toLowerCase().indexOf("imagetext") >= 0 ? this.$("#preview").html("<span>微信图文暂时只支持腾讯视频。</span>") : this.$("#preview").html("<span>请复制腾讯、优酷视频地址输入框。</span>")
			},
			isYouku: function() {
				return this.iframeUrl && this.iframeUrl.match("youku")
			},
			isTudou: function() {
				return this.iframeUrl && this.iframeUrl.match("tudou")
			},
			getSiteLogoImage: function() {
				return this.isYouku() ? s : this.isTudou() ? o : void 0
			},
			saveVideo: function(e) {
				if (this.iframeUrl) {
					var t = {
						url: this.iframeUrl,
						width: this.imgWidth,
						height: this.imgHeight
					};
					(this.isYouku() || this.isTudou()) && (t.html = _.template('<a class="video-link" target="_blank" href="<%= url %>"><img src="<%= src %>" /></a>', {
						url: this.iframeUrl,
						src: this.getSiteLogoImage()
					})), this.callback(t), this.hidden()
				}
			},
			hidden: function() {
				this.$el.data("modal", null), t(".modal-backdrop").removeClass("in").remove(), this.$el.remove()
			}
		})
	}), define("text!components/ueditor_plugins/link/templates/app.html", [], function() {
		return '<div class="modal-header">\n    <a class="close" data-dismiss="modal">×</a>\n    <h4>超链接</h4>\n</div>\n<div class="modal-body">\n    <div class="share-content">\n        <div class="follow-collect <%= showOff %>">\n           <span class="js-btn-follow">关注链接</span>\n           <span class="js-btn-collect">收藏链接</span>\n        </div>\n        <div><label for="linkUrl">链接地址:</label><input type="text" class="js-url-add" id="linkUrl" value="<%= url %>"></div>\n        <div class="error-info"></div>\n    </div>\n</div>\n<div class="modal-footer">\n    <input class="btn btn-primary js-btn-save" type="button" value="确 定">\n    <input class="btn" data-dismiss="modal" type="button" value="取消">\n</div>\n\n'
	}), define("components/ueditor_plugins/link/app", ["require", "jquery", "underscore", "backbone", "text!./templates/app.html"], function(e) {
		var t = e("jquery"),
			i = e("underscore"),
			n = e("backbone"),
			a = e("text!./templates/app.html");
		return n.View.extend({
			className: "modal fade hide widget-ueditor-link",
			template: i.template(a),
			defaults: {
				callback: function() {}
			},
			events: {
				hidden: "hidden",
				"keyup .js-url-add": "formatUrl",
				"click .js-btn-follow": "followReturn",
				"click .js-btn-collect": "collectReturn",
				"keypress .js-url-add": "keyDown",
				"click .js-btn-save": "saveShare"
			},
			initialize: function(e) {
				this.options = e || {}, this.showOff = this.options.showOff || "hide", this.follow = this.options.follow || "关注", this.collect = this.options.collect || "收藏", this.finalUrl = "", this.render()
			},
			render: function() {
				return this.$el.html(this.template({
					showOff: this.showOff,
					url: this.options.url
				})), this.$el.css({
					width: 400,
					marginLeft: -200
				}), this.show(), this
			},
			show: function() {
				this.$el.modal("show")
			},
			hide: function() {
				this.$el.modal("hide")
			},
			formatUrl: function() {
				var e = this.$(".js-url-add"),
					i = this.$(".error-info"),
					n = t.trim(e.val()).replace(/^\s+|\s+$/g, "");
				if (n) {
					var a = /:\s*\/\//.test(n);
					a ? (i.html(""), this.finalUrl = n) : (i.html("您输入的超链接中不包含http等协议名称，默认将为您添加http://前缀"), this.finalUrl = "http://" + n)
				}
			},
			keyDown: function(e) {
				var t = e.keyCode;
				13 == t && this.saveShare()
			},
			saveShare: function() {
				if (this.formatUrl(), this.finalUrl) {
					var e = {};
					e = {
						target: "_blank",
						href: this.finalUrl,
						textValue: this.finalUrl
					}, "hide" === this.showOff && delete e.textValue, this.callback(e), this.hide()
				}
			},
			followReturn: function() {
				var e = {};
				e = {
					"class": "js-open-follow",
					href: "javascript:void(0);",
					textValue: this.follow
				}, this.callback(e), this.hide()
			},
			collectReturn: function() {
				var e = {};
				e = {
					"class": "js-open-fav",
					href: "javascript:void(0);",
					textValue: this.collect
				}, this.callback(e), this.hide()
			},
			callback: function(e) {
				i.isFunction(this.options.callback) && this.options.callback(e)
			},
			hidden: function() {
				this.$el.data("modal", null), this.remove()
			}
		})
	}), define("components/ueditor_plugins/app", ["require", "components/image/2.0.0/app", "components/ueditor_plugins/emotion/app", "components/ueditor_plugins/video/app", "components/ueditor_plugins/link/app"], function(e) {
		window.__ueditor_image = e("components/image/2.0.0/app"), window.__ueditor_emotion = e("components/ueditor_plugins/emotion/app"), window.__ueditor_video = e("components/ueditor_plugins/video/app"), window.__ueditor_link = e("components/ueditor_plugins/link/app")
	}), define("main", ["require", "components/message/message_bot_lite", "routers/router", "bootstrap", "common", "components/ueditor_plugins/app"], function(e) {
		var t = e("components/message/message_bot_lite"),
			i = e("routers/router");
		return e("bootstrap"), e("common"), e("components/ueditor_plugins/app"), {
			initialize: function() {
				window.router = new i, Backbone.history.start(), t.init()
			}
		}
	});
$(function() {
				
//				右侧菜单排序
				function Menusort(){
					$(".js-first-nav-fields").sortable({
						axis:"y",
						items: ".nav-field",
						sort: function() {
							$(this).removeClass("ui-state-default");
						},
					});
					$(".sec-nav-field ").sortable({
						axis:"y",
						items: ".js-menu-li",
						sort: function() {
							$(this).removeClass("ui-state-default");
						},
						stop: function() {
							var len = $(".sec-nav-field li").length;
							for (var i = 0; i < len; i++) {
								$(this).find(".num:eq(" + i + ")").html(i+1+". ")
							}
						}
					});
					return false;
				}
				Menusort();
				
				
//				添加右侧二级菜单
				function Addsecond(){
					var Secondmenu = "<li class=\"js-second-field js-menu-li clearfix \" data-id=\"2\"><span class=\"h5\"><span class='num'></span>标题</span><span class=\"opts\"><a href=\"javascript:void(0);\" class=\"js-edit-second\">编辑</a> -<a href=\"javascript:void(0);\" class=\"js-del-second\">删除</a></span></li>	"
					$(".js-add-second").click(function() {
						var len = $(this).parent(".add-second-nav").prev(".sec-nav-field").children("li").length;
						
	//					alert(len)
						if(len<"5"){
							$(this).parent(".add-second-nav").prev(".sec-nav-field").append(Secondmenu);
							var len2 = $(".sec-nav-field li").length-5;
	//						alert(len2)
							for (var j = 0; j< len2; j++) {
	
								$(this).parent(".add-second-nav").prev(".sec-nav-field").find(".num:eq(" + j + ")").html(j+1+". ")
	
							}						
						}else{
//							alert("最大五项")
							Cover(5);
						}			
					});
					return false;
				}
				Addsecond();
				
//				按钮增加右侧一级菜单，其中包含重新加载排序及添加二级事件
				var Firstmenu="<div class=\"nav-field js-first-field\" data-id=\"2\"><div class=\"close-modal js-del-first\" style=\"display:none\">×</div><div class=\"field-wrap clearfix js-field-wrap\"><div class=\"menu-titles\"><div class=\"h4\">一级菜单：</div><ul class=\"first-nav-field\"><li class=\"js-first-field-li js-menu-li clearfix\" data-id=\"-1\"><span class=\"h5\">标题</span> <span class=\"opts\"><a href=\"javascript:void(0);\" class=\"js-edit-first\">编辑</a></span></li></ul><div class=\"h4\">二级菜单：</div><ul class=\"sec-nav-field ui-sortable\"><li class=\"js-second-field js-menu-li clearfix\" data-id=\"0\"><span class=\"h5\"><span class=\"num\"></span>标题</span> <span class=\"opts\"><a href=\"javascript:void(0);\" class=\"js-edit-second\">编辑</a> - <a href=\"javascript:void(0);\" class=\"js-del-second\">删除</a></span></li><li class=\"js-second-field js-menu-li clearfix active\" data-id=\"1\"><span class=\"h5\"><span class=\"num\"></span>标题</span> <span class=\"opts\"><a href=\"javascript:void(0);\" class=\"js-edit-second\">编辑</a> - <a href=\"javascript:void(0);\" class=\"js-del-second\">删除</a></span></li><li class=\"js-second-field js-menu-li clearfix\" data-id=\"2\"><span class=\"h5\"><span class=\"num\"></span>标题</span> <span class=\"opts\"><a href=\"javascript:void(0);\" class=\"js-edit-second\">编辑</a> - <a href=\"javascript:void(0);\" class=\"js-del-second\">删除</a></span></li><li class=\"js-second-field js-menu-li clearfix\" data-id=\"3\"><span class=\"h5\"><span class=\"num\"></span>标题</span> <span class=\"opts\"><a href=\"javascript:void(0);\" class=\"js-edit-second\">编辑</a> - <a href=\"javascript:void(0);\" class=\"js-del-second\">删除</a></span></li><li class=\"js-second-field js-menu-li clearfix\" data-id=\"4\"><span class=\"h5\"><span class=\"num\"></span>标题</span> <span class=\"opts\"><a href=\"javascript:void(0);\" class=\"js-edit-second\">编辑</a> - <a href=\"javascript:void(0);\" class=\"js-del-second\">删除</a></span></li></ul><div class=\"add-second-nav\"><a href=\"javascript:void(0);\" class=\"js-add-second\">+ 添加二级菜单</a></div></div><div class=\"menu-main\"><div class=\"menu-content\" style=\"min-height:270px\"><div class=\"link-to js-link-to hide\" data-id=\"-1\"><span class=\"died-link-to\">使用二级菜单后主回复已失效。</span></div><div class=\"link-to js-link-to hide\" data-id=\"0\"></div><div class=\"link-to js-link-to\" data-id=\"1\"></div><div class=\"link-to js-link-to hide\" data-id=\"2\"></div><div class=\"link-to js-link-to hide\" data-id=\"3\"></div><div class=\"link-to js-link-to hide\" data-id=\"4\"></div></div><div class=\"select-link js-select-link\"><span class=\"change-txt\">回复内容：</span> <span class=\"main-link\"><a class=\"js-modal-txt\" data-type=\"txt\" href=\"javascript:void(0);\">一般信息</a> - <a class=\"js-modal-news\" data-type=\"news\" href=\"javascript:void(0);\">图文素材</a> - <a class=\"js-modal-magazine\" data-type=\"feature\" href=\"javascript:void(0);\">微页面</a> - <a class=\"js-modal-goods\" data-type=\"goods\" href=\"javascript:void(0);\">商品</a> -</span><div class=\"opts dropdown hover\"><a class=\"dropdown-toggle\" href=\"javascript:void(0);\">其他<i class=\"caret\"></i></a><ul class=\"dropdown-menu\"><li><a class=\"js-modal-homepage\" data-type=\"homepage\" href=\"javascript:void(0);\">店铺主页</a></li><li><a class=\"js-modal-usercenter\" data-type=\"usercenter\" href=\"javascript:void(0);\">会员主页</a></li><li><a class=\"js-modal-survey\" data-type=\"survey\" href=\"javascript:void(0);\">投票调查</a></li><li><a class=\"js-modal-links\" data-type=\"link\" href=\"javascript:void(0);\">自定义外链</a></li></ul></div><div class=\"editor-image js-editor-image\"></div><div class=\"hide editor-place js-editor-place\"></div></div></div></div></div>";
				$(".js-add-first").on("click",function(){
					
					var Firlen=$(this).parents(".js-first-nav-fields").children(".js-first-field").length;
					if(Firlen<"3"){
						$(this).parent(".add-first-nav").before(Firstmenu);
						$(".js-add-first").on("click",function(){
							
							Addsecond();
							Delmenu();
							Demolist();
							
						});
						Listordernew();
						if(Firlen=="0"){					
							$(".menu-ico").after(Bottomlist);
						}						
						if(Firlen=="1"){			
							$(".one:eq(0)").after(Bottomlist);
						}				
						if(Firlen=="2"){				
							$(".one:eq(1)").after(Bottomlist);
						}
					}else{
//						
						Cover(3);
					}
//					
				});
				
				
//				一级菜单删除按钮
				function Delmenu(){
					$(".js-first-field").hover(
						function(){
							$(this).children(".js-del-first").css("display","block")
						},
						function(){
							$(this).children(".js-del-first").css("display","none")
						}
					)					
				}
				Delmenu();
				
				$(document).on("click", ".js-del-first", function() {
					var firstnum=($(this).parent(".js-first-field").index())
//					alert(firstnum);
					$(this).parent(".js-first-field").remove();
					Listordernew();
					$(".one:eq("+firstnum+")").remove();
				})				
						
//				二级删除按钮
				$(document).on("click", ".js-del-second", function() {
					$(this).closest(".js-second-field").remove();
									
				})
				
//				遮罩提示层
				function Cover(m) {
					$('#mcover').show();
					$(".addnum").text(m)
					return false;
				};	
				
//				demo窗口菜单显示
				function Menuclick(){
//					$(".js-mainmenu").click(function(){
					$(document).on("click", ".js-mainmenu", function() {
						var followmenu=$(this).next(".js-submenu").css("display")
						switch(followmenu){
							case "block":
							$(this).next(".js-submenu").css("display","none")
							break
							case "none":
							$(this).next(".js-submenu").css("display","block")
							break
						}
					})					
				}
				
				var Bottomlist="<div class=\"one\"data-id=\"0\"><a class=\"mainmenu js-mainmenu\"href=\"javascript:void(0);\"><i class=\"arrow-weixin\"><\/i><span class=\"mainmenu-txt\">标题<\/span><\/a><div class=\"submenu js-submenu\"style=\"left: 42px; display: none;\"><span class=\"arrow before-arrow\"><\/span><span class=\"arrow after-arrow\"><\/span><ul><li><a class=\"js-submneu-a\"data-id=\"0\"href=\"javascript:void(0);\">标题<\/a><\/li><li class=\"line-divide\"><\/li><li><a class=\"js-submneu-a\"data-id=\"1\"href=\"javascript:void(0);\">标题<\/a><\/li><li class=\"line-divide\"><\/li><li><a class=\"js-submneu-a\"data-id=\"2\"href=\"javascript:void(0);\">标题<\/a><\/li><li class=\"line-divide\"><\/li><li><a class=\"js-submneu-a\"data-id=\"3\"href=\"javascript:void(0);\">标题<\/a><\/li><li class=\"line-divide\"><\/li><li><a class=\"js-submneu-a\"data-id=\"4\"href=\"javascript:void(0);\">标题<\/a><\/li><\/ul><\/div><\/div>";
				
				//demo添加一级菜单
				function Newlist(){
					$(".one").remove();
					var Firstlist=$(".js-first-field").length;
					for (var f=0;f<Firstlist;f++) {
						$(".menu-ico").after(Bottomlist);
					}
					Menuclick();
					Listordernew();
				}
				Newlist();
				
//				按钮更新demo一级菜单
				function Listorder(){
					var Firstlist=$(".js-first-field").length;
					switch(Firstlist){
						case 1:					
						$(".nav-menu").removeClass("has-menu-2");
						$(".nav-menu").removeClass("has-menu-3");						
						$(".nav-menu").addClass("has-menu-1");
						Newlist();
						break;			
						case 2:
						
						$(".nav-menu").removeClass("has-menu-1");
						$(".nav-menu").removeClass("has-menu-3");						
						$(".nav-menu").addClass("has-menu-2");
						Newlist();
						break;				
						case 3:
						
						$(".nav-menu").removeClass("has-menu-1");
						$(".nav-menu").removeClass("has-menu-2");
						$(".nav-menu").addClass("has-menu-3");
						Newlist();
						$(".one:eq(1)").children(".js-submenu").css("left","132px");
						break;			
					}				
				}

//				第一次加载一级菜单
				function Listordernew(){
					var Firstlist=$(".js-first-field").length;
					switch(Firstlist){
						case 1:					
						$(".nav-menu").removeClass("has-menu-2");
						$(".nav-menu").removeClass("has-menu-3");						
						$(".nav-menu").addClass("has-menu-1");
						
						break;			
						case 2:
						
						$(".nav-menu").removeClass("has-menu-1");
						$(".nav-menu").removeClass("has-menu-3");						
						$(".nav-menu").addClass("has-menu-2");
						
						break;				
						case 3:
						
						$(".nav-menu").removeClass("has-menu-1");
						$(".nav-menu").removeClass("has-menu-2");
						$(".nav-menu").addClass("has-menu-3");
						
						$(".one:eq(1)").children(".js-submenu").css("left","132px");
						break;			
					}				
				}

				

})

			
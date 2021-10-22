# 文档
#### 您可用通过JSON文本来编写配置信息,为了方便文档,此页面的JSON会将 {"index":data} 写成 {index:data}

#### 启动方式
```javascript
node index
```

```vim
./start.bat
```

```vim
sh ./start.sh
```

#### 由于程序没有使用任何 "有条件的" 命令方块，所以理论上可支持mcfunction


#### 文档格式,如果没有标记选填,那么代表必填
```javascript
{
	//名字
	name: '测试菜单',
	//提示
	hint: '这是测试',
	//入口菜单,从关闭状态打开的菜单的名字
	init:'菜单a',
	//需要3个计分板名字,3个积分版会自动创建,您只需要定义名字即可
	v1: '计分板1',
	v2: '计分板2',
	v3: '计分板3',
	//命令方块导入的坐标,您可用通过结构方块,schematic等导入,但是需要明确导入的坐标
	x: 'x',
	y：'y',
	z：'z',
	//页面数据
	page: [
		//里面一个{}代表一个菜单页面
		{
			//菜单名字,不可重复
			name: '名字',
			//菜单配置[选填]
			conf: {
				//前缀后缀,如果为false,并且只要为选项的一行,才会执行,代表忽略,例如:
				/*
				{
					open: '当前>',
					open_ "<",
					close: '>非当前',
					close_ flase
				}
				那么显示的是这样
				'
				菜单
				当前>回城<
				非当前>关闭
				'
				
				*/
				//当选项的前面,加上前缀
				open: '前缀',
				//当选项的后面,加上后缀
				open_: '后缀',
				//非当选项的前面,加上前缀
				close: '前缀',
				//非当选项的后面面,加上后缀
				close_: '后缀',
				//如果打开了这个菜单,关闭的时候执行一次执行JSON
				onclose: 执行JSON,
				//定义了该菜单最多显示几行
				max: 5
			},
			data:[
				//这里面每一个{}代表一行数据
				//如果一行内数据是 单纯的字符,那么这是一个不可选择的
				"§l§6Lspower菜单 §f@p",
				//没有run的情况下同等与字符串,另外字符或text将通过render自动解析选择器,计分板等
				{
					text: '§l余额: §l§e$(@s,money)$(金币) §l最近实体:@e[type=!player,c=1,r=10]',
				},
				{
					text: '回城',
					//如果选到这一行,并且执行菜单.那么run会激活
					run: 执行JSON
				}
				...更多的行
			]
		}
		...更多的菜单页面
	],
	//确定打开菜单的方式
	hook: 逻辑运算JSON,
	//打开菜单时执行什么[选填]
	onhook: 执行JSON,
	//确定切换菜单的方式
	chose: 逻辑运算JSON,
	//切换菜单时执行什么[选填]
	onhook: 执行JSON,
	//确定执行菜单选项的方式
	run: 逻辑运算JSON,
	//执行菜单选项时执行什么[选填]
	onrun: 执行JSON,
	//关闭菜单选项的方式
	close: 逻辑运算JSON,
	//关闭菜单时执行什么[选填]
	onclose: 执行JSON,
	//全局配置,如果在菜单页面,全局配置会覆盖conf没有的项目
	conf: 配置
```

#### 什么是逻辑运算JSON？
<p>我们实现了一套命令方块进行逻辑运算的算法,并且他可支持复杂的逻辑运算,比如和运算,或运算,并且它可以通过Jvav编译器来变成下面文档的格式</p>

<p>逻辑运算JSON是一个JSON,类型如下:</p>

```javascript
{
	//任何逻辑运算JSON都可以加入selector,代表只有满足selector选择器的实体才会被检测
	selector: '@s,@a[name=xxx] 之类的选择器,只能填写一个,如 "@e[tag=a]"'
}
//这是一个和运算,代表 data里面的逻辑运算JSON必须全部满足
{
	type: 'and',
	data: [逻辑运算JSON1,逻辑运算JSON2...]
}
//这是一个或运算,代表 data里面的逻辑运算JSON只要任意一个满足即可
{
	type: 'or',
	data: [逻辑运算JSON1,逻辑运算JSON2...]
}
//抬头的时候满足条件
{
	type: 'uphead'
}
//低头的时候满足
{
	type: 'downhead'
}
//旋转的时候满足
{
	type: 'spin'
}
//当周围出现实体的时候满足(自动kill实体)
{
	type: 'entity',
	name: '实体英语名字',
	r: 半径
}
//当跳跃的时候满足
{
	type: 'jump'
}
//当在某个方块上面的时候满足
{
	type: 'upblock',
	dy: '方块离脚下距离',
	name: '方块英语',
	data: '方块特殊值'
}
//当在某方块下面的时候满足
{
	type: 'downblock',
	dy: '方块离脚下距离',
	name: '方块英语',
	data: '方块特殊值'
}
//下面是一些示范:
//我该如何完成雪球菜单打开菜单?
{
	hook: {
		type: 'entity',
		name: 'snowball',
		r: 2
	}
}
//扔雪球打开菜单,或者在 红石块 上面抬头打开菜单
{
	hook: {
		type: 'or',
		data: [
			{
				type: 'entity',
				name: 'snowball',
				r: 2
			},
			{
				type: 'and',
				data: [
					{
						type: 'uphead'
					},
					{
						type: 'upblock',
						dy: 0.5,
						name: 'redstone_block',
						data: 0
					}
				]
			}
		]
	}
}
//在钻石方块上面扔鸡蛋,并且需要保证有 xxx 标签 打开菜单
{
	hook:{
		type: 'and',
		data: [
			{
				type: 'entity',
				name: 'egg',
				r: 2,
				selector: '@a[tag=xxx]'
			},
			{
				type: 'upblock',
				dy: 0.5,
				name: 'diamond_block',
				data: 0
			}
		]
	}
}
//复杂的运算!
//拥有 a 标签的玩家 在红石块上抬头的时候, 如扔雪球,此时此刻有一个名字叫 steve 的玩家在周围14格,拥有t标签,并且在钻石块上面低头扔雪球的时候,最近的一名叫Alex的玩家如果此时扔了鸡蛋,那么他打开了菜单 [可以用这种复杂的检测搞紧急后门菜单]
{
	hook: {
		selector: '@p[name=Alex]',
		type: 'and',
		data: [
			{
				selector: '@a[tag=a]',
				type: 'and',
				data: [
					{
						selector: '@a[name=steve,tag=t,r=14]',
						type: 'and',
						data: [
							{
								type: 'downhead'
							},
							{
								type: 'upblock',
								dy: 0.5,
								name: 'diamond_block'
							},
							{
								type: 'entity',
								r: 2,
								name: 'snowball'
							}
						]
					},
					{
						type: 'uphead'
					},
					{
						type: 'upblock',
						dy: 1,
						name: 'redstone_block',
						data: 0
					},
					{
						type: 'entity',
						name: 'snowball',
						r: 2
					}
				]
			},
			{
				type: 'entity',
				name: 'egg',
				r: 2
			}
		]
	}
}
```

#### 执行JSON
<p>执行JSON和逻辑运算JSON差不多,也是一个JSON</p>
<p>下面是文档</p>

```javascript
//该json可用写成一个数组,执行多个,如:
{
	onchose: [
		'clear @p snowball',
		'give @p snowball 16',
		'playsound random.orb @p ~~~  1 1 1'
	]
}
//当 json 是一个字符串的时候,如：
{
	onhook: 'xxx'
}
//那么等价于(打开xxx菜单):
{
	onhook:[
		{
			action: 'open',
			menu: 'xxx'
		}
	]
}
//打开一个菜单
{
	action: 'open',
	menu: '菜单名称'
}
//关闭当前菜单
{
	action: 'close'
}
//执行一条命令
{
	action: 'cmd',
	data: '命令字符'
}
//如果是数组内的字符串,同等于执行一条命令

```


### 模板

```json
{
	"name": "测试菜单",
	"hint": "无",
	"init": "主菜单",
	"v1": "jf_menu_1",
	"v2": "jf_menu_2",
	"v3": "jf_menu_3",
	"x": 0,
	"y": 100,
	"z": 0,
	"hook": {
		"type": "entity",
		"name": "snowball",
		"r": 2
	},
	"onhook": [
		"clear @p snowball",
		"give @p snowball 16",
		"playsound random.orb @p ~~~ 1 1 1"
	],
	"chose": {
		"type": "entity",
		"name": "snowball",
		"r": 2
	},
	"onchose": [
		"clear @p snowball",
		"give @p snowball 16",
		"playsound random.orb @p ~~~ 1 1 1"
	],
	"run": {
		"type": "uphead"
	},
	"close": {
		"type": "downhead"
	},
	"conf": {
		"close": "$(关)§l§f",
		"open": "$(开)>>§l§e",
		"close_": false,
		"open_": "<<",
		"max": 7
	},
	"page": [
		{
			"name": "主菜单",
			"data": [
				{
					"text": "§l§6测试菜单 §f名称:§7@p §f余额:§e$(@p,money) 硬币"
				},
				{
					"text": "回城",
					"run": [
						{
							"action": "close"
						},
						{
							"action": "cmd",
							"data": "say §6§l成功回城"
						},
						"tp @s 0 100 0"
					]
				},
				{
					"text": "生存菜单",
					"run": "生存菜单"
				}
			]
		},
		{
			"name": "生存菜单",
			"conf": {
				"onclose": [
					{
						"action": "open",
						"menu": "主菜单"
					},
					"say 返回了主菜单"
				]
			},
			"data": [
				{
					"text": "去生存区",
					"run": [
						"tp @s 1000 20 1000"
					]
				},
				{
					"text": "签到",
					"run": [
						"say 签到成功",
						"scoreboard players set @s task 1"
					]
				},
				{
					"text": "设置家",
					"run": [
						"scoreboard players set @s task 2"
					]
				},
				{
					"text": "回家",
					"run": [
						"scoreboard players set @s task 3"
					]
				},
				{
					"text": "[这是一条固定内容]"
				},
				{
					"text": "返回",
					"run": "主菜单"
				}
			]
		}
	]
}

```

#### Menu-render

<p>什么是menu-render?,这是一个简易的AST解析器,并且拥有简易的渲染功能</p>
<p>有什么用呢?</p>
<p>1.特殊符号的替换,$(名字)即可替换特殊符号,支持的特殊符号如下:</p>

```javascript
['a', 'b', 'x', 'y', 'lb', 'rr', 'lt', 'rt', '放大', '菜单栏', 'ls', 'rs', '加上', '加左', '加下', '加右', '关闭', '圆形', "正方形", '三角形', 'l1', 'r1', 'l2', 'r2', '圆左', '圆右', 'l3', 'r3', '尖上', '尖左', '尖下', '尖右', 'A', 'B', 'X', 'Y', 'l', 'r', 'zl', 'zr', '+', '-', 'R', '小上', '小左', '小下', '小右', '鼠标左', '鼠标中', '鼠标右', '上', '左', '下', '右', '跳', '蹲', '上飞', '下飞', '关', '开', 'lg', 'rg', '菜单栏1', 'ls', 'rs', '/', '/', '/', '/', '/', '/', '/', '/', 'win', '0', 'A1', 'B1', 'LG', 'RG', 'LS', 'RS', 'LT', 'RT', 'x', 'y', '鸡腿', '盔甲', '金币']
```
<p>比如您在菜单的某一行的text里面写一个$(金币),即可替换</p>
<p>2.实体和计分板共存</p>

```javascript
//示例
'@a,@r,@e[type=egg] $(玩家名字,计分板名字)'
//实体选择器只需要按照下面写即可
'@...[参数...]'
//计分板只需要按照下面写即可
'$ (名字, 计分板名字) '
//一段字符内可支持多个选择器和计分板存在

````


#### 上面实现了:
<p>扔雪球可用打开或者切换菜单,抬头执行,低头关闭,并且打开或切换菜单,会自动补给雪球,并且菜单最多显示7行</p>
<p>如果菜单关闭状态下,那么扔雪球会打开主菜单,主菜单的第一行是个人信息,不能被选择,第二行是回城,第三行是打开生存菜单</p>
<p>在生存菜单中,有6行,第一行去生存区,第二行签到,第三行设置加,第四行回家,第五行是一个固定的内容,可显示计分板,实体等,第六行是返回.其中选到”去生存区“抬头即可传送,但是conf里面设置了关闭菜单的时候跳转到主菜单，所以又会打开主菜单，第六号”返回“抬头会关闭菜单，并且返回主菜单，功能重复了，所以还是返回主菜单，在主菜单低头，会关闭菜单，因为主菜单没有在onclose设置跳转事件，如果您在主菜单设置onclose跳转主菜单，那么这个菜单打开后，不使用命令则无法关闭(低头也不行)</p>

#### 这个产品有什么优势?
<p>1.逻辑清晰,不易出错</p>
<p>2.编写方便,比如把 选择器 和 计分板 直接写进字符都可以解析</p>
<p>3.可构建大型菜单,当您的菜单页面达到几十上百的时候,变得非常难以维护,如果使用这个构建,那么你只需要简单改改,就可以替换了</p>
<p>4.可定制,您提交需求,定制大型灵活的菜单系统</p>

#### 未来考虑支持
<p>1.动态选项系统,这个东西让 地皮选择,玩家互传,领地内成员管理,等高级功能成为了可能</p>
<p>2.UI可视化编辑</p>

### 在最后

#### 如何将您按照上面信息写的js文件实现？找客服 QQ：1874689607 一键转换
<p>为了将计划搭建到自动程序内</p>

#### 运行此构建程序可能您需要具备某些先决条件
<p>Good English skills and some basic programming knowledge,The project is outsourced so I will not be responsible for it</p>
<p>Thanks for translation: Google Translate</p>
<p>Jvav compiler</p>
<p>Jvav AST</p>
<p>Jvav chain stack</p>
<p>Jvav flat binary tree</p>
<p>Jvav Mathematical use of Kepler conjecture in N-dimensional space</p>
<p>Jvav Command block object-oriented model</p>
<p>Jquery</p>
<p>Nodejs</p>
<p>Yue renderer</p>


#### [官网](https://lspower.xyz)
#### [在商店查询此产品](https://lspower.xyz/user/shop.html)
#### [合作](https://lspower.xyz/funk.html)

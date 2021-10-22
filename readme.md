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
	onclose: 执行JSON
```

#### 什么是逻辑运算JSON？
<p>我们实现了一套命令方块进行逻辑运算的算法,并且他可支持复杂的逻辑运算,比如和运算,或运算</p>

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
```

#### 执行JSON

### 模板

```javascript

exports .name = '测试菜单'

exports .hint = '无'

exports .init = '主菜单'

exports .v1 = 'jf_menu_1'
exports .v2 = 'jf_menu_1'
exports .v3 = 'jf_menu_1'

exports .hook = {
	type: 'entity',
	name: 'snowball',
	r: 2
}
exports .onhook = [
	"clear @p snowball",
	"give @p snowball 16"
]
exports .chose = {
	type: 'entity',
	name: 'snowball',
	r: 2
}
exports .onchose = [
	"clear @p snowball",
	"give @p snowball 16"
]
exports .run= {
	type: 'uphead'
}
exports .close = {
	type: 'downhead'
}
exports .page = [
	{
		name: '主菜单',
		conf: {
			close: '$(关)>>§l§f',
			open: '$(开)§l§e',
			//开关状态后缀 false 没有
			close_: false,
			open_: '<<',
			//最大显示行数
			max: 7,
		},
		data: [
			{
				text: '§l§6测试菜单 §f名称:§7@p §f金币:§e$(@p,money)'
			},
			{
				text: '回城',
				run: [
					{
						action: 'close',
					},
					{
						action: 'cmd',
						data: 'say §6§l成功回城'
					},
					"tp @s 0 100 0"
				]
			},
			{
				text: '生存菜单',
				run: '生存菜单'
			}
		]
	},
	{
		name: '生存菜单',
		conf: {
			close: '$(关)>>§l§f',
			open: '$(开)§l§e',
			//开关状态后缀 false 没有
			close_: false,
			open_: '<<',
			//最大显示行数
			max: 7,
			onclose: [
				//返回主菜单
				{
					action: 'open',
					menu: '主菜单'
				},
				"say 返回了主菜单"
			]
		},
		data: [
			{
				text: '去生存区',
				run: [
					"tp @s 1000 20 1000"
				]
			},
			{
				text: '签到',
				run: [
					"scoreboard players set @s task 1"
				]
			},
			{
				text: '设置家',
				run: [
					"scoreboard players set @s task 2"
				]
			},
			{
				text: '回家',
				run: [
					"scoreboard players set @s task 3"
				]
			},
			{
				text: '[这是一条固定内容]'
			},
			{
				text: '返回',
				run: "主菜单"
			}
		]
	}
]

```

#### 上面实现了:
<p>扔雪球可用打开或者切换菜单,抬头执行,低头关闭,并且打开或切换菜单,会自动补给雪球,并且菜单最多显示7行</p>
<p>如果菜单关闭状态下,那么扔雪球会打开主菜单,主菜单的第一行是个人信息,不能被选择,第二行是回城,第三行是打开生存菜单</p>
<p>在生存菜单中,有6行,第一行去生存区,第二行签到,第三行设置加,第四行回家,第五行是一个固定的内容,可显示计分板,实体等,第六行是返回.其中选到”去生存区“抬头即可传送,但是conf里面设置了关闭菜单的时候跳转到主菜单，所以又会打开主菜单，第六号”返回“抬头会关闭菜单，并且返回主菜单，功能重复了，所以还是返回主菜单，在主菜单低头，会关闭菜单，因为主菜单没有在onclose设置跳转事件，如果您在主菜单设置onclose跳转主菜单，那么这个菜单打开后，不使用命令则无法关闭(低头也不行)</p>


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

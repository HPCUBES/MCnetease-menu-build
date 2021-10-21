# 文档
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


#### 标记信息
```javascript
//名字
exports .name = '测试菜单'
//提示
exports .hint = '这是测试'
//入口菜单
exports .init = '菜单a'
```
#### 页面
```javascript
exports .page = [
	//菜单a
	{
		//配置
		conf: {
			//开关前后缀只对可选择项目有效
			//开关状态的前缀 false没有
			close: '$(关)>>§l§f',
			open: '$(开)§l§e',
			//开关状态后缀 false 没有
			close_: false,
			open_: '<<',
			//最大显示行数
			max: 5,
			//onclose如果没有次参数,玩家关闭菜单将完全关闭,如果有,那么作为一条run执行
			onclose: [
				{
					//onclose里面只有一个close等价于不加onclose
					action: 'close'
				}
			]
		},
		name: '菜单a',
		data: [
			//菜单栏
			{
				text: '§l§6LightSpeedPower'
			},
			{
				text: '回城',
				//run是run执行器
				run: [
					//关闭菜单
					{
						action: 'close'
					},
					//命令
					'tp @s 0 100 0',
				]
			},
			{
				//render 将自动解析 @s , 计分板 等字符串
				text: '§l名字 @s 金币 $( @s , money )'
			},
			{
				text: '生存管理',
				//字符串情况下,将跳转至b菜单
				run: 'b'
			}
		]
	}
]
```
#### run执行器

<p>run执行器是run的参数</p>

```javascript
//字符串
//字符串 将作为跳转该菜单，如：
[{run: 'a'}] => [{
	action: 'open',
	menu: 'a'
}]

//单个数组 数组内的将依次解析，解析命令如下：

//数组内的字符串,将作为一条execute该玩家的命令执行,如：
['execute @s ~~~ say @s']
//关闭菜单栏
[{
	action: 'close'
}]
//打开菜单栏
[{
	action: 'open',
	menu: '目标'
}]
```
#### 事件树
```javascript
//注意::
//事件树必须是一个JSON开头的,如:
[{
	type: 'uphead'
}]
[{
	type: 'or',
	data: [...]
}]
//------------------------//

//先决条件:当玩家周围r格出现eventName的时候激活
[{
	type: 'entity',
	name: 'entityName',
	r: 整数
}]

//先决条件:当玩家抬头的时候持激活
[{
	type: 'uphead'
}]
//先决条件:当玩家低头的时候持激活
[{
	type: 'downhead'
}]
//先决条件:跳跃
[{
	type: 'jump'
}]
//先决条件:旋转[可能体验不好,旋转一下就会tp]
[{
	type: 'spin'
}]

//------------------------//

//逻辑符 或,其中一个条件满足即可
[{
	type: 'or'，
	data: [
		{
			条件1
		},
		{
			条件2
		},
		...
	]
}]
//逻辑符 和，必须都满足
[{
	type: 'and',
	data: [
		{
			条件1
		},
		{
			条件2
		}
		...
	]
}]


//示例
exports .hook = {
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
					type: 'jump'
				},
				{
					type: 'uphead'
				}
			]
		}
	]
}
//意思为: 抬头跳跃 或 扔雪球 激活事件

```
#### 激活菜单的事件
```javascript
//激活菜单的事件
exports .hook = 事件树
//激活菜单后执行
exports .onhook = run执行器
```
#### 切换菜单的事件
```javascript
//选择菜单的事件
exports .chose = 事件树
//选择菜单后执行
exports .onchose = run执行器
```
#### 确认菜单的事件
```javascript
//执行菜单的事件
exports .run = 事件树
//执行菜单后执行
exports .onrun = run执行器
```
#### 关闭菜单的事件
```javascript
//关闭菜单的事件
exports .close = 事件树
//关闭菜单后执行
exports .onclose = run执行器
```
#### render 处理器
<p>render是一个简单的ast解析器,他可以自动解析一些字符串作为titleraw的JSON</p>

```javascript
"sss@s[x=3]bp@r$(a,money)s" => [
	{
		text: 'sss'
	},
	{
		selector: '@s[x=3]'
	},
	{
		text: 'bp'
	},
	{
		selector: '@r'
	},
	{
		score: {
			objective: 'money',
			name: 'a'
		}
	},
	{
		text: 's'
	}
]
```
#### render 还有一个替换器,将 $(名字) 替换成特殊符号,支持的如下(数组里面代表名字):
```javascript
['a', 'b', 'x', 'y', 'lb', 'rr', 'lt', 'rt', '放大', '菜单栏', 'ls', 'rs', '加上', '加左', '加下', '加右', '关闭', '圆形', "正方形", '三角形', 'l1', 'r1', 'l2', 'r2', '圆左', '圆右', 'l3', 'r3', '尖上', '尖左', '尖下', '尖右', 'A', 'B', 'X', 'Y', 'l', 'r', 'zl', 'zr', '+', '-', 'R', '小上', '小左', '小下', '小右', '鼠标左', '鼠标中', '鼠标右', '上', '左', '下', '右', '跳', '蹲', '上飞', '下飞', '关', '开', 'lg', 'rg', '菜单栏1', 'ls', 'rs', '/', '/', '/', '/', '/', '/', '/', '/', 'win', '0', 'A1', 'B1', 'LG', 'RG', 'LS', 'RS', 'LT', 'RT', 'x', 'y', '鸡腿', '盔甲', '金币']
```

<br>

### 模板

```javascript

exports .name = '测试菜单'

exports .hint = '无'

exports .init = '主菜单'

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

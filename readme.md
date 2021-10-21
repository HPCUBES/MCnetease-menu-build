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
				//可选择的 run是执行器 ,如果没有run,那么他在可显示区间,始终显示,并且不可以作为选择,也不会受前缀后缀影响
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

<p>执行器是run的参数</p>

```javascript
//字符串
//字符串 将作为跳转该菜单，如：
[{run: 'a'}]

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
	type: 'uphead'
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
//激活器 
exports .hook = 事件树
```
#### 切换菜单的事件
```javascript
exports .chose = 事件树
```
#### 确认菜单的事件
```javascript
exports .run = 事件树
```
#### 关闭菜单的事件
```javascript
exports .close = 事件树
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

### 在最后

#### [官网](https://lspower.xyz)
#### [在商店查询此产品](https://lspower.xyz/user/shop.html)
#### [合作](https://lspower.xyz/funk.html)

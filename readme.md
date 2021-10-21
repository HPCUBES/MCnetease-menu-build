# BDX-MENU
### AUTH YmStrip
### LIS GPL 3.0

#### 启动方式
```js
node index
```

```vim
./start.bat
```

```vim
sh ./start.sh
```

#### 标记信息
```js
//名字
exports .name = '测试菜单'
//提示
exports .hint = '这是测试'
//入口菜单
exports .init = '菜单a'
```
#### 页面
```js
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
#### 执行器

<p>执行器是run的参数</p>

```js
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
#### 激活器
```js

//事件框架:

//当玩家 2格内出现 enitiyName 的时候,激活事件
[{
	type: 'entity',
	name: 'entityName'
}]
//条件组 满足多个 和 条件执行
[{
	type: 'array',
	data: [
		//...
	]
}]

```
#### 激活菜单的事件
```js
//激活器 
exports .hook = 事件数组
```
#### 切换菜单的事件
```js
exports .chose = 事件数组
```
#### 确认菜单的事件
```js
exports .run = 事件数组
```
#### 关闭菜单的事件
```js
exports .close = 事件数组
```
#### render 处理器
<p>render是一个简单的ast解析器,他可以自动解析一些字符串作为titleraw的JSON</p>
```js
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
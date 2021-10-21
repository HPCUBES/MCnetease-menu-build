( function ( yue ) {
	//conf
	yue .set ( 'dirname' , __dirname )
	//load库
	yue .load ( __dirname + '/src' )
	//shel
	yue .startshell ( )
} ( require ( 'Yuejs' ) ) )
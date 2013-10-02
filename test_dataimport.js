d3.xhr( "matrix_testData_import_num.tsv", function(d){
	//console.info(d);
	var rows = d3.tsv.parseRows( d.response );
	//console.info(rows[1]);
	var header = rows[0];
	var result = {};

	for( var i=1; i<rows.length; i++ ){
		var kvPair = {};
		var line = rows[i];
		for( var j=1; j<line.length; j++ ){
			var priority = parseInt( line[j] );
			var destLand = header[j];
			kvPair[destLand]=priority;
		}
		var sourceLand = line[0]; 
		result[sourceLand]=kvPair;
	}
	console.info(result);
} )
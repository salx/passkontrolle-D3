(function(){ //don't accidentially pollute the global scope

//set width and height vor the main container svg
	var width = 960;
	var height = 500;

//create the main svg
	var svg = d3.select("svg")
		.attr("width", width)
		.attr("height", height);

//define a projection
	var projection = d3.geo.mercator();

//define a function that will generate a path and link it to the selected projection 
	var path = d3.geo.path()
		.projection(projection);

//set some initial test-data 
  // restriction1, restrictions2, restriction3
  /*
  var travelRestrictions = {
    124: {
      40: 2,
      840: 3,
      76: 1
    },
    840: {
      124: 2,
      76: 1,
      40: 3
    }
  };
  */

// load the data from csv and generate json for it. load the json as well. 
    var result = {};
    d3.xhr( "matrix_testData_import_num.tsv", function(d){
    var rows = d3.tsv.parseRows( d.response );
    var header = ( rows[0] );

      for( var i=1; i<rows.length; i++ ){
        var kvPair = {};
        var line = rows[i];
        for( var j=1; j<line.length; j++ ){
          var priority = parseInt( line[j] );
          var destLand = ( header[j] ); 
          kvPair[destLand]= parseInt( priority ); 
        }
        var sourceLand = line[0]; 
        result[sourceLand]=kvPair;
      }
  });

//load geodata
	d3.json("world-50m.json", function(error, world) {
    // convert topojson back to geojson (will be obsolete in future versions)
    // define the country-variables from geodata
		var countries = topojson.object(world, world.objects.countries).geometries;

//load countries to svg
		svg.selectAll(".country")
			.data(countries)
			.enter()
			.insert("path")
			.attr("class", "country")
			.attr("d", path);

//define an on.click-event that loads the data for the country-object that has been clicked
    svg.selectAll( '.country' )
    // using an anonymous function, load an array of data with the values for the current country? 
    .on( 'click', function( d ) {
      // loading the dataset for the country that has been clicked
      var clickedCountry = d.id; //save clicked Country ID for comparison with currentCountry
      var restrictions = result[ d.id ]; 
      //set the color of the other country-objects according to the data specified in the clicked country
      svg.selectAll( '.country' )
      //set the attribute 'class' of all countries with a variable currentID, that stores the 1, 2, 3 value
      .attr( 'class', function( d ) {
        var currentID = ''+d.id;
        var currentCountryID = d.id; //save currentID to compare with clickedCountry
        //final if-statement to color the countries.
        if( currentCountryID == clickedCountry ){
          return 'country restriction' + 0; //id it's the clicked country, color grey
        }else if( restrictions[ currentID ] ) {
          return 'country restriction' + restrictions[ currentID ]; //else, apply restriction-code
        } else{
          return 'country'; //if none found, leave as is
        }
      } );

    } );

	});

})();

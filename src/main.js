/*
 * Copyright © 2020. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

//@ts-check - Get type warnings from the TypeScript language server. Remove if not wanted.

/**
 * Get access to the Spotfire Mod API by providing a callback to the initialize method.
 * @param {Spotfire.Mod} mod - mod api
 */
Spotfire.initialize(async (mod) => {
    /**
     * Create the read function.
     */
    const reader = mod.createReader(mod.visualization.data(), mod.windowSize(), mod.property("myProperty"));

    /**
     * Store the context.
     */
    const context = mod.getRenderContext();

    /**
     * Initiate the read loop
     */
    reader.subscribe(render);

    /**
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.Size} windowSize
     * @param {Spotfire.ModProperty<string>} prop
     */
    async function render(dataView, windowSize, prop) {
        /**
         * Check the data view for errors
         */
        let errors = await dataView.getErrors();
        if (errors.length > 0) {
            // Showing an error overlay will hide the mod iframe.
            // Clear the mod content here to avoid flickering effect of
            // an old configuration when next valid data view is received.
            mod.controls.errorOverlay.show(errors);
            return;
        }
        mod.controls.errorOverlay.hide();


        /**
         * Get rows from dataView
         */
        const rows = await dataView.allRows();
        if (rows == null) {
            // User interaction caused the data view to expire.
            // Don't clear the mod content here to avoid flickering.
            return;
        }

		
		/**
		 * Create data structure for bars
		 */
		var cataxis = await dataView.categoricalAxis("X");
		var cataxislevels = cataxis.hierarchy.levels;

		var bars = new Array();
		for(var i in cataxislevels){
			var bar = new Map();
			bar.height = 0;
			rows.forEach(function(row){
				var rowvalue = Number(row.continuous("Y").value());
				var rowlabel = row.categorical("X").value();
				var rowcolor = row.color().hexCode;
				
				var rowlabelpart = rowlabel[i].formattedValue();
				if ( !bar.has(rowlabelpart) ){ bar.set( rowlabelpart, { height: 0 } ); }
				
				bar.get(rowlabelpart).height += rowvalue;
				bar.get(rowlabelpart).color = rowcolor;
				bar.height += rowvalue;
	
				//TODO Check for negative bar values and show error
				//TODO Check if sum of all barvalues is the same for all paths
			});			
			bars.push(bar);			
		};



		/**
		 * Clear SVG and set constants
		 */	
		var svgmod = document.querySelector("#mod-svg");
		svgmod.innerHTML = "";


		/**
		 * Render SVG
		 */
		for(var i in bars){
			var bar = bars[i];
			var barheightcursor = 0;
			
			bar.forEach(function(barsegment, barsegmentlabel){

				var path = document.createElementNS("http://www.w3.org/2000/svg","path");
				var d = createDonutSlice(barheightcursor, barheightcursor + barsegment.height / bar.height * 100, i*10+10, i*10+20);
				path.setAttribute("d", d);
				path.setAttribute("fill", barsegment.color);
				path.setAttribute("stroke", "white");
				svgmod.appendChild(path);

				barheightcursor += barsegment.height / bar.height * 100 ;
				
			});
						
		}
		


        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();



		function createDonutSlice(startPercent, endPercent, radius, outerRadius){
				
			var start = convertPercentToCoordinates(startPercent, radius);
			var end = convertPercentToCoordinates(endPercent, radius);
			
			var outerStart = convertPercentToCoordinates(startPercent, outerRadius);
			var outerEnd = convertPercentToCoordinates(endPercent, outerRadius);
			
			var largeArcFlag = endPercent - startPercent <= 50 ? "0" : "1";
		
			var d = [
				"M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
				"L", outerEnd.x, outerEnd.y, "A", outerRadius, outerRadius, 0, largeArcFlag, 0, outerStart.x, outerStart.y, "Z"
			].join(" ");
			
			return d; 
		}
		
		function convertPercentToCoordinates(angleInPercent, radius){
			
			var angleInDegrees = angleInPercent/100*360;
			var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
		
			return {
				x: Math.cos(angleInRadians)*radius,
				y: Math.sin(angleInRadians)*radius
			}
			
		}


    }
});

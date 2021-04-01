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
				
				var rowlabelpart = rowlabel[i].formattedValue();
				if ( !bar.has(rowlabelpart) ){ bar.set( rowlabelpart, { height: 0 } ); }
				
				bar.get(rowlabelpart).height += rowvalue;
				bar.height += rowvalue;
	
				//TODO Check for negative bar values and show error
				//TODO Check if sum of all barvalues is the same for all paths
			});			
			bars.push(bar);			
		};


        /**
         * Print out to document
         */
        const container = document.querySelector("#mod-container");
        container.textContent = `windowSize: ${windowSize.width}x${windowSize.height}\r\n`;
        container.textContent += `should render: ${rows.length} rows\r\n`;
        container.textContent += `${prop.name}: ${prop.value()}` + "\r\n";

		for(var i in bars){
			var bar = bars[i];
			container.textContent += "Layer " + i + "\r\n";
			bar.forEach(function(barsegment, barsegmentlabel){
				container.textContent += barsegmentlabel + " " + barsegment.height + "\r\n";
			});
						
		}


        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});

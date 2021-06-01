# Spotfire Sunburst Chart

Working on a Spotfire mod to create Sunburst chart. Currently the mod is in very early stage and not ready for usage. Just some experimental code to explore the idea has been created. Hopefully over summer I have some spare time to create a first useful release.

Objective would be to create Sunburst chart similar to how Excel is creating it including how empty values and labels are handled plus of course support for marking and tooltip. See here https://support.microsoft.com/en-us/office/create-a-sunburst-chart-in-office-4a127977-62cd-4c11-b8c7-65b84a358e0c.

The interactivity of other Sunburst visualizations like D3 https://github.com/vasturiano/sunburst-chart is confusing I would say and could be better provided in a Spotfire dashboard using filtering. So the objective for me in this project is a quite straight forward easy to use Sunburst chart.

## References
- How to calculate SVG path for an arc of a circle https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
- Data to Viz https://www.data-to-viz.com/graph/sunburst.html
- Excel https://support.microsoft.com/en-us/office/create-a-sunburst-chart-in-office-4a127977-62cd-4c11-b8c7-65b84a358e0c
- PowerBI https://appsource.microsoft.com/en-us/product/power-bi-visuals/wa104380767?tab=overview
- D3 https://github.com/vasturiano/sunburst-chart
- AnyChart https://www.anychart.com/products/anychart/gallery/Sunburst_Charts/
- Plotly https://plotly.com/python/sunburst-charts/

## How to get started with development 
All source code for the mod example can be found in the `src` folder. 
These instructions assume that you have [Node.js](https://nodejs.org/en/) (which includes npm) installed. 

- Open a terminal at the location of this example.
- Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
- Run `npm run server`. This will start a development server.
- Start editing, for example `src/main.js`.
- In Spotfire, follow the steps of creating a new mod and connecting to the development server.

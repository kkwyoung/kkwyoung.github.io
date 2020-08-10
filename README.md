##Links
- [bl.ocks](http://bl.ocks.org/chrisrzhou/2421ac6541b68c1680f8) 
- [plunker](http://embed.plnkr.co/RC2NL1/preview)

------
##Description
- A radar chart visualizes multivariate data in a 2D chart of three or more quantitative variables represented on axes.
- This is a variation of the [original](http://bl.ocks.org/tpreusse/2bc99d74a461b8c0acb1) and [improved](http://bl.ocks.org/nbremer/6506614) D3 radar chart.
- Major improvements include:
  - Refactoring D3 components (`levels`, `labels`, `axes`, `polygons`, `legend`), which now can be controlled through the `config` object.
  - Abstracting the building and rendering portions of the D3 visualization.
  - Aside from the basic stacked view, this variation includes a facetting option to plot the graphs in a facet grid.
- Use the configuration parameters to adjust the plot to your tastes, and you can also choose to view the plots stacked vs facetted.
- The data input has to be a 4-column CSV (headers MUST be included) conforming to the data schema of:
  - `group (int/string)`: data to be grouped into an object to plot the required polygon on the radar chart.
  - `axis (int/string)`: the axis of the radar charts (dimensions of the multivariate data).
  - `value (int)`: the data value of the given record.
  - `description (int/string)`: not a mandatory field, and additional columns after this are accepted as well.
- All D3 logic is contained in the `radar.js` file.  You should be able to look at just this file if you intend to use the visualization logic without AngularJS.

------
##Files
- **`index.html`**: Main angular app connecting the D3 vis through an angular directive `<radar>`.
- **`app.js`**: Main angular app file connecting the DOM view with Javascript variables.  Contains directive `onReadFile` to handle file uploads and `radar` to re-render the D3 visualization on data updates.
- **`radar.js`**: All D3 logic is contained in this file.  You should use this file if you are looking solely to use D3 without AngularJS.
- **`radarDraw.js`**: This is the directive-link function called by the AngularJS directive `radar` in `app.js`.  Funnels the dataset from the angular app into the D3 drawing logic called from `radar.js`.
- **`style.css`**: stylesheet containing optional D3 classes that can be adjusted (commented out)
- **`data.csv`**: Three CSV-data files for sample downloads and uploads to the app.

------
##Notes
- You may notice Angular digest errors in the console due to `$scope.$watch`.  Not too familiar on resolving these issues.
- A big help from this [fiddle](http://jsfiddle.net/alexsuch/6aG4x/) to help implement an AngularJS `FileReader`.
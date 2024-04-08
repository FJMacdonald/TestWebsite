
let zoomingEnabled = true;

// function isTouchDevice() {
//     return 'ontouchstart' in window || navigator.maxTouchPoints;
// }

// if (isTouchDevice()) {
//     const zoomButton = d3.select("#zoomButton");
//     zoomButton.style("display", "inline-block");
//     zoomButton.on("click", toggleBrushing);
//     displayTooltip(zoomButton, "Tap this button to enable zooming mode");
// }
const height = window.innerHeight * 0.5;
var max_time_lag = 10*60;

function drawChart(athletesArray, max_time_lag, spiderChartArray, colorPalette) {
    const chartTitleDiv = document.getElementById("devchart_title");
    chartTitleDiv.innerHTML = "<h3> Race Development Chart </h3>";

    if (athletesArray.length === 0) {
        return;
    }



    const duration = 300;
    const raceLength = 70;
    const margin = { top: 40, right: 10, bottom: 10, left: window.innerWidth / 14 };
    const width = window.innerWidth - margin.left - margin.right;

    const size = 25;
    const circleRadiusHover = 6;

    var lineOpacity = "0.5";
    var lineStroke = "1.0";
    var circleRadius = 3;
    var athleteIndexArray = [];


    const svg = d3.select("#development_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, raceLength])
        .range([0, width]);



    const xAxis = d3.axisTop(xScale).ticks(0);
    const yAxis = d3.axisLeft(yScale).ticks(0).tickFormat(formatYAxis);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    var yAxisGroup = svg.append("g")
        .attr("class", "y axis label")
        .call(yAxis);

    yAxisGroup.append('text')
        .attr("y", -window.innerWidth / 20)
        .attr("x", -10)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Time Behind Leader");



    function updateYAxis() {
        // Update y-axis dynamically
        // Calculate the range of the yScale
        const yRange = yScale.domain();

        // Calculate the difference between the max and min values
        const yRangeDiff = yRange[1] - yRange[0];

        // Determine the number of ticks based on the yRangeDiff
        let numberOfTicks;

        if (yRangeDiff <= 60) {
            // If the range is less than or equal to 60 seconds, show ticks every 10 seconds
            numberOfTicks = yRangeDiff / 10;
        } else if (yRangeDiff <= 600) {
            // If the range is less than or equal to 600 seconds (10 minutes), show ticks every minute
            numberOfTicks = yRangeDiff / 60;
        } else if (yRangeDiff >= 1800) {
            // If the range is greater than (30 minutes), show ticks every 5 minutes
            numberOfTicks = Math.floor(yRangeDiff / 300);
        } else {
            // Otherwise, show ticks every 2 minutes
            numberOfTicks = yRangeDiff / 120;
        }


        // Define the y-axis with the calculated number of ticks and custom tick format
        const yAxis = d3.axisLeft(yScale).ticks(numberOfTicks).tickFormat(d => {
            if (d < -90) {
                const mins = -Math.floor(d / 60);
                const secs = -d % 60
                return mins + ":" + (secs < 10 ? '0' + secs : secs);
            } else {
                return -d; // For values under or equal to 90 seconds, use the default format
            }
        });

        // Update the y-axis
        yAxisGroup = svg.select(".y.axis").call(yAxis);

        // Modify the font style for the tick labels
        yAxisGroup.selectAll(".tick text")
            .attr("class", "label-small");


        // // Add y-axis gridlines
        svg.selectAll(".y-gridline")
            .data(yScale.ticks(numberOfTicks))
            .enter()
            .append("line")
            .attr("class", "y-gridline")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .style("stroke", "#ddd")  // Adjust the color as needed
            .style("stroke-dasharray", "3,3");  // Add dashes for a dashed appearance

        // Update the y-axis label dynamically
        const yDomain = yScale.domain();
        const isSeconds = yDomain[0] >= 0 && yDomain[1] <= 90; // Assuming 90 seconds threshold, adjust as needed

    }

    function updateChart(max_time_lag) {
        // Update chart based on max_time_lag
        function addListItem(listItem, index) {
            // Append the clickable rectangle
            var innerRect = listItem.append('svg')
                .attr('width', size) // Adjust width as needed
                .attr('height', size) // Adjust height as needed
                .style('display', 'inline-block') // Ensure the SVG and text are displayed inline
                .selectAll('.innerRect') // Select existing .innerRect elements (if any)
                .data([resultsArray[index]]) // Bind data to new .innerRect elements
                .join('rect') // Join data to elements
                .attr('class', 'innerRect')
                .attr('width', size)
                .attr('height', size)
                .style('stroke', 'Black')
                .style('stroke-width', lineStroke)
                .style('opacity', lineOpacity)
                .attr('fill', colorPalette[index])
                .on('click', function (d, i) {
                    // Handle click event for the rectangle
                    var athleteRect = d3.select(this);
                    var opacity = athleteRect.style('opacity');
                    if (opacity === '0.5') {
                        lineOpacity = '1.0';
                        lineStroke = '3.0';
                        circleRadius = 3;
                    } else if (opacity === '1.0') {
                        lineOpacity = '0.0';
                        lineStroke = '1.0';
                        circleRadius = 0;
                    } else {
                        lineOpacity = '0.5';
                        lineStroke = '1.0';
                        circleRadius = 3;
                    }

                    // set the new state of the rect
                    athleteRect.style("opacity", lineOpacity);

                    // Get the index of the clicked element's data in the resultsArray
                    const athleteIndex = index;//resultsArray.findIndex(item => item === d);
                    // Filter for the corresponding athlete path & update it with new state
                    const athleteLine = svg.selectAll(".line").filter((d, i) => i === athleteIndex);
                    athleteLine.style("opacity", lineOpacity);
                    athleteLine.style("stroke-width", lineStroke);

                    // Filter for the corresponding athlete label & update it with new state
                    const athletetext = svg.selectAll(".line-name").filter((d, i) => i === athleteIndex);
                    if (lineOpacity == 1.0) {
                        athletetext.style("visibility", "visible");
                        athleteIndexArray.push(athleteIndex);
                    } else {
                        athletetext.style("visibility", "hidden");
                        // Remove athlete from spider chart
                        let index = athleteIndexArray.indexOf(athleteIndex);
                        if (index !== -1) {
                            athleteIndexArray.splice(index, 1);
                        }
                    }

                    // Filter for the corresponding athlete path circles & update them with new state
                    const athleteCircles = svg.selectAll(".athlete-circle").filter(d => d.athleteIndex === athleteIndex);
                    athleteCircles.each(function (d) {
                        d3.select(this)
                            .style("opacity", lineOpacity)
                            .attr("r", circleRadius);
                    });
                    //prepare array for spiderchart
                    var selectedAthletes = [];
                    for (let i = 0; i < athleteIndexArray.length; i++) {
                        selectedAthletes.push(spiderChartArray[athleteIndexArray[i]]);
                    }
                    drawSpiderChart(selectedAthletes, athleteIndexArray, colorPalette);
                });

            const nameParts = resultsArray[index].athleteName.split(" ")
            // Extract the first name
            const firstName = nameParts[0];

            // Append the athlete name and country on two lines
            const placeSpan = listItem.append('span')
                .style('display', 'inline-block') // Ensure the text is displayed inline
                .style('vertical-align', 'top') // Align the text to the top of the rectangle
                .attr("class", "label")
                .text((index + 1) + '. '); // Display the athlete's place

            // Get the width of the place span
            const placeWidth = placeSpan.node().getBoundingClientRect().width;

            // Append the first name
            const firstSpan = listItem.append('span')
                .style('display', 'inline-block') // Ensure the text is displayed inline
                .style('vertical-align', 'top') // Align the text to the top of the rectangle
                .attr("class", "label")
                .text(firstName);

            // Get the width of the first name span
            const firstNameWidth = firstSpan.node().getBoundingClientRect().width;

            listItem.append('span')
                .style('display', 'block') // Ensure the text is displayed as a block
                .style('margin-top', '-20px') // Adjust the margin-top to align vertically below the first name
                .style('margin-left', 25 + 'px') // Adjust margin-left based on the width of the first name.attr("class", "label")
                .style('float', 'left') // Right-align the text
                .style('text-align', 'left') // Align the text to the right
                .attr("class", "label")
                .text(nameParts.pop() + resultsArray[index].country + resultsArray[index].status);
        }

        function renderLegendPage(pageIndex) {
            var athletesPerPage = 4;
            // Calculate startIndex and endIndex based on pageIndex and athletesPerPage
            var startIndex = pageIndex * athletesPerPage;
            var endIndex = Math.min(startIndex + athletesPerPage, resultsArray.length);

            var legendPage = d3.create('li');
            for (var i = startIndex; i < endIndex; i++) {
                (function (index) {
                    var listItem = legendPage.append('div')
                        .classed('legend-item', true);
                    addListItem(listItem, index);
                })(i);
            }
            return legendPage.node();
        }





        function renderLegend() {
            var numPages = Math.ceil(resultsArray.length / 4);
            var legendPagesContainer = document.getElementById('legend-pages');

            // Clear previous legend pages
            legendPagesContainer.innerHTML = '';

            // Render legend pages
            for (var i = 0; i < numPages; i++) {
                var legendPage = renderLegendPage(i);
                legendPagesContainer.appendChild(legendPage);
            }
        }


        // Render legend initially
        renderLegend();

        // Grouping elements for each athlete
        const athleteGroups = svg.selectAll(".athlete-group")
            .data(resultsArray)
            .enter()
            .append("g")
            .attr("class", "athlete-group");


        // Draw path for each athlete
        athleteGroups.append("path")
            .attr("class", "line athlete-line")
            .attr("id", (d, i) => i)
            .attr("fill", "none")
            .attr("stroke", (d, i) => colorPalette[i])
            .attr("stroke-width", lineStroke)
            .attr("d", d => d3.line()
                .x(coord => xScale(coord.x))
                .y(coord => yScale(coord.y))
                .curve(d3.curveLinear)(d.values))
            .style('opacity', lineOpacity)
            .attr("clip-path", "url(#clip)")
            .on("mouseover", function (d, i) {
                var athleteLine = d3.select(this);
                athleteLine.attr("stroke-width", 4)
                    .style('opacity', 1.0);


                // get the current mouse position 
                const [mouseX, mouseY] = d3.pointer(event, this);
                svg.append("text")
                    .attr("class", "line-text label")
                    //   .style("fill", colorPalette[index])
                    .text(i.athleteName)
                    .attr("x", mouseX)
                    .attr("y", mouseY);
            })
            .on("mouseout", function (d, i) {
                const athleteLine = d3.select(this);
                const athleteIndex = parseInt(athleteLine.attr("id"));

                svg.select(".line-text").remove();


                // Check if the athlete is selected
                var isSelected = athleteIndexArray.includes(athleteIndex);
                if (!isSelected) {
                    athleteLine.attr("stroke-width", 1)
                        .style('opacity', 0.5);
                }

            });

        // Draw circles for each athlete
        athleteGroups.selectAll(".athlete-circle")
            .data((d, i) => d.values.map(coord => ({ athleteIndex: i, coordinate: coord })))
            .enter()
            .append("circle")
            .attr("class", "athlete-circle")
            .attr("r", circleRadius)
            .style("opacity", lineOpacity)
            .attr("fill", d => colorPalette[d.athleteIndex])
            .attr("cx", d => xScale(d.coordinate.x))
            .attr("cy", d => yScale(d.coordinate.y))
            .attr("clip-path", "url(#clip)")
            .on("click", function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadiusHover)
                    .style("cursor", "pointer");
                svg.append("text")
                    .attr("class", "text label")
                    .text(i.coordinate.diff) // Accessing the diff property from the nested data
                    .attr("x", xScale(i.coordinate.x) + 5) // Accessing the x property from the nested data
                    .attr("y", yScale(i.coordinate.y) - 10); // Accessing the y property from the nested data
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadius)
                    .style("cursor", "none")
                svg
                    .selectAll(".text").remove();
            });

        // Label paths with athlete first names
        athleteGroups.append("text")
            .attr("class", "line-name label athlete-name")
            .style("fill", (d, i) => colorPalette[i])
            .text(d => d.athleteName.split(' ')[0])
            .attr("text-anchor", "end")
            .attr("x", d => xScale(d.values[d.values.length - 1].x) + 5)
            .attr("y", d => yScale(d.values[d.values.length - 1].y))
            .attr("clip-path", "url(#clip-labels)")
            .style("visibility", "hidden")
            .attr("text-anchor", "left");




        // Define clipping path for lines
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // Define clipping path for line-labels
        svg.append("defs").append("clipPath")
            .attr("id", "clip-labels")
            .append("rect")
            .attr("width", width)
            .attr("height", height + 20)
            .attr("y", -10);




        // Call the function to draw gridlines
        drawVerticalGridlines(svg, 10);
        drawVerticalGridlines(svg, 12);
        drawVerticalGridlines(svg, 42);
        drawVerticalGridlines(svg, 44);

        // annotate with swim, t1, bike, t2, run
        annotateChart(svg, 4, -10, 'Swim');
        annotateChart(svg, 10.5, -10, 'T1');
        annotateChart(svg, 24, -10, 'Bike');
        annotateChart(svg, 42.5, -10, 'T2');
        annotateChart(svg, 52, -10, 'Run');
    }
    function formatYAxis(d) {
        if (d < -90) {
            const mins = -Math.floor(d / 60);
            const secs = -d % 60;
            return `${mins}:${secs < 10 ? '0' + secs : secs}`;
        } else {
            return -d;
        }
    }
    // Function to draw vertical gridlines
    function drawVerticalGridlines(selection, x) {
        selection
            .attr("class", "gridline")
            .append("line")
            .attr('x1', xScale(x))
            .attr('y1', -10)
            .attr('x2', xScale(x))
            .attr('y2', yScale(-height - 250))
            .style('stroke', 'gray')
            .style('opacity', 0.5)
            .style("stroke-dasharray", ("3, 3"))
            .style("stroke-width", 0.5);
    }

    //function to annotate chrt 
    function annotateChart(selection, x, y, text) {
        selection
            .append('text')
            .attr("class", "label")
            .attr('x', xScale(x))
            .attr('y', y)
            .text(text);
    }
    initZoom();
    updateChart(10*60);
    updateYAxis();

}

const yScale = d3.scaleLinear()
.domain([-max_time_lag, 0])
.range([height, 0]);

    let zoom = d3.zoom()
        .scaleExtent([0.25, 10])
        .on('zoom', handleZoom);
    

    
    function initZoom() {
       // d3.select("#development_chart")
        d3.select('svg')
            .call(zoom);
    }
    
    
    function handleZoom(e) {
        d3.select('svg g')
            .attr('transform', e.transform);
            // const newYScale = e.transform.rescaleY(yScale); // Assuming yScale is your y-axis scale
            // d3.select('svg g')
            //     .attr('transform', `translate(0, ${e.transform.y}) scale(1, ${newYScale})`);
        
    }
    
    function zoomIn() {
        d3.select('svg')
            .transition()
            .call(zoom.scaleBy, 2);
    }
    
    function zoomOut() {
        d3.select('svg')
            .transition()
            .call(zoom.scaleBy, 0.5);
    }
    
    function resetZoom() {
        d3.select('svg')
            .transition()
            .call(zoom.scaleTo, 1);
    }
    
    function center() {
        d3.select('svg')
            .transition()
            .call(zoom.translateTo, 0.5 * width, 0.5 * height);
    }
    
    function panLeft() {
        d3.select('svg')
            .transition()
            .call(zoom.translateBy, -50, 0);
    }
    
    function panRight() {
        d3.select('svg')
            .transition()
            .call(zoom.translateBy, 50, 0);
    }
    
    // function updateData() {
    //     data = [];
    //     for(let i=0; i<numPoints; i++) {
    //         data.push({
    //             id: i,
    //             x: Math.random() * width,
    //             y: Math.random() * height
    //         });
    //     }
    // }

    // function update() {
    //     d3.select('svg g')
    //         .selectAll('circle')
    //         .data(data)
    //         .join('circle')
    //         .attr('cx', function(d) { return d.x; })
    //         .attr('cy', function(d) { return d.y; })
    //         .attr('r', 3);
    // }
    

    // updateData();
    // update();

        /*
        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 10]) // Limit zoom scale
            .on('zoom', zoomed);

        // Apply zoom behavior to SVG
        athleteGroups.call(zoom);

    

    function zoomed(event) {
        const { transform } = event;
        athleteGroups.attr('transform', transform);
    }
    
    // Function to handle mouse wheel event for zooming
    function handleMouseWheel(svg) {
        console.log("handle mouse wheel");
        svg.on('wheel', (event) => {
            console.log("handle mouse wheel2");
            // Check if the mouse event occurs inside the SVG area
            if (!svg.node().contains(event.target)) return;
            console.log("handle mouse wheel3")
            // Prevent default behavior
            event.preventDefault();
    
            // Get current transformation
            const { transform } = d3.zoomTransform(svg.node());
    
            // Calculate scale based on wheel delta
            const scale = 1 + event.deltaY * 0.01;
    
            // Apply scale transformation
            const newTransform = transform.scale(scale);
    
            // Call zoom behavior with new transformation
            svg.call(zoom.transform, newTransform);
        });
    }
    
    // Call function to handle mouse wheel event
    handleMouseWheel(svg);
    handleMouseWheel(athleteGroups);
}
*/


    

function getCountryFlagEmoji(countryCode) {
    const flagMappings = {
        'AFG': '🇦🇫', 'ALA': '🇦🇽', 'ALB': '🇦🇱', 'DZA': '🇩🇿', 'ASM': '🇦🇸',
        'AND': '🇦🇩', 'AGO': '🇦🇴', 'AIA': '🇦🇮', 'ATA': '🇦🇶', 'ATG': '🇦🇬',
        'ARG': '🇦🇷', 'ARM': '🇦🇲', 'ABW': '🇦🇼', 'AUS': '🇦🇺', 'AUT': '🇦🇹',
        'AZE': '🇦🇿', 'BHS': '🇧🇸', 'BHR': '🇧🇭', 'BGD': '🇧🇩', 'BRB': '🇧🇧',
        'BLR': '🇧🇾', 'BEL': '🇧🇪', 'BLZ': '🇧🇿', 'BEN': '🇧🇯', 'BMU': '🇧🇲',
        'BTN': '🇧🇹', 'BOL': '🇧🇴', 'BIH': '🇧🇦', 'BWA': '🇧🇼', 'BVT': '🇧🇻',
        'BRA': '🇧🇷', 'IOT': '🇮🇴', 'BRN': '🇧🇳', 'BGR': '🇧🇬', 'BFA': '🇧🇫',
        'BDI': '🇧🇮', 'KHM': '🇰🇭', 'CMR': '🇨🇲', 'CAN': '🇨🇦', 'CPV': '🇨🇻',
        'CYM': '🇰🇾', 'CAF': '🇨🇫', 'TCD': '🇹🇩', 'CHL': '🇨🇱', 'CHN': '🇨🇳',
        'CXR': '🇨🇽', 'CCK': '🇨🇨', 'COL': '🇨🇴', 'COM': '🇰🇲', 'COG': '🇨🇬',
        'COD': '🇨🇩', 'COK': '🇨🇰', 'CRI': '🇨🇷', 'CIV': '🇨🇮', 'HRV': '🇭🇷',
        'CUB': '🇨🇺', 'CYP': '🇨🇾', 'CZE': '🇨🇿', 'DNK': '🇩🇰', 'DJI': '🇩🇯',
        'DMA': '🇩🇲', 'DOM': '🇩🇴', 'ECU': '🇪🇨', 'EGY': '🇪🇬', 'SLV': '🇸🇻',
        'GNQ': '🇬🇶', 'ERI': '🇪🇷', 'EST': '🇪🇪', 'ETH': '🇪🇹', 'FLK': '🇫🇰',
        'FRO': '🇫🇴', 'FJI': '🇫🇯', 'FIN': '🇫🇮', 'FRA': '🇫🇷', 'GUF': '🇬🇫',
        'PYF': '🇵🇫', 'ATF': '🇹🇫', 'GAB': '🇬🇦', 'GMB': '🇬🇲', 'GEO': '🇬🇪',
        'DEU': '🇩🇪', 'GHA': '🇬🇭', 'GIB': '🇬🇮', 'GRC': '🇬🇷', 'GRL': '🇬🇱',
        'GRD': '🇬🇩', 'GLP': '🇬🇵', 'GUM': '🇬🇺', 'GTM': '🇬🇹', 'GGY': '🇬🇬',
        'GIN': '🇬🇳', 'GNB': '🇬🇼', 'GUY': '🇬🇾', 'HTI': '🇭🇹', 'HMD': '🇭🇲',
        'VAT': '🇻🇦', 'HND': '🇭🇳', 'HKG': '🇭🇰', 'HUN': '🇭🇺', 'ISL': '🇮🇸',
        'IND': '🇮🇳', 'IDN': '🇮🇩', 'IRN': '🇮🇷', 'IRQ': '🇮🇶', 'IRL': '🇮🇪',
        'IMN': '🇮🇲', 'ISR': '🇮🇱', 'ITA': '🇮🇹', 'JAM': '🇯🇲', 'JPN': '🇯🇵',
        'JEY': '🇯🇪', 'JOR': '🇯🇴', 'KAZ': '🇰🇿', 'TRI': '🇹🇹', 'POR': '🇵🇹',
        'KEN': '🇰🇪', 'KIR': '🇰🇮', 'PRK': '🇰🇵', 'KOR': '🇰🇷', 'KWT': '🇰🇼',
        'KGZ': '🇰🇬', 'LAO': '🇱🇦', 'LVA': '🇱🇻', 'LBN': '🇱🇧', 'LSO': '🇱🇸',
        'LBR': '🇱🇷', 'LBY': '🇱🇾', 'LIE': '🇱🇮', 'LTU': '🇱🇹', 'LUX': '🇱🇺',
        'MAC': '🇲🇴', 'MKD': '🇲🇰', 'MDG': '🇲🇬', 'MWI': '🇲🇼', 'MYS': '🇲🇾',
        'MDV': '🇲🇻', 'MLI': '🇲🇱', 'MLT': '🇲🇹', 'MHL': '🇲🇭', 'MTQ': '🇲🇶',
        'MRT': '🇲🇷', 'MUS': '🇲🇺', 'MYT': '🇾🇹', 'MEX': '🇲🇽', 'FSM': '🇫🇲',
        'MDA': '🇲🇩', 'MCO': '🇲🇨', 'MNG': '🇲🇳', 'MNE': '🇲🇪', 'MSR': '🇲🇸',
        'MAR': '🇲🇦', 'MOZ': '🇲🇿', 'MMR': '🇲🇲', 'NAM': '🇳🇦', 'NRU': '🇳🇷',
        'NPL': '🇳🇵', 'NLD': '🇳🇱', 'NCL': '🇳🇨', 'NZL': '🇳🇿', 'NIC': '🇳🇮',
        'NER': '🇳🇪', 'NGA': '🇳🇬', 'NIU': '🇳🇺', 'NFK': '🇳🇫', 'MNP': '🇲🇵',
        'NOR': '🇳🇴', 'OMN': '🇴🇲', 'PAK': '🇵🇰', 'PLW': '🇵🇼', 'PSE': '🇵🇸',
        'PAN': '🇵🇦', 'PNG': '🇵🇬', 'PRY': '🇵🇾', 'PER': '🇵🇪', 'PHL': '🇵🇭',
        'PCN': '🇵🇳', 'POL': '🇵🇱', 'PRT': '🇵🇹', 'PRI': '🇵🇷', 'QAT': '🇶🇦',
        'REU': '🇷🇪', 'ROU': '🇷🇴', 'RUS': '🇷🇺', 'RWA': '🇷🇼', 'BLM': '🇧🇱',
        'SHN': '🇸🇭', 'KNA': '🇰🇳', 'LCA': '🇱🇨', 'MAF': '🇲🇫', 'SPM': '🇵🇲',
        'VCT': '🇻🇨', 'WSM': '🇼🇸', 'SMR': '🇸🇲', 'STP': '🇸🇹', 'SAU': '🇸🇦',
        'SEN': '🇸🇳', 'SRB': '🇷🇸', 'SYC': '🇸🇨', 'SLE': '🇸🇱', 'SGP': '🇸🇬',
        'SXM': '🇸🇽', 'SVK': '🇸🇰', 'SVN': '🇸🇮', 'SLB': '🇸🇧', 'SOM': '🇸🇴',
        'ZAF': '🇿🇦', 'USA': '🇺🇸', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'NED': '🇳🇱',
        'DEN': '🇩🇰', 'GBR': '🇬🇧', 'RSA': '🇿🇦', 'SUI': '🇨🇭', 'CHI': '🇨🇱',
        'BER': '🇧🇲', 'ZIM': '🇿🇼', 'VEN': '🇻🇪', 'CRC': '🇨🇷', 'GUA': '🇬🇹',
    }
    return flagMappings[countryCode] || countryCode;
}
function toggleBrushing() {
    // Toggle brushing functionality
}

function displayTooltip(element, text) {
    // Display tooltip for element
}

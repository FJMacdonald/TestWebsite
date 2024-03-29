---
layout: post
title:  "Welcome to Jekyll!"
date:   2024-03-13 10:57:10 -0400
categories: jekyll update
---
<!-- You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/ -->




<!-- Set Up Your Website: Create the structure of your website using HTML, CSS, and JavaScript. 
You'll need an HTML file to create the user interface, a CSS file for styling,
 and a JavaScript file to handle the file upload and D3.js visualization.

Create the User Interface: 
Design the user interface where users can upload their CSV files. You can use HTML form elements 
and styling to create an intuitive and user-friendly interface.

Implement File Upload Functionality: Write JavaScript code to handle the file upload process. 
Use the File API to allow users to select and upload CSV files from their local device. 
You'll also need to handle the file upload event and read the contents of the uploaded CSV file.

Parse and Process the CSV Data: Once the CSV file is uploaded, parse its contents using JavaScript. 
You can use libraries like Papa Parse to parse CSV data easily. Process the data as needed to prepare 
it for visualization with D3.js.

Visualize the Data with D3.js: Use D3.js to create custom visualizations based on the data from the CSV file. 
You can create various types of charts, graphs, or other visualizations to present the data in a special way 
according to your requirements.

Test Your Website: Before deploying your website, thoroughly test it to ensure that the file upload and
visualization functionalities work correctly across different browsers and devices.
Deploy Your Website: Once you're satisfied with your website, deploy it to your chosen hosting platform. 
Follow the instructions provided by the hosting platform to deploy your website for free.

Share Your Website: Share the URL of your website with others so they can upload their CSV files and explore
 the visualizations you've created with D3.js.
By following these steps, you can create a free website that allows users to upload CSV files
 and presents the data in a special way using D3.js for visualization. -->


 <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>CSV File Upload</title>
 </head>
 <body>
   <input type="file" id="csvFileInput" accept=".csv">
   <div id="csvData"></div>
 
   <h1>{{ racename }} <small>- {{ date }}</small></h1>  

   <!-- Initialize the y-scale scale menu -->
   <button id="resetButton" style="margin-bottom: 10px">Reset</button>
   <!-- Create a div where the graph will take place -->
   <div>
      <div id="chart"></div>
   </div>

    <script src="https://d3js.org/d3-color.v1.min.js"> </script> 
    <script src="https://d3js.org/d3-interpolate.v1.min.js"> </script> 
    <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"> </script>
    <script src="https://d3js.org/d3.v7.min.js"></script>
   <script>
     // Function to handle file upload
     function handleFileUpload(event) {
       const file = event.target.files[0]; // Get the uploaded file
       const reader = new FileReader(); // Create a new FileReader object
 
       // Define the onload event handler for the FileReader
       reader.onload = function (e) {
         const csvData = e.target.result; // Get the CSV data
        // displayCSVData(csvData); // Call function to display CSV data
         processData(csvData);
         drawChart(csvData);
       };
 
       // Read the uploaded file as text
       reader.readAsText(file);
     }
 
     // Function to display CSV data
     function displayCSVData(csvData) {
       const csvDataDiv = document.getElementById('csvData'); // Get the div element
       csvDataDiv.textContent = csvData; // Display the CSV data in the div
     }
 
     // Add event listener for file input change
     const fileInput = document.getElementById('csvFileInput');
     fileInput.addEventListener('change', handleFileUpload);

    function processData(csvData) {
        console.log("processing csv");
        const lines = csvData.split('\\n');
        const result = [];

        const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            console.log("line" +i);
            const obj = {};
            const currentline = lines[i].split(',');

            headers.forEach((header, index) => {
                console.log(header);
                obj[header] = currentline[index];
            });

            result.push(obj);
        }

        console.log(result);
    }



    function drawChart(csvData) {

        const blue = ["#01213f","#02325f","#034b8f","#0465bf","#057eef","#2b96fa","#5baefb","#8bc5fc","#bbddfd","#d3e9fd"] //blue
        const blue2 = ["#022b3e","#034362","#056693","#0787c4","#09a9f5","#3abbf7","#6bcbf9","#9cddfb","#cdeefd","#d3f0fd"]
        const blue3 = ["#004049","#005a66","#008799","#00b4cc","#00e1ff","#33e7ff","#66edff","#99f3ff","#ccf9fe","#d2f9fe"]//tealish
        const green = ["#004128","#00663e","#00995d","#00cc7d","#00ff9c","#33ffb0","#66ffc3","#99ffd7","#ccfeeb","#d2feed"]//Tones of Iceland Green 
        const green3 = ["#404900","#5a6600","#879900","#b4cc00","#e1ff00","#e7ff33","#edff66","#f3ff99","#f9fecc","#fafeda"]//swamp green
        const brown = ["#492a00","#663b00","#995800","#cc7600","#ff9300","#ffa933","#ffbe66","#ffd499","#fee9cc","#feecd2"]//beastial brown
        const pink = ["#42190e","#66005d","#99008c","#cc00ba","#ff00e9","#ff33ed","#ff66f2","#ff99f6","#feccfa","#fed2fb"]//devine purple
        const brown2 = ["#35290b","#534012","#7d601b","#a78024","#d1a12d","#dab357","#e3c681","#ecd9ab","#f5ecd5","#f6eeda"]//gold
        const red2 = ["#8e0b0b","#a00c0c","#b20e0e","#d92f2f","#f04d4d","#f67373","#f89696","#fcb9b9","#ffe1e1","#efcece"] //red
        const purple = ["#340066","#4e0099","#6800cc","#8300ff","#9b33ff","#b466ff","#cd99ff","#9279df","#c1b3f8","#e6ccfe"]
        const green2 = ["#0a6e23","#128c31","#1ba73f","#26c34d","#37d760","#54e97a","#7dfc9e","#a7f9bd","#c8f8d6","#e4faea"] //greens
        const redbrown = ["#4c0000","#671c04","#802f0b","#9a4221","#b65537","#d1694e","#e8816b","#f49b8a","#fcb5aa","#ffccd0"] //maroons
        const blue4 = ["#00a0a0","#13b4b4","#26c7c7","#3adbdb","#4deeee","#61f7f7","#8bfdfd","#aafafa","#c8fcfc","#e7ffff"] //blue-green
        const grey = ["#333333","#505050","#666666","#808080","#999999","#b3b3b3","#cccccc","#d9d9d9","#e6e6e6","#f2f2f2"] //greys
        const gold = ["#fdd835","#ffeb3b","#ffe57f","#ffd740","#ffcd3c","#ffc107","#ffca28","#ffc400","#ffc94a","#fff350"] //yellow
        const grey2 = [ "#30475e","#475c76","#596c86","#6b7c95","#7c8ca5","#8d9cb4","#9faebf","#b0becd","#c2cedc","#d3dedb"] //blue-grey
        const green4 = ["#b0d223","#c5e050","#d4e979","#e4f1a4","#eaf4bd","#f0f7d6","#f6f9ea","#f7fbed","#f8fce8","#f9fef2"] //yellow-green
        const purple2 = ["#6341b7","#7357c5","#846dd4","#9279df","#9c86e5","#a493ec","#b3a4f4","#c1b3f8","#d0c2fc","#d8ccfe"] //purple-blue
        const orange = ["#ff4500","#ff6347","#ff8c22","#ff7f5e","#ff9767","#ffaa61","#ffca87","#ffdbb1","#ffedcb","#ffeeea",] //orange-red
        const beige = ["#4c2d19","#704021","#8e5a38","#b7774e","#d49e74","#f0e3c2","#f4ebd3","#f7f4e3","#faf9f2","#fcfcfa"] //beige
        const teal = ["#00796b","#00897b","#009b8b","#00aa9b","#00b8aa","#00c8ba","#00d8c9","#00e8d9","#00f8e9","#00ffff"] //teal
        const red = ["#560f24","#811737","#ac1f49","#d7275b","#df527c","#e77d9d","#efa8bd","#f7d3de","#feffff","#f9e0e7"]
        const colorPalettes = [green2,blue2,red,green,pink,orange,purple,brown,green3,gold,blue3,
        red2,blue,redbrown,grey,green4,green2,brown2,grey2,teal,blue4,beige,purple2]


        // Parse the JSON data from Django context
        var raceData = csvData;

        // Add a click event listener to the reset button
        document.getElementById("resetButton").addEventListener("click", resetChart);

        // Function to reset the chart
        function resetChart() {

            // Reset the y-axis scale to its original domain
            yScale.domain(d3.extent(yValues));

            // Update the y-axis
            svg.select(".y.axis").call(yAxis);

            // Update the lines and circles based on the original yScale
            updateLinesAndCircles();
            //Update Y-axis
            updateYAxis();

            // Reset the brush to its initial position
            svg.select(".brush").call(yBrush.move, null);
        }



        const duration = 300; //To calibrate all races to proportions of swim=10, t=2, bike=30, run=20
        const raceLength = 70;


        // Initialize an empty array to hold team data
        const teamData = [];

        // Group raceData by team
        const teams = Array.from(new Set(raceData.map(d => d.team)));

        var nRects = 0
        var max_time_lag = 0;
        teams.forEach(team => {
        // Filter the data for each team
        const teamAthletes = raceData.filter(d => d.team === team);
        nRects += teamAthletes.length
        // Extract athlete names and values for the team
        const athleteNames = teamAthletes.map(d => d.athlete);
        const athleteValues = teamAthletes.map(d => d.values);

        //Find the slowest race time:
        athleteValues.forEach((value) => {
            if (value[5].y < max_time_lag) {
            max_time_lag = value[5].y;
            }
        });

        // Determine the color palette for the team
        const colorPalette = colorPalettes[teamData.length % colorPalettes.length];

        // Create an object for the team
        const teamObject = {
            team: team,
            athletes: athleteNames,
            values: athleteValues,
            colors: colorPalette,
        };

        // Push the team object into the teamData array
        teamData.push(teamObject);
        });
        max_time_lag = -1 * max_time_lag;
        initial_time_lag = max_time_lag/60;
        // Define the size and spacing of the rectangles
        const size = 25;

        //rectangles in the legend (athletes + teams)
        nRects += teamData.length
        const clientWidth = d3.select("#chart").node().getBoundingClientRect().width;
        const nColumns = Math.trunc(clientWidth/120);
        const bottom = Math.ceil(nRects / nColumns) * size * 1.2 + 70; 


        // set the dimensions and margins of the graph
        var margin = {top: 40, right: 10, bottom: bottom, left: 50},
            width =  clientWidth - margin.left - margin.right,
            height = 500
        // append the svg object to the body of the page
        var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Create a rectangle for the frame
        var frame = svg.append("rect")
        .attr("x", 0)             
        .attr("y", 0)             
        .attr("width", width + margin.left + margin.right)         
        .attr("height", height + margin.top + margin.bottom)       
        .attr("rx", 10)             
        .attr("ry", 10)             
        .attr("stroke", "gray")    
        .attr("opacity", 0.6)
        .attr("stroke-width", 2)    
        .attr("fill", "transparent")
        .attr("transform",
                "translate(-" + margin.left + ",-" + margin.top + ")");


        var xScale = d3.scaleLinear()
            .domain([0, raceLength]) //assuming a 90min race
            .range([0, width]); //leaving space for ledgend

        // Extract y-coordinates from data
        const yValues = teamData.flatMap(team => team.values.flat().map(point => point.y));

        // Define the initial yScale
        const yScale = d3.scaleLinear()
        .domain(d3.extent(yValues))
        .range([height, 0]);

        // Define the initial yAxis
        const yAxis = d3.axisLeft(yScale).ticks(0);

        // Append the yAxis to the svg
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", -30)
        .attr("x", -10)
        .style("font-size", "13px")
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000");



        // Add brushing for y-axis
        var yBrush = d3.brushY()
        .extent([[0, 0], [width, height]])
        .on("end", yBrushed);

        // Create the area variable: where both the area and the brush take place
        var area = svg.append('g')
        .attr("class", "brush")
        .call(yBrush);

        function yBrushed(event) {
            if (!event.selection) return; // Ignore empty selections

            // Get the brushed extent
            var yBrushExtent = event.selection.map(yScale.invert);

            // Update yScale domain
            yScale.domain(yBrushExtent);

            // Update yScale domain if the minimum is greater than the maximum
            if (yBrushExtent[0] > yBrushExtent[1]) {
            yScale.domain([yBrushExtent[1], yBrushExtent[0]]);
            } else {
            yScale.domain(yBrushExtent);
            }

            // Update y-axis with meaningful ticks
            updateYAxis();

            // Update the lines and circles based on the new yScale
            updateLinesAndCircles();

            // Reset the brush to its initial position
            svg.select(".brush").call(yBrush.move, null);
            
        }
        // Handle touch events
        svg.on("touchstart", yBrushed)
            .on("touchmove", yBrushed)
            .on("touchend", yBrushed);


        function updateLinesAndCircles() {

        // Update lines
        svg.selectAll(".line")
            .attr("d", d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y)));

        // Update circles
        svg.selectAll(".athlete-circle")
            .attr("cy", d => yScale(d.y));
        
        // Update labels
        svg.selectAll(".line-text")
            .attr("y", d => yScale(d.y));


        }

        // Function to update the y-axis based on the current yScale
        function updateYAxis() {

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
            svg.select(".y.axis text").remove();
            // Define the y-axis with the calculated number of ticks and custom tick format
            const yAxis = d3.axisLeft(yScale).ticks(numberOfTicks).tickFormat(d => {
            if (d < -90) {
                const mins = -Math.floor(d / 60);
                const secs = -d %60
                return mins + ":" + (secs < 10 ? '0'+secs : secs);
            } else {
                return -d; // For values under or equal to 90 seconds, use the default format
            }
            });


            // Update the y-axis
            svg.select(".y.axis").call(yAxis);
            // Add y-axis gridlines
            svg.selectAll(".y-gridline").remove(); // Remove existing gridlines

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




        updateChart(initial_time_lag);
        updateYAxis();
        

        function updateChart(max_time_lag) {

            
            // Create a group for all athletes
            const athleteGroup = svg.append("g")
            .attr("class", "athlete-group");


        const yScale = d3.scaleLinear()
            .domain(d3.extent(yValues))
            .range([height, 0]);

            
            var lineOpacity = "0.5";
            var lineStroke = "1.0";

            var circleRadius = 3;
            const circleRadiusHover = 6;


            var legendIndex = 0;
            teamData.forEach((team, teamIndex) => {

            var x = legendIndex % nColumns * (clientWidth / nColumns) - 20;
            var y = height + Math.floor(legendIndex / nColumns) * 30 + 50;
            
            // draw the teamrect border
            athleteGroup.append("rect")
                .attr("x", x)
                .attr("y", y)
                .attr("width", size)
                .attr("height", size)
                .style("stroke", "Black")
                .style("stroke-width", lineStroke)
                .style("fill", "white");
            // Teams - legend for each team.
            athleteGroup.append("rect")
                .attr("class", "athlete-ledgend")
                .attr("x", x)
                .attr("y", y)
                .attr("width", size)
                .attr("height", size)
                .attr("class", function(d){ return d})
                .attr("fill", function(d) { // Assign colors based on athlete index within the team
                    var fillColor = team.colors[0 % team.colors.length];
                    var opacity = 0.5; // Adjust the opacity value as needed
                    return d3.color(fillColor).copy({opacity: opacity}).toString();
                })
                .on("click", function() {
                    // Athlete's are in Team order so to highlight the team athletes we need to know how far down the list we are
                    indexCounter = 0
                    for (let i=0; i<teamData.length; i++) {
                    //for some reason team.team has quotation marks in it.  e.g. "Queens"
                    if (team.team.includes(teamData[i].team)) {break;}
                    indexCounter += teamData[i].athletes.length
                    }
                    //Check if the rect is selected 
                    var teamRect = d3.select(this);
                    var opacity = teamRect.style("opacity"); 
                    if (opacity == 0.5) {
                    lineOpacity = 1.0
                    lineStroke = 3.0
                    circleRadius = 3
                    } else if (opacity == 1.0) {
                    lineOpacity = 0.0
                    lineStroke = 1.0    
                    circleRadius = 0          
                    } else {
                    lineOpacity = 0.5
                    lineStroke = 1.0       
                    circleRadius = 3       
                    }
                    teamRect.style("opacity", lineOpacity);
                    team.athletes.forEach((athlete, athleteIndex) => {

                        const athleteLine = svg.selectAll(".line").filter((d, i) => i === athleteIndex + indexCounter);
                        athleteLine.style("opacity", lineOpacity);
                        athleteLine.style("stroke-width", lineStroke);
                    
                        const athleteRect = svg.selectAll(".athlete-ledgend").filter((d, i) => i === athleteIndex + indexCounter);
                        athleteRect.style("opacity", lineOpacity);
                        
                        const athleteCircles = Array.from(svg.selectAll(".athlete-circle").nodes());
                        const circlesForAthlete = athleteCircles.filter(circle => d3.select(circle).attr("team") === team.team);
                        circlesForAthlete.forEach(circle => {
                        d3.select(circle)
                            .style("opacity", lineOpacity)
                            .attr("r", circleRadius);
                        });
                            
                        const athletetext = svg.selectAll(".line-text").filter((d, i) => i === indexCounter + athleteIndex);
        
                        if (lineOpacity == 1.0) {
                        athletetext.style("visibility", "visible");
                        } else {
                        athletetext.style("visibility", "hidden");
                        }

                })
                }); 
                        
                //Add team name next to rect
                athleteGroup.append("text")
                .attr("x", x + 1.2*size)
                .attr("y", y + 0.3*size)
                    .attr("fill", team.colors[0 % team.colors.length])
                    .text(function(d){ 
                    return team.team.split(' ')[0].toUpperCase();
                    })
                    .attr("class", function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")// select the svg area
                    .style("font-size", "12px") 
                    .style("font-weight", 900);

                athleteGroup.append("text")
                .attr("x", x + 1.2*size)
                .attr("y", y + 0.8*size)
                    .attr("fill", team.colors[0 % team.colors.length])
                    .text(function(d){ 
                        if (team.team.split(' ').length > 1)
                            return team.team.split(' ')[1].toUpperCase();
                        })
                    .attr("class", function(d){ return d})
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")// select the svg area
                    .style("font-size", "12px") 
                    .style("font-weight", 900);           

                //increment legendIndex
                legendIndex += 1;

                team.athletes.forEach((athlete, athleteIndex) => {
                x = legendIndex % nColumns * (clientWidth / nColumns) - 20;
                y = height + Math.floor(legendIndex / nColumns) * 30 + 50;
                athleteGroup.append("rect")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", "Black")
                    .style("stroke-width", lineStroke)
                    .style("fill", "white");
                // Athletes - legend for each athlete
                athleteGroup.append("rect")
                    .attr("class", "athlete-ledgend")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", size)
                    .attr("height", size)
                    .attr("fill", team.colors[athleteIndex % team.colors.length]) // Assign colors based on athlete index within the team
                    .style('opacity', lineOpacity)
                    .style("stroke", "Black")
                    .style("stroke-width", lineStroke)
                    .on("click", function() {
                        indexCounter = 0
                        for (let i=0; i<teamData.length; i++) {
                            //for some reason team.team has quotation marks in it.  e.g. "Queens"
                            if (team.team.includes(teamData[i].team)) {break;}
                            indexCounter += teamData[i].athletes.length
                        }
                        
                        // //Check if the rect is selected 
                        var athleteRect = d3.select(this);
                        var opacity = athleteRect.style("opacity"); 
                        if (opacity == 0.5) {
                            lineOpacity = 1.0
                            lineStroke = 3.0
                            circleRadius = 3
                        } else if (opacity == 1.0) {
                            lineOpacity = 0.0
                            lineStroke = 1.0    
                            circleRadius = 0          
                        } else {
                            lineOpacity = 0.5
                            lineStroke = 1.0       
                            circleRadius = 3       
                        }
                        athleteRect.style("opacity", lineOpacity);


                        const athleteLine = svg.selectAll(".line").filter((d, i) => i === indexCounter + athleteIndex);
                        athleteLine.style("opacity", lineOpacity);
                        athleteLine.style("stroke-width", lineStroke);
                            
                        const athleteCircles = Array.from(svg.selectAll(".athlete-circle").nodes());
                        const circlesForAthlete = athleteCircles.filter(circle => d3.select(circle).attr("athlete") === athlete);
                        circlesForAthlete.forEach(circle => {
                            d3.select(circle)
                            .style("opacity", lineOpacity)
                            .attr("r", circleRadius);
                        });    
                        
                        
                        const athletetext = svg.selectAll(".line-text").filter((d, i) => i === indexCounter + athleteIndex);
        
                        if (lineOpacity == 1.0) {
                            athletetext.style("visibility", "visible");
                        } else {
                            athletetext.style("visibility", "hidden");
                        }
                    });
                    //Add athlete first name next to rect
                    athleteGroup.append("text")
                        .attr("x", x + 1.2*size)
                        .attr("y", y + 0.4*size)
                        .attr("fill", team.colors[athleteIndex % team.colors.length])
                        .text(function(d){ 
                        return athlete.split(' ')[0];
                        })
                        .attr("text-anchor", "left")
                        .style("font-size", "12px")
                    //Add last name next to rect
                    athleteGroup.append("text")
                        .attr("x", x + 1.2*size)
                        .attr("y", y + 0.9*size)
                        .attr("fill", team.colors[athleteIndex % team.colors.length])
                        .text(function(d){ 
                        return athlete.split(' ')[1];
                        })
                        .attr("text-anchor", "left")
                        .style("font-size", "12px")

                    //increment legendIndex
                    legendIndex += 1;

                    //Draw chart items (path, circles, name text)
                    athleteGroup.append("path")
                    .datum(team.values[athleteIndex])
                    .attr("class", "line")  
                    .attr("fill", "none")
                    .attr("stroke", team.colors[athleteIndex % team.colors.length])
                    .attr("stroke-width", lineStroke)
                    .attr("d", d3.line()
                        .x(d => xScale(d.x))  
                        .y(d => yScale(d.y))) 
                    .attr("fill", "none")
                    .style('opacity', lineOpacity)
                    .attr("clip-path", "url(#clip)")
                    .on("mouseover", function(d, i) {
                        const [mouseX, mouseY] = d3.pointer(event, this);
                        svg.append("text")
                            .attr("class", "title-text")
                            .style("fill", team.colors[athleteIndex % team.colors.length])  
                            .text(athlete)
                            .attr("text-anchor", "left")
                            .attr("x", mouseX)
                            .attr("y", mouseY)  
                            .style("font-size", "12px")
                        })
                    .on("mouseout", function(d) {
                        svg.select(".title-text").remove();
                        });


                    athleteGroup.selectAll(".circle")
                    .data(team.values[athleteIndex])
                    .enter()
                    .append("circle")
                    .attr("r", circleRadius) 
                    .style('opacity', lineOpacity)
                    .attr("fill", team.colors[athleteIndex % team.colors.length])
                    .attr("class", "athlete-circle")
                    .attr("athlete", athlete)
                    .attr("team", team.team)
                    .attr("cy", d => yScale(d.y))
                    .attr("cx", d => xScale(d.x))
                    .attr("clip-path", "url(#clip)")
                    .on("click", function(d, i) {
                            d3.select(this)
                                .transition()
                                .duration(duration)
                                .attr("r", circleRadiusHover)
                                .style("cursor", "pointer");
                            svg.append("text")
                                .attr("class", "text")
                                .text(i.diff)
                                .attr("x", xScale(i.x) + 5)
                                .attr("y", yScale(i.y) - 10);
                            })
                    .on("mouseout", function(d) {
                        d3.select(this) 
                            .transition()
                            .duration(duration)
                            .attr("r", circleRadius)
                            .style("cursor", "none")  
                        svg
                            .selectAll(".text").remove();
                    });

                    athleteGroup.selectAll(".text")
                        .data([team.values[athleteIndex][5]])
                        .enter()
                        .append("text")
                        .attr("class", "line-text")
                        .text(team.athletes[athleteIndex])
                        .attr("x", xScale(raceLength-5))
                        .attr("y", d => yScale(d.y))
                        .attr("fill", team.colors[athleteIndex % team.colors.length])
                        .text(function(d){ return athlete.split(' ')[0]})
                        .attr("text-anchor", "left")
                        .style("font-size", "10px")
                        .style("visibility", "hidden");
                    
                    });

                });

        // // Define clipping path for lines
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);


            svg.append("defs").append("clipPath")
            .attr("id", "clip-labels")
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("y", -10);


            // Add Axis into SVG 
            var xAxis = d3.axisTop(xScale).ticks(0);
            var yAxis = d3.axisLeft(yScale).ticks(0);


            svg.append("g")
            .attr("class", "x axis")
            .call(xAxis);


            svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append('text')
            .attr("y", -36)
            .attr("x", -10)
            .style("font-size", "14px")
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Time Behind Leader");


        
        // Call the function to draw gridlines
        drawVerticalGridlines(athleteGroup, 10);
        drawVerticalGridlines(athleteGroup, 12);
        drawVerticalGridlines(athleteGroup, 42);
        drawVerticalGridlines(athleteGroup, 44);
        // Function to draw vertical gridlines
        function drawVerticalGridlines(selection, x) {
            selection
            .attr("class", "gridline")
            .append("line")
            .attr('x1', xScale(x))
            .attr('y1', -10)
            .attr('x2', xScale(x))
            .attr('y2', yScale(-height-250))
            .style('stroke', 'gray')
            .style('opacity', 0.5)
            .style("stroke-dasharray", ("3, 3"))
            .style("stroke-width", 0.5);
        }




            //function to annotate chrt 
            function annotateChart(selection, x, y, text) {
            selection
                .append('text')
                .attr('x', xScale(x))
                .attr('y', y)
                .text(text)
                .style('font-size', '14px')
                .style('fill', 'black'); // Customize the text styling as needed
            }

            // annotate with swim, t1, bike, t2, run
            annotateChart(athleteGroup, 1, -10, 'Swim');
            annotateChart(athleteGroup, 10, -10, 'T1');  
            annotateChart(athleteGroup, 24, -10, 'Bike');
            annotateChart(athleteGroup, 42, -10, 'T2'); 
            annotateChart(athleteGroup, 52, -10, 'Run');


        }
    }
</script>
</body>
</html>


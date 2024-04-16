/*
For runsignup get csv in browser from:
https://runsignup.com/Rest/race/127586/results/get-results?format=csv&event_id=596772&include_total_finishers=F&include_split_time_ms=F&supports_nb=F&page=1&results_per_page=300
Get the event id from:
https://runsignup.com/Rest/race/127586
Then convert runsignup csv to world triathlon format:
result_id,place,bib,first_name,last_name,gender,city,state,split-278311,split-278311-pace,split-278312,split-278312-pace,split-278313,split-278313-pace,split-278314,split-278314-pace,split-278315,split-278315-pace,clock_time,chip_time,pace,age,age_percentage,custom-field-208308
64003421,1,96,Franca,Henseleit,F,,,,,,,,,,,,,1:05:08,1:05:08,9:58,19,48.4312,Queens University of Charlotte Triathlon
to
Program ID,Athlete ID,Athlete First Name,Athlete Last Name,Country,Start Number,Swim,T1,Bike,T2,Run,Position,Status,Total Time
630031,115483,Amber,Schlebusch,RSA,2,00:09:45,00:01:05,00:29:18,00:00:00,00:00:00,1,,00:57:59

*/
function generateCSVfileFromRunSignUp() {
    // Fetch data from the API
    fetch('https://runsignup.com/Rest/race/127586/results/get-results?format=csv&event_id=596772&include_total_finishers=F&include_split_time_ms=F&supports_nb=F&page=1&results_per_page=300')
        .then(response => response.text())
        .then(csvData => {
            // Parse CSV data
            console.log('csvData', csvData);

            const parsedData = Papa.parse(csvData, { header: true });
            console.log('parsedData', parsedData);

            // Call processDataAndDownload with the parsed data
            processDataAndDownload(parsedData.data, "filename.csv");
        })
        .catch(error => {
            console.error('Error fetching data from API:', error);
        });
}


function processData(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const modifiedResults = [];

    // Process csv file into a modified results array
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] !== "") {
            const obj = {};
            const currentline = lines[i].split(',');
            headers.forEach((header, index) => {
                obj[header] = currentline[index];
            });

            // Extract and modify data
            var program_id = filename;
            var athlete_id = obj["result_id"];
            var position = obj["place"];
            var start_number = obj["bib"];
            var athlete_firstname = obj["first_name"];
            var athlete_lastname = obj["last_name"];
            var swim = obj["split-278311"] || '00:00:00';
            var t1 = obj["split-278312"] || '00:00:00';
            var bike = obj["split-278313"] || '00:00:00';
            var t2 = obj["split-278314"] || '00:00:00';
            var run = obj["split-278315"] || '00:00:00';
            var status = run === '00:00:00' ? 'DNF' : (swim === '00:00:00' ? 'DNS' : '');
            var clock_time = obj["clock_time"];
            var total_time = obj["chip_time"];
            var team = obj["custom-field-208308"];

            // Construct modified data in CSV format
            var modifiedData = `${program_id},${athlete_id},${athlete_firstname},${athlete_lastname},${team},${start_number},${swim},${t1},${bike},${t2},${run},${position},${status},${total_time}`;

            // Store modified data
            modifiedResults.push(modifiedData);
        }
    }

    // Return or write modified data
    return modifiedResults.join('\n');
}

/*
Copy results from https://my.raceresult.com/ into text file and replace all spaces and tabs with commas 
to generate csv file which needs to be converted into the same format as world triathlon data for use in
graphing site. */
function convertMyRaceResultCSVToStandardFormat(csvData) {
    console.log('csvData', csvData);
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const modifiedResults = [];

    // Process csv file into a modified results array
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        headers.forEach((header, index) => {
            obj[header] = currentline[index];
        });
        console.log('obj', obj);
        // Extract and modify data
        var program_id = 'Program ID';
        var athlete_id = obj["Bib"];
        var athlete_firstname = obj["firstname"];
        var athlete_lastname = obj["lastname"];
        var country = ''; // Add your country data if available
        var start_number = obj["Bib"];
        var position = obj["Place"];
        let swim, t1, bike, t2, run, total_time, status;

        if (position === '*') {
            [swim, t1, bike, t2, run, total_time, status] = handleAsteriskPosition(obj);
        } else {
            [swim, t1, bike, t2, run, total_time, status] = handleRegularPosition(obj);
        } 
        // Construct modified data in CSV format
        var modifiedData = `${program_id},${athlete_id},${athlete_firstname},${athlete_lastname},${country},${start_number},${swim},${t1},${bike},${t2},${run},${position},${status},${total_time}`;
        console.log('modifiedData', modifiedData);
        // Store modified data
        modifiedResults.push(modifiedData);
    }
    
    // Combine modified data into a single CSV string
    return modifiedResults.join('\n');
}




function handleAsteriskPosition(obj) {
    let swim, t1, bike, t2, run, total_time, status;

    if (obj["Swim"] === "DNF") {
        [swim, t1, bike, t2, run, total_time, status] = ["00:00:00", "00:00:00", "00:00:00", "00:00:00", "00:00:00", "00:00:00", 'DNS'];
    } else {
        swim = formatTime(obj["Swim"]);
        if (obj["T1"] === "DNF") {
            [t1, bike, t2, run, total_time, status] = ["00:00:00", "00:00:00", "00:00:00", "00:00:00", "00:00:00", 'DNF'];
        } else {
            t1 = formatTime(obj["T1"]);
            if (obj["Bike"] === "DNF") {
                [bike, t2, run, total_time, status] = ["00:00:00", "00:00:00", "00:00:00", "00:00:00", 'DNF'];
            } else {
                bike = formatTime(obj["Bike"]);
                if (obj["T2"] === "DNF") {
                    [t2, run, total_time, status] = ["00:00:00", "00:00:00", "00:00:00", 'DNF'];
                } else {
                    t2 = formatTime(obj["T2"]);
                    if (obj["Run"] === "DNF") {
                        [run, total_time, status] = ["00:00:00", "00:00:00", 'DNF'];
                    } else {
                        run = formatTime(obj["Run"]);
                        [total_time, status] = [formatTime(obj["Finish"]), ''];
                    }
                }
            }
        }
    }

    return [swim, t1, bike, t2, run, total_time, status];
}

function handleRegularPosition(obj) {
    const swim = formatTime(obj["Swim"]);
    const t1 = formatTime(obj["T1"]);
    const bike = formatTime(obj["Bike"]);
    const t2 = formatTime(obj["T2"]);
    const run = formatTime(obj["Run"]);
    var total_time = formatTime(obj["Finish"]);
    var status = '';
    if (total_time === 'DSQ') {
        total_time = '00:00:00';
        status = 'DSQ'
    }
    return [swim, t1, bike, t2, run, total_time, status];
}


function formatTime(time) {
    console.log('time', time);
    if (time === 'DSQ') {
        return 'DSQ';
    }
    if (!time || time === '0') {
        return '00:00:00';
    }

    // Check the number of colons in the time string
    const numColons = (time.match(/:/g) || []).length;

    if (numColons === 1) {
        // If only one colon, assume minutes and seconds
        const [minutes, seconds] = time.split(':');
        const paddedMinutes = minutes.padStart(2, '0');
        const paddedSeconds = seconds.padStart(2, '0');
        return `00:${paddedMinutes}:${paddedSeconds}`;
    } else {
        // If two colons, assume hours, minutes, and seconds
        const [hours, minutes, seconds] = time.split(':');
        const paddedHours = hours.padStart(2, '0');
        const paddedMinutes = minutes.padStart(2, '0');
        const paddedSeconds = seconds.padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
}
    


function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csvData = event.target.result;
        const filenameInput = document.getElementById('filenameInput');
        const newFilename = filenameInput.value || 'newfilename.csv'; // Use a default filename if none is provided
        const reformattedCsv = convertMyRaceResultCSVToStandardFormat(csvData);
        // Prepend the header to the reformatted CSV data
        const header = "Program ID,Athlete ID,Athlete First Name,Athlete Last Name,Country,Start Number,Swim,T1,Bike,T2,Run,Position,Status,Total Time\n";
        const csvWithHeader = header + reformattedCsv;
        downloadCsv(csvWithHeader, newFilename);
    };

    reader.readAsText(file);
}

function downloadCsv(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
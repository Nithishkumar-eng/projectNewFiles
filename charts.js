// <!---------------- DATA EXTRACTION ----------------!>
// array object of json records
records = data.records;
let colors = ["antiquewhite", "aqua", "aquamarine", "bisque", "blue", "blueviolet", "brown", "chocolate", "yellow",
                "purple", "red", "maroon", "grey", "green", "darksalmon", "darkslategray", "gold", "hotpink"];

// <!-------------------------------------------------!>

// "Placed" vs "UnPlaced" vs "InternOnly"
let internCount = 0;
let companiesSplitUp = {}
for (let i = 0; i<records.length; i++){
    // get companiesSplitUp
    let company = records[i]["Company"];
    if (companiesSplitUp[company] !== undefined){
        companiesSplitUp[company] += 1
    } else {
        companiesSplitUp[company] = 1
    }
    // get internCount
    if (records[i]["InternOnly"] == 1){
        internCount += 1;
    }
}
// get placed and unplaced counts
let unplacedCount = companiesSplitUp["-"];
let placedCount = records.length - unplacedCount;

// status object
let statusObject = {"Placed":placedCount,
                    "UnPlaced":unplacedCount,
                    "InternOnly":internCount}
let statusEntries = Object.entries(statusObject);

// add color
for (let i=0; i<statusEntries.length; i++){
    statusEntries[i].push(colors[i]);
}

// remove unplaced '-'
delete companiesSplitUp["-"];
let companiesSplitUpEntries = Object.entries(companiesSplitUp);

// <!-------------------------------------------------!>

// "Batch" vs "Students Placed"
let yearWiseTotalStudents = {};
let yearWisePlacedStudents = {};
let yearWiseInternStudents = {};
for (let i = 0; i<records.length; i++){
    let batch = records[i]["Batch"];
    if (yearWiseTotalStudents[batch.toString()] != null){
        yearWiseTotalStudents[batch.toString()] += 1;
    } else {
        yearWiseTotalStudents[batch.toString()] = 1;
    }
    if (records[i]["Placed"] == 1){
        if (yearWisePlacedStudents[batch.toString()] != null){
            yearWisePlacedStudents[batch.toString()] += 1;
        } else {
            yearWisePlacedStudents[batch.toString()] = 1;
        }
    }
    if (records[i]["InternOnly"] == 1){
        if (yearWiseInternStudents[batch.toString()] != null){
            yearWiseInternStudents[batch.toString()] += 1;
        } else {
            yearWiseInternStudents[batch.toString()] = 1;
        }
    }
}

// <!-------------------------------------------------!>

// "BatchVsPercentage" & "BatchVsCount"
let batchVsPercentage = [['Year', 'Percentage']];
let batchVsCountChartRows = [['Year', 'Total', 'Placed', 'Intern', 'UnPlaced']];
let batches = Object.keys(yearWiseTotalStudents);
for (let i=0; i<batches.length;i++){
    let batch = batches[i];
    let totalCount = yearWiseTotalStudents[batches[i]];
    let placedCount = yearWisePlacedStudents[batches[i]];
    let internCount = yearWiseInternStudents[batches[i]];
    let unplacedCount = totalCount - (placedCount+internCount);
    let percentage = ((placedCount+internCount) / totalCount) * 100;
    batchVsPercentage.push([batch, percentage]);
    batchVsCountChartRows.push([batch, totalCount, placedCount, internCount, unplacedCount]);
}
batchVsPercentage.push(['2024', 76]);
batchVsPercentage.push(['2025', 82]);
batchVsPercentage.push(['2021', 55]);

batchVsCountChartRows.push(['2020', 300, 106, 2, 192]);
batchVsCountChartRows.push(['2021', 350, 170, 10, 170]);
batchVsCountChartRows.push(['2024', 450, 378, 27, 45]);

// <!-------------------------------------------------!>

// Departments
let departments = {};
batches.forEach(function(batch){
    departments[batch] = {};
});
for (let i = 0; i<records.length; i++){
    let batch = records[i]["Batch"];
    let dept = records[i]["Department"];
    if (yearWiseTotalStudents[batch.toString()] != 0){
        yearWiseTotalStudents[batch.toString()] += 1;
        if (departments[batch][dept] != 0){
            departments[batch][dept] += 1;
        } else {
            departments[batch][dept] = 1;
        }
    } else {
        yearWiseTotalStudents[batch.toString()] = 1;
        if (departments[batch][dept] != 0){
            departments[batch][dept] += 1;
        } else {
            departments[batch][dept] = 1;
        }
    }
}

// <!-------------------------------------------------!>

// print
console.log(statusEntries);
console.log(companiesSplitUpEntries);
console.log(batchVsPercentage);
console.log(batchVsCountChartRows);
console.log(departments);

// <!-------------------- FUNCTIONS --------------------!>
function drawChartAndTable01(){
    drawChart03();
    drawChart04();
    drawTable03();
    drawTable04();
}

function drawChartAndTable02(){
    drawChart05();
    drawTable05();
}

function yearSortFunction() {
    let finalRecords = []
    console.log("Function Executed");
    let filter1, filter2, table, tr, td, td2, i, txtValue, txtValue2;
    filter1 = document.getElementById("year").value;
    filter2 = document.getElementById("dept").value;
    console.log(filter1,filter2);
    for (let i = 0; i<records.length; i++){
        let year = records[i]['Year'];
        let dept = records[i]['Department'];
        if ((filter1 == year || filter1 == 0) && (filter2 == dept || filter2 == "ALL")){
            finalRecords.push(records[i]);
        } else {
        }
    }
    console.log(finalRecords.length, records.length);
}

function deptSortFunction() {
    let deptWiseReport = {};
    batches.forEach(function(batch){
        deptWiseReport[batch] = 0;
    });
    let filter = document.getElementById("dept").value;
    console.log("Function Executed", filter);
    for (let i = 0; i<records.length; i++){
        let dept = records[i]['Department'];
        if ((filter == dept) && (records[i]['Placed'] == 1)){
            let batch = records[i]['Batch'];
            if (deptWiseReport[batch] != 0){
                deptWiseReport[batch] += 1;
            } else {
                deptWiseReport[batch] = 1;
            }
        }
    }
    let deptWiseReportEntries = Object.entries(deptWiseReport);
    return deptWiseReportEntries;
}

function batchSortFunction01() {
    console.log("Function Executed");
    let filter = document.getElementById("batch").value;
    
    let batchWiseCompaniesSplitUp = {};
    let batchWiseDeptSplitUp = {};

    batchWiseCompaniesSplitUp[filter] = {};
    batchWiseDeptSplitUp[filter] = {};
    
    for (let i = 0; i<records.length; i++){
        let batch = records[i]['Batch']; 
        if (batch == filter){
            let company = records[i]["Company"];
            if (batchWiseCompaniesSplitUp[batch][company] != null){
                batchWiseCompaniesSplitUp[batch][company] += 1
            } else {
                batchWiseCompaniesSplitUp[batch][company] = 1
            }
        }
    }
    // remove unplaced '-'
    delete batchWiseCompaniesSplitUp[filter]["-"];
    let batchWiseCompaniesSplitUpEntries = Object.entries(batchWiseCompaniesSplitUp[filter]);
    console.log(batchWiseCompaniesSplitUpEntries);
    return batchWiseCompaniesSplitUpEntries;
}



function batchSortFunction02() {
    let filter = document.getElementById("batch").value;
    console.log("Function Executed, Filter : ", filter);
    let batchWiseDeptSplitUp = Object.keys(departments[filter]);
    //console.log(batchWiseDeptSplitUp);
    let columns = ['Dept', 'Total', 'Placed', 'Intern', 'UnPlaced'];
    let batchWisePlacementSummary = {};
    batchWiseDeptSplitUp.forEach(function(dept){
        batchWisePlacementSummary[dept] = {};
        columns.forEach(function(col){
            batchWisePlacementSummary[dept][col] = 0;
        })
    })
    
    for (let i = 0; i<records.length; i++){
        let batch = records[i]['Batch']; 
        let dept = records[i]['Department'];
        let placed = records[i]["Placed"];
        let intern = records[i]["InternOnly"];
        if (batch == filter){
            batchWisePlacementSummary[dept]['Dept'] = dept;
           if (batchWisePlacementSummary[dept]['Total'] != 0){
            batchWisePlacementSummary[dept]['Total'] += 1;
           } else {
            batchWisePlacementSummary[dept]['Total'] = 1;
           }

            if (placed == 1){
                if (batchWisePlacementSummary[dept]['Placed'] != 0){
                    batchWisePlacementSummary[dept]['Placed'] += 1;
                } else {
                    batchWisePlacementSummary[dept]['Placed'] = 1;
                }
            }

            if (intern == 1){
                if (batchWisePlacementSummary[dept]['Intern'] != 0){
                    batchWisePlacementSummary[dept]['Intern'] += 1;
                } else {
                    batchWisePlacementSummary[dept]['Intern'] = 1;
                }
            }
        }
    }
    batchWiseDeptSplitUp.forEach(function(dept){
    batchWisePlacementSummary[dept]['UnPlaced'] = batchWisePlacementSummary[dept]['Total'] - 
                                (batchWisePlacementSummary[dept]['Placed'] + batchWisePlacementSummary[dept]['Intern']);
                            })
    tableRows = [];
    tableRows.push(['Department', 'Total', 'Placed', 'Intern', 'UnPlaced']);
    for (const property in batchWisePlacementSummary){
        let row = [];
        for (const key in batchWisePlacementSummary[property]){
            row.push(batchWisePlacementSummary[property][key]);
        }
        tableRows.push(row);
    }
    console.log("tableRows", tableRows);
    return tableRows;
}

// <!-------------------- CHARTS --------------------!>
// Load the Visualization API and the piechart package.
google.charts.load('current', {'packages':['corechart']});
google.charts.load('current', {'packages':['line']});
google.charts.load('current', {'packages':['bar']});
google.charts.load('current', {'packages':['table']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart01);
google.charts.setOnLoadCallback(drawChart02);
google.charts.setOnLoadCallback(drawChart03);
google.charts.setOnLoadCallback(drawChart04);
google.charts.setOnLoadCallback(drawChart05);
google.charts.setOnLoadCallback(drawChart06);
google.charts.setOnLoadCallback(drawTable01);
google.charts.setOnLoadCallback(drawTable02);
google.charts.setOnLoadCallback(drawTable03);
google.charts.setOnLoadCallback(drawTable04);
google.charts.setOnLoadCallback(drawTable05);
google.charts.setOnLoadCallback(drawTable06);

function drawChart01() {
    // Create the data table.
    var data = google.visualization.arrayToDataTable(batchVsPercentage);
    // Set chart options
    var options = {
        chart: {
        title: '"Batch" vs "Students Placed Percentage"',
        subtitle: 'Total and Percentage',
        }
    };
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.charts.Bar(document.getElementById('chart_01'));   
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawChart02() {
    var data = google.visualization.arrayToDataTable(batchVsCountChartRows);

    var options = {
        chart: {
        title: '"Batch" vs "Students Placed"',
        subtitle: 'Total, Placed, Intern, and UnPlaced',
        }
    };
    
    var chart = new google.charts.Bar(document.getElementById('chart_02'));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawChart03() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Company');
    data.addColumn('number', 'StudentCount');
    data.addRows(batchSortFunction01());
    
    
    var options = {'title':'"Companies" vs "Students Placed"',
                    subtitle: 'Batch : ' + document.getElementById("batch").value,
                   'width':800,
                   'height':600};
    
    
    var chart = new google.visualization.PieChart(document.getElementById('chart_03'));
    chart.draw(data, options);
}

function drawChart04() {
    var data = google.visualization.arrayToDataTable(batchSortFunction02());
    
    var options = {
        chart: {
        title: '"Departments" vs "Placement Summary"',
        subtitle: 'Total, Placed, Intern, and UnPlaced',
        }
    };
    
    var chart = new google.charts.Bar(document.getElementById('chart_04'));
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawChart05() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Batch');
    data.addColumn('number', 'Count')
    data.addRows(deptSortFunction());

    var options = {
      chart: {
        title: 'Department wise Student Placement Reports'
      },
      width: 800,
      height: 600
    };

    var chart = new google.charts.Line(document.getElementById('chart_05'));
    chart.draw(data, google.charts.Line.convertOptions(options));
}

function drawChart06() {   
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Company');
    data.addColumn('number', 'StudentCount');
    data.addRows(companiesSplitUpEntries);
    
    var options = {'title':'"Companies" vs "Students Placed"',
                   'width':800,
                   'height':600};
    
    var chart = new google.visualization.PieChart(document.getElementById('chart_06'));
    chart.draw(data, options);
}

// <!-------------------- TABLES --------------------!>
function drawTable01() {
    var data = google.visualization.arrayToDataTable(batchVsPercentage);

    var table = new google.visualization.Table(document.getElementById('table_01'));

    table.draw(data, {showRowNumber: true, width: 800, height: 600});
}

function drawTable02() {
    var data = google.visualization.arrayToDataTable(batchVsCountChartRows);

    var table = new google.visualization.Table(document.getElementById('table_02'));

    table.draw(data, {showRowNumber: true, width: 800, height: 600});
}

function drawTable03() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Company');
    data.addColumn('number', 'StudentCount');
    data.addRows(batchSortFunction01());

    var table = new google.visualization.Table(document.getElementById('table_03'));

    table.draw(data, {showRowNumber: true, width: 800, height: 600});
}

function drawTable04() {
    var data = google.visualization.arrayToDataTable(batchSortFunction02());

    var table = new google.visualization.Table(document.getElementById('table_04'));

    table.draw(data, {showRowNumber: true, width: 800, height: 600});
}

function drawTable05() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Batch');
    data.addColumn('number', 'Count')
    data.addRows(deptSortFunction());

    var table = new google.visualization.Table(document.getElementById('table_05'));

    table.draw(data, {showRowNumber: true, width: 800, height: 600});
}

function drawTable06() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Company');
    data.addColumn('number', 'StudentCount');
    data.addRows(companiesSplitUpEntries);

    var table = new google.visualization.Table(document.getElementById('table_06'));

    table.draw(data, {showRowNumber: true, width: 800, height: 600});
}
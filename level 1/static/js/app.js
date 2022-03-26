// from data.js
var tableData = data;

// Creating References
var tablecontent = d3.select("tbody");
var button = d3.select("#filter-btn");
var boxInputDate = d3.select("#datetime");
// Columns from data
var columns = ["datetime", "city", "state", "country", "shape", "durationMinutes", "comments"]

// function to initial load / render of table
function init() {
// Send table data to HTML to show populated table
    var addData = (dataInput) => {
        dataInput.forEach(ufoSightings => {
            var row = tablecontent.append("tr");
            columns.forEach(column => row.append("td").text(ufoSightings[column])
            )
        });
    }
    addData(tableData);
}

// function invoked to filter data and send content filtered to HTML
function filterdata(){
        // Create Event Listener for button
        // Setting up filter button for date
        button.on("click", () => {

            // Prevent page from refreshing
            d3.event.preventDefault();

            //Empty table to get new filtered content
            tablecontent.html("");

            // variable to collect input value introduced. Trim spaces from input
            var inputDate = boxInputDate.property("value").trim();
            // console.log(inputDate)
            // Filter the data from table where date in table is equal input date
            var filterDate = tableData.filter(tableData => tableData.datetime === inputDate);
            // console.log(filterDate)

            // function to add filtered data to HTML table
            var addDatafiltered = (filterDate) => {
                filterDate.forEach(ufosight => {
                    var row = tablecontent.append("tr");
                    columns.forEach(column => row.append("td").text(ufosight[column])
                    )
                });
            }
            
            // if filterDate has content, then append content 
            if(filterDate.length !== 0) {
                addDatafiltered(filterDate);
            }

            //otherwise, added comment as HTML table content if problems with sightings or no filtered content
            
                else {
                    tablecontent.append("tr").append("td").text("Womp womp womp womp NO DATA.");
                    tablecontent.append("tr").append("td").text("There are 3 possible reasons you are here:");
                    tablecontent.append("tr").append("td").text("1. Input format, it has to be like: M/DD/YYYY");
                    tablecontent.append("tr").append("td").text("2. Date not in the range");
                    tablecontent.append("tr").append("td").text("3. No martian in sight");
                }
        })

}
// Invoke function to filter table data
filterdata();
// Render initial table load
init();
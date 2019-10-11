function createCalendar() {
    var d = new Date;
    var year = d.getFullYear()
    var month = d.getMonth()
    var today = d.getDate()
    let firstDay = (new Date(year, month)).getDay();
    console.log(firstDay)//OCTOBER THIS WOULD BE VALUE 2 BECAUSE IT IS A TUESDAY (OR THE THIRD DAY FROM SUNDAY)
    
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']
    const short_days = ['Mon', 'Tue', 'Wed','Thu','Fri','Sat', 'Sun']
    
    var getDaysInMonth = function(month,year) {
        // Here January is 1 based
        //Day 0 is the last day in the previous month
       return new Date(year, month, 0).getDate();
      // Here January is 0 based
      // return new Date(year, month+1, 0).getDate();
    };

    var table = document.getElementById("calendar")
    var date = 1;
    var num_days = getDaysInMonth(month, year)
    for (var i = 0; i++; i<6){ //LOOP TO CREATE ROWS
        var row = document.createElement("tr")
        //creating individual cells within rows
        for (var j=0; j<7;j++){
            if(i===0 && j<firstDay){
                var cell = document.createElement("td");
                var cellText = document.createTextNode("");
                cell.innerHTML+=cellText;
                row.innerHTML+=cell
            }
            else if (date>num_days){
                break;
            }
            else {
                var cell = document.createElement("td");
                var cellText = document.createTextNode(date);
                cell.innerHTML+=cellText;
                row.innerHTML+=cell;
                date++
            }
        }
        table.innerHTML+=row; //THIS APPENDS EACH ROW TO THE TABLE;
    }


}

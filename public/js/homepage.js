window.onload = function() {
  let month_iterator = 0;
  createCalendarMonth(month_iterator);

  //function for recentering calendar
  document
    .getElementById("today_btn")
    .addEventListener("click", function today() {
      month_iterator = 0;
      createCalendarMonth(0);
    });
  document
    .getElementById("next_btn")
    .addEventListener("click", function next() {
      month_iterator++;
      createCalendarMonth(month_iterator);
    });
  document
    .getElementById("prev_btn")
    .addEventListener("click", function next() {
      month_iterator--;
      createCalendarMonth(month_iterator);
    });

  document.getElementById("logout_btn").onclick = logOut;

  let task_form = document.getElementById("create_task_form");
  task_form.onsubmit = e => {
    e.preventDefault();
    createTask().then(res => {
      if (res.status == 201) {
        window.location.pathname = "/dashboard";
      } else {
        let description_box = document.getElementById("month_select");
        let year_box = document.getElementById("year_select");
        let date_box = document.getElementById("date");
        let month_box = document.getElementById("month_select");
        description_box.style.borderColor = "red";
        year_box.style.borderColor = "red";
        date_box.style.borderColor = "red";
        month_box.style.borderColor = "red";
      }
    });
  };

  const delete_search = document.getElementById("myInput");
  autocomplete(delete_search);

  var delete_form = document.getElementById("delete_form");
  delete_form.onsubmit = e => {
    e.preventDefault();
    deleteTask();
  };

  makeTodaysTasks();
};

function createCalendarMonth(month_iter) {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  let month_helper = Math.floor((month + month_iter) / 12);
  month = month + month_iter;
  if (month > 11) {
    month = month - 12 * month_helper;
  }

  var today = d.getDate();
  let day1 = new Date(year, month).getDay(); //THIS IS A VALUE FOR THE FIRST DAY OF THE MONTH

  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const short_days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  Date.prototype.monthDays = function() {
    var d = new Date(this.getFullYear(), month + 1, 0);
    return d.getDate();
  };

  let num_days = d.monthDays();
  let thingy = document.getElementById("date");
  thingy.setAttribute("min", "1");
  thingy.setAttribute("max", "" + num_days);

  getTasks()
    .then(function(response) {
      if (response.status == 401) {
        window.location.href = "/";
        return;
      } else {
        return response.text();
      }
    })
    .then(string_response => {
      let my_thing = JSON.parse(string_response);
      let new_array = [];
      for (key in Object.keys(my_thing)) {
        if (
          my_thing[key].month == month &&
          my_thing[key].year == year + month_helper
        ) {
          new_array.push(my_thing[key]);
        }
      }
      return new_array;
    })
    .then(task_array => {
      let calendar = document.getElementById("calendar");
      calendar.innerHTML = "";
      let cal_row = document.createElement("div");
      cal_row.setAttribute("class", "cal_row");
      let month_name = document.createElement("h2");
      month_name.innerHTML = "" + months[month] + " " + (year + month_helper);

      cal_row.appendChild(month_name);

      //create labels for the days of week
      for (let i = 0; i < 7; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "month_cell");
        let cellText = document.createElement("h3");
        cellText.innerHTML = "" + short_days[i];
        cell.appendChild(cellText);
        cal_row.appendChild(cell);
      }
      calendar.appendChild(cal_row);

      //create rest of the days of the month
      var date = 1;
      let num_rows_counter = 0;
      for (let i = 0; i < 6; i++) {
        //LOOP TO CREATE ROWS
        if (date > num_days) {
          break;
        }
        var row = document.createElement("div");
        row.setAttribute("class", "cal_row cal_date_row");
        //creating individual cells within rows
        for (var j = 0; j < 7; j++) {
          if (i == 0 && j < day1) {
            var cell = document.createElement("div");
            cell.setAttribute("class", "month_cell date_cell");
            var cellText = document.createElement("h3");
            cellText.innerHTML = "N/A";
            cell.appendChild(cellText);
            row.appendChild(cell);
          } else if (date > num_days) {
            break;
          } else {
            var cell = document.createElement("div");
            cell.setAttribute("class", "month_cell date_cell");

            var cellText = document.createElement("h3");
            cellText.innerHTML = date + "";
            cell.appendChild(cellText);
            if (date == today && month_iter == 0) {
              cell.style.backgroundColor = "#2b7a78";
              cell.style.color = "white";
            }

            var daysEvents = document.createElement("p");
            let counter = 0;
            for (ii in Object.keys(task_array)) {
              if (task_array[ii].date == date) {
                var task_text = document.createTextNode(
                  "\n\u2022" + " " + task_array[ii].description
                );
                daysEvents.appendChild(task_text);
                daysEvents.appendChild(document.createElement("br"));
                counter++;
              }
            }
            if (counter != 0) {
              cell.appendChild(daysEvents);
            }
            row.appendChild(cell);

            date++;
          }
        }
        calendar.appendChild(row); //THIS APPENDS EACH ROW TO THE TABLE;
        num_rows_counter++;
      }
    });
}

function load_next_month(month_iter) {
  month_iterator = month_iterator + 1;
  createCalendarMonth(month_iterator);
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function autocomplete(inp) {
  getTasks()
    .then(function(response) {
      if (response.status == 401) {
        window.location.href = "/";
        return;
      } else {
        return response.text();
      }
    })
    .then(string_response => {
      let my_thing = JSON.parse(string_response);
      let new_array = [];
      for (key in Object.keys(my_thing)) {
        new_array.push(my_thing[key].description);
      }
      return new_array;
    })
    .then(arr => {
      /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function(e) {
        var a,
          b,
          i,
          val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
          return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML =
              "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
              closeAllLists();
            });
            a.appendChild(b);
          }
        }
      });
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) {
          //up
          /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function(e) {
        closeAllLists(e.target);
      });
    });
};

function getnumdays() {
  let a_month = document.getElementById("month_select").value;
  let day_select = document.getElementById("date");

  let dict = {
    0: 31,
    1: 29,
    2: 30,
    3: 30,
    4: 31,
    5: 29,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
  };

  let days = dict[a_month];

  for (let i = 1; i < days + 1; i++) {
    let option = document.createElement("option");
    option.innerHTML = i;
    option.setAttribute("value", i);
    day_select.appendChild(option);
  }
};

const logOut = () => {
  return fetch("/users/logoutAll", {
    method: "POST",
    credentials: "include"
  }).then((window.location.href = "/"));
};

const createTask = () => {
  let description = document.getElementById("task_description").value;
  let year = document.getElementById("year_select").value;
  let date = document.getElementById("date").value;
  let month = document.getElementById("month_select").value;
  let post = {
    description,
    month,
    year,
    date
  };
  let body = JSON.stringify(post);
  return fetch("/tasks", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const getTasks = () => {
  return fetch("/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
};

function deleteTask() {
  getTasks()
    .then(function(response) {
      if (response.status == 401) {
        window.location.href = "/";
        return;
      } else {
        return response.text();
      }
    })
    .then(string_response => {
      let my_thing = JSON.parse(string_response);
      let all_task_desc = [];
      let all_task_id = [];
      for (key in Object.keys(my_thing)) {
        all_task_desc.push(my_thing[key].description);
        all_task_id.push(my_thing[key]._id);
      }
      counter = 0;
      task_desc = document.getElementById("myInput").value;
      for (let jj = 0; jj < all_task_desc.length; jj++) {
        if (all_task_desc[jj] == task_desc) {
          break;
        } else {
          counter++;
        }
      }
      var task_id = all_task_id[counter];
      let post = {
        id: task_id
      };
      let body = JSON.stringify(post);
      const options = {
        method: "DELETE",
        body: body,
        headers: {
          "Content-Type": "application/json"
        }
      };
      return fetch("/tasks/" + task_id, options)
        .then(document.location.reload())
        .catch(error => console.log(error));
    });
};

const makeTodaysTasks = () =>{
  let d = new Date().getDate()
  getTasks()
    .then(function(response) {
      if (response.status == 401) {
        window.location.href = "/";
        return;
      } else {
        return response.text();
      }
    })
    .then(string_response => {
      let my_thing = JSON.parse(string_response);
      let today_task = [];
      for (key in Object.keys(my_thing)) {
        if (my_thing[key].date==d){
          today_task.push(my_thing[key].description)
        }
      }
      let event_box = document.getElementById('event-container')
      event_box.innerHTML=''
      console.log(event_box)
      for (let i=0; i<today_task.length; i++){
        let event = document.createElement('h3')
        let event_text = document.createTextNode(today_task[i])
        event.appendChild(event_text)
        event_box.appendChild(event)
      }
    })
  }
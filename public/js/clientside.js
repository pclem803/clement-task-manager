//ONLOAD FUNCTION
window.onload = function (){
  createCalendar()
  var alltasksdata_box = document.getElementById("datastorage");
  var alltasksdata = alltasksdata_box.textContent
  var alltasks=JSON.parse(alltasksdata)
  var alltaskdesc=[]
  var alltaskid=[]
  for (let i=0; i<alltasks.length; i++){
    alltaskdesc[i]=alltasks[i].description
    alltaskid[i]=alltasks[i]._id
  }
  var datatoken = document.getElementById("tokenstorage")
  var authenticationToken=datatoken.textContent

  const delete_search = document.getElementById("myInput")
  autocomplete(delete_search, alltaskdesc)

  var delete_form = document.getElementById("delete_form")
  delete_form.onsubmit = function (e){
    e.preventDefault()
    deleteTask(alltaskdesc, alltaskid, authenticationToken)
  }
  //To get User Data
  getTodaysTasks()

}

var datatoken = document.getElementById("tokenstorage")
var authenticationToken=datatoken.textContent
//TO ADD LOGOUT EVENT LISTENER
var logout = document.getElementById("logout-btn");
logout.addEventListener("click",function(){
  logOut(authenticationToken)
})




/*-------THIS IS THE MODAL FOR ADDING A TASK ---*/

// Get the modal
var modal = document.getElementById("AddModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
  modal.style.display = "none";
}
}


function createCalendar() {
  var d = new Date;
  var year = d.getFullYear()
  var month = d.getMonth()
  var today = d.getDate()
  let day1 = (new Date(year, month)).getDay(); //THIS IS A VALUE FOR THE FIRST DAY OF THE MONTH
  
  const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']
  const short_days = ['Mon', 'Tue', 'Wed','Thu','Fri','Sat', 'Sun']
  
  var getDaysInMonth = function(month,year) {
     return new Date(year, month, 0).getDate();
  };

  var table = document.getElementById("calendar")
  var date = 1;
  var num_days = getDaysInMonth(month, year)
  num_days+=1;

  var title = document.getElementById("cal-date")
  title.innerHTML = months[month] + ', ' + year;


  for (let i = 0; i<6; i++){ //LOOP TO CREATE ROWS
      var row = document.createElement("div");
      row.setAttribute("class", "calrow")
      //creating individual cells within rows
      for (var j=0; j<7;j++){
          if(i==0 && j<day1){
              var cell = document.createElement("div");
              cell.setAttribute("class", "caldate")
              var cellText = document.createTextNode("N/A");
              cell.appendChild(cellText);
              row.appendChild(cell)
          }
          else if (date>num_days){
              break;
          }
          else {
              var cell = document.createElement("div");
              cell.setAttribute("class", "caldate")
              var date_tasks= getTask(date)
              var cellText = document.createTextNode(date);
              cell.appendChild(cellText);
              for (let ii=0; ii<date_tasks.length; ii++){
                var Tasktext=document.createElement("li")
                Tasktext.style.fontSize="inherit"
                var Tasktexttext= document.createTextNode(date_tasks[ii].description)
                Tasktext.style.textTransform = "uppercase"
                Tasktext.style.overflowY="hidden"
                Tasktext.style.overflowX="hidden"
                Tasktext.appendChild(Tasktexttext)
                Tasktext.style.fontSize = "10px"
                Tasktext.style.color = "black"
                if (date==today){
                  Tasktext.style.color ="white"
                }
                cell.appendChild(Tasktext)
                
              }
              if (date==today){
                cell.style.backgroundColor="#557a95"
                cell.style.color ="white"
              }
              row.appendChild(cell);
              date++
          }
      }
      table.appendChild(row); //THIS APPENDS EACH ROW TO THE TABLE;
  }


}


function getTodaysTasks() {
  var datatoken = document.getElementById("tokenstorage")
  var token=datatoken.textContent
  var dataStorage = document.getElementById("datastorage");
  var tasksdata=dataStorage.textContent;
  var tasks = JSON.parse(tasksdata)
  tasks.reverse()
  var currentDiv = document.getElementById("recent-tasks")
  dataStorage.style.display = "none";
  datatoken.style.display = "none";

  const d = new Date
  const today = d.getDate()
  var days_tasks = tasks.filter(task =>task.date == today)
  days_tasks= days_tasks.sort((a, b) => (a.start > b.start) ? 1 : -1)



  for (let i=0; i<days_tasks.length; i++){
    var new_task = document.createElement("button")
    new_task.setAttribute("id", "task-btn-"+i)
    new_task.setAttribute("class", "task")

    if (days_tasks[i].start==12){
      var start_time=days_tasks[i].start+":00pm"
    }
    else if (days_tasks[i].start>12){
      var start_time=(days_tasks[i].start-12)+":00pm"
    }
    else{
      var start_time = days_tasks[i].start + ":00am"
    }

    if (days_tasks[i].end==12){
      var end_time=days_tasks[i].end+":00pm"
    }
    else if(days_tasks[i].end>12){
      var end_time = (days_tasks[i].end-12)+":00pm"
    }
    else{
      var end_time = days_tasks[i].end+":00am"
    }

    var time_text = document.createTextNode(start_time+"-"+end_time)
    var text_break = document.createElement("br")
    var task_desc = document.createTextNode(days_tasks[i].description)
    new_task.appendChild(time_text)
    new_task.appendChild(text_break)
    new_task.appendChild(task_desc)
    if (days_tasks[i].completed==false){
      new_task.style.backgroundColor = "#fff"
    }
    var id=days_tasks[i]._id
    var completed=days_tasks[i].completed
    new_task.addEventListener("click", callCompleteTask(id,token,completed, new_task))
    currentDiv.appendChild(new_task)
 }


}

function callCompleteTask(a,b,c,d){
  return function(){
    completeTask(a,b,c,d)
  }
}


function getTask(num) {
  var dataStorage = document.getElementById("datastorage");
  var tasksdata=dataStorage.textContent;
  var tasks = JSON.parse(tasksdata)
  var dates_tasks = tasks.filter(task =>task.date == num)
  var dates_tasks = dates_tasks.sort((a, b) => (a.start > b.start) ? 1 : -1)
  return dates_tasks
}


function completeTask(id, authToken, completed, task_div){

    if (completed==false){
      var patch ={
        completed:true
      }
      const color="#fff"
      task_div.style.backgroundColor=color
    }
    else{
      var patch ={
        completed:false
      }
      const color="#888"
      task_div.style.backgroundColor=color
    }
  
    const newpatch= async patch => {
      const options={
        method:'PATCH',
      }
      fetch('./'+id+'/update?authorization='+authToken+'&task_id='+!completed, options)
      .then (setTimeout(function(){document.location.reload(true)}, 5))
    }
    
    return newpatch(patch)

}


function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
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
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
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
      } else if (e.keyCode == 38) { //up
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
    if (currentFocus < 0) currentFocus = (x.length - 1);
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
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

function deleteTask(desc_array, id_array, authToken){
  counter=0;
  task_desc=document.getElementById("myInput").value
  for (let jj=0; jj<desc_array.length; jj++){
    if (desc_array[jj]==task_desc){
      break;
    }
    else{
      counter++;
    }
  }
  var task_id = id_array[counter]
  const options={
    method:'DELETE'
  }
  return fetch('./'+task_id+'/delete?authorization='+authToken, options)
  .then (document.location.reload())
  .catch(error=>console.log(error))
}

function logOut(authToken){
  return fetch('/users/logoutAll?authorization='+authToken,{
    method:"POST"
  })
}

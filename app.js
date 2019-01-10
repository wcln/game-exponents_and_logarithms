/*
 * Exponents and Logarithms
 * Western Canadian Learning Network (wcln.ca).
 * January 2019
 * @author Colin Bernard
 */


var currentExample = "Example-1";

/*
 * Initialize the
 */
function init(example) {
  currentExample = example;

  updateCheckButton();

  // Remove all event listeners.
  $('.box').each(function() {
    this.removeEventListener("dragstart", dragstart);
    this.removeEventListener("dragend", dragend);
    this.removeEventListener("dragenter", boxdragenter);
    this.removeEventListener("dragleave", boxdragleave);
  });
  $('.holder').each(function() {
    this.removeEventListener("dragover", dragover);
    this.removeEventListener("dragenter", dragenter);
    this.removeEventListener("dragleave", dragleave);
    this.removeEventListener("drop", drop);
  });

  // Add event listeners to the boxes (draggable).
  $('#'+example+' .box').each(function() {
    this.addEventListener("dragstart", dragstart);
    this.addEventListener("dragend", dragend);
    this.addEventListener("dragenter", boxdragenter);
    this.addEventListener("dragleave", boxdragleave);
  });

  // Add event listerners to all the containers.
  $('#'+example+' .holder').each(function() {
    this.addEventListener("dragover", dragover);
    this.addEventListener("dragenter", dragenter);
    this.addEventListener("dragleave", dragleave);
    this.addEventListener("drop", drop);
  });
}

/*
 * Check button clicked event handler.
 * Checks if the answer is correct or incorrect.
 */
function check() {
  let box4 = $("#"+currentExample+" #holder4 > .box").html().trim();
  let box5 = $("#"+currentExample+" #holder5 > .box").html().trim();
  let box6 = $("#"+currentExample+" #holder6 > .box").html().trim();

  if (currentExample.includes("1")) {
    if (Math.pow(box4, box5) == box6) {
      correct();
    } else {
      incorrect();
    }
  } else if (currentExample.includes("2")) {
    if (box4 == 'x' && box5 == 'y' && box6 == 'z') {
      correct();
    } else {
      incorrect();
    }
  } else if (currentExample.includes("3")) {
    if (box4 == 'b' && box5 == 'a' && box6 == 'c') {
      correct();
    } else {
      incorrect();
    }
  } else {
    if (Math.pow(box4, box5) == box6) {
      correct();
    } else {
      incorrect();
    }
  }
}

/*
 * Reloads a specifc div.
 */
function reset() {
  $.get(location.href).then(function(page) {
    $("#"+currentExample).html($(page).find("#"+currentExample).html());
    document.getElementById('Button-' + currentExample).click();
    init(currentExample);
  });
}

/*
 * Display the correct info <div> and highlight other <div>'s with green.
 */
function correct() {
  $("#"+currentExample+" #equation-2").css("border", "2px solid green")
  $("#"+currentExample+" #holder4, #"+currentExample+" #holder5, #"+currentExample+" #holder6").css("background-color", "#39d861");
  $("#"+currentExample+" #holder4, #"+currentExample+" #holder5, #"+currentExample+" #holder6").css("color", "white");
  $("#"+currentExample+" #equation").css("display", "none");
  $("#"+currentExample+" #correct-info").css("display", "inline-block");
  $("#incorrect-info").css("display", "none");
  $("#check-button").prop("disabled", "true");
}

/*
 * Show the incorrect info <div> and highlight a <div> with red.
 */
function incorrect() {
  $("#"+currentExample+" #equation-2").css("border", "2px solid #d83a3a")
  $("#incorrect-info").css("display", "inline-block");
}

/*
 * Started dragging a box.
 */
function dragstart(e) {
  this.className += " held";
  e.dataTransfer.setData('text', e.target.id);
  // setTimeout(()=>this.className="invisible", 0);
}

/*
 * Stopped dragging a box.
 */
function dragend() {
  this.className = "box";
}

/*
 * Prevent the default action when dragging over an element.
 */
function dragover(e) {
  e.preventDefault();
}

/*
 * Box was dragged over holder.
 */
function dragenter(e) {
  if ($("#"+currentExample+' #' + e.target.id + " .box").length == 0) {
    e.preventDefault()
    this.className += " hovered";
  }
}

/*
 * Box was dragged over box (in a holder).
 */
function boxdragenter(e) {
  this.parentNode.className += " hovered";
}

/*
 * Box leaves holder.
 */
function dragleave(e) {
  if ($("#"+currentExample+' #' + e.target.id + " .box").length == 0) {
    this.classList.remove("hovered");
  }
}

/*
 * Box leaves box (in a holder).
 */
function boxdragleave() {
  this.parentNode.classList.remove("hovered");
}

/*
 * A box is dropped.
 */
function drop(e) {
  // Retrieve data.
  var data = e.dataTransfer.getData("text");

  // Check if dropping into another box, and check if holder is empty.
  if (!e.target.className.includes('box')) {
    if ($("#"+currentExample+' #' + e.target.id + " .box").length == 0) {
      // It's empty.
      e.target.appendChild($("#"+currentExample+" #"+data)[0]);
    } else {
      // There is a box, we need to swap them.
      swapElements($("#"+currentExample+" #"+data)[0], $("#"+currentExample+' #' + e.target.id + " .box")[0]);
    }
  } else {
    // There is a box, we need to swap them.
    swapElements($("#"+currentExample+" #"+data)[0], e.target);
  }

  // Ensure the hovered class is removed for all containers.
  $('.holder').removeClass("hovered");

  // Check if all required holders are full.
  setTimeout(updateCheckButton, 200); // Timeout required as otherwise child hasn't been added... Should use Promise.
}

function updateCheckButton() {



  let allFull = true;
  $("#"+currentExample+" #holder4, #"+currentExample+" #holder5, #"+currentExample+" #holder6").each(function() {
    if ($( this ).find('.box').length == 0) {
      allFull = false;
    }
  });

  // Already got correct answer.
  if ($("#"+currentExample+" #correct-info").css("display") == 'inline-block') {
    allFull = false;
  }

  // If all holders are full.
  if (allFull) {
    // Show check button.
    $('#check-button').prop('disabled', false);
    $("#check-button").prop('title', "Click to check your answer!");
  } else {
    // Hide check button.
    $('#check-button').prop('disabled', true);
    $("#check-button").prop('title', "Fill all boxes in the new equation before clicking 'Check'.");
  }
}

/*
 * Swaps two elements.
 */
function swapElements(obj1, obj2) {
  // Save the location of obj2.
  var parent2 = obj2.parentNode;
  var next2 = obj2.nextSibling;
  // Special case for obj1 is the next sibling of obj2.
  if (next2 === obj1) {
      // Just put obj1 before obj2.
      parent2.insertBefore(obj1, obj2);
  } else {
      // Insert obj2 right before obj1.
      obj1.parentNode.insertBefore(obj2, obj1);

      // Now insert obj1 where obj2 was.
      if (next2) {
          // If there was an element after obj2, then insert obj1 right before that.
          parent2.insertBefore(obj1, next2);
      } else {
          // Otherwise, just append as last child.
          parent2.appendChild(obj1);
      }
  }
}

/*
 * Returns the logarithm of y with base x
 */
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}


function openExample(evt, example) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(example).style.display = "block";
  evt.currentTarget.className += " active";

  // Re-init app.
  init(example);
}

window.onload = function() {
  document.getElementById('Button-' + currentExample).click();
  init(currentExample);
}

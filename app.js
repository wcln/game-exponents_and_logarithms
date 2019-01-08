/*
 * Exponents and Logarithsm
 * Western Canadian Learning Network (wcln.ca).
 * January 2019
 * @author Colin Bernard
 */

class App {

  /*
   * Initialize the App.
   */
  static init() {

    // Get all boxes.
    const boxes = document.getElementsByClassName('box');

    // Add event listeners to the boxes (draggable).
    for (const box of boxes) {
      box.addEventListener("dragstart", App.dragstart);
      box.addEventListener("dragend", App.dragend);
      box.addEventListener("dragenter", App.boxdragenter);
      box.addEventListener("dragleave", App.boxdragleave);
    }

    // Get all containers (holders).
    const containers = document.getElementsByClassName('holder');

    // Add event listerners to all the containers.
    for(const container of containers) {
      container.addEventListener("dragover", App.dragover);
      container.addEventListener("dragenter", App.dragenter);
      container.addEventListener("dragleave", App.dragleave);
      container.addEventListener("drop", App.drop);
    }
  }

  /*
   * Check button clicked event handler.
   * Checks if the answer is correct or incorrect.
   */
  static check() {
    let b = $("#holder4 > .box").html();
    let y = $("#holder5 > .box").html();
    let x = $("#holder6 > .box").html();

    console.log(b);
    console.log(y);
    console.log(x);

    if (Math.pow(b, y) == x) {
      App.correct();
    } else {
      App.incorrect();
    }
  }

  /*
   * Reloads the page.
   */
  static reset() {
    location.reload();
  }

  /*
   * Display the correct info <div> and highlight other <div>'s with green.
   */
  static correct() {
    $("#equation-2").css("border", "2px solid green")
    $("#holder4, #holder5, #holder6").css("background-color", "#39d861");
    $("#holder4, #holder5, #holder6").css("color", "white");
    $("#equation").css("display", "none");
    $("#correct-info").css("display", "inline-block");
    $("#incorrect-info").css("display", "none");
    $("#check-button").prop("disabled", "true");
  }

  /*
   * Show the incorrect info <div> and highlight a <div> with red.
   */
  static incorrect() {
    $("#equation-2").css("border", "2px solid #d83a3a")
    $("#incorrect-info").css("display", "inline-block");
  }

  /*
   * Started dragging a box.
   */
  static dragstart(e) {
    this.className += " held";
    e.dataTransfer.setData('text', e.target.id);
    // setTimeout(()=>this.className="invisible", 0);
  }

  /*
   * Stopped dragging a box.
   */
  static dragend() {
    this.className = "box";
  }

  /*
   * Prevent the default action when dragging over an element.
   */
  static dragover(e) {
    e.preventDefault();
  }

  /*
   * Box was dragged over holder.
   */
  static dragenter(e) {
    if ($('#' + e.target.id + " .box").length == 0) {
      e.preventDefault()
      this.className += " hovered";
    }
  }

  /*
   * Box was dragged over box (in a holder).
   */
  static boxdragenter(e) {
    this.parentNode.className += " hovered";
  }

  /*
   * Box leaves holder.
   */
  static dragleave(e) {
    if ($('#' + e.target.id + " .box").length == 0) {
      this.className = "holder";
    }
  }

  /*
   * Box leaves box (in a holder).
   */
  static boxdragleave() {
    this.parentNode.className = "holder";
  }

  /*
   * A box is dropped.
   */
  static drop(e) {
    // Retrieve data.
    var data = e.dataTransfer.getData("text");

    // Check if dropping into another box, and check if holder is empty.
    if (!e.target.className.includes('box')) {
      if ($('#' + e.target.id + " .box").length == 0) {
        // It's empty.
        e.target.appendChild(document.getElementById(data));
      } else {
        // There is a box, we need to swap them.
        App.swapElements(document.getElementById(data), $('#' + e.target.id + " .box")[0]);
      }
    } else {
      // There is a box, we need to swap them.
      App.swapElements(document.getElementById(data), e.target);
    }

    // Ensure the hovered class is removed for all containers.
    $('.holder').removeClass("hovered");

    // Check if all required holders are full.
    setTimeout(function() {
      let allFull = true;
      $("#holder4, #holder5, #holder6").each(function() {
        if ($( this ).find('.box').length == 0) {
          allFull = false;
        }
      });

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
    }, 200); // Timeout required as otherwise child hasn't been added... Should use Promise.
  }

  /*
   * Swaps two elements.
   */
  static swapElements(obj1, obj2) {
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


}

// Load the App.
document.addEventListener("DOMContentLoaded", App.init);

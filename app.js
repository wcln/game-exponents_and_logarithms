class App {

  static init() {

    const boxes = document.getElementsByClassName('box');

    for (const box of boxes) {
      box.addEventListener("dragstart", App.dragstart);
      box.addEventListener("dragend", App.dragend);
      box.addEventListener("dragenter", App.boxdragenter);
      box.addEventListener("dragleave", App.boxdragleave);
    }

    const containers = document.getElementsByClassName('holder');

    for(const container of containers) {
      container.addEventListener("dragover", App.dragover);
      container.addEventListener("dragenter", App.dragenter);
      container.addEventListener("dragleave", App.dragleave);
      container.addEventListener("drop", App.drop);
    }
  }

  static dragstart(e) {
    this.className += " held";
    e.dataTransfer.setData('text', e.target.id);
    setTimeout(()=>this.className="invisible", 0);
  }

  static dragend() {
    this.className = "box";
  }

  static dragover(e) {
    e.preventDefault();
  }

  static dragenter(e) {
    if ($('#' + e.target.id + " .box").length == 0) {
      e.preventDefault()
      this.className += " hovered";
    }
  }

  static boxdragenter(e) {
    this.parentNode.className += " hovered";
  }

  static dragleave(e) {
    if ($('#' + e.target.id + " .box").length == 0) {
      this.className = "holder";
    }
  }

  static boxdragleave() {
    this.parentNode.className = "holder";
  }

  static drop(e) {
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

    $('.holder').removeClass("hovered");
  }

  static swapElements(obj1, obj2) {
    // save the location of obj2
    var parent2 = obj2.parentNode;
    var next2 = obj2.nextSibling;
    // special case for obj1 is the next sibling of obj2
    if (next2 === obj1) {
        // just put obj1 before obj2
        parent2.insertBefore(obj1, obj2);
    } else {
        // insert obj2 right before obj1
        obj1.parentNode.insertBefore(obj2, obj1);

        // now insert obj1 where obj2 was
        if (next2) {
            // if there was an element after obj2, then insert obj1 right before that
            parent2.insertBefore(obj1, next2);
        } else {
            // otherwise, just append as last child
            parent2.appendChild(obj1);
        }
    }
}


}

document.addEventListener("DOMContentLoaded", App.init);

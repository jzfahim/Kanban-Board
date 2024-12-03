const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

// Drag Functionality
let draggedItem;
let currentCoolumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Make Some Project'];
    progressListArray = ['Working on projects', 'Uploading on Github'];
    completeListArray = ['Go To Gym', 'Drink Tea'];
    onHoldListArray = ['Play Video Game','Buy a pair of shoe','Call Mehedi'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  // listArray = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  // const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

  // arrayNames.forEach((arrayName, i) => {
  //   localStorage.setItem(`${arrayName[i]}Items`, JSON.stringify(listArray[i]));
  // })

  listArray = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArray[index]));
  });

};


//Filter Arrays to remove epty items;
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}



// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  //Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray)

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray)
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray)
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray)
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
};

//Update Item/Delete the item
function updateItem(id, column) {
  const selectedArray = listArray[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id]
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}


//looping all the arrays and rebuliding the array;
// function helperRebuild(parentName, arrayName) {
//   arrayName = [];
//   for (let i = 0; i < parentName.children.length; i++) {
//     console.log(i, 'i is')
//     arrayName.push(parentName.children[i].textContent);
//   }  // helperRebuild(backlogList, backlogListArray);
// helperRebuild(progressList, progressListArray);
// helperRebuild(completeList, completeListArray);
// helperRebuild(onHoldList, onHoldListArray);
// }

//Add to column List, reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArray[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}


//Show add item input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex'
};

//hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}


//Allows arrays to refelct drag and drop items
function rebuildArrays() {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  };
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  };
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  };
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  };

  updateDOM();
}



//When we drag something
function drag(e) {
  draggedItem = e.target;
  dragging = true;

};

//Column Allows for Item to Drop
function allowedDrop(e) {
  e.preventDefault();
};

//Drop Elemnets
function drop(e) {
  e.preventDefault();
  //Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  //Add the item to the column
  const parent = listColumns[currentCoolumn];

  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();


};

//When item enters column Area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentCoolumn = column;

}



//on Load
updateDOM();
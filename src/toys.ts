const toyBtn = document.querySelector(".toy-btn") as HTMLElement;
const treeBtn = document.querySelector(".tree-btn") as HTMLElement;
const entry = document.querySelector(".entry") as HTMLElement;
const toyCatalog = document.querySelector(".toys") as HTMLElement;
const treeCatalog = document.querySelector(".tree") as HTMLElement;
const toyContainer = document.querySelector(
  ".tree-toys__container"
) as HTMLElement;
const entryBtn = document.querySelector(".entry__btn") as HTMLElement;

entryBtn.addEventListener("click", () => toyBtn.click()); // entry
toyBtn.addEventListener("click", handlerToyBtn);
treeBtn.addEventListener("click", handlerTreeBtn);

function handlerToyBtn(e: Event) {
  e.preventDefault();
  toyBtn.classList.add("active");
  treeBtn.classList.remove("active");
  entry.classList.remove("active");
  toyCatalog.classList.add("active");
  treeCatalog.classList.remove("active");
}

function handlerTreeBtn(e: Event) {
  e.preventDefault();
  treeBtn.classList.add("active");
  toyBtn.classList.remove("active");
  entry.classList.remove("active");
  toyCatalog.classList.remove("active");
  treeCatalog.classList.add("active");
  toyContainer.innerHTML = "";
  initTreeCatalog();
}

async function initTreeCatalog() {
  favorites.forEach((toy) => {
    setTreeToyHTML(Object(toy));
  });
}

function setTreeToyHTML(el: DataJson) {
  const newToy = `<div class="tree-toys__block">
    <span >${el.count}</span>
   ${setImgsForToys(el)}
  </div>`;

  toyContainer.insertAdjacentHTML("beforeend", newToy);

  function setImgsForToys(el: DataJson) {
    let res = "";
    for (let i = 0; i < Number(el.count); i++) {
      res += `<img
         src="assets/toys/${el.num}.png"
         alt="image toy tree"
         draggable="true"
         data="${getRandomId()}"
       />`;
    }

    return res;
  }
}

function getRandomId() {
  return (Math.random() * 8888489).toFixed();
}

// CURRENT TREE

const currentTree = document.querySelector(
  ".current-tree__item"
) as HTMLElement;
const currentBackground = document.querySelector(
  ".current-tree"
) as HTMLElement;
const selectTrees = document.querySelectorAll(
  ".trees__block-item"
) as NodeListOf<Element>;
const selectBackgrounds = document.querySelectorAll(".trees__background-item");

for (const selectTree of selectTrees) {
  selectTree.addEventListener("click", () => {
    const src = getSrcForTree(selectTree, "tree");
    currentTree.style.backgroundImage = `url(${src})`;
    deleteActiveClass(selectTrees);
    selectTree.classList.add("active");
  });
}

for (const selectBg of selectBackgrounds) {
  selectBg.addEventListener("click", () => {
    const src = getSrcForTree(selectBg, "bg");
    deleteActiveClass(selectBackgrounds);
    selectBg.classList.add("active");
    currentBackground.style.backgroundImage = `url(${src})`;
  });
}

function getSrcForTree(el: HTMLElement | Element, elType: string) {
  const elNum = el.getAttribute("data");
  if (elType === "tree") return `assets/tree/${elNum}.png`;
  else if (elType === "bg") return `assets/bg/${elNum}.jpg`;
}

// TOY FILTER Shape
// TOY FILTER Shape ----------------------------------------------------------
// TOY FILTER Shape

const shapesSelect = document.querySelectorAll(".settings__value-toys-figure");
const colorSelect = document.querySelectorAll(".cube");
const sizeSelect = document.querySelectorAll(".settings__value-toys-item");

function checkAllCatalogs(toys: Array<DataJson>) {
  let filteredArray;
  filteredArray = checkShape(toys);
  filteredArray = checkColor(filteredArray);
  filteredArray = checkSize(filteredArray);
  tempToys = filteredArray;
  ballContainer.innerHTML = "";
  initData(filteredArray);
  setToySetting();
}

function checkShape(toyArray: Array<DataJson>) {
  const res: Array<DataJson> = [];
  shapesSelect.forEach((toy) => {
    if (toy.classList.contains("active")) {
      const targetShape = toy.getAttribute("data");
      toyArray.filter((item) => {
        if (item.shape === targetShape) res.push(item);
        return item.shape === targetShape;
      });
    }
  });
  return !res.length ? toyArray : res;
}

function checkColor(toyArray: Array<DataJson>) {
  const res: Array<DataJson> = [];
  colorSelect.forEach((toy) => {
    if (toy.classList.contains("active")) {
      const targetColor = toy.getAttribute("data");
      toyArray.filter((item) => {
        if (item.color === targetColor) res.push(item);
        return item.color === targetColor;
      });
    }
  });
  return !res.length ? toyArray : res;
}

function checkSize(toyArray: Array<DataJson>) {
  const res: Array<DataJson> = [];
  sizeSelect.forEach((toy) => {
    if (toy.classList.contains("active")) {
      const targetSize = toy.getAttribute("data");
      toyArray.filter((item) => {
        if (item.size === targetSize) res.push(item);
        return item.size === targetSize;
      });
    }
  });
  return !res.length ? toyArray : res;
}

function setClassEvents(el: Array<HTMLElement> | NodeListOf<Element>) {
  el.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
      checkAllCatalogs(currentToys);
    });
  });
}

function deleteActiveClass(el: Array<HTMLElement> | NodeListOf<Element>) {
  Array.from(el).forEach((item) => item.classList.remove("active"));
}

setClassEvents(shapesSelect);
setClassEvents(colorSelect);
setClassEvents(sizeSelect);

// sort toys

const sortInput = document.getElementById(
  "setting__sort-input"
) as HTMLInputElement;

sortInput.addEventListener("change", () => {
  sortToys(sortInput.value);
});

function sortToys(status: string) {
  if (status == "a-z") {
    tempToys.sort((a, b) =>
      a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0
    );
  } else if (status === "z-a") {
    tempToys.sort((a, b) =>
      a.name !== b.name ? (a.name > b.name ? -1 : 1) : 0
    );
    setToySetting();
  } else if (status === "1-9") {
    tempToys.sort((a: DataJson, b) => Number(a.count) - Number(b.count));
  } else if (status === "9-1") {
    tempToys.sort((a: DataJson, b) => Number(b.count) - Number(a.count));
  }
  ballContainer.innerHTML = "";
  initData(tempToys);
  setToySetting();
}

const defaultSortBtn: HTMLElement = document.querySelector(
  ".settings__sort-btn"
)!;

defaultSortBtn.addEventListener("click", () => {
  deleteActiveClass(shapesSelect);
  deleteActiveClass(colorSelect);
  deleteActiveClass(sizeSelect);
  initData();
  favoriteCount.innerHTML = String(0);
  favorites = [];
  sortInput.value = "a-z";
  sortToys("a-z");
  defaultSortBtn.click();
});

//  drag & drop

let tempImg: HTMLElement;
const toyDivs = document.querySelectorAll(
  ".placeholder"
) as NodeListOf<Element>;
for (const toyDiv of toyDivs) {
  let tempClientX: string;
  let tempClientY: string;

  (toyDiv as HTMLElement).addEventListener("dragstart", (e) => {
    setTimeout(() => {
      (e.target as HTMLElement).style.display = "none";
      tempImg = e.target as HTMLElement;
    }, 0o0);
  });

  toyDiv.addEventListener("dragend", (e: Event | MouseEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).style.display = "block ";
  });

  toyDiv.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  toyDiv.addEventListener("drop", (e) => {
    e.preventDefault();

    const img: HTMLElement = getImgFromData(tempImg)!; // found img from data

    img.style.position = "absolute";
    img.style.top = tempClientY + "px";
    img.style.left = tempClientX + "px";

    (e.target as HTMLElement).appendChild(img);
  });

  toyDiv.addEventListener(
    "dragover",
    (e: Event | MouseEvent | CustomEventMouse) => {
      tempClientX = String(e.offsetX - 20);
      tempClientY = String(e.offsetY - 20);
    }
  );
}

interface CustomEventMouse {
  offsetX: string | number;
  offsetY: string | number;
}

function getImgFromData(img: HTMLImageElement | HTMLElement) {
  const imgs = toyContainer.querySelectorAll("img");
  let res;
  imgs.forEach((el) => {
    const targetData = img.getAttribute("data");
    const imgData = el.getAttribute("data");
    // return imgData == targetData ? el : "";
    if (imgData == targetData) {
      res = el;
    }
  });
  if (!res) {
    const container = document.querySelector(
      ".current-tree__toys-container"
    ) as HTMLElement;
    const images = container.querySelectorAll("img");
    images.forEach((el) => {
      const targetData = img.getAttribute("data");
      const imgData = el.getAttribute("data");
      // return imgData == targetData ? el : "";
      if (imgData == targetData) {
        res = el;
      }
    });
  }

  return res;
}

// function checkToyCount() {
//   const treeBlocks = document.querySelectorAll(".tree-toys__block");
//   for (const block of treeBlocks) {
//     const span = block.querySelector("span") as HTMLElement;
//     const imgs = block.querySelectorAll("img");
//     span.innerHTML = String(imgs.length - 1);
//   }
// }

// search catalog
// search catalog
// search catalog

const inputSearch = document.querySelector(
  ".header__right-input"
) as HTMLInputElement;

inputSearch.addEventListener("change", () => {
  filterFromName(inputSearch.value);
  setToySetting();
});

function filterFromName(name: string) {
  invalidSearchMessage();

  // checking empty value
  if (!inputSearch.value.length) {
    invalidSearchMessage();
    ballContainer.innerHTML = String("");
    initData();
    return;
  }

  const filtered = (currentToys as Array<DataJson>).reduce(
    <T>(acc: Array<T>, item: DataJson) => {
      // check and filter words
      const eachWord = item.name.split(" ");

      for (let word of eachWord) {
        word = word.toLowerCase();
        name = name.toLowerCase().trim();
        if (word === name) {
          acc.push(Object(item));
        }
      }
      return acc;
    },
    []
  );

  if (!filtered.length) {
    invalidSearchMessage(true);
  }

  ballContainer.innerHTML = "";
  initData(filtered);
  return filtered;
}

function invalidSearchMessage<T>(e?: T) {
  if (e) {
    const message = document.createElement("div");
    message.classList.add("search-invalid");
    message.textContent = "Not found, try to search other one";
    document.body.appendChild(message);
    return;
  } else {
    const mess = document.querySelector(".search-invalid") as HTMLElement;
    if (mess) mess.remove();
  }
}

//tree lights
//tree lights
//tree lights

const currentTreeItem = document.querySelector(
  ".current-tree__lights-wrapper"
) as HTMLElement;

function createLights(color: string | number) {
  currentTreeItem.innerHTML = String("");
  generateItems(1, 8, String(color));
  generateItems(2, 14, String(color));
  generateItems(3, 18, String(color));
  generateItems(4, 24, String(color));
}

function generateItems(
  num: string | number,
  count: string | number,
  color: string
) {
  const lightBlock = document.createElement("div");
  lightBlock.classList.add(`current-tree__lights-block-${num}`);

  for (let i = 0; i < Number(count); i++) {
    createLightItem(lightBlock, color);
  }
  currentTreeItem.appendChild(lightBlock);
}

function createLightItem(parentElement: HTMLElement, color: string) {
  const item = document.createElement("span");
  item.classList.add("current-tree__lights-item-span");
  item.style.background = color;
  parentElement.appendChild(item);
}

const treeLights = document.querySelectorAll(".tree_lights-item");
const lightsBtn = document.querySelector(".tree__lights-btn") as HTMLElement;

for (const treeLight of treeLights) {
  // each light buttons
  treeLight.addEventListener("click", () => {
    const treeData = treeLight.getAttribute("data");
    deleteActiveClass(treeLights);
    treeLight.classList.add("active");
    createLights(Number(treeData));
    lightsBtn.textContent = "On";
  });
}

lightsBtn.addEventListener("click", () => {
  if (lightsBtn.textContent == "On") {
    //  stop all lights
    deleteActiveClass(treeLights);
    lightsBtn.textContent = "Off";
    currentTreeItem.innerHTML = "";
    return;
  }

  lightsBtn.textContent = "On";
  treeLights[0].classList.add("active");
  createLights("red");
});

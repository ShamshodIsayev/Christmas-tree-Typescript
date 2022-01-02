const ballContainer: HTMLElement = document.querySelector(".cards")!;
const favoriteCount: HTMLElement = document.querySelector(".fav-balls-count")!;

let toys;
let currentToys: Array<DataJson>;
const favorites: Array<object> = [{}];


interface DataJson {
  num: string;
  name: string;
  shape: string;
  color: string;
  size: string;
  year: string;
  count: string;
  favorite: boolean | HTMLElement | string;
}

async function getData() {
  const newLocal = await fetch("data-eng.json");
  const data: Array<DataJson> = await newLocal.json();
  console.log(data);
  return data;
}
getData();
initData();

function setHTML(el: DataJson) {
  const res = `<div class="cards__item">
     <h2>${el.name}</h2>
     <div class="cards__item-container">
       <div>
         <img
           class="cards__item-container-pic"
           src="assets/toys/${el.num}.png"
           alt=""
           data="${el.num}"
         />
       </div>
       <div>
         <div class="cards__item-container-description">
           Quantity: <span id="quantity">${el.count}</span>
         </div>
         <div class="cards__item-container-description">
           Year of purchase: <span id="year">${el.year}</span>
         </div>
         <div class="cards__item-container-description">
           Shape: <span id="figure">${el.shape}</span>
         </div>
         <div class="cards__item-container-description">
           Color: <span id="color">${el.color}</span>
         </div>
         <div class="cards__item-container-description">
           Size: <span id="size">${el.size}</span>
         </div>
         <div class="cards__item-container-description">
           Favourite: <span id="favorite">${recognizeFavorite(
             el.favorite
           )}</span>
         </div>
       </div>
     </div>
     <div class="ribbon"></div>
   </div>`;

  ballContainer.insertAdjacentHTML("beforeend", res);
}

function recognizeFavorite(el: HTMLElement | string | boolean) {
  return !el ? "true" : "false";
}

async function initData(limitedToys?: Array<DataJson>) {
  if (limitedToys) {
    (limitedToys as Array<DataJson>).forEach((ballItem) => {
      setHTML(ballItem);
    });
    return;
  }
  const data = await getData();
  currentToys = data;
  (data as Array<DataJson>).forEach((ballItem) => {
    setHTML(ballItem);
  });
  await setToySetting();
}

function setToySetting(): void {
  toys = document.querySelectorAll(".cards__item");

  for (const toy of toys) {
    toy.addEventListener("click", () => {
      if (!toy.classList.contains("active")) {
        addToFavorites(toy);
      } else {
        removeFromFavorites(toy);
      }

      toy.classList.toggle("active");
    });
  }
}

function addToFavorites(el: HTMLElement | Element) {
  const count: string | null = (el.querySelector("#quantity") as HTMLElement)
    .textContent;
  const year = (el.querySelector("#year") as HTMLElement).textContent;
  const figure = (el.querySelector("#figure") as HTMLElement).textContent;
  const color = (el.querySelector("#color") as HTMLElement).textContent;
  const size = (el.querySelector("#size") as HTMLElement).textContent;
  const favorite = (el.querySelector("#favorite") as HTMLElement).textContent;
  const num = (
    el.querySelector(".cards__item-container-pic") as HTMLElement
  ).getAttribute("data");

  // check limit size
  if (favorites.length == 20) {
    alert("Maximum favorite toys");
    throw "Limit has been reached";
  }

  const createdObject = {
    count: count,
    year: year,
    figure: figure,
    color: color,
    size: size,
    favorite: favorite,
    num: num,
  };

  favoriteCount as HTMLElement;
  const favoritesCount = (favorites.length + 1).toFixed();
  favoriteCount.innerHTML = String(favoritesCount);

  favorites.push(createdObject);
  return createdObject;
}

function removeFromFavorites(el: Element): void {
  const img: HTMLElement = (<Element>(
    el.querySelector(".cards__item-container-pic")
  )) as HTMLElement;
  const num = img.getAttribute("data");
  (favorites as Array<DataJson>).forEach((item) => {
    //get item toy
    if (item.num == num) {
      const index = favorites.indexOf(item);
      favorites.splice(index, 1);
    }
  });
  favoriteCount.innerHTML = String(favorites.length);
}

// Sound Catalog

const sound = new Audio();
sound.src = "./assets/audio/audio.mp3";

async function play() {
  return (await sound.paused) ? sound.play() : sound.pause();
}

const volume = document.querySelector(".volume") as HTMLElement;
volume.addEventListener("click", () => play());

// จำนวน Pokemon ทั้งหมดใน Generation 1
const MAX_POKEMON = 649;

// ตัวแปรที่ใช้เก็บ Element ของรายการ Pokemon
const listWrapper = document.querySelector(".list-wrapper");

// ตัวแปรที่ใช้เก็บ Element ของช่องค้นหา
const searchInput = document.querySelector("#search-input");

// ตัวแปรที่ใช้เก็บ Filter ของการค้นหา (ตามเลขหรือชื่อ)
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");

// ตัวแปรที่ใช้เก็บ Element ของข้อความเมื่อ Pokemon ไม่พบ
const notFoundMessage = document.querySelector("#not-found-message");

// ตัวแปรที่ใช้เก็บข้อมูล Pokemon ทั้งหมด
let allPokemons = [];

// เรียกใช้ API เพื่อดึงข้อมูล Pokemon
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  });

// ฟังก์ชันสำหรับดึงข้อมูล Pokemon ก่อนเปลี่ยนหน้า
async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokemon data before redirect");
  }
}

// ฟังก์ชันสำหรับแสดงรายการ Pokemon ทั้งหมด
function displayPokemons(pokemon) {
  listWrapper.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">${pokemon.name}</p>
        </div>
    `;

    // เพิ่ม Event Listener เมื่อคลิกที่ Pokemon
    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    listWrapper.appendChild(listItem);
  });
}

// Event Listener สำหรับการค้นหา Pokemon
searchInput.addEventListener("keyup", handleSearch);

// ฟังก์ชันสำหรับการค้นหา Pokemon
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  // แสดง Pokemon ที่ค้นหา
  displayPokemons(filteredPokemons);

  // แสดงข้อความเมื่อ Pokemon ไม่พบ
  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

// Event Listener สำหรับปุ่มปิดค้นหา
const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

// ฟังก์ชันสำหรับล้างข้อมูลค้นหา
function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}
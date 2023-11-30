// ตัวแปรที่ใช้เก็บ ID ของ Pokemon ที่กำลังแสดงรายละเอียด
let currentPokemonId = null;

// Event Listener สำหรับการโหลดหน้าเว็บ
document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 649;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  // ตรวจสอบ ID ของ Pokemon ว่าถูกต้องหรือไม่
  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  // กำหนด ID ของ Pokemon และโหลดข้อมูล Pokemon
  currentPokemonId = id;
  loadPokemon(id);
});

// ฟังก์ชันสำหรับโหลดข้อมูล Pokemon
async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    // ตั้งค่า Element สำหรับ Abilities
    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = "";

    // ตรวจสอบว่า ID ของ Pokemon ตรงกับที่กำลังแสดงรายละเอียดหรือไม่
    if (currentPokemonId === id) {
      // แสดงรายละเอียด Pokemon
      displayPokemonDetails(pokemon);

      // ดึงข้อมูลเนื้อหาภาษาอังกฤษของ Pokemon
      const flavorText = getEnglishFlavorText(pokemonSpecies);

      // แสดงข้อมูลเนื้อหาภาษาอังกฤษ
      document.querySelector(
        ".body3-fonts.pokemon-description"
      ).textContent = flavorText;

      // ตั้งค่า Event Listener สำหรับการนำทาง Pokemon
      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      // กำหนด Event Listener สำหรับการนำทาง Pokemon ทางซ้าย
      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }

      // กำหนด Event Listener สำหรับการนำทาง Pokemon ทางขวา
      if (id !== 151) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }

      // ปรับ URL ใน History
      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occurred while fetching Pokemon data:", error);
    return false;
  }
}

// ฟังก์ชันสำหรับการนำทาง Pokemon
async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

// สีของ Type Pokemon
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

// ฟังก์ชันสำหรับตั้งค่าสีพื้นหลังและตัวหนังสือของ Type Pokemon
function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

// ฟังก์ชันสำหรับแปลง Hex เป็น RGBA
function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

// ฟังก์ชันสำหรับตั้งค่าสีพื้นหลังและตัวหนังสือของ Type Pokemon
function setTypeBackgroundColor(pokemon) {
  const typeWrapper = document.querySelector(".power-wrapper");

  // ล้างค่า HTML ของ Element ที่มี class เป็น "power-wrapper"
  typeWrapper.innerHTML = "";

  // วนลูปเพื่อสร้าง Element และกำหนดสีตาม Type
  pokemon.types.forEach(({ type }) => {
    const color = typeColors[type.name];

    // ตรวจสอบว่าสีมีนิยามหรือไม่
    if (!color) {
      console.warn(`Color not defined for type: ${type.name}`);
      return;
    }

    // สร้าง Element ใน .power-wrapper และกำหนดค่าสี
    const typeElement = createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });

    // ตั้งค่าสีพื้นหลังและเส้นขอบของ Element นี้
    setElementStyles([typeElement], "backgroundColor", color);
  });

  // ตั้งค่าสีพื้นหลังและเส้นขอบของหน้า Detail โดยใช้สีจาก Type แรก
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  // ตรวจสอบว่าสีมีนิยามหรือไม่
  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  // ตั้งค่าสีพื้นหลังและเส้นขอบของหน้า Detail
  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);

  // ตั้งค่าสีของตัวหนังสือที่แสดง Type บนหน้า Detail
  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );

  // ตั้งค่าสีของแถบแสดงความก้าวหน้า (Progress Bar)
  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  // แปลง Hex เป็น RGBA เพื่อใช้กับ Progress Bar
  const rgbaColor = rgbaFromHex(color);

  // สร้าง Style Tag เพื่อใส่ Style สำหรับ Progress Bar
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}


// ฟังก์ชัน capitalizeFirstLetter(string)
// รับข้อความ string และทำการแปลงตัวอักษรตัวแรกให้เป็นตัวพิมพ์ใหญ่และตัวที่เหลือให้เป็นตัวพิมพ์เล็ก
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// ฟังก์ชัน createAndAppendElement(parent, tag, options = {})
// รับพารามิเตอร์ parent (Element หลัก), tag (Tag HTML ที่ต้องการสร้าง), และ options (Object ที่มีค่าเริ่มต้นเป็น {})
// สร้าง Element ใหม่ตาม tag และ options ที่กำหนด และนำ Element นั้นเข้าไปเป็นลูกของ parent
// คืนค่า Element ที่สร้างขึ้น
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

// ฟังก์ชัน displayPokemonDetails(pokemon)
// รับ object ข้อมูลของ Pokemon (pokemon) และนำข้อมูลนั้นไปแสดงบนหน้ารายละเอียด Pokemon
function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  // ตั้งค่า title ของหน้าเว็บ
  document.querySelector("title").textContent = capitalizePokemonName;

  // ตั้งค่า class ของ detail-main ใน Element หลักของหน้า Detail
  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  // แสดงชื่อ Pokemon ใน Element ที่มี class เป็น name
  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;

  // แสดงหมายเลข Pokemon ใน Element ที่มี class เป็น body2-fonts
  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  // ตั้งค่า src และ alt ของ Element รูปภาพ Pokemon
  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  // แสดง Type Pokemon ใน Element ที่มี class เป็น power-wrapper
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  // แสดงน้ำหนักและความสูงของ Pokemon
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

  // แสดง Abilities ของ Pokemon
  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  // แสดงสถิติ (Stats) ของ Pokemon
  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  // Mapping ชื่อสถิติเป็นชื่อย่อ
  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  // แสดงสถิติแต่ละประการ
  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    // แสดงชื่อย่อของสถิติ
    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });

    // แสดงค่าสถิติ
    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    // สร้าง Progress Bar แสดงความก้าวหน้าของสถิติ
    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  // ตั้งค่าสีพื้นหลังของ Type Pokemon
  setTypeBackgroundColor(pokemon);
}

// ฟังก์ชัน getEnglishFlavorText(pokemonSpecies)
// รับ object ข้อมูลของ Pokemon Species (pokemonSpecies) และคืนค่าข้อความคำอธิบายเกี่ยวกับ Pokemon ในภาษาอังกฤษ
function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      // แทนที่เครื่องหมายพิเศษ '\f' ด้วยช่องว่าง
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}

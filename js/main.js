const API = "https://portfolio-backend-xed8.onrender.com";

let categoriesData = [];
let currentCat = null;

function getLevel(l) {
  if (l === 4) return "expert";
  if (l === 3) return "advanced";
  if (l === 2) return "intermediate";
  if (l === 1) return "beginner";
  return "beginner";
}

function renderSkills(cat) {
  const panel = document.getElementById("skills-panel");
  const title = document.getElementById("panel-title");
  const grid = document.getElementById("skill-grid");

  panel.classList.add("fading");
  setTimeout(() => {
    title.textContent = cat.name;
    grid.innerHTML = cat.skills
      .map((s) => {
        const lvl = getLevel(s.level);
        return `<div class="skill-item">
                <span class="skill-name">${s.name}</span>
                <span class="skill-level level-${lvl}">${lvl.charAt(0).toUpperCase() + lvl.slice(1)}</span>
            </div>`;
      })
      .join("");
    panel.classList.remove("fading");
  }, 150);
}

function selectCat(id) {
  if (id === currentCat) return;
  currentCat = id;
  document
    .querySelectorAll(".cat-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("btn-" + id).classList.add("active");
  const cat = categoriesData.find((c) => c.id === id);
  renderSkills(cat);
}

async function loadSkills() {
  try {
    const res = await fetch(`${API}/api/skills/categories`);
    categoriesData = await res.json();
    categoriesData.sort((a, b) => a.name.localeCompare(b.name));

    categoriesData.forEach((c) => {
      if (c.skills) {
        c.skills.sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level;
          return a.name.localeCompare(b.name);
        });
      }
    });

    const row = document.getElementById("cat-row");
    row.innerHTML = categoriesData
      .map(
        (c) =>
          `<div class="cat-btn" id="btn-${c.id}" onclick="selectCat(${c.id})">
                <span class="cat-btn-name">${c.name}</span>
                <span class="cat-btn-count">${c.skills ? c.skills.length : 0} skills</span>
            </div>`,
      )
      .join("");

    if (categoriesData.length > 0) {
      selectCat(categoriesData[0].id);
    }
  } catch (err) {
    document.getElementById("cat-row").innerHTML =
      `<p style="color: var(--text-secondary); font-size: 13px;">Failed to load skills.</p>`;
    console.error("Failed to load skills:", err);
  }
}

loadSkills();

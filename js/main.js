const API = "https://portfolio-backend-xed8.onrender.com";

let current = null;
let expanded = false;
let animating = false;

function getLevel(l) {
  if (l === 4) return "expert";
  if (l === 3) return "advanced";
  if (l === 2) return "intermediate";
  if (l === 1) return "beginner";
  return "not-specified";
}

function renderSkills(skills) {
  document.getElementById("skill-grid").innerHTML = skills
    .map((s) => {
      const level = getLevel(s.level);
      return `<div class="skill-item">
            <span class="skill-name">${s.name}</span>
            <span class="skill-level level-${level}">${level.charAt(0).toUpperCase() + level.slice(1)}</span>
        </div>`;
    })
    .join("");
}

function updateTabs(activeKey, allCategories) {
  document.getElementById("exp-label").textContent = activeKey.name;
  document.getElementById("exp-others").innerHTML = allCategories
    .filter((c) => c.id !== activeKey.id)
    .map(
      (c) =>
        `<div class="exp-other-btn" onclick="switchCat(${c.id})">${c.name}</div>`,
    )
    .join("");
}

function getRect(el) {
  const area = document.getElementById("skills-area");
  const ar = area.getBoundingClientRect();
  const br = el.getBoundingClientRect();
  return {
    left: br.left - ar.left,
    top: br.top - ar.top,
    width: br.width,
    height: br.height,
  };
}

let categoriesData = [];

async function loadSkills() {
  try {
    const res = await fetch(`${API}/api/skills/categories`);
    categoriesData = await res.json();
    const row = document.getElementById("cat-row");
    row.innerHTML = categoriesData
      .map(
        (c) =>
          `<div class="cat-btn" id="btn-${c.id}" onclick="openCat(${c.id})">
                <span class="cat-btn-name">${c.name}</span>
                <span class="cat-btn-count">${c.skills ? c.skills.length : 0} skills</span>
            </div>`,
      )
      .join("");
  } catch (err) {
    console.error("Failed to load skills:", err);
  }
}

function openCat(id) {
  if (animating) return;
  if (expanded) {
    switchCat(id);
    return;
  }
  animating = true;
  const cat = categoriesData.find((c) => c.id === id);
  const btn = document.getElementById("btn-" + id);
  const panel = document.getElementById("exp-panel");
  const label = document.getElementById("exp-label");
  const others = document.getElementById("exp-others");
  const content = document.getElementById("exp-content");
  const area = document.getElementById("skills-area");
  const areaRect = area.getBoundingClientRect();
  const btnR = getRect(btn);

  btn.classList.add("ghost");
  label.classList.remove("show");
  others.classList.remove("show");
  content.classList.remove("show");
  updateTabs(cat, categoriesData);
  renderSkills(cat.skills || []);

  panel.classList.remove("animating");
  panel.style.left = btnR.left + "px";
  panel.style.top = btnR.top + "px";
  panel.style.width = btnR.width + "px";
  panel.style.height = btnR.height + "px";
  panel.classList.add("visible");

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      panel.classList.add("animating");
      panel.style.left = "0px";
      panel.style.top = btnR.top + "px";
      panel.style.width = areaRect.width + "px";
      panel.style.height = "220px";
      setTimeout(() => {
        label.classList.add("show");
        others.classList.add("show");
        setTimeout(() => {
          content.classList.add("show");
          panel.style.height = panel.scrollHeight + "px";
          animating = false;
        }, 80);
        panel.classList.remove("animating");
        expanded = true;
        current = id;
      }, 400);
    }),
  );
}

function switchCat(id) {
  if (animating || id === current) return;
  animating = true;
  const cat = categoriesData.find((c) => c.id === id);
  const content = document.getElementById("exp-content");
  const label = document.getElementById("exp-label");
  const others = document.getElementById("exp-others");
  const prevBtn = document.getElementById("btn-" + current);
  const newBtn = document.getElementById("btn-" + id);

  content.classList.remove("show");
  label.classList.remove("show");
  others.classList.remove("show");

  setTimeout(() => {
    prevBtn.classList.remove("ghost");
    newBtn.classList.add("ghost");
    current = id;
    updateTabs(cat, categoriesData);
    renderSkills(cat.skills || []);
    label.classList.add("show");
    others.classList.add("show");
    setTimeout(() => {
      content.classList.add("show");
      panel.style.height = panel.scrollHeight + "px";
      animating = false;
    }, 80);
  }, 200);
}

loadSkills();

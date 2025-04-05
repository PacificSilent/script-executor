async function fetchScripts() {
  const response = await fetch("/scripts");
  const scripts = await response.json();

  const container = document.getElementById("scripts-list");
  container.innerHTML = "";

  const categories = {};
  scripts
    .filter((script) => script.visible)
    .forEach((script) => {
      if (!categories[script.category]) {
        categories[script.category] = [];
      }
      categories[script.category].push(script);
    });

  Object.keys(categories).forEach((category) => {
    const categoryTitle = document.createElement("h2");
    categoryTitle.textContent = category;
    categoryTitle.classList.add("category-title");
    container.appendChild(categoryTitle);

    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("scripts-container");

    categories[category].forEach((script) => {
      if (script.name === "global_fps_custom.bat") {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("script-item");

        const customGroup = document.createElement("div");
        customGroup.classList.add("custom-fps-group");

        const title = document.createElement("span");
        title.classList.add("script-title");
        title.textContent = "Custom FPS Limiter";
        customGroup.appendChild(title);

        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("slider-container");

        const slider = document.createElement("input");
        slider.type = "range";
        slider.classList.add("fps-slider");
        slider.min = 30;
        slider.max = 240;
        slider.value = 60;
        slider.step = 1;
        slider.setAttribute("list", "fps-ticks");
        sliderContainer.appendChild(slider);

        const dataList = document.createElement("datalist");
        dataList.id = "fps-ticks";

        const tickValues = [30, 60, 70, 80, 90, 100, 120, 144, 165];
        tickValues.forEach((value) => {
          const option = document.createElement("option");
          option.value = value;
          option.label = value;
          dataList.appendChild(option);
        });
        sliderContainer.appendChild(dataList);
        customGroup.appendChild(sliderContainer);

        const valueSpan = document.createElement("span");
        valueSpan.classList.add("fps-value");
        valueSpan.textContent = slider.value + " FPS";
        customGroup.appendChild(valueSpan);

        slider.addEventListener("input", (e) => {
          valueSpan.textContent = e.target.value + " FPS";

          // Update slider background based on value
          const value =
            ((e.target.value - e.target.min) / (e.target.max - e.target.min)) *
            100;
          e.target.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${value}%, 
                              ${
                                document.body.classList.contains("dark")
                                  ? "#4b5563"
                                  : "#e5e7eb"
                              } ${value}%, 
                              ${
                                document.body.classList.contains("dark")
                                  ? "#4b5563"
                                  : "#e5e7eb"
                              } 100%)`;
        });

        // Initialize slider background
        const value =
          ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${value}%, 
                          ${
                            document.body.classList.contains("dark")
                              ? "#4b5563"
                              : "#e5e7eb"
                          } ${value}%, 
                          ${
                            document.body.classList.contains("dark")
                              ? "#4b5563"
                              : "#e5e7eb"
                          } 100%)`;

        const btn = document.createElement("button");
        btn.textContent = "Apply FPS limit";
        btn.classList.add("btn", "btn-primary");
        btn.addEventListener("click", () => {
          const fps = slider.value;
          fetch("/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ script: "global_fps_custom.bat", fps }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data.message);
            })
            .catch((err) => console.error(err));
        });
        customGroup.appendChild(btn);

        itemContainer.appendChild(customGroup);
        container.appendChild(itemContainer);
      } else {
        const btn = document.createElement("button");
        btn.textContent = script.description;
        btn.classList.add("btn", "btn-primary");

        // Apply custom color if provided, otherwise use default primary color
        if (script.color) {
          btn.style.backgroundColor = script.color;
        }

        btn.addEventListener("click", () => handleScriptExecution(script));
        categoryContainer.appendChild(btn);
      }
    });

    container.appendChild(categoryContainer);
  });
}

function handleScriptExecution(script) {
  if (script.requiresConfirmation) {
    showConfirmationModal(() => executeScript(script.name));
  } else {
    executeScript(script.name);
  }
}

function showConfirmationModal(onConfirm) {
  const modal = document.getElementById("confirmation-modal");
  modal.style.display = "flex";

  document.getElementById("confirm-button").onclick = () => {
    modal.style.display = "none";
    onConfirm();
  };

  document.getElementById("cancel-button").onclick = () => {
    modal.style.display = "none";
  };
}

async function executeScript(scriptName) {
  const response = await fetch("/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ script: scriptName }),
  });
  const result = await response.json();
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains("dark")
    ? "dark"
    : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.classList.remove(currentTheme);
  document.body.classList.add(newTheme);
  localStorage.setItem("theme", newTheme);

  // Update theme icon
  updateThemeIcon(newTheme);

  // Update all sliders' backgrounds
  document.querySelectorAll(".fps-slider").forEach((slider) => {
    const value =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${value}%, 
                              ${
                                newTheme === "dark" ? "#4b5563" : "#e5e7eb"
                              } ${value}%, 
                              ${
                                newTheme === "dark" ? "#4b5563" : "#e5e7eb"
                              } 100%)`;
  });
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("theme-icon");

  if (theme === "dark") {
    themeIcon.innerHTML = `
      <path
        fill="currentColor"
        d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"
      ></path>
    `;
  } else {
    themeIcon.innerHTML = `
      <path
        fill="currentColor"
        d="M12 4.5A1.5 1.5 0 0 1 13.5 6 1.5 1.5 0 0 1 12 7.5 1.5 1.5 0 0 1 10.5 6 1.5 1.5 0 0 1 12 4.5M4.22 5.64l1.06 1.06L4.94 8.12 3.88 7.06 4.22 5.64M1 13.5h2.5v-3H1v3m3.64 5.28l1.06-1.06 1.06 1.06-1.06 1.06-1.06-1.06M12 16.5A1.5 1.5 0 0 1 13.5 18 1.5 1.5 0 0 1 12 19.5 1.5 1.5 0 0 1 10.5 18 1.5 1.5 0 0 1 12 16.5m6.36-1.22l1.06 1.06-1.06 1.06-1.06-1.06 1.06-1.06M20 13.5h2.5v-3H20v3m-1.22-6.86l1.06-1.06 1.06 1.06-1.06 1.06-1.06-1.06M16.5 12a4.5 4.5 0 1 1-4.5-4.5 4.5 4.5 0 0 1 4.5 4.5z"
      ></path>
    `;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
  updateThemeIcon(savedTheme);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered successfully:", registration);
    })
    .catch((error) => {
      console.error("Error registering Service Worker:", error);
    });
}

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  fetchScripts();
});

async function fetchScripts() {
  const response = await fetch('/scripts');
  const scripts = await response.json();

  const container = document.getElementById('scripts-list');
  container.innerHTML = '';

  const categories = {};
  scripts.filter(script => script.visible).forEach(script => {
    if (!categories[script.category]) {
      categories[script.category] = [];
    }
    categories[script.category].push(script);
  });

  Object.keys(categories).forEach(category => {
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category;
    categoryTitle.classList.add('category-title');
    container.appendChild(categoryTitle);

    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('scripts-container');
    
    categories[category].forEach(script => {
      if (script.name === "global_fps_custom.bat") {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('script-item');

        const customGroup = document.createElement('div');
        customGroup.classList.add('custom-fps-group');

        const title = document.createElement('span');
        title.classList.add('script-title');
        customGroup.appendChild(title);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.classList.add('fps-slider');
        slider.min = 30;
        slider.max = 240;
        slider.value = 60;
        slider.step = 1;
        slider.setAttribute('list', 'fps-ticks');
        customGroup.appendChild(slider);

        const dataList = document.createElement('datalist');
        dataList.id = 'fps-ticks';

        const tickValues = [30, 60, 70, 80, 90, 100, 120, 144, 165];
        tickValues.forEach(value => {
          const option = document.createElement('option');
          option.value = value;
          option.label = value;
          dataList.appendChild(option);
        });
        customGroup.appendChild(dataList);

        const valueSpan = document.createElement('span');
        valueSpan.classList.add('fps-value');
        valueSpan.textContent = slider.value + " FPS";
        customGroup.appendChild(valueSpan);

        slider.addEventListener('input', (e) => {
          valueSpan.textContent = e.target.value + " FPS";
        });

        const btn = document.createElement('button');
        btn.textContent = 'Apply FPS limit';
        btn.classList.add("btn", "btn-primary", "btn-toggle");
        btn.addEventListener('click', () => {
          const fps = slider.value;
          fetch('/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script: "global_fps_custom.bat", fps }),
          })
            .then(res => res.json())
            .then(data => { console.log(data.message); })
            .catch(err => console.error(err));
        });
        customGroup.appendChild(btn);

        itemContainer.appendChild(customGroup);
        container.appendChild(itemContainer);
      } else {
        const btn = document.createElement('button');
        btn.textContent = script.description;
        btn.classList.add("btn", "btn-primary", "btn-toggle");
        btn.style.backgroundColor = script.color;
        btn.addEventListener('click', () => handleScriptExecution(script));
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
  const modal = document.getElementById('confirmation-modal');
  modal.style.display = 'flex';

  document.getElementById('confirm-button').onclick = () => {
    modal.style.display = 'none';
    onConfirm();
  };

  document.getElementById('cancel-button').onclick = () => {
    modal.style.display = 'none';
  };
}

async function executeScript(scriptName) {
  const response = await fetch('/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script: scriptName }),
  });
  const result = await response.json();
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.classList.remove(currentTheme);
  document.body.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered successfully:', registration);
    })
    .catch(error => {
      console.error('Error registering Service Worker:', error);
    });
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchScripts();
});

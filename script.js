(async () => {
    let manifest;
    try {
      manifest = await fetch('manifest.json').then(r => {
        if (!r.ok) throw new Error('Manifest fetch failed');
        return r.json();
      });
    } catch (err) {
      console.error("❌ Failed to load manifest.json:", err.message);
      alert("Manifest file not found or invalid. Please ensure 'manifest.json' exists and is valid.");
      return;
    }
  
    const humanList = manifest.human || [];
    const machineFolders = Object.keys(manifest.machine || {});
  
    const idSet = new Set(humanList);
    machineFolders.forEach(folder => {
      (manifest.machine[folder] || []).forEach(id => idSet.add(id));
    });
  
    const allIds = Array.from(idSet).sort((a, b) => Number(a) - Number(b));
  
    const stored = localStorage.getItem('ratings');
    let ratings = stored ? JSON.parse(stored) : {};
    allIds.forEach(id => {
      if (!(id in ratings)) ratings[id] = "-";
    });
    localStorage.setItem('ratings', JSON.stringify(ratings));
  
    const machineSelect = document.getElementById('machineSelect');
    machineFolders.forEach(folder => {
      const opt = document.createElement('option');
      opt.value = folder;
      opt.textContent = folder;
      machineSelect.appendChild(opt);
    });
  
    const videoListDiv = document.getElementById('videoList');
    let currentId = null;
  
    allIds.forEach(id => {
      const div = document.createElement('div');
      div.textContent = `${id} [${ratings[id]}]`;
      div.className = 'video-id-item';
      div.dataset.videoId = id;
      div.addEventListener('click', () => selectId(id));
      videoListDiv.appendChild(div);
    });
  
    function updateListSelection() {
      document.querySelectorAll('.video-id-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.videoId === currentId);
      });
    }
  
    async function selectId(id) {
      currentId = id;
      updateListSelection();
  
      document.getElementById('videoLink').innerHTML =
        `<a href="https://bandmaid.tokyo/movies/${id}" target="_blank">https://bandmaid.tokyo/movies/${id}</a>`;
  
      const humanText = document.getElementById('humanText');
      try {
        const txt = await fetch(`human/${id}.txt`).then(r => {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        });
        humanText.textContent = txt;
      } catch {
        humanText.textContent = "No translation";
      }
  
      const machineText = document.getElementById('machineText');
      const folder = machineSelect.value;
      try {
        const txt = await fetch(`${folder}/${id}.txt`).then(r => {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        });
        machineText.textContent = txt;
      } catch {
        machineText.textContent = "No translation";
      }
  
      const ratingVal = ratings[id] || "-";
      document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.checked = (radio.value === ratingVal);
      });
    }
  
    document.getElementById('rating').addEventListener('change', e => {
      if (!currentId) return;
      const val = e.target.value;
      if (["-", "H", "M"].includes(val)) {
        ratings[currentId] = val;
        localStorage.setItem('ratings', JSON.stringify(ratings));
        const label = `${currentId} [${val}]`;
        document.querySelector(`.video-id-item[data-video-id="${currentId}"]`).textContent = label;
      }
    });
  
    machineSelect.addEventListener('change', () => {
      if (currentId) selectId(currentId);
    });
  
    document.getElementById('downloadRatingsBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(ratings, null, 2)], { type
  
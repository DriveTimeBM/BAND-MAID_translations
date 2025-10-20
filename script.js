(async () => {
    let manifest;
    try {
      const resp = await fetch('manifest.json');
      if (!resp.ok) throw new Error(`Manifest fetch failed: ${resp.status}`);
      manifest = await resp.json();
    } catch (err) {
      console.error("❌ Failed to load manifest.json:", err.message);
      alert("Manifest file not found or invalid.");
      return;
    }
  
    const humanList = manifest.human || [];
    const machineFolders = Object.keys(manifest.machine || {});
    const idSet = new Set(humanList);
  
    machineFolders.forEach(folder => {
      (manifest.machine[folder] || []).forEach(id => idSet.add(id));
    });
  
    const allIds = Array.from(idSet).sort((a, b) => Number(a) - Number(b));
  
    let ratings = {};
    const stored = localStorage.getItem('ratings');
    if (stored) {
      try { ratings = JSON.parse(stored); } catch { ratings = {}; }
    }
    allIds.forEach(id => { if (!(id in ratings)) ratings[id] = "-"; });
    localStorage.setItem('ratings', JSON.stringify(ratings));
  
    // Populate dropdown
    const machineSelect = document.getElementById('machineSelect');
    machineFolders.forEach(folder => {
      const opt = document.createElement('option');
      opt.value = folder;
      opt.textContent = folder;
      machineSelect.appendChild(opt);
    });
  
    // Create clickable list of videos
    const videoListDiv = document.getElementById('videoList');
    let currentId = null;
  
    function renderVideoList() {
      videoListDiv.innerHTML = "";
      allIds.forEach(id => {
        const div = document.createElement('div');
        div.textContent = `${id} [${ratings[id]}]`;
        div.className = 'video-id-item';
        div.dataset.videoId = id;
        div.addEventListener('click', () => {
          selectId(id);
        });
        videoListDiv.appendChild(div);
      });
    }
  
    function highlightSelected() {
      document.querySelectorAll('.video-id-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.videoId === currentId);
      });
    }
  
    async function selectId(id) {
      currentId = id;
      highlightSelected();
  
      document.getElementById('videoLink').innerHTML =
        `<a href="https://bandmaid.tokyo/movies/${id}" target="_blank">https://bandmaid.tokyo/movies/${id}</a>`;
  
      const humanText = document.getElementById('humanText');
      try {
        const txt = await fetch(`human/${id}.txt`).then(r => {
          if (!r.ok) throw new Error();
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
          if (!r.ok) throw new Error();
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
        renderVideoList(); // Refresh labels
      }
    });
  
    machineSelect.addEventListener('change', () => {
      if (currentId) selectId(currentId);
    });
  
    document.getElementById('downloadRatingsBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(ratings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ratings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  
    renderVideoList();
    if (allIds.length > 0) selectId(allIds[0]); // ✅ Automatically select first video
  })();
  
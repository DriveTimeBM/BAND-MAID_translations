// script.js
(async () => {
    const manifest = await fetch('manifest.json').then(r => r.json());
    const humanList = manifest.human || [];
    const machineFolders = Object.keys(manifest.machine || {});
    
    // Build superset of IDs
    const idSet = new Set(humanList);
    machineFolders.forEach(folder => {
      (manifest.machine[folder] || []).forEach(id => idSet.add(id));
    });
    const allIds = Array.from(idSet).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
    
    // Load or initialize ratings
    const stored = localStorage.getItem('ratings');
    let ratings = stored ? JSON.parse(stored) : {};
    // Ensure all ids present
    allIds.forEach(id => { if (!(id in ratings)) ratings[id] = '-'; });
    // Save updated baseline
    localStorage.setItem('ratings', JSON.stringify(ratings));
    
    // Populate machineSelect
    const machineSelect = document.getElementById('machineSelect');
    machineFolders.forEach(folder => {
      const opt = document.createElement('option');
      opt.value = folder;
      opt.textContent = folder;
      machineSelect.appendChild(opt);
    });
    
    let currentId = null;
    
    // Populate videoList
    const videoListDiv = document.getElementById('videoList');
    allIds.forEach(id => {
      const div = document.createElement('div');
      div.textContent = id + ' [' + ratings[id] + ']';
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
      
      // Load human
      const humanPane = document.getElementById('humanText');
      try {
        const txt = await fetch(`human/${id}.txt`).then(r => {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        });
        humanPane.textContent = txt;
      } catch(e) {
        humanPane.textContent = "No translation";
      }
      
      // Load machine
      const machinePane = document.getElementById('machineText');
      const folder = machineSelect.value;
      try {
        const txt = await fetch(`${folder}/${id}.txt`).then(r => {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        });
        machinePane.textContent = txt;
      } catch(e) {
        machinePane.textContent = "No translation";
      }
      
      // Set rating radio based on stored value
      const ratingVal = ratings[id] || '-';
      document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.checked = (radio.value === ratingVal);
      });
    }
    
    // Rating change handler
    document.getElementById('rating').addEventListener('change', e => {
      if (!currentId) return;
      const val = e.target.value;
      if (['-','H','M'].includes(val)) {
        ratings[currentId] = val;
        localStorage.setItem('ratings', JSON.stringify(ratings));
        // also update list display label
        document.querySelector(`.video-id-item[data-video-id="${currentId}"]`).textContent = currentId + ' [' + val + ']';
      }
    });
    
    // Machine folder change: reload current video
    machineSelect.addEventListener('change', () => {
      if (currentId) selectId(currentId);
    });
    
    // Initial selection
    if (allIds.length > 0) {
      selectId(allIds[0]);
    }
  })();
  
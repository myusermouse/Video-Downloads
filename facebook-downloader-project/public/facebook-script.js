// Download History Array
let downloadHistory = [];

// Load download history from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const storedHistory = localStorage.getItem('facebookDownloadHistory');
  if (storedHistory) {
    downloadHistory = JSON.parse(storedHistory);
    updateDownloadCount(); // Update count on load
  }
  document.getElementById('download-button').disabled = true; // Disable download button initially
  document.getElementById('video-details').style.display = 'none'; // Hide details section initially
});

// Save download history to localStorage
function saveDownloadHistory() {
  localStorage.setItem('facebookDownloadHistory', JSON.stringify(downloadHistory));
}

// Show Download History Modal
function showDownloadHistory() {
  const modal = document.getElementById('history-modal');
  const historyList = document.getElementById('download-history');
  historyList.innerHTML = ''; // Clear previous history
  
  if (downloadHistory.length === 0) {
    historyList.innerHTML = '<li>No downloads yet.</li>';
  } else {
    downloadHistory.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.platform}: ${item.url.substring(0, 50)}... (Downloaded on ${item.date})`;
      historyList.appendChild(li);
    });
  }
  
  modal.style.display = 'flex';
}

// Close Modal
function closeModal() {
  document.getElementById('history-modal').style.display = 'none';
}

// Update Download Count
function updateDownloadCount() {
  const countElement = document.getElementById('download-count');
  countElement.textContent = downloadHistory.length;
  countElement.style.display = downloadHistory.length > 0 ? 'inline' : 'none';
}

// Update Download Status (next to download icon)
function updateDownloadStatus(status) {
  const statusElement = document.getElementById('download-status');
  statusElement.textContent = status;
}

// Reset UI state
function resetUI() {
  document.getElementById('video-title').textContent = '';
  document.getElementById('video-description').textContent = '';
  document.getElementById('video-formats').textContent = '';
  document.getElementById('quality-selector').innerHTML = '<option value="">Select Quality</option>';
  document.getElementById('download-button').disabled = true;
  document.getElementById('video-details').style.display = 'none'; // Hide details section
  updateDownloadStatus('');
}

// Fetch Video Details
async function fetchVideoDetails() {
  const urlInput = document.getElementById('video-url');
  const url = urlInput.value.trim(); // Trim whitespace
  const videoDetails = document.getElementById('video-details');
  const titleElement = document.getElementById('video-title');
  const descriptionElement = document.getElementById('video-description');
  const formatsElement = document.getElementById('video-formats');
  const qualitySelector = document.getElementById('quality-selector');
  const downloadButton = document.getElementById('download-button');
  
  if (!url) {
    alert('Please enter a valid Facebook video URL');
    resetUI();
    return;
  }

  // Basic URL validation
  if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
    alert('Please enter a valid Facebook video URL (e.g., from facebook.com or fb.watch).');
    resetUI();
    return;
  }
  
  try {
    updateDownloadStatus('Fetching details...');
    
    // Clear previous details and hide section
    resetUI();
    
    const response = await fetch('http://localhost:3000/download/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    
    if (data.error) {
      alert(`Error: ${data.error}`);
      resetUI();
      return;
    }
    
    // Populate video details
    titleElement.textContent = data.title || 'No Title Available';
    descriptionElement.textContent = data.description || 'No description available.';
    
    if (data.formats && data.formats.length > 0) {
        formatsElement.textContent = `Available Qualities: ${data.formats.map(f => f.quality).join(', ')}`;
        qualitySelector.innerHTML = '<option value="">Select Quality</option>';
        data.formats.forEach(format => {
            const option = document.createElement('option');
            option.value = format.url; // Use the actual download URL for the option value
            option.textContent = `${format.quality} (${format.size || 'N/A'})`;
            qualitySelector.appendChild(option);
        });
        downloadButton.disabled = false; // Enable download button if formats are found
    } else {
        formatsElement.textContent = 'No downloadable formats found.';
        qualitySelector.innerHTML = '<option value="">No Qualities Available</option>';
        downloadButton.disabled = true; // Disable if no formats
    }
    
    videoDetails.style.display = 'flex'; // Show the details section
    updateDownloadStatus('');
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Error fetching video details. Please check the server or URL.');
    resetUI();
  }
}

// Start Download
function startDownload() {
  const qualitySelector = document.getElementById('quality-selector');
  const videoUrlInput = document.getElementById('video-url');
  const url = videoUrlInput.value.trim();
  const downloadUrl = qualitySelector.value;
  const selectedQualityText = qualitySelector.options[qualitySelector.selectedIndex].textContent;
  
  if (!downloadUrl || downloadUrl === '') {
    alert('Please select a quality before downloading.');
    return;
  }
  
  updateDownloadStatus('Download started...');
  
  // Add to history
  downloadHistory.push({
    platform: 'Facebook',
    originalUrl: url, // Original URL from input
    downloadUrl: downloadUrl, // The actual URL used for download
    quality: selectedQualityText,
    date: new Date().toLocaleString()
  });
  saveDownloadHistory(); // Save to localStorage
  updateDownloadCount();
  
  // Trigger download (create a temporary anchor tag and click it)
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `facebook_video_${Date.now()}.mp4`; // Suggest a filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Simulate download completion (optional, as actual download is handled by browser)
  setTimeout(() => {
    updateDownloadStatus('Download completed!');
    // Clear status after 3 seconds
    setTimeout(() => updateDownloadStatus(''), 3000); 
  }, 2000); // Simulate network delay
}

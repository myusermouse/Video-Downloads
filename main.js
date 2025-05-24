// Download History Array
let downloadHistory = [];

// Show Download History Modal
function showDownloadHistory() {
  const modal = document.getElementById('history-modal');
  const historyList = document.getElementById('download-history');
  historyList.innerHTML = ''; // Clear previous history
  
  if (downloadHistory.length === 0) {
    historyList.innerHTML = '<li>No downloads yet</li>';
  } else {
    downloadHistory.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.platform}: ${item.url} (Downloaded on ${item.date})`;
      historyList.appendChild(li);
    });
  }
  
  modal.style.display = 'flex';
}

// Close Modal
function closeModal() {
  document.getElementById('history-modal').style.display = 'none';
}

// Open Platform Page (Placeholder)
function openPlatform(platform) {
  // এখানে প্ল্যাটফর্ম-নির্দিষ্ট পেজে রিডাইরেক্ট করা যাবে
  // উদাহরণস্বরূপ, URL ইনপুট পেজে যাওয়ার জন্য
  alert(`Clicked on ${platform}. Redirect to URL input page.`);
  // ভবিষ্যতে এখানে নতুন পেজে রিডাইরেক্ট করা যাবে, যেমন:
  // window.location.href = `download.html?platform=${platform}`;
}

// Update Download Count (Example)
function updateDownloadCount() {
  const countElement = document.getElementById('download-count');
  countElement.textContent = downloadHistory.length;
  countElement.style.display = downloadHistory.length > 0 ? 'inline' : 'none';
}

// Example: Simulate Adding to Download History
function addToHistory(platform, url) {
  downloadHistory.push({
    platform,
    url,
    date: new Date().toLocaleString()
  });
  updateDownloadCount();
}

// Simulate Download (For Testing)
document.addEventListener('DOMContentLoaded', () => {
  // Simulate a download for testing
  setTimeout(() => {
    addToHistory('YouTube', 'https://youtube.com/watch?v=example');
  }, 2000); // Add to history after 2 seconds
});
const devices = [
  { id: '1', name: 'Windows PC', browser: 'Microsoft Edge', location: 'Mumbai, India', lastActive: 'Active now', current: true, icon: 'monitor' },
  { id: '2', name: 'iPhone 15', browser: 'Safari', location: 'Mumbai, India', lastActive: '2 hours ago', current: false, icon: 'smartphone' },
  { id: '3', name: 'iPad Air', browser: 'Vela app', location: 'Pune, India', lastActive: '3 days ago', current: false, icon: 'tablet' }
];

function showToast(message) {
  const toast = document.querySelector('#accountToast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

function renderDevices() {
  document.querySelector('#deviceList').innerHTML = devices.length
    ? devices.map(device => `
        <div class="device-row" data-id="${device.id}">
          <div class="device-icon"><i data-lucide="${device.icon}"></i></div>
          <div class="device-info">
            <strong>${device.name}${device.current ? ' <span class="device-badge">This device</span>' : ''}</strong>
            <span>${device.browser} · ${device.location}</span>
            <small>${device.lastActive}</small>
          </div>
          ${device.current ? '' : '<button type="button" class="device-signout">Sign out</button>'}
        </div>
      `).join('')
    : '<p class="empty-devices">No other active sessions.</p>';

  document.querySelectorAll('.device-signout').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.device-row');
      const id = row.dataset.id;
      const index = devices.findIndex(d => d.id === id);
      if (index > -1) {
        devices.splice(index, 1);
        renderDevices();
        if (window.lucide) window.lucide.createIcons();
        showToast('Device signed out.');
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function initTheme() {
  if (localStorage.getItem('vela-theme') === 'dark') {
    document.body.classList.add('dark');
  }
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.setAttribute('data-lucide', document.body.classList.contains('dark') ? 'sun' : 'moon');
  }
}

document.querySelector('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('vela-theme', isDark ? 'dark' : 'light');
  const icon = document.querySelector('#themeToggle i');
  if (icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  if (window.lucide) window.lucide.createIcons();
});

document.querySelector('#profileForm').addEventListener('submit', event => {
  event.preventDefault();
  showToast('Profile updated.');
});

document.querySelector('#passwordForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  if (data.get('newPassword') !== data.get('confirmPassword')) {
    showToast('New passwords do not match.');
    return;
  }
  event.target.reset();
  showToast('Password updated.');
});

document.querySelector('#signOutOthers').addEventListener('click', () => {
  const current = devices.find(d => d.current);
  devices.length = 0;
  if (current) devices.push(current);
  renderDevices();
  showToast('Signed out of all other devices.');
});

document.querySelector('#exportData').addEventListener('click', () => {
  showToast('Export started — check your downloads.');
});

document.querySelector('#deleteAccount').addEventListener('click', () => {
  if (confirm('Delete your Vela account? This cannot be undone.')) {
    showToast('Account deletion request received.');
  }
});

document.querySelector('#editAvatarBtn').addEventListener('click', () => {
  showToast('Photo upload is not available in this demo.');
});

initTheme();
renderDevices();
if (window.lucide) window.lucide.createIcons();

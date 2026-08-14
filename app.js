function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Good evening';
  if (hour >= 5 && hour < 12) greeting = 'Good morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 22) greeting = 'Good evening';
  else greeting = 'Good night';

  const dateEl = document.querySelector('#greetingDate');
  const greetingEl = document.querySelector('#greetingText');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  if (greetingEl) greetingEl.textContent = greeting;
}

const greetingColors = ['#7c5cfc', '#e0567a', '#1a9e72', '#c4922a', '#9369ec', '#d47a9a'];
let greetingColorIndex = 0;

function initGreetingColorCycle() {
  const greetingEl = document.querySelector('#greetingText');
  if (!greetingEl) return;

  greetingEl.style.color = greetingColors[0];
  setInterval(() => {
    greetingColorIndex = (greetingColorIndex + 1) % greetingColors.length;
    greetingEl.style.color = greetingColors[greetingColorIndex];
  }, 30000);
}

const notifications = [];

function renderNotifications() {
  const list = document.querySelector('#notificationsList');
  const dot = document.querySelector('#notificationDot');
  if (!list) return;

  if (!notifications.length) {
    list.innerHTML = '<p class="notifications-empty">No unread messages</p>';
    dot?.classList.add('is-hidden');
    return;
  }

  dot?.classList.remove('is-hidden');
  list.innerHTML = notifications.map(n => `
    <div class="notification-item">
      <div class="notification-item-icon"><i data-lucide="${n.icon}"></i></div>
      <div>
        <strong>${n.title}</strong>
        <span>${n.message}</span>
        <small>${n.time}</small>
      </div>
    </div>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
}

function initNotifications() {
  const btn = document.querySelector('#notificationsBtn');
  const panel = document.querySelector('#notificationsPanel');
  if (!btn || !panel) return;

  const closePanel = () => {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', event => {
    event.stopPropagation();
    const isOpen = !panel.hidden;
    if (isOpen) {
      closePanel();
      return;
    }
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    renderNotifications();
  });

  document.addEventListener('click', event => {
    if (!panel.hidden && !panel.contains(event.target) && !btn.contains(event.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePanel();
  });
}

const transactions = [
  { name: 'Whole Foods Market', category: 'Food & dining', date: 'Today, 10:42 AM', amount: 1840, type: 'expense', icon: '🥬' },
  { name: 'Netflix', category: 'Entertainment', date: 'Yesterday', amount: 649, type: 'expense', icon: '🎬' },
  { name: 'Monthly salary', category: 'Income', date: 'Aug 1, 2026', amount: 92400, type: 'income', icon: '✦' },
  { name: 'Uber', category: 'Travel', date: 'Jul 31, 2026', amount: 425, type: 'expense', icon: '🚕' },
  { name: 'Zara', category: 'Shopping', date: 'Jul 29, 2026', amount: 3299, type: 'expense', icon: '♧' }
];
let activeFilter = 'all';
const money = n => `₹ ${n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0 })}`;
function renderTransactions() {
  const q = document.querySelector('#searchInput').value.toLowerCase();
  const filtered = transactions.filter(t => (activeFilter === 'all' || t.type === activeFilter) && `${t.name} ${t.category}`.toLowerCase().includes(q));
  document.querySelector('#transactionList').innerHTML = filtered.length ? filtered.map(t => `<div class="transaction"><div class="transaction-icon">${t.icon}</div><div class="transaction-name"><strong>${t.name}</strong><span>${t.category}</span></div><span class="transaction-date">${t.date}</span><strong class="amount ${t.type}">${t.type === 'income' ? '+' : '−'} ${money(t.amount)}</strong></div>`).join('') : '<p style="color:var(--muted);font-size:12px;padding:15px 0">No transactions found.</p>';
}
function updateExpenseTotal() { const total = transactions.filter(t => t.type === 'expense').reduce((sum,t) => sum+t.amount, 31217); document.querySelector('#expenseTotal').textContent = money(total); }
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => { activeFilter=btn.dataset.filter; document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===btn)); renderTransactions(); }));
document.querySelector('#searchInput').addEventListener('input', renderTransactions);
const dialog = document.querySelector('#transactionDialog');
document.querySelector('#addTransaction').onclick = () => dialog.showModal();
document.querySelector('.close-modal').addEventListener('click', () => {
  dialog.close();
  document.querySelector('#transactionForm').reset();
});
document.querySelector('#transactionForm').addEventListener('submit', event => {
  event.preventDefault();
  const d = new FormData(event.target);
  transactions.unshift({ name: d.get('description'), category: d.get('category'), amount: Number(d.get('amount')), type: d.get('type'), date: 'Just now', icon: d.get('type') === 'income' ? '✦' : '●' });
  renderTransactions();
  updateExpenseTotal();
  dialog.close();
  event.target.reset();
});
document.querySelector('#themeToggle').onclick = () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('vela-theme', isDark ? 'dark' : 'light');
  const icon = document.querySelector('#themeToggle i');
  if (icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  if (window.lucide) window.lucide.createIcons();
};
if (localStorage.getItem('vela-theme') === 'dark') {
  document.body.classList.add('dark');
  const icon = document.querySelector('#themeToggle i');
  if (icon) icon.setAttribute('data-lucide', 'sun');
}
const ctx = document.querySelector('#spendingChart');
if (window.Chart) {
  new Chart(ctx, {type:'line',data:{labels:['Mar','Apr','May','Jun','Jul','Aug'],datasets:[{label:'Income',data:[64,72,68,82,78,92],borderColor:'#7c5cfc',backgroundColor:'rgba(124,92,252,.1)',fill:true,tension:.45,pointRadius:0,borderWidth:2},{label:'Expenses',data:[32,38,29,42,35,38],borderColor:'#e0567a',backgroundColor:'transparent',tension:.45,pointRadius:0,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#14141a',padding:10,displayColors:false,callbacks:{label:c=>`${c.dataset.label}: ₹ ${c.raw}k`}}},scales:{x:{grid:{display:false},ticks:{color:'#6b6b78',font:{size:10}}},y:{min:0,max:100,ticks:{stepSize:25,color:'#6b6b78',font:{size:10},callback:v=>`₹${v}k`},grid:{color:'rgba(0,0,0,.06)'}}}}});
} else {
  const fallback = document.createElement('div');
  fallback.className = 'chart-unavailable';
  Object.assign(fallback.style, { height: '100%', display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: '12px', border: '1px dashed var(--line)', borderRadius: '12px' });
  fallback.textContent = 'Spending chart is temporarily unavailable.';
  ctx.replaceWith(fallback);
}
document.querySelector('#rangeSelect').addEventListener('change', e => { ctx.style.opacity=.5; setTimeout(()=>ctx.style.opacity=1,180); });
renderTransactions();
updateExpenseTotal();
updateGreeting();
initGreetingColorCycle();
renderNotifications();
initNotifications();
if (window.lucide) window.lucide.createIcons();

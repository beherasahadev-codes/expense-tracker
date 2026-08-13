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
document.querySelector('#transactionForm').addEventListener('submit', event => { event.preventDefault(); const d = new FormData(event.target); transactions.unshift({name:d.get('description'),category:d.get('category'),amount:Number(d.get('amount')),type:d.get('type'),date:'Just now',icon:d.get('type')==='income'?'✦':'●'}); renderTransactions(); updateExpenseTotal(); dialog.close(); event.target.reset(); });
document.querySelector('#themeToggle').onclick = () => document.body.classList.toggle('light');
const ctx = document.querySelector('#spendingChart');
if (window.Chart) {
  new Chart(ctx, {type:'line',data:{labels:['Mar','Apr','May','Jun','Jul','Aug'],datasets:[{label:'Income',data:[64,72,68,82,78,92],borderColor:'#ad8df5',backgroundColor:'rgba(173,141,245,.16)',fill:true,tension:.45,pointRadius:0,borderWidth:2},{label:'Expenses',data:[32,38,29,42,35,38],borderColor:'#f39ab6',backgroundColor:'transparent',tension:.45,pointRadius:0,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#242442',padding:10,displayColors:false,callbacks:{label:c=>`${c.dataset.label}: ₹ ${c.raw}k`}}},scales:{x:{grid:{display:false},ticks:{color:'#9996b6',font:{size:10}}},y:{min:0,max:100,ticks:{stepSize:25,color:'#777494',font:{size:10},callback:v=>`₹${v}k`},grid:{color:'rgba(255,255,255,.07)'}}}}});
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
if (window.lucide) window.lucide.createIcons();

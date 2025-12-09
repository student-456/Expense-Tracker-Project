/* ---------------- DOM ELEMENTS ---------------- */
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("expense-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

/* ---------------- INITIALIZE ---------------- */
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseChart;

/* ---------------- ADD TRANSACTION ---------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;

  if (!desc || isNaN(amount) || amount <= 0) return;

  const transaction = {
    id: Date.now(),
    desc,
    amount,
    type,
    category
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
});

/* ---------------- RENDER TRANSACTIONS ---------------- */
function renderTransactions() {
  transactionList.innerHTML = "";

  let income = 0;
  let expense = 0;
  const expenseCategories = {};

  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      ${t.desc} <span>${t.type === "income" ? "+" : "-"}$${t.amount.toFixed(2)}</span>
      <span class="delete-btn" onclick="deleteTransaction(${t.id})">x</span>
    `;
    transactionList.appendChild(li);

    if (t.type === "income") income += t.amount;
    else {
      expense += t.amount;
      if (expenseCategories[t.category]) expenseCategories[t.category] += t.amount;
      else expenseCategories[t.category] = t.amount;
    }
  });

  incomeEl.innerText = `$${income.toFixed(2)}`;
  expenseEl.innerText = `$${expense.toFixed(2)}`;
  balanceEl.innerText = `$${(income - expense).toFixed(2)}`;

  renderChart(expenseCategories);
}

/* ---------------- DELETE TRANSACTION ---------------- */
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

/* ---------------- LOCAL STORAGE ---------------- */
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* ---------------- RENDER CHART ---------------- */
function renderChart(data) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (expenseChart) expenseChart.destroy();

  expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        label: "Expenses by Category",
        data: values,
        backgroundColor: [
          "#e74c3c",
          "#f1c40f",
          "#2ecc71",
          "#3498db",
          "#9b59b6",
          "#34495e"
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

/* ---------------- INITIAL RENDER ---------------- */
renderTransactions();

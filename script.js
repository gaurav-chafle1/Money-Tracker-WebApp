let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const downloadBtn = document.getElementById('download-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

addBtn.addEventListener('click', function () {
  const category = categorySelect.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (!category || isNaN(amount) || amount <= 0 || !date) {
    alert("Please fill all fields with valid data.");
    return;
  }

  const expense = { category, amount, date };
  expenses.push(expense);
  totalAmount += amount;
  totalAmountCell.textContent = totalAmount.toFixed(2);

  const newRow = expenseTableBody.insertRow();
  newRow.classList.add("fade-row");

  const categoryCell = newRow.insertCell();
  const amountCell = newRow.insertCell();
  const dateCell = newRow.insertCell();
  const deleteCell = newRow.insertCell();

  categoryCell.textContent = category;
  amountCell.textContent = amount;
  dateCell.textContent = date;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener('click', function () {
    const index = expenses.indexOf(expense);
    if (index !== -1) {
      expenses.splice(index, 1);
      totalAmount -= amount;
      totalAmountCell.textContent = totalAmount.toFixed(2);
      expenseTableBody.removeChild(newRow);
    }
  });

  deleteCell.appendChild(deleteBtn);

  // Clear inputs
  amountInput.value = "";
  dateInput.value = "";
});

// DOWNLOAD TO EXCEL
downloadBtn.addEventListener('click', function () {
  if (expenses.length === 0) {
    alert("No data to download!");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(expenses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  XLSX.writeFile(workbook, "Expenses_Report.xlsx");
});
const yearSelect = document.getElementById('year-select');
const showChartBtn = document.getElementById('show-chart-btn');
const pieCtx = document.getElementById('pie-chart').getContext('2d');
let pieChart;

// Populate year dropdown from current year to past 5 years
function populateYears() {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 5; y--) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }
}
populateYears();

showChartBtn.addEventListener('click', function () {
  const selectedYear = yearSelect.value;
  if (!selectedYear) {
    alert("Please select a year");
    return;
  }

  // Filter expenses by selected year
  const filtered = expenses.filter(exp => new Date(exp.date).getFullYear().toString() === selectedYear);

  if (filtered.length === 0) {
    alert("No data for selected year.");
    return;
  }

  // Aggregate totals by category
  const categoryTotals = {};
  filtered.forEach(exp => {
    if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
    categoryTotals[exp.category] += exp.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  // Create or update the chart
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expense Breakdown',
        data: data,
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#ffcd56',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40',
          '#c9cbcf'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: `Expenses by Category in ${selectedYear}`
        }
      }
    }
  });
});


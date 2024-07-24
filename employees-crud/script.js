document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const positionInput = document.getElementById('position');
    const addEmployeeButton = document.getElementById('addEmployee');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');
    const employeesTable = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];

    const apiUrl = 'http://localhost:3000/employees';

    async function fetchEmployees() {
        const response = await fetch(apiUrl);
        const employees = await response.json();
        displayEmployees(employees);
    }

    async function searchEmployees() {
   /*      const response = await fetch(`${apiUrl}/search?q=${query}`);
        const employees = await response.json();
        displayEmployees(employees); */
        const query = searchInput.value;
        const response = await fetch(apiUrl);
        const employees = await response.json();
        const filteredEmployees = employees.filter(employee => 
            employee.name.toLowerCase().includes(query.toLowerCase()));
        displayEmployees(filteredEmployees);
    }

    async function addEmployee() {
        const employee = {
            name: nameInput.value,
            email: emailInput.value,
            position: positionInput.value,
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });

        if (response.ok) {
            fetchEmployees();
            nameInput.value = '';
            emailInput.value = '';
            positionInput.value = '';
        }
    }

    async function updateEmployee(id, name, email, position) {
        const employee = { name, email, position };

        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });

        if (response.ok) {
            fetchEmployees();
        }
    }

    async function deleteEmployee(id) {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchEmployees();
        }
    }

    function displayEmployees(employees) {
        employeesTable.innerHTML = '';
        employees.forEach(employee => {
            const row = employeesTable.insertRow();
            row.innerHTML = `
                <td>${employee.id}</td>
                <td contenteditable="true">${employee.name}</td>
                <td contenteditable="true">${employee.email}</td>
                <td contenteditable="true">${employee.position}</td>
                <td>
                    <button onclick="deleteEmployee(${employee.id})">Excluir</button>
                    <button onclick="saveEmployee(${employee.id}, this)">Salvar</button>
                </td>
            `;
        });
    }

    window.deleteEmployee = deleteEmployee;

    window.saveEmployee = function(id, button) {
        const row = button.closest('tr');
        const name = row.cells[1].textContent;
        const email = row.cells[2].textContent;
        const position = row.cells[3].textContent;
        updateEmployee(id, name, email, position);
    };

    addEmployeeButton.addEventListener('click', addEmployee);
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            searchEmployees(query);
        } else {
            fetchEmployees();
        }
    });

    fetchEmployees();
});

document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const positionInput = document.getElementById('position');
    const addEmployeeButton = document.getElementById('addEmployee');
    const searchInput = document.getElementById('search');
    const searchEmployeeButton = document.getElementById('searchEmployee');
    const employeeTable = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];

    const apiUrl = 'http://localhost:3000/employees';

    async function fetchEmployees() {
        const response = await fetch(apiUrl);
        const employees = await response.json();
        displayEmployees(employees);
    }

    async function searchEmployee() {
        const query = searchInput.value;
        const response = await fetch(apiUrl);
        const employees = await response.json();
        const filteredEmployees = employees.filter(employee => 
            employee.name.toLowerCase().includes(query.toLowerCase()));
        displayEmployees(filteredEmployees);
    }

    function displayEmployees(employees) {
        employeeTable.innerHTML = '';
        employees.forEach(employee => {
            const row = employeeTable.insertRow();
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.position}</td>
                <td>
                    <button onclick="editEmployee(${employee.id})">Edit</button>
                    <button onclick="deleteEmployee(${employee.id})">Delete</button>
                </td>
            `;
        });
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

    window.editEmployee = async function(id) {
        const name = prompt('Digite um novo nome:');
        const email = prompt('Digite um novo e-mail:');
        const position = prompt('Digite um novo cargo:');
        
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

    window.deleteEmployee = async function(id) {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchEmployees();
        }
    }

    addEmployeeButton.addEventListener('click', addEmployee);
    searchEmployeeButton.addEventListener('click', searchEmployee);
    fetchEmployees();
});

import {
  hasUniqueEmployees,
  findEmployee,
  findHighestPaidEmployee,
  findLowestPaidEmployee,
  getDepartments,
  getDepartmentEmployeeCount,
  findHighestSpendDepartment,
  findLowestSpendDepartment,
  addEmployee,
  removeEmployee,
  replaceEmployee,
  Employee,
  findEmployeeStack,
  findEmployeeTCO,
  findEmployeeCPS,
  findEmployeeTrampoline,
} from './company';

import employees from '../data/validStructure.json';
import invalidEmployees from '../data/invalidStructure.json';

const getEmployees = () => JSON.parse(JSON.stringify(employees));
const getInvalidEmployees = () => JSON.parse(JSON.stringify(invalidEmployees));

describe('Company', () => {
  describe('hasUniqueEmployees', () => {
    test('returns true when called with json containing unique employees ', () => {
      const result = hasUniqueEmployees(getEmployees());
      expect(result).toBe(true);
    });

    test('returns false when called with json containing duplicate employees ', () => {
      let result = hasUniqueEmployees(getInvalidEmployees());
      expect(result).toBe(false);
    });
  });

  describe('findEmployee implementations', () => {
    test('findEmployee returns an employee that matches the predicate', () => {
      const namedEmployee = findEmployee(
        getEmployees(),
        (o) => o.name === 'Robert Davis',
      );
      if (!namedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.name).toBe('Robert Davis');

      const salaryMatchedEmployee = findEmployee(
        getEmployees(),
        (o) => o.salary === 90_000,
      );
      if (!salaryMatchedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.salary).toBe(90_000);
    });

    test('findEmployeeStack returns an employee that matches the predicate', () => {
      const namedEmployee = findEmployeeStack(
        getEmployees(),
        (o) => o.name === 'Robert Davis',
      );
      if (!namedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.name).toBe('Robert Davis');

      const salaryMatchedEmployee = findEmployeeStack(
        getEmployees(),
        (o) => o.salary === 90_000,
      );
      if (!salaryMatchedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.salary).toBe(90_000);
    });

    test('findEmployeeTCO returns an employee that matches the predicate', () => {
      const namedEmployee = findEmployeeTCO(
        [getEmployees()],
        (o) => o.name === 'Robert Davis',
      );
      if (!namedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.name).toBe('Robert Davis');

      const salaryMatchedEmployee = findEmployeeTCO(
        [getEmployees()],
        (o) => o.salary === 90_000,
      );
      if (!salaryMatchedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.salary).toBe(90_000);
    });

    test('findEmployeeCPS returns an employee that matches the predicate', () => {
      const namedEmployee = findEmployeeCPS(
        [getEmployees()],
        (o) => o.name === 'Robert Davis',
      );
      if (!namedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.name).toBe('Robert Davis');

      const salaryMatchedEmployee = findEmployeeCPS(
        [getEmployees()],
        (o) => o.salary === 90_000,
      );
      if (!salaryMatchedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.salary).toBe(90_000);
    });

    test('findEmployeeTrampoline returns an employee that matches the predicate', () => {
      const namedEmployee = findEmployeeTrampoline(
        [getEmployees()],
        (o) => o.name === 'Robert Davis',
      );
      if (!namedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.name).toBe('Robert Davis');

      const salaryMatchedEmployee = findEmployeeTrampoline(
        [getEmployees()],
        (o) => o.salary === 90_000,
      );
      if (!salaryMatchedEmployee) {
        throw new Error('employee is null');
      }
      expect(namedEmployee.salary).toBe(90_000);
    });
  });

  test('findHighestPaidEmployee returns the highest paid employee', () => {
    const highestPaid = findHighestPaidEmployee(getEmployees());
    expect(highestPaid.salary).toEqual(120_000);
  });

  test('findLowestPaidEmployee returns the lowest paid employee', () => {
    const lowestPaid = findLowestPaidEmployee(getEmployees());
    expect(lowestPaid.salary).toEqual(20_000);
  });

  test('getDepartments returns an array of departments', () => {
    const departments = getDepartments(getEmployees());
    expect(departments.size).toBe(4);
    const expectedDepartments = ['Executive', 'Marketing', 'Sales', 'IT'];
    expectedDepartments.forEach((department) =>
      expect(departments.has(department)).toBe(true),
    );
  });

  test('getDepartmentHeadcount returns the number of employees in the department', () => {
    const executiveCount = getDepartmentEmployeeCount(
      getEmployees(),
      'Executive',
    );
    const marketingCount = getDepartmentEmployeeCount(
      getEmployees(),
      'Marketing',
    );
    const salesCount = getDepartmentEmployeeCount(getEmployees(), 'Sales');
    const itCount = getDepartmentEmployeeCount(getEmployees(), 'IT');
    expect(executiveCount).toEqual(1);
    expect(marketingCount).toEqual(4);
    expect(salesCount).toEqual(6);
    expect(itCount).toEqual(8);
  });

  test('findHighestSpendDepartment returns the department witht he highest total salary cost', () => {
    const highestSpendDepartment = findHighestSpendDepartment(getEmployees());
    expect(highestSpendDepartment).toEqual('IT');
  });

  test('findLowestSpendDepartment returns the department witht he lowest total salary cost', () => {
    const lowestSpendDepartment = findLowestSpendDepartment(getEmployees());
    expect(lowestSpendDepartment).toEqual('Executive');
  });

  describe('addEmployee', () => {
    test('adds an employee as a subordinate when a manager name is provided', () => {
      const newEmployee: Employee = {
        name: 'Sarah Smith',
        title: 'Software Developer',
        department: 'IT',
        salary: 30000,
        subordinates: [],
      };
      const employee = getEmployees();
      const modified = addEmployee(employee, 'Michael Brown', newEmployee);
      expect(JSON.stringify(employee)).not.toEqual(JSON.stringify(modified));

      const manager = findEmployee(modified, (o) => o.name === 'Michael Brown');
      expect(manager!.subordinates.length).toEqual(5);
      expect(manager!.subordinates[4].name).toEqual(newEmployee.name);
      expect(manager!.subordinates[4].title).toEqual(newEmployee.title);
      expect(manager!.subordinates[4].department).toEqual(
        newEmployee.department,
      );
      expect(manager!.subordinates[4].salary).toEqual(newEmployee.salary);
      expect(manager!.subordinates[4].subordinates.length).toEqual(0);
    });

    test('adds an employee as a new root when called with null for manager name', () => {
      const chairman: Employee = {
        name: 'Bob Smith',
        title: 'Chairman',
        department: 'Executive',
        salary: 150000,
        subordinates: [],
      };
      const employees = getEmployees();
      const modified = addEmployee(employees, null, chairman);
      expect(JSON.stringify(employees)).not.toEqual(JSON.stringify(modified));
      const added = findEmployee(modified, (o) => o.name === 'Bob Smith');
      expect(added).not.toBe(null);
      expect(added!.name).toEqual(chairman.name);
      expect(added!.title).toEqual(chairman.title);
      expect(added!.department).toEqual(chairman.department);
      expect(added!.salary).toEqual(chairman.salary);
      expect(added!.subordinates).not.toBe(null);
      expect(added!.subordinates.length).toEqual(1);
      expect(added!.subordinates[0].name).toEqual('John Smith');
      expect(added!.subordinates[0].title).toEqual('CEO');
      expect(added!.subordinates[0].department).toEqual('Executive');
      expect(added!.subordinates[0].salary).toEqual(120000);
      expect(added!.subordinates[0].subordinates.length).toEqual(3);
    });
  });

  describe('removeEmployee', () => {
    test('removes an employee and moves their subordinates to subordinates of their manager', () => {
      const employee = getEmployees();
      const modified = removeEmployee(employee, 'Robert Davis');
      expect(JSON.stringify(employee)).not.toEqual(JSON.stringify(modified));
      const removed = findEmployee(modified, (o) => o.name === 'Robert Davis');
      expect(removed).toBe(null);
      const newManager = findEmployee(modified, (o) => o.name === 'John Smith');
      expect(newManager).not.toBe(null);
      expect(newManager!.subordinates.length).toEqual(3);
    });

    test('fails when trying to remove the root employee', () => {
      expect(() => {
        removeEmployee(getEmployees(), 'John Smith');
      }).toThrow();
    });
  });

  test('replaceEmployee replaces an employee', () => {
    const newEmployee: Employee = {
      name: 'Harry Potter',
      title: 'Head of IT',
      department: 'IT',
      salary: 80000,
      subordinates: [],
    };
    const employee = getEmployees();
    const modified = replaceEmployee(employee, 'Michael Brown', newEmployee);
    expect(JSON.stringify(employee)).not.toEqual(JSON.stringify(modified));

    const removedEmployee = findEmployee(
      modified,
      (o) => o.name === 'Michael Brown',
    );
    expect(removedEmployee).toBe(null);

    const addedEmployee = findEmployee(
      modified,
      (o) => o.name === 'Harry Potter',
    );
    expect(addedEmployee).not.toBe(null);
    expect(addedEmployee!.name).toEqual(newEmployee.name);
    expect(addedEmployee!.title).toEqual(newEmployee.title);
    expect(addedEmployee!.department).toEqual(newEmployee.department);
    expect(addedEmployee!.salary).toEqual(newEmployee.salary);
    expect(addedEmployee!.subordinates.length).toEqual(4);
  });
});

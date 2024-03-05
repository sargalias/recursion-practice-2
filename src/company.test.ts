import {
  hasNoDuplicates,
  findEmployee,
  findHighestPaidEmployee,
  findLowestPaidEmployee,
  getDepartments,
  getDepartmentHeadcount,
  findHighestPaidDepartment,
  findLowestPaidDepartment,
  addEmployee,
  removeEmployee,
  replaceEmployee,
  Employee,
} from './company';
const employees = require('../data/validStructure.json');
const invalidEmployees = require('../data/invalidStructure.json');

const getEmployees = () => JSON.parse(JSON.stringify(employees));
const getInvalidEmployees = () => JSON.parse(JSON.stringify(invalidEmployees));

describe('Company', () => {
  test('Can determine whether structures are valid', () => {
    let isValidStructureLoadable = hasNoDuplicates(getEmployees());
    expect(isValidStructureLoadable).toBe(null);
    expect(isValidStructureLoadable).toBe(true);
  });

  test('Can determine whether invalid employees can be loaded', () => {
    let isInvalidStructureLoadable = hasNoDuplicates(getInvalidEmployees());
    expect(isInvalidStructureLoadable).not.toBe(null);
    expect(isInvalidStructureLoadable).toBe(false);
  });

  test('Can find employees by name', () => {
    let nameMatch = findEmployee(
      getEmployees(),
      (e) => e.name === 'Billy Price',
    );
    let salaryMatch = findEmployee(getEmployees(), (e) => e.salary === 45000);
    let noMatch = findEmployee(
      getEmployees(),
      (e) => e.department === 'Department of Nonsense',
    );
    expect(nameMatch).not.toBe(null);
    expect(nameMatch!.name).toEqual('Billy Price');
    expect(salaryMatch).not.toBe(null);
    expect(salaryMatch!.salary).toEqual(45000);
    expect(noMatch).toBe(null);
  });

  test('Can find the highest paid employee', () => {
    let highestPaid = findHighestPaidEmployee(getEmployees());
    expect(highestPaid).not.toBe(null);
    expect(highestPaid.salary).toEqual(100000);
  });

  test('Can find the lowest paid employee', () => {
    let lowestPaid = findLowestPaidEmployee(getEmployees());
    expect(lowestPaid).not.toBe(null);
    expect(lowestPaid.salary).toEqual(15000);
  });

  test('Can get the departments', () => {
    let departments = getDepartments(getEmployees());
    expect(departments).not.toBe(null);
    expect(departments.length).toEqual(4);
    let expectedDepartments = ['Executive', 'Marketing', 'Sales', 'IT'];
    let allMatch = departments.every(
      (d) => expectedDepartments.indexOf(d) !== -1,
    );
    expect(allMatch).toBe(true);
  });

  test('Can get the department headcounts', () => {
    let executives = getDepartmentHeadcount(getEmployees(), 'Executive');
    let marketing = getDepartmentHeadcount(getEmployees(), 'Marketing');
    let sales = getDepartmentHeadcount(getEmployees(), 'Sales');
    let it = getDepartmentHeadcount(getEmployees(), 'IT');
    expect(executives).toEqual(1);
    expect(marketing).toEqual(4);
    expect(sales).toEqual(6);
    expect(it).toEqual(8);
  });

  test('Can get the highest paid department', () => {
    let highestPaid = findHighestPaidDepartment(getEmployees());
    expect(highestPaid).toEqual('IT');
  });

  test('Can get the lowest paid department', () => {
    let lowestPaid = findLowestPaidDepartment(getEmployees());
    expect(lowestPaid).toEqual('Executive');
  });

  test('Can add an employee as a subordinate', () => {
    const apprentice: Employee = {
      name: 'Clive Mitchel',
      title: 'Apprentice Software Developer',
      department: 'IT',
      salary: 10000,
      subordinates: [],
    };
    const employees = getEmployees();
    const modified = addEmployee(employees, 'Martin Shawshank', apprentice);
    expect(JSON.stringify(employees)).not.toEqual(
      JSON.stringify(modified),
      // 'employees tree mutated',
    );
    let manager = findEmployee(modified, (e) => e.name === 'Martin Shawshank');
    expect(manager!.subordinates.length).toEqual(1);
    expect(manager!.subordinates[0].name).toEqual(apprentice.name);
    expect(manager!.subordinates[0].title).toEqual(apprentice.title);
    expect(manager!.subordinates[0].department).toEqual(apprentice.department);
    expect(manager!.subordinates[0].salary).toEqual(apprentice.salary);
    expect(manager!.subordinates[0].subordinates).not.toBe(null);
    expect(manager!.subordinates[0].subordinates.length).toEqual(0);
  });

  test('Can add an employee as a new root', () => {
    const chairman: Employee = {
      name: 'James Runner',
      title: 'Chairman',
      department: 'Executive',
      salary: 150000,
      subordinates: [],
    };
    const employees = getEmployees();
    const modified = addEmployee(employees, null, chairman);
    expect(JSON.stringify(employees)).not.toEqual(
      JSON.stringify(modified),
      // 'employees tree mutated',
    );
    let added = findEmployee(modified, (e) => e.name === 'James Runner');
    expect(added).not.toBe(null);
    expect(added!.name).toEqual(chairman.name);
    expect(added!.title).toEqual(chairman.title);
    expect(added!.department).toEqual(chairman.department);
    expect(added!.salary).toEqual(chairman.salary);
    expect(added!.subordinates).not.toBe(null);
    expect(added!.subordinates.length).toEqual(1);
    expect(added!.subordinates[0].name).toEqual('Mike Love');
    expect(added!.subordinates[0].title).toEqual('CEO');
    expect(added!.subordinates[0].department).toEqual('Executive');
    expect(added!.subordinates[0].salary).toEqual(100000);
    expect(added!.subordinates[0].subordinates).not.toBe(null);
    expect(added!.subordinates[0].subordinates.length).toEqual(3);
  });

  test('Can remove an employee', () => {
    const employees = getEmployees();
    const modified = removeEmployee(employees, 'Josh Anderson');
    expect(JSON.stringify(employees)).not.toEqual(
      JSON.stringify(modified),
      // 'employees tree mutated',
    );
    let removed = findEmployee(modified, (e) => e.name === 'Josh Anderson');
    expect(removed).toBe(null);
    let newManager = findEmployee(modified, (e) => e.name === 'Mike Love');
    expect(newManager).not.toBe(null);
    expect(newManager!.subordinates).not.toBe(null);
    expect(newManager!.subordinates.length).toEqual(6);
  });

  test('Cannot remove root employee', () => {
    let wasError = false;
    try {
      removeEmployee(getEmployees(), 'Mike Love');
    } catch (error) {
      wasError = true;
    }
    expect(wasError).toBe(true);
  });

  test('Can replace an employee', () => {
    const newHeadOfIt: Employee = {
      name: 'Helen Vargas',
      title: 'Head of IT',
      department: 'IT',
      salary: 75000,
      subordinates: [],
    };
    const employees = getEmployees();
    const modified = replaceEmployee(employees, 'Josh Anderson', newHeadOfIt);
    expect(JSON.stringify(employees)).not.toEqual(
      JSON.stringify(modified),
      // 'employees tree mutated',
    );
    let removed = findEmployee(modified, (e) => e.name === 'Josh Anderson');
    expect(removed).toBe(null);
    let added = findEmployee(modified, (e) => e.name === 'Helen Vargas');
    expect(added).not.toBe(null);
    expect(added!.name).toEqual(newHeadOfIt.name);
    expect(added!.title).toEqual(newHeadOfIt.title);
    expect(added!.department).toEqual(newHeadOfIt.department);
    expect(added!.salary).toEqual(newHeadOfIt.salary);
    expect(added!.subordinates).not.toBe(null);
    expect(added!.subordinates.length).toEqual(4);
  });
});

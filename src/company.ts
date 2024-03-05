export interface Employee {
  name: string;
  title: string;
  department: string;
  salary: number;
  subordinates: Employee[];
}

// returns true if the employee is a match
export type EmployeePredicate = (employee: Employee) => boolean;

const defaultEmployee: Employee = {
  name: '',
  title: '',
  department: '',
  salary: -1,
  subordinates: [],
};

export const hasNoDuplicates = (
  employees: Employee,
  namesSeenSoFar?: Set<string>,
): boolean => {
  if (!namesSeenSoFar) {
    namesSeenSoFar = new Set<string>();
  }

  if (namesSeenSoFar.has(employees.name)) {
    return false;
  }

  namesSeenSoFar.add(employees.name);

  if (employees.subordinates.length === 0) return true;

  let duplicate = employees.subordinates.find(
    (e) => !hasNoDuplicates(e, namesSeenSoFar),
  );

  return !duplicate;
};

// finds the first employee that matches the predicate
export const findEmployee = (
  employees: Employee,
  predicate: EmployeePredicate,
): Employee | null => {
  return null;
};

// finds the highest paid employee in the loaded employees
export const findHighestPaidEmployee = (employees: Employee): Employee => {
  return defaultEmployee;
};

// finds the lowest paid employee in the loaded employees
export const findLowestPaidEmployee = (employees: Employee): Employee => {
  return defaultEmployee;
};

// gets an array of all the departments
export const getDepartments = (employees: Employee): string[] => {
  return [];
};

// gets the number of employees in the specified department
export const getDepartmentHeadcount = (
  employees: Employee,
  department: string,
): number => {
  return -1;
};

// finds the department with the highest total pay
export const findHighestPaidDepartment = (employees: Employee): string => {
  return '';
};

// finds the department with the lowest total pay
export const findLowestPaidDepartment = (employees: Employee): string => {
  return '';
};

// adds an employee as a subordinate of the matching manager if one is supplied, else
// adds all employees as subordinates of the supplied employee
// should not mutate passed-in employees
export const addEmployee = (
  employees: Employee,
  managerName: string | null,
  subordinate: Employee,
): Employee => {
  return employees;
};

// removes the employee with the matching name, shifting all their subordinates up to their manager
// if the highest level employee (the employee who is nobody's subordinate) is removed, then an error
// should be thrown
// should not mutate passed-in employees
export const removeEmployee = (
  employees: Employee,
  employee: string,
): Employee => {
  return employees;
};

// replaces the employee with the matching name with the replacement employee, retaining
// all subordinates from the replaced employee
// should not mutate passed-in employees
export const replaceEmployee = (
  employees: Employee,
  original: string,
  replacement: Employee,
): Employee => {
  return employees;
};

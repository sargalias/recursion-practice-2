export interface Employee {
  name: string;
  title: string;
  department: string;
  salary: number;
  subordinates: Employee[];
}

export type EmployeePredicate = (employee: Employee) => boolean;

export const hasUniqueEmployees = (
  employee: Employee,
  namesSeenSoFar: Set<string> = new Set<string>(),
): boolean => {
  return true;
};

export const findEmployee = (
  employee: Employee,
  predicate: EmployeePredicate,
): Employee | null => {
  return null;
};

// a stack implementation of the findEmployee function
export const findEmployeeStack = (
  employee: Employee,
  predicate: EmployeePredicate,
): Employee | null => {
  return null;
};

// a tail call optimised implementation of the findEmployee function
export const findEmployeeTCO = (
  employees: Employee[],
  predicate: EmployeePredicate,
): Employee | null => {
  return null;
};

// a tail call optimised, continuous passing style implementation of the findEmployee function
export const findEmployeeCPS = (
  employees: Employee[],
  predicate: EmployeePredicate,
  continuation = (x) => x,
): Employee | null => {
  return continuation(null);
};

const trampoline = (fn) => {
  const execute = (...args) => {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
  return execute;
};

// an implementation of findEmployee using the trampoline function to avoid stack overflow
export const findEmployeeTrampoline = (
  employees: Employee[],
  predicate: EmployeePredicate,
): Employee | null => {
  return null;
};

export const findHighestPaidEmployee = (employee: Employee): Employee => {
  return employee;
};

export const findLowestPaidEmployee = (employee: Employee): Employee => {
  return employee;
};

export const getDepartments = (
  employee: Employee,
  departments: Set<string> = new Set(),
): Set<string> => {
  return new Set();
};

export const getDepartmentEmployeeCount = (
  employee: Employee,
  department: string,
): number => {
  return 0;
};

export const findHighestSpendDepartment = (employee: Employee): string => {
  return '';
};

export const findLowestSpendDepartment = (employee: Employee): string => {
  return '';
};

export const addEmployee = (
  employee: Employee,
  managerName: string | null,
  subordinate: Employee,
): Employee => {
  return employee;
};

export const removeEmployee = (
  employee: Employee,
  nameToRemove: string,
): Employee => {
  return employee;
};

export const replaceEmployee = (
  employee: Employee,
  leaverName: string,
  replacement: Employee,
): Employee => {
  return employee;
};

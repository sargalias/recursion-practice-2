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
  if (namesSeenSoFar.has(employee.name)) {
    return false;
  }

  namesSeenSoFar.add(employee.name);

  return employee.subordinates.every((subordinate) =>
    hasUniqueEmployees(subordinate, namesSeenSoFar),
  );
};

export const findEmployee = (
  employee: Employee,
  predicate: EmployeePredicate,
): Employee | null => {
  if (predicate(employee)) {
    return employee;
  }
  return (
    employee.subordinates.find((subordinate) =>
      findEmployee(subordinate, predicate),
    ) || null
  );
};

// a stack implementation of the findEmployee function
export const findEmployeeStack = (
  employee: Employee,
  predicate: EmployeePredicate,
): Employee | null => {
  const remaining: Employee[] = [employee];
  while (remaining.length > 0) {
    const current = remaining.pop()!;
    if (predicate(current)) {
      return current;
    }
    if (current.subordinates.length) {
      remaining.push(...current.subordinates);
    }
  }
  return null;
};

// a tail call optimised implementation of the findEmployee function
export const findEmployeeTCO = (
  employees: Employee[],
  predicate: EmployeePredicate,
): Employee | null => {
  const [employee, ...rest] = employees;
  if (predicate(employee)) {
    return employee;
  }
  if (employee.subordinates.length) {
    rest.push(...employee.subordinates);
  }
  if (rest.length > 0) {
    return findEmployeeTCO(rest, predicate);
  }
  return null;
};

// a tail call optimised, continuous passing style implementation of the findEmployee function
export const findEmployeeCPS = (
  employees: Employee[],
  predicate: EmployeePredicate,
  continuation = (x) => x,
): Employee | null => {
  const [employee, ...rest] = employees;
  if (predicate(employee)) {
    return continuation(employee);
  }
  if (employee.subordinates.length) {
    rest.push(...employee.subordinates);
  }
  if (rest.length > 0) {
    return findEmployeeCPS(rest, predicate, continuation);
  }
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
) => {
  return trampoline(_findEmployeeTrampoline)(employees, predicate);
};

const _findEmployeeTrampoline = (
  employees: Employee[],
  predicate: EmployeePredicate,
) => {
  const [employee, ...rest] = employees;
  if (predicate(employee)) {
    return employee;
  }
  if (employee.subordinates.length) {
    rest.push(...employee.subordinates);
  }
  if (rest.length > 0) {
    return () => _findEmployeeTrampoline(rest, predicate);
  }
  return null;
};

export const findHighestPaidEmployee = (employee: Employee): Employee => {
  return employee.subordinates.reduce((highest, subordinate) => {
    const subordinateSubordinatesHighest = findHighestPaidEmployee(subordinate);
    return subordinateSubordinatesHighest.salary > highest.salary
      ? subordinateSubordinatesHighest
      : highest;
  }, employee);
};

export const findLowestPaidEmployee = (employee: Employee): Employee => {
  return employee.subordinates.reduce((lowest, subordinate) => {
    const subordinateSubordinatesLowest = findLowestPaidEmployee(subordinate);
    return subordinateSubordinatesLowest.salary < lowest.salary
      ? subordinateSubordinatesLowest
      : lowest;
  }, employee);
};

export const getDepartments = (
  employee: Employee,
  departments: Set<string> = new Set(),
): Set<string> => {
  departments.add(employee.department);

  employee.subordinates.forEach((subordinate) => {
    getDepartments(subordinate, departments);
  });

  return departments;

  // if you prefer immutability, the above can be written like so:
  // return employee.subordinates.reduce((departments, subordinate) => {
  //   const subordinateDepartments = getDepartments(subordinate, departments);
  //   return new Set([...departments, ...subordinateDepartments]);
  // }, departments);
};

export const getDepartmentEmployeeCount = (
  employee: Employee,
  department: string,
): number => {
  let count = 0;
  if (employee.department === department) {
    count++;
  }
  return employee.subordinates.reduce((count, subordinate) => {
    return count + getDepartmentEmployeeCount(subordinate, department);
  }, count);
};

export const findHighestSpendDepartment = (employee: Employee): string => {
  const data = _findHighestSpendDepartment(employee);
  const highest = Object.entries(data).reduce((highestSoFar, current) => {
    if (highestSoFar[1] > current[1]) {
      return highestSoFar;
    }
    return current;
  });
  return highest[0];
};

const _findHighestSpendDepartment = (
  employee: Employee,
  data: { [k in string]: number } = {},
): { [k in string]: number } => {
  const { department, salary, subordinates } = employee;

  if (data[department]) {
    data[department] += salary;
  } else {
    data[department] = salary;
  }

  subordinates.forEach((subordinate) => {
    _findHighestSpendDepartment(subordinate, data);
  });
  return data;
};

export const findLowestSpendDepartment = (employee: Employee): string => {
  const data = _findLowestSpendDepartment(employee);
  const lowest = Object.entries(data).reduce((lowestSoFar, current) => {
    if (lowestSoFar[1] < current[1]) {
      return lowestSoFar;
    }
    return current;
  });
  return lowest[0];
};

const _findLowestSpendDepartment = (
  employee: Employee,
  data: { [k in string]: number } = {},
): { [k in string]: number } => {
  const { department, salary, subordinates } = employee;

  data[department] = (data[department] || 0) + salary;

  subordinates.forEach((subordinate) => {
    _findLowestSpendDepartment(subordinate, data);
  });
  return data;
};

export const addEmployee = (
  employee: Employee,
  managerName: string | null,
  subordinate: Employee,
): Employee => {
  // instead of this trick, we could use recursion and manually copy properties at every level, but this is much easier
  const copiedEmployee = JSON.parse(JSON.stringify(employee));
  return _addEmployee(copiedEmployee, managerName, subordinate);
};
const _addEmployee = (
  employee: Employee,
  managerName: string | null,
  subordinate: Employee,
): Employee => {
  if (managerName === null) {
    subordinate.subordinates = [employee];
    return subordinate;
  }
  const predicate = (o) => o.name === managerName;
  const manager = findEmployee(employee, predicate);
  manager?.subordinates.push(subordinate);
  return employee;
};

export const removeEmployee = (
  employee: Employee,
  nameToRemove: string,
): Employee => {
  const copiedEmployee = JSON.parse(JSON.stringify(employee));
  const manager = findManager(copiedEmployee, nameToRemove);
  if (!manager) {
    throw new Error(`Manager can't be found`);
  }

  const employeeToRemove = findEmployee(
    manager,
    (o) => o.name === nameToRemove,
  );
  if (!employeeToRemove) {
    throw new Error(`Employee to be removed can't be found`);
  }

  manager.subordinates = manager.subordinates.filter(
    (o) => o !== employeeToRemove,
  );
  manager.subordinates = [
    ...manager?.subordinates,
    ...employeeToRemove?.subordinates,
  ];
  return manager;
};

const findManager = (
  employee: Employee,
  subordinateName: string,
): Employee | null => {
  for (const subordinate of employee.subordinates) {
    if (subordinate.name === subordinateName) {
      return employee;
    }
    const subordinateResult = findManager(subordinate, subordinateName);
    if (subordinateResult) {
      return subordinateResult;
    }
  }
  return null;
};

export const replaceEmployee = (
  employee: Employee,
  leaverName: string,
  replacement: Employee,
): Employee => {
  const copiedEmployee = JSON.parse(JSON.stringify(employee));
  const leaverManager = findManager(copiedEmployee, leaverName);
  if (!leaverManager) {
    throw new Error(`Manager can't be found`);
  }

  const leaver = findEmployee(leaverManager, (o) => o.name === leaverName);
  if (!leaver) {
    throw new Error(`Employee to be replaced can't be found`);
  }

  replacement.subordinates = leaver.subordinates;
  const i = leaverManager.subordinates.findIndex((o) => o === leaver);
  leaverManager[i] = replacement;
  return replacement;
};

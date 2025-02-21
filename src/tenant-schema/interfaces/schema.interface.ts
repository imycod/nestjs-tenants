export interface TableColumn {
  name: string;
  type: string;
  constraints?: string[];
}

export interface TableConfig {
  name: string;
  columns: TableColumn[];
}

export interface SchemaConfig {
  name?: string; // 公司名
  schema: string;
  tables: TableConfig[];
}

/**
 * 
 * const schemaConfig = {
  name: "公司B",
  schema: "company_b",
  tables: [
    {
      name: "users",
      columns: [
        { name: "username", type: "VARCHAR(255)", constraints: ["UNIQUE", "NOT NULL"] },
        { name: "password", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
        { name: "email", type: "VARCHAR(255)" },
        { name: "roles", type: "TEXT[]", constraints: ["DEFAULT '{}'"] },
        { name: "is_active", type: "BOOLEAN", constraints: ["DEFAULT true"] }
      ]
    },
    {
      name: "employees",
      columns: [
        { name: "employee_code", type: "VARCHAR(50)", constraints: ["UNIQUE", "NOT NULL"] },
        { name: "department", type: "VARCHAR(100)" },
        { name: "position", type: "VARCHAR(100)" },
        { name: "salary", type: "DECIMAL(10,2)" }
      ]
    }
  ]
};
 * 
 */
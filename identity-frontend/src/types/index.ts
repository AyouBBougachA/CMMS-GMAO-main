export interface User {
  userId: number;
  fullName: string;
  email: string;
  roleName: string | null;
  roleId: number | null;
  departmentName: string | null;
  departmentId: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}

export interface Department {
  departmentId: number;
  departmentName: string;
}

export interface AuditLog {
  id: number;
  userId: number | null;
  actionType: string;
  entityName: string;
  entityId: number | null;
  details: string;
  createdAt: string;
}

export interface Equipment {
  equipmentId: number;
  name: string;
  serialNumber: string;
  status: string;
  location: string;
  departmentId: number;
  createdAt: string;
}

export interface EquipmentHistory {
  id: number;
  equipmentId: number;
  action: string;
  performedBy: string;
  createdAt: string;
}

export interface MaintenancePlan {
  planId: number;
  id?: number;
  equipmentId: number;
  name: string;
  frequency: string;
  intervalValue?: number;
  intervalUnit?: string;
  status?: string;
  technicianName?: string;
  lastPerformedAt?: string;
  nextDueAt?: string;
}

export interface Meter {
  meterId: number;
  id?: number;
  equipmentId: number;
  equipmentName?: string;
  name: string;
  value: number;
  lastValue?: number; // Alias for value if needed
  unit: string;
  meterType: string;
  lastReadingAt?: string;
}

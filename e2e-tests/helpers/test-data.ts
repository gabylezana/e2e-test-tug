export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegistrationData extends UserCredentials {
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface PrimaryFlowData {
  itemName: string;
  itemDescription: string;
  quantity: number;
}

export interface ProfileData {
  phone: string;
  city: string;
  preferredLanguage: 'es' | 'en';
}

export interface ProductFlowData {
  createdName: string;
  editedName: string;
}

const firstName = process.env.TEST_USER_FIRST_NAME ?? 'QA';
const lastName = process.env.TEST_USER_LAST_NAME ?? 'User';
const defaultPassword = process.env.TEST_USER_PASSWORD ?? 'ChangeMe123!';

export const defaultTestUser: UserCredentials = {
  email: process.env.TEST_USER_EMAIL ?? 'qa@example.com',
  password: defaultPassword
};

export const invalidLoginAttempt: UserCredentials = {
  email: defaultTestUser.email,
  password: 'WrongPassword123!'
};

export const sampleRegistrationBase: Omit<RegistrationData, 'email'> = {
  firstName,
  lastName,
  fullName: `${firstName} ${lastName}`,
  password: defaultPassword
};

export const samplePrimaryFlowData: PrimaryFlowData = {
  itemName: 'Pedido E2E de ejemplo',
  itemDescription: 'Pedido creado desde un test end-to-end para validar el flujo principal.',
  quantity: 1
};

export const sampleProfileData: ProfileData = {
  phone: '+59170000000',
  city: 'La Paz',
  preferredLanguage: 'es'
};

export function buildUniqueProductFlowData(): ProductFlowData {
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const createdName = `Producto E2E ${uniqueSuffix}`;

  return {
    createdName,
    editedName: `${createdName} Editado`
  };
}

export function buildUniqueRegistrationData(): RegistrationData {
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const email = `qa+${uniqueSuffix}@example.com`;

  return {
    ...sampleRegistrationBase,
    email
  };
}

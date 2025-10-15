import type { LoginCredentials, RegisterData, User } from '../types/auth.types';

// Usuarios de prueba
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@gameofbones.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: 2,
    username: 'user',
    email: 'user@gameofbones.com',
    password: 'user123',
    role: 'user' as const,
  },
  {
    id: 3,
    username: 'maria',
    email: 'maria@test.com',
    password: 'maria123',
    role: 'user' as const,
  },
];

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> {
    await delay(800); // Simular petición al servidor

    const foundUser = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!foundUser) {
      throw new Error('Credenciales inválidas');
    }

    const { password: __password, ...user } = foundUser;
    const token = `mock-token-${user.id}-${Date.now()}`;

    return { user, token };
  }

  async register(
    data: RegisterData
  ): Promise<{ user: User; token: string }> {
    await delay(800);

    // Verificar si el email ya existe
    const emailExists = MOCK_USERS.some((u) => u.email === data.email);
    if (emailExists) {
      throw new Error('El email ya está registrado');
    }

    // Crear nuevo usuario mock
    const newUser: User = {
      id: MOCK_USERS.length + 1,
      username: data.username,
      email: data.email,
      role: 'user',
    };

    const token = `mock-token-${newUser.id}-${Date.now()}`;

    return { user: newUser, token };
  }

  async verifyToken(): Promise<User> {
    await delay(500);

    const token = localStorage.getItem('token');

    if (!token || !token.startsWith('mock-token-')) {
      throw new Error('Token inválido');
    }

    // Extraer ID del token mock
    const userId = parseInt(token.split('-')[2]);
    const foundUser = MOCK_USERS.find((u) => u.id === userId);

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const { password: __password, ...user } = foundUser;
    return user;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

export default new AuthService();

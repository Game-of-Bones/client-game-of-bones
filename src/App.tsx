import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-dvh">
      <header className="p-4 border-b border-black/10 dark:border-white/10 flex gap-4">
        <Link to="/" className="font-serif text-xl">Game of Bones</Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main className="p-8">
        <div className="p-6 rounded-2xl bg-primary-300 text-primary-50 font-serif">
          🦴 Tailwind v4 OK (deberías ver esto marrón/beige)
        </div>
        <Outlet />
      </main>
    </div>
  );
}

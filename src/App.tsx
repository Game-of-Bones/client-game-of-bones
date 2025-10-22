import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './layout/navbar';
import Footer from './layout/footer';  


const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 bg-transparent" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Outlet />
        </main>
        
        <Footer />  {/* 👈 REEMPLAZA el footer antiguo con esta línea */}
      </div>
    </ThemeProvider>
  );
};

function App() {
  return <Layout />;
}

export default App;
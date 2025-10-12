import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <h1>Game of Bones</h1>
          <p>Blog de descubrimientos paleontológicos</p>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

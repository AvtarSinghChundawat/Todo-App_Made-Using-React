import { TodoProvider } from './context/TodoContext';
import Layout from './layouts/Layout';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Layout />
    </TodoProvider>
  );
}

export default App;

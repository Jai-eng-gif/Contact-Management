import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';

function App() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Management</h1>
      <ContactForm />
      <ContactTable />
    </div>
  );
}

export default App;

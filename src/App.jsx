import { useState, useEffect } from "react";
import"./App.css";

function App() {
  const [users, setUsers] = useState([]); // Nutzerdaten aus der API

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="container">
      <h2>🔍 Benutzerliste</h2>
      <input type="text" placeholder="Suche nach Namen..." />
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

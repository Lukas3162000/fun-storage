import { useState, useEffect } from "react";
import"./App.css";

function App() {
  const [users, setUsers] = useState([]); // Nutzerdaten aus der API
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [users]);

  const eventHandler = (e) => {
    setSearchTerm(e.target.value);
  }

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <div className="container">
      <h2>🔍 Benutzerliste</h2>
      <input type="text" placeholder="Suche nach Namen..." value={searchTerm} onChange={eventHandler} />
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

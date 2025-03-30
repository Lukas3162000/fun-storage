import { useState, useEffect } from "react";
import"./App.css";

function checkboxBP(){

}

function App() {
  const [users, setUsers] = useState([]); // Nutzerdaten aus der API
  const [searchTerm, setSearchTerm] = useState("");

  //Hier wird die Checkbox geregelt
  const [isChecked,setIsChecked] = useState(false);
  const handleChange= () => {
    setIsChecked(prevChecked => !prevChecked);
  }

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        const modifiedData = data.map((user =>({
          ...user,
          active: Math.random()>0.5
        }))); setUsers(modifiedData);
      });
  }, []);

  const eventHandler = (e) => {
    setSearchTerm(e.target.value);
  }

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())).filter((user)=>isChecked ? user.active === true:true);






  return (
    <div className="container">
      <h2>🔍 Benutzerliste</h2>
      <input type="text" placeholder="Suche nach Namen..." value={searchTerm} onChange={eventHandler} className="InputField"/>
      <div className="CheckSpace">
        <label htmlFor="boxes">Aktive Nutzer</label>
        <input type="checkbox" id="boxes" name="active" onChange={handleChange} checked={isChecked}/>
      </div>
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

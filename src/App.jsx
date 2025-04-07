import { useState, useEffect } from "react";
import"./App.css";



function App() {
  const [toDos, setToDos] = useState([
    { id: 1, text: "React üben (done: false)", done: false },
    { id: 2, text: "Pizza essen (done: true)", done: true },
    { id: 3, text: "Code aufräumen (done: false)", done: false },
    { id: 4, text: "Mails checken (done: false)", done: false },
    { id: 5, text: "Kaffee holen ☕ (done: true)", done: true },
    { id: 6, text: "Ein bisschen prokrastinieren (done: false)", done: false },
    { id: 7, text: "CSS zähmen 🐉 (done: false)", done: false },
    { id: 8, text: "Git push nicht vergessen! (done: true)", done: true },
    { id: 9, text: "Short break: YouTube 🙈 (done: false)", done: false },
    { id: 10, text: "Aufgabe von ChatGPT lösen 💪 (done: true)", done: true },
  ]); //ToDos eingetragen

  const [newTasks, setNewTasks]= useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //Hier wird die Checkbox geregelt
  const [isChecked1,setIsChecked1] = useState(false);
  const [isChecked2,setIsChecked2] = useState(false);
  const [isChecked3,setIsChecked3] = useState(false);

  const handleChange1= () => {
    setIsChecked1(prevChecked => !prevChecked);
    updateTasks();
  }

  const handleChange2= () => {
    setIsChecked2(prevChecked => !prevChecked);
    updateTasks();
  }

  const handleChange3= () => {
    setIsChecked3(prevChecked => !prevChecked);
    updateTasks();
  }

  //UpdateTasks
  const updateTasks = () =>{
    let filteredTasks = toDos;

    if(isChecked2 && isChecked3){
      filteredTasks = toDos;
    }else{
      if(isChecked2){
        filteredTasks = filteredTasks.filter(task => task.done === false);
      }
      if(isChecked3){
       filteredTasks = filteredTasks.filter(task => task.done === true);
      }
  }
    
    if(isChecked1){
      filteredTasks = toDos;
    }

    setNewTasks(filteredTasks);
  }

  useEffect(()=>{
    updateTasks();
  },[isChecked1,isChecked2,isChecked3, toDos])


  //Nach Checkbox input kommt hier die Input field Suche als Finaler zulaufspunkt. Hier wird gefiltert, welche inputs aus searchTerm-usestate ( was im input eingegeben wurder) ebenfalls im newtask-state ist (was die checkboxen regeln) und das wird dann weiter unten in die liste im html gemappt.
  const eventHandler = (e) => {
    setSearchTerm(e.target.value);
  }

  const filteredSearchTasks = newTasks.filter((task) => task.text.toLowerCase().includes(searchTerm.toLowerCase()));







  return (
    <div className="container">
      <h2>🔍 Benutzerliste</h2>
      <div className="positioner">
      <input type="text" placeholder="Suche nach Namen..." value={searchTerm} onChange={eventHandler} className="InputField"/>
        <div className="CheckSpace">
          <label htmlFor="all">Alle</label>
          <input type="checkbox" id="all" name="alle_tasks" onChange={handleChange1} checked={isChecked1}/>

          <label htmlFor="open">Offen</label>
         <input type="checkbox" id="open" name="offene_tasks" onChange={handleChange2} checked={isChecked2}/>

          <label htmlFor="done">Done</label>
          <input type="checkbox" id="done" name="done_tasks" onChange={handleChange3} checked={isChecked3}/>

        </div>
      </div>
      <ul className="user-list">
        {filteredSearchTasks.map((tasks) => (
          <li key={tasks.id}>{tasks.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

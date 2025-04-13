import { useState, useEffect } from "react";
import"./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



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

  //Neue Todos
  const [newTodoText,setNewTodoText] = useState("");
  function handleAddToDo(event){
    event.preventDefault();
    if(newTodoText.trim() !==""){
    const newTodo = {
      id: toDos.length+1,
      text: newTodoText,
      done: false,
    };
    setToDos([...toDos, newTodo]);
    setNewTodoText("");
  }
  }

  //Todos löschen-handler
  function handleDeletion(id){
    const updatedToDos = toDos.filter(toDos => toDos.id !== id);
    setToDos(updatedToDos);
  }

  useEffect(()=>{
    updateTasks();
  },[isChecked1,isChecked2,isChecked3, toDos])


  //Nach Checkbox input kommt hier die Input field Suche als Finaler zulaufspunkt. Hier wird gefiltert, welche inputs aus searchTerm-usestate ( was im input eingegeben wurder) ebenfalls im newtask-state ist (was die checkboxen regeln) und das wird dann weiter unten in die liste im html gemappt.
  const eventHandler = (e) => {
    setSearchTerm(e.target.value);
  }

  const filteredSearchTasks = newTasks.filter((task) => task.text.toLowerCase().includes(searchTerm.toLowerCase()));


//Hier kommt das Drag-Event bzw die Logik für das Drag-Event

const handleOnDragEnd = (result) => {
  //hier wird abgefangen, wenn das Listenelement keine destination hat also gerade im hover ist oder irgendwo ins  nichts abgelegt wird
  if(!result.destination) return;


  //hier werden die Indizes der Liste vorher und nachher gespeichert. das heisst vor Drag und nach drag Indexe 
  const sourceIndex = result.source.index;
  const destIndex = result.destination.index;

  //Da wir mit Checkboxen und Input field filtern und die eigendliche state toDos nicht anzeigen, sondern die vorgefilterte "filterSearchTasks"-State,
  //brauchen wir hier eine Variable, die diese angezeigte Liste bzw die ids davon speichert. Denn nur was angezeigt wird soll verschoben werden könne
  // Außerdem ist es wichtig, dass die reihenfolge die bei den angezeigten vertauscht wird nachher in der main-liste also todos state gespeichert wird
  const currentVisibleIds = filteredSearchTasks.map(task=> task.id);

  //hier wird der array der sichtbaren kopiert bevor dieser bearbeitet/verschoben wird
  const reorderedVisibleIds = Array.from(currentVisibleIds);
  //hier destrukturieren wir das item, das aus der reordered List rausgemoved wird. Splice nimmt dabei an der Position "sourceIndex" 1 Element und destrukturiert es in den Array "movedId"
  const [movedId] = reorderedVisibleIds.splice(sourceIndex, 1);

  //hier wird im array "reorderedVisibleIds" tatsächlich gearbeitet. 
  //in splice besagt der erste input X (Array.splice(X,Y,Z)) die stelle, an der etwas im array passieren soll.
  //die zweite stelle Y besagt, wie viele Array-inhalte gelöscht werden sollen. Da wir ja nicht löäschen sondern moven wollen, 
  //Steht hier bei uns "0"
  //der dritte input, nämlich "Z" besagt, welches Item/welcher array-inhalt eingesetzt werden soll. in unserem Fall ist das 
  //die Variable/die ID, die wir zuvor aus der Kopie der sichtbaren Liste 
  reorderedVisibleIds.splice(destIndex, 0, movedId);


//in reorderedToDos wird eine kopie von toDos kopiert. diese wird mit .sort(a,b) sortiert.
  const reorderedToDos = [...toDos].sort((a,b) => {
    //Hier werden von der neu gedraggten sichtbaren Liste die neuen indexe von Stelle a und stelle b in einer variable gespeichert
    const aIndex = reorderedVisibleIds.indexOf(a.id);
    const bIndex = reorderedVisibleIds.indexOf(b.id);

//Nachtrag: -1 heisst nicht sichtbar. 
  //hier passiert die tauschlogik. Wenn indexe -1 sind, dann haben sie die selbe Stelle und werden nicht getauscht. bei Return 0 macht sort nichts mit a und b
    if(aIndex === -1 && bIndex === -1) return 0;
    //wenn a nicht sichtbar ist, aber b schon -> b soll vor a
    if(aIndex === -1) return 1;
    // wenn b nicht sichtbar aber a schon -> a soll vor b
    if(bIndex === -1) return -1;

    //Wenn beide sichtbar sind sortiere sie nach ihrer position im neuen sichtbaren Reienfolge
    return aIndex - bIndex;
  });
  setToDos(reorderedToDos);
};




  return (
    <div className="container">
      <h2>🔍 Benutzerliste</h2>
      <div className="positioner">
        <input type="text" placeholder="Suche" value={searchTerm} onChange={eventHandler} className="InputField"/>
          <div className="CheckSpace">
            <label htmlFor="all">Alle</label>
            <input type="checkbox" id="all" name="alle_tasks" onChange={handleChange1} checked={isChecked1}/>

            <label htmlFor="open">Offen</label>
            <input type="checkbox" id="open" name="offene_tasks" onChange={handleChange2} checked={isChecked2}/>

          <label htmlFor="done">Done</label>
          <input type="checkbox" id="done" name="done_tasks" onChange={handleChange3} checked={isChecked3}/>
        </div>
      </div>

      
      <form>
      <label>➕ Aufgabe hinzufügen</label>
        <input type="text" placeholder="Notiz schreiben..." value={newTodoText} onChange={(e) => {setNewTodoText(e.target.value)}}/>
        <input type="submit" value="Submit" onClick={handleAddToDo} />
      </form>

  <DragDropContext onDragEnd={handleOnDragEnd}>
  <Droppable droppableId="toDoList">
    {(provided) => (
      <ul
        className="user-list"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {filteredSearchTasks.map((task, index) => (
          <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {task.text}
                <button className="btn" onClick={() => handleDeletion(task.id)}>❌</button>
              </li>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext>



    </div>
  );
}

export default App;
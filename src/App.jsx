import { useState, useEffect } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [toDos, setToDos] = useState([
    { id: "1", text: "React üben (done: false)", done: false },
    { id: "2", text: "Pizza essen (done: true)", done: true },
    { id: "3", text: "Code aufräumen (done: false)", done: false },
    { id: "4", text: "Mails checken (done: false)", done: false },
    { id: "5", text: "Kaffee holen ☕ (done: true)", done: true },
    { id: "6", text: "Ein bisschen prokrastinieren (done: false)", done: false },
    { id: "7", text: "CSS zähmen 🐉 (done: false)", done: false },
    { id: "8", text: "Git push nicht vergessen! (done: true)", done: true },
    { id: "9", text: "Short break: YouTube 🙈 (done: false)", done: false },
    { id: "10", text: "Aufgabe von ChatGPT lösen 💪 (done: true)", done: true },
  ]);

  const [newTasks, setNewTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);

  const handleChange1 = () => {
    setIsChecked1(prev => !prev);
    updateTasks();
  };
  const handleChange2 = () => {
    setIsChecked2(prev => !prev);
    updateTasks();
  };
  const handleChange3 = () => {
    setIsChecked3(prev => !prev);
    updateTasks();
  };

  const updateTasks = () => {
    let filteredTasks = toDos;

    if (isChecked2 && isChecked3) {
      filteredTasks = toDos;
    } else {
      if (isChecked2) {
        filteredTasks = filteredTasks.filter(task => task.done === false);
      }
      if (isChecked3) {
        filteredTasks = filteredTasks.filter(task => task.done === true);
      }
    }

    if (isChecked1) {
      filteredTasks = toDos;
    }

    setNewTasks(filteredTasks);
  };

  const [newTodoText, setNewTodoText] = useState("");

  function handleAddToDo(e) {
    e.preventDefault();
    if (newTodoText.trim() !== "") {
      const newTodo = {
        id: (Date.now()).toString(), // neue ID als eindeutiger String
        text: newTodoText,
        done: false,
      };
      setToDos([...toDos, newTodo]);
      setNewTodoText("");
    }
  }

  function handleDeletion(id) {
    const updatedToDos = toDos.filter(task => task.id !== id);
    setToDos(updatedToDos);
  }

  useEffect(() => {
    updateTasks();
  }, [isChecked1, isChecked2, isChecked3, toDos]);

  const eventHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSearchTasks = newTasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const currentVisibleIds = filteredSearchTasks.map(task => task.id);
    const reorderedVisibleIds = Array.from(currentVisibleIds);
    const [movedId] = reorderedVisibleIds.splice(sourceIndex, 1);
    reorderedVisibleIds.splice(destIndex, 0, movedId);

    const reorderedToDos = [...toDos].sort((a, b) => {
      const aIndex = reorderedVisibleIds.indexOf(a.id);
      const bIndex = reorderedVisibleIds.indexOf(b.id);

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

    setToDos(reorderedToDos);
  };

  return (
    <div className="container">
      <h2>🔍 Benutzerliste</h2>
      <div className="positioner">
        <input
          type="text"
          placeholder="Suche"
          value={searchTerm}
          onChange={eventHandler}
          className="InputField"
        />
        <div className="CheckSpace">
          <label htmlFor="all">Alle</label>
          <input type="checkbox" id="all" onChange={handleChange1} checked={isChecked1} />

          <label htmlFor="open">Offen</label>
          <input type="checkbox" id="open" onChange={handleChange2} checked={isChecked2} />

          <label htmlFor="done">Done</label>
          <input type="checkbox" id="done" onChange={handleChange3} checked={isChecked3} />
        </div>
      </div>

      <form>
        <label>➕ Aufgabe hinzufügen</label>
        <input
          type="text"
          placeholder="Notiz schreiben..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
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
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                >
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

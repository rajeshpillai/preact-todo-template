import { render } from "preact";
import { signal, computed } from "@preact/signals";

const todos = signal([
  { text: "Write my first post", completed: true },
  { text: "Buy new groceries", completed: false },
  { text: "Walk the dog", completed: false }
]);

const uiStatus = signal({
  edit: false,
  todoIndex: -1
});

const completedCount = computed(() => {
  return todos.value.filter((todo) => todo.completed).length;
});

const newItem = signal("");

function addTodo() {
  if (!uiStatus.value.edit) {
    todos.value = [...todos.value, { text: newItem.value, completed: false }];
    newItem.value = ""; // Reset input value on add
  } else {
    todos.value[uiStatus.value.todoIndex].text = newItem.value;
    todos.value = [...todos.value];
  }
}

function cancelEditTodo() {
  uiStatus.value = {
    edit: false,
    todoIndex: -1
  };
  newItem.value = "";
}

function removeTodo(index) {
  todos.value.splice(index, 1);
  todos.value = [...todos.value];
}

function editTodo(index) {
  uiStatus.value = {
    edit: true,
    todoIndex: index
  };
  newItem.value = todos.value[index].text;
}

function TodoList() {
  const onInput = (event) => (newItem.value = event.target.value);

  return (
    <div>
      <input type="text" value={newItem.value} onInput={onInput} />
      <button onClick={addTodo}>
        {uiStatus.value.edit ? "Update" : "Add"}
      </button>

      {uiStatus.value.edit && <button onClick={cancelEditTodo}>Cancel</button>}

      <ul>
        {todos.value.map((todo, index) => {
          return (
            <li>
              <input
                type="checkbox"
                checked={todo.completed}
                onInput={() => {
                  todo.completed = !todo.completed;
                  todos.value = [...todos.value];
                }}
              />
              {todo.completed ? <s>{todo.text}</s> : todo.text}{" "}
              <button onClick={() => removeTodo(index)}>
                <span>❌</span>
              </button>
              <button onClick={() => editTodo(index)}>✎</button>
            </li>
          );
        })}
      </ul>
      <p>Completed count: {completedCount.value}</p>
    </div>
  );
}

render(<TodoList />, document.getElementById("root"));

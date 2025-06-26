import React, { useState, useEffect } from "react";

export default function TaskHub() {
  const [tasks, setTasks] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  function fetchTasks() {
    fetch("http://localhost:8000/api/tasklist/")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Erro ao buscar tasks:", err));
  }

  fetchTasks(); 

  const intervalId = setInterval(fetchTasks, 5000);

  return () => clearInterval(intervalId);
}, []);


  function handleAddClick() {
    setShowInput(true);
  }

  function handleCancel() {
    setShowInput(false);
    setNewTaskTitle("");
  }

  function handleSave() {
    if (!newTaskTitle.trim()) {
      alert("Digite um título para a task");
      return;
    }

    setLoading(true);
    fetch("http://localhost:8000/api/taskcreate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTaskTitle.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro no POST");
        return res.json();
      })
      .then((newTask) => {
        setTasks((oldTasks) => [...oldTasks, newTask]);
        setShowInput(false);
        setNewTaskTitle("");
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao salvar a task");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.logo}>TaskHub</h1>
      <div style={styles.container}>
        {!showInput && (
          <button style={styles.addButton} onClick={handleAddClick}>
            +
          </button>
        )}

        {showInput && (
          <div style={styles.inputContainer}>
            <input
              autoFocus
              type="text"
              placeholder="Nova task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={styles.input}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <button
              style={{ ...styles.iconButton, color: "green" }}
              onClick={handleSave}
              disabled={loading}
              title="Salvar"
            >
              ✔️
            </button>
            <button
              style={{ ...styles.iconButton, color: "red" }}
              onClick={handleCancel}
              disabled={loading}
              title="Cancelar"
            >
              ❌
            </button>
          </div>
        )}

        <div style={styles.tasks}>
          {tasks.length === 0 ? (
            <p style={{ color: "white" }}>Nenhuma tarefa</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} style={styles.taskBox}>
                <span style={styles.taskText}>{task.title}</span>
                <div style={styles.icons}>
                  <button
                    style={{ ...styles.iconButton, color: "yellow" }}
                    title="Editar"
                    onClick={() => alert(`Editar: ${task.title}`)}
                  >
                    ✏️
                  </button>
                  <button
                    style={{ ...styles.iconButton, color: "red" }}
                    title="Deletar"
                    onClick={() => alert(`Deletar: ${task.title}`)}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "black",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logo: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 8,
    maxWidth: 600,
    margin: "0 auto",
  },
  addButton: {
    backgroundColor: "green",
    color: "white",
    fontSize: 28,
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    cursor: "pointer",
    marginBottom: 20,
  },
  inputContainer: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #555",
    outline: "none",
  },
  tasks: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  taskBox: {
    backgroundColor: "#333",
    color: "white",
    padding: 12,
    borderRadius: 6,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    flex: 1,
  },
  icons: {
    display: "flex",
    gap: 12,
    marginLeft: 12,
  },
  iconButton: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
  },
};

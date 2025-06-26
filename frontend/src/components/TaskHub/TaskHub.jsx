import React, { useState, useEffect } from "react";
import "./TaskHub.css";
import { getCookie, toUTCString, formatDatetime } from "../utils";

export default function TaskHub() {
  // State for tasks, form, and loading
  const [tasks, setTasks] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDatetime, setNewTaskDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    // Fetch tasks from backend
    function fetchTasks() {
      fetch("http://localhost:8000/api/tasklist/")
        .then((res) => res.json())
        .then((data) => {
          if (data.tasks) setTasks(data.tasks);
          else setTasks([]);
        })
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
    setNewTaskDatetime("");
  }

  function handleEdit(task) {
    setShowInput(true);
    setNewTaskTitle(task.title);
    setNewTaskDatetime(task.datetime ? task.datetime.slice(0, 16) : "");
    setEditingTaskId(task.id);
  }

  function handleDelete(taskId) {
    if (loading) return; // Prevent multiple deletes
    setLoading(true);
    fetch("http://localhost:8000/api/taskdelete/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
      body: JSON.stringify({ id: taskId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao deletar");
        return res.json();
      })
      .then(() => {
        setTasks((oldTasks) => oldTasks.filter((t) => t.id !== taskId));
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao deletar a task");
      })
      .finally(() => setLoading(false));
  }

  function handleSave() {
    if (!newTaskTitle.trim()) {
      alert("Digite um título para a task");
      return;
    }
    if (!newTaskDatetime) {
      alert("Selecione data e hora para a task");
      return;
    }

    setLoading(true);
    let datetime = newTaskDatetime;
    if (datetime && datetime.length === 16) {
      datetime = toUTCString(datetime); // Convert local datetime to UTC ISO string
    }
    if (editingTaskId) {
      // Edit task
      fetch("http://localhost:8000/api/taskedit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({ id: editingTaskId, title: newTaskTitle.trim(), datetime }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao editar");
          return res.json();
        })
        .then((updatedTask) => {
          setTasks((oldTasks) => oldTasks.map((t) => t.id === updatedTask.id ? updatedTask : t));
          setShowInput(false);
          setNewTaskTitle("");
          setNewTaskDatetime("");
          setEditingTaskId(null);
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao editar a task");
        })
        .finally(() => setLoading(false));
    } else {
      // Create task
      fetch("http://localhost:8000/api/taskcreate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({ title: newTaskTitle.trim(), datetime }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erro no POST");
          return res.json();
        })
        .then((newTask) => {
          setTasks((oldTasks) => [...oldTasks, newTask]);
          setShowInput(false);
          setNewTaskTitle("");
          setNewTaskDatetime("");
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao salvar a task");
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="page">
      <h1 className="logo">TaskHub</h1>
      <div className="container">
        {!showInput && (
          <button className="addButton" onClick={handleAddClick}>
            +
          </button>
        )}

        {showInput && (
          <div className="inputContainer">
            <input
              autoFocus
              type="text"
              placeholder="Nova task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="input"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") { handleCancel(); setEditingTaskId(null); }
              }}
            />
            <input
              type="datetime-local"
              value={newTaskDatetime}
              onChange={(e) => setNewTaskDatetime(e.target.value)}
              className="input"
              disabled={loading}
            />
            <button
              className="iconButton"
              style={{ color: "green" }}
              onClick={handleSave}
              disabled={loading}
              title={editingTaskId ? "Salvar edição" : "Salvar"}
            >
              ✔️
            </button>
            <button
              className="iconButton"
              style={{ color: "red" }}
              onClick={() => { handleCancel(); setEditingTaskId(null); }}
              disabled={loading}
              title="Cancelar"
            >
              ❌
            </button>
          </div>
        )}

        <div className="tasks">
          {tasks.length === 0 ? (
            <p style={{ color: "white" }}>Nenhuma tarefa</p>
          ) : (
            tasks.map((task) => {
              // Show warning if task is overdue
              const isPast = task.datetime && new Date(task.datetime) < new Date();
              return (
                <div key={task.id} className="taskBox">
                  <span className="taskText">
                    {isPast && (
                      <span title="Task atrasada" style={{ color: "#FFD600", fontSize: 18, marginRight: 6 }}>⚠️</span>
                    )}
                    {task.title}
                    {task.datetime && (
                      <span className="taskTime"> &nbsp;⏰ {formatDatetime(task.datetime)}</span>
                    )}
                  </span>
                  <div className="icons">
                    <button
                      className="iconButton"
                      style={{ color: "yellow" }}
                      title="Editar"
                      onClick={() => handleEdit(task)}
                    >
                      ✏️
                    </button>
                    <button
                      className="iconButton"
                      style={{ color: "red" }}
                      title="Deletar"
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(task.id); }}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

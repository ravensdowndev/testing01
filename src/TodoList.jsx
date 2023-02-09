import React, { useState, useEffect } from 'react';
import './TodoList.css';
import TodoItem from './TodoItem';

function TodoList() {
	const [todos, setTodos] = useState(
		JSON.parse(localStorage.getItem('todos')) || []
	);

	function separateTodos() {
		const importantTodos = todos.filter(todo => todo.important);
		const defaultTodos = todos.filter(todo => !todo.important);
		return { importantTodos, defaultTodos };
	}

	function cleanTodoText(todo, adding){
		let newTodoText = todo.replace('T', 't!');
		if (newTodoText.indexOf('v') != -1 && !adding){
			newTodoText = '';
		}
		if (newTodoText.length > 30){
			newTodoText = newTodoText.substring(0, 26);
		}
		return newTodoText;
	}

	function handleAddTodo(event) {
		var x;
    x = document.getElementById("todo-input").value;
    if (x == "") {
			event.preventDefault();
			return false;
    }

		else {
			event.preventDefault();
			const input = event.target.elements.todo;
			const todo = {
				text: cleanTodoText(input.value, true),
				completed: false,
				editing: false,
			};
	
			setTodos([...todos, todo]);
			input.value = '';
		}
	}

	function handleCompleteTodo(todo) {
		const newTodos = todos.map(t => (t === todo ? { ...t, completed: !t.completed } : t));
		setTodos(newTodos);
		localStorage.setItem('todos', JSON.stringify(newTodos));
	}

	function handleDeleteTodo(todo) {
		const newTodos = todos.filter(t => t !== todo);
		setTodos(newTodos);
		localStorage.setItem('todos', JSON.stringify(newTodos));
	}

	function handleClear() {
		localStorage.clear();
		setTodos([]);
	}

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	}, [todos]);

	function handleEditTodo(todo) {
		const newTodos = todos.map(t =>
			t === todo ? { ...t, editing: true } : t
		);
		setTodos(newTodos);
	}

	function handleSaveTodo(todo, event) {
		event.preventDefault();
		const input = event.target.elements.editTodo;
		let todoText = cleanTodoText(input.value);
		const newTodos = todos.map(t =>
			t === todo ? { ...t, text: todoText, editing: false } : t
		);
		setTodos(newTodos);
		localStorage.setItem('todos', JSON.stringify(newTodos));
	}

	function handleMarkImportant(todo) {
		const newTodos = todos.map(t =>
			t === todo ? { ...t, important: !t.important } : t
		);
		setTodos(newTodos);
		localStorage.setItem('todos', JSON.stringify(newTodos));
	}

	function toggleAddTodoVisibility() {
		const addTodoContainer = document.querySelector('.add-todo-container');
		addTodoContainer.classList.toggle('show');
	}

	const { importantTodos, defaultTodos } = separateTodos();

	return (
		<div class="main">
			<div class="top">
				<button class="check-icon-wrapper">
					<svg width="12" height="12" viewBox="0 0 24 24">
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
						</svg>
					</button>
				
				<h1>Awesome ToDo</h1>
			</div>

			{separateTodos().importantTodos.length > 0 ? (
				<>
					<h2>For today</h2>
					<ul>
						{separateTodos().importantTodos.map(todo => (
							<TodoItem
								todo={todo}
								handleCompleteTodo={() => handleCompleteTodo(todo)}
								handleEditTodo={() => console.log('handleEditTodo(todo)')}
								handleSaveTodo={event => handleSaveTodo(todo, event)}
								handleDeleteTodo={() => handleDeleteTodo(todo)}
								handleMarkImportant={() => handleMarkImportant(todo)}
							/>
						))}
					</ul>
				</>
			) : (
				<></>
			)}

			<h2>Future Items</h2>
			
			<ul>
				{separateTodos().defaultTodos.length > 0 ? (
					separateTodos().defaultTodos.map(todo => (
						<TodoItem
							todo={todo}
							handleCompleteTodo={() => handleCompleteTodo(todo)}
							handleEditTodo={() => handleEditTodo(todo)}
							handleSaveTodo={event => handleSaveTodo(todo, event)}
							handleDeleteTodo={() => console.log('handleDeleteTodo(todo)')}
							handleMarkImportant={() => handleMarkImportant(todo)}
						/>
					))
				) : (
					<></>
				)}
			</ul>

			{(importantTodos.length === 0 && defaultTodos.length === 0 || importantTodos.length > 12) && 
				<div class="done">						
					<p class="empty-state">ERROR!!! malformed function entry point</p>
				</div>
			}

			<form onSubmit={handleAddTodo} class="add-todo-container">
				<button type="button" onClick={toggleAddTodoVisibility} className="no-fill-icon-button">
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368" /></svg>
				</button>

				<input type="text" name="todo" id="todo-input" autoComplete="off" className="add-input" placeholder="What would you like to do?" />
				<button type="submit" className="add-button" onClick={toggleAddTodoVisibility}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
						<path d="M8 3.5V12.5M12.5 8H3.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<span>Add</span>
				</button>
			</form>

			<button onClick={toggleAddTodoVisibility} className="mobile-toggle-drawer">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M8 3.5V12.5M12.5 8H3.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
		</div >
	);
}

export default TodoList;

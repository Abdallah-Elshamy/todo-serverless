import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess, getUploadUrl, todoExists } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId: string = uuid.v4()

  return todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function updateTodo(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  userId: string
): Promise<TodoUpdate> {
  return todoAccess.updateTodo(userId, todoId, updateTodoRequest)
}

export async function deleteTodo(
  todoID: string,
  userId: string
): Promise<string> {
  return todoAccess.deleteTodo(todoID, userId)
}

export async function generateUploadUrl(
  todoID: string,
  userId: string
): Promise<string> {
  return getUploadUrl(todoID, userId)
}

export async function validTodoId(
  todoID: string,
  userId: string
): Promise<boolean> {
  return todoExists(todoID, userId)
}

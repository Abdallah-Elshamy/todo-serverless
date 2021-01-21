import * as uuid from 'uuid'

import { parseUserId } from '../auth/utils'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId: string = parseUserId(jwtToken)
  return todoAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const todoId: string = uuid.v4()
  const userId: string = parseUserId(jwtToken)

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
  jwtToken: string
): Promise<TodoUpdate> {
  const userId: string = parseUserId(jwtToken)

  return todoAccess.updateTodo(userId, todoId, updateTodoRequest)
}

export async function deleteTodo(
  todoID: string,
  jwtToken: string
): Promise<string> {
  const userId = parseUserId(jwtToken)
  return todoAccess.deleteTodo(todoID, userId)
}

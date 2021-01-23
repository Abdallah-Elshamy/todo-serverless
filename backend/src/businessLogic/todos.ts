import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess, getUploadUrl, todoExists } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const todoAccess = new TodoAccess()
const logger = createLogger('business')

export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`getting todos of user: ${userId}`)
  return todoAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId: string = uuid.v4()

  logger.info(`Creating todo: ${todoId}`)

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
  logger.info(`Updating todo: ${todoId}`)
  return todoAccess.updateTodo(userId, todoId, updateTodoRequest)
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info(`Updating todo: ${todoId}`)
  return todoAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId: string): Promise<string> {
  logger.info(`Generating upload URL for todo: ${todoId}`)
  return getUploadUrl(todoId)
}

export async function validTodoId(
  todoId: string,
  userId: string
): Promise<boolean> {
  logger.info(`Validating todo: ${todoId}`)
  return todoExists(todoId, userId)
}

export async function addAttachmentUrl(
  todoId: string,
  userId: string,
  uploadUrl: string
): Promise<void> {
  logger.info(`adding attachment URL for todo: ${todoId}`)
  return todoAccess.AddAttachmentUrl(todoId, userId, uploadUrl)
}

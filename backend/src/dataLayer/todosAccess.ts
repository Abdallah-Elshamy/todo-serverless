import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable: string = process.env.TODOS_TABLE
  ) {}

  async getTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :partitionKey',
        ExpressionAttributeValues: {
          ':partitionKey': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async updateTodo(
    userId: string,
    todoId: string,
    todo: TodoUpdate
  ): Promise<TodoUpdate> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
          ':name': todo.name,
          ':dueDate': todo.dueDate,
          ':done': todo.done,
          ':todoId': todoId
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        }
      })
      .promise()

    return todo
  }

  async deleteTodo(todoId: string, userId: string): Promise<string> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise()

    return todoId
  }

  async AddAttachmentUrl(
    todoId: string,
    userId: string,
    uploadUrl: string
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set attachmentUrl = :URL',
        ExpressionAttributeValues: {
          ":URL": uploadUrl.split("?")[0]
        }
      })
      .promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

export async function getUploadUrl(todoId: string): Promise<string> {
  const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

  const bucketName = process.env.UPLOADS_S3_BUCKET
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION

  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}

export async function todoExists(
  todoId: string,
  userId: string
): Promise<boolean> {
  const todosTable: string = process.env.TODOS_TABLE
  const docClient: DocumentClient = createDynamoDBClient()
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        todoId,
        userId
      }
    })
    .promise()

  console.log('Get group: ', result)
  return !!result.Item
}

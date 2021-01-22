import 'source-map-support/register'
import { getTodos } from '../../businessLogic/todos'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const logger = createLogger('get todos')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId: string = getUserId(event)
  logger.info(`getting todos of user: ${userId}`)
  const todos: TodoItem[] = await getTodos(userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}

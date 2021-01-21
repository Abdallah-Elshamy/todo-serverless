import 'source-map-support/register'
import { getTodos } from '../../businessLogic/todos';
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todos: TodoItem[] = await getTodos(getUserId(event))
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

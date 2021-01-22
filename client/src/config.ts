// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'todo-serverless.us.auth0.com', 
  clientId: 'g1CrPrFSasKihjcpsPeMhBhYx6NvN8tn',
  callbackUrl: 'http://localhost:3000/callback'
}

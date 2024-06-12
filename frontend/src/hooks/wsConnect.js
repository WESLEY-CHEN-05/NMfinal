const client = new WebSocket('ws://localhost:4000');
client.onopen = ()=> console.log('backend socket server connected!')

export default client;
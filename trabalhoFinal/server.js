const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Conexão MQTT
const mqttClient = mqtt.connect('mqtt://192.168.0.9');

mqttClient.on('connect', () => {
  mqttClient.subscribe('/sensores/umidade', (err) => {
    if (!err) {
      console.log('Conectado ao MQTT');
    }
  });
});

mqttClient.on('message', (topic, message) => {
  console.log('Mensagem recebida:', message.toString());
  io.emit('mqttMessage', message.toString());
});

// Configuração da rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor web rodando na porta ${PORT}`);
});

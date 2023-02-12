// Whatsapp OpenAI
const axios = require("axios");
// Get the environment variables
require("dotenv").config();
// Venon bot
const venom = require('venom-bot');

// -----------------------------------------------------------------
// OPENA AI 
// -----------------------------------------------------------------

// Function to send message to OpenAi using Axios POST
async function AISendMsg(prompt) {

  const response = await axios.post(
    `${process.env.OPENAI_URL}/completions`,
    {
      "max_tokens"        : Number(process.env.OPENAI_MAX_TOKENS),
      "temperature"       : Number(process.env.OPENAI_TEMPERATURE),
      "frequency_penalty" : Number(process.env.OPENAI_FREQUENCY_PENALTY),
      prompt
    },
    {
      headers: {
        Authorization   : `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  // Return the response from OpenAi
  return String(response.data.choices[0].text).trim() || "Não sei o que responder. Tente refazer sua pergunta por favor !";
};

// -----------------------------------------------------------------
// WHATSAPP
// -----------------------------------------------------------------
venom
  .create({
    session       : 'whatsapp-bot-openai-01',
    multidevice   : true
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log("Whatsapp bot error:", erro);
  });

function start(client) {
  client.onMessage((message) => {

    // Message body
    const { body : msg, isGroupMsg, from } = message;

    // Check data
    // console.log("Message:", msg);
    // console.log("isGroupMsg:", isGroupMsg);
    // console.log("from:", from);

    if ( isGroupMsg === false ) {
      // Send msg to OpenAi
      AISendMsg( msg ).then((resp) => {
        // console.log("OpenAi response:", resp);
        // Wpp bot
        client
          .sendText( from, resp )
          .then((result) => {
            // console.log('Bot Result: ', result); //return object success        
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });        
      });  
    }
  });
}
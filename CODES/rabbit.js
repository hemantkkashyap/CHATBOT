let isListening = false;
let listeningMessageElement;
let dataset;
let jokes;
let funfacts;

async function fetchDataset() {
    try {
        const response1 = await fetch('./dataset.json');
        const response2 = await fetch('./jokes.json'); 
        const response3 = await fetch('./funfacts.json');
        dataset = await response1.json();
        jokes = await response2.json();
        funfacts = await response3.json();
    } catch (error) {
        console.error('Error fetching dataset:', error);
    }
}

fetchDataset().then(() => {
});


function sendUserMessage() {
    const userInput = document.getElementById("user-input").value;
    
    if (userInput.trim() === "") {
      displayMessage("Please enter something.", "bot");
      return;
  }
    displayMessage(userInput, "user");

    handleUserQuery(userInput);

}
  
  function handleUserQuery(query) {
    if (query.toLowerCase().includes("add")) {
        // Perform addition
        const result = performAddition(query);
        displayMessage(result, "bot");
    } else if (query.toLowerCase().includes("subtract")) {
        // Perform subtraction
        const result = performSubtraction(query);
        displayMessage(result, "bot");
    } else if (query.toLowerCase().includes("multiply")) {
        // Perform multiplication
        const result = performMultiplication(query);
        displayMessage(result, "bot");
    } else if (query.toLowerCase().includes("divide")) {
        // Perform division
        const result = performDivision(query);
        displayMessage(result, "bot");
    } else {
        const botResponse = generateBotResponse(query);
        displayMessage(botResponse, "bot");
    }
  }
  
  function performAddition(query) {
    const numbers = extractNumbers(query);
    if (numbers.length === 2) {
        return numbers[0] + numbers[1];
    } else {
        return "Sorry, I couldn't understand the numbers for addition.";
    }
}

function performSubtraction(query) {
    const numbers = extractNumbers(query);
    if (numbers.length === 2) {
        return numbers[0] - numbers[1];
    } else {
        return "Sorry, I couldn't understand the numbers for subtraction.";
    }
}

function performMultiplication(query) {
    const numbers = extractNumbers(query);
    if (numbers.length === 2) {
        return numbers[0] * numbers[1];
    } else {
        return "Sorry, I couldn't understand the numbers for multiplication.";
    }
}

function performDivision(query) {
    const numbers = extractNumbers(query);
    if (numbers.length === 2 && numbers[1] !== 0) {
        return numbers[0] / numbers[1];
    } else if (numbers[1] === 0) {
        return "Division by zero is not allowed.";
    } else {
        return "Sorry, I couldn't understand the numbers for division.";
    }
}

function extractNumbers(query) {
    const regex = /-?\d+/g;
    return query.match(regex).map(Number);
}

  function generateBotResponse(userQuery) {
    userQuery = userQuery.toLowerCase();

    let bestMatch = null;

    for (const intent of dataset.intents) {
        for (const pattern of intent.patterns) {
            if (userQuery.includes(pattern.toLowerCase())) {
                if (!bestMatch || pattern.length > bestMatch.pattern.length) {
                    bestMatch = { pattern, response: intent.responses[0] };
                }
            }
        }
    }

    if (bestMatch) {
        const dynamicContentRegex = /\{([^}]+)\}/g;
        bestMatch.response = bestMatch.response.replace(dynamicContentRegex, (match, content) => {
            if (content === 'random_joke') {
                return getRandomJoke();
            } else if (content === 'random_fun_fact') {
                return getRandomFact();
            }
            else if(content==='current_date'){
                return currentDate();
            }
            else if(content==='random_quote'){
                return getrandomquote();
            }
            return match;
        });

        console.log(`Best matched pattern: ${bestMatch.pattern}`);
        console.log(`Bot response: ${bestMatch.response}`);
        return bestMatch.response;
    }

    const fallbackResponse = dataset.intents.find(intent => intent.tag === "fallback").responses[0];
    console.log(`Fallback response: ${fallbackResponse}`);
    return fallbackResponse;
}

function getrandomquote() {
    const quoteArray = jokes.quote || [];
    if (quoteArray.length === 0) {
        return "Sorry, no jokes available at the moment.";
    }

    const randomIndex = Math.floor(Math.random() * quoteArray.length);
    return quoteArray[randomIndex];
}
function currentDate(){
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
    return formattedDate;
}
function getRandomJoke() {
    const jokesArray = jokes.jokes || [];
    if (jokesArray.length === 0) {
        return "Sorry, no jokes available at the moment.";
    }

    const randomIndex = Math.floor(Math.random() * jokesArray.length);
    return jokesArray[randomIndex];
}

function getRandomFact() {
    const funFactsArray = funfacts.facts || [];
    if (funFactsArray.length === 0) {
        return "Sorry, no fun facts available at the moment.";
    }

    const randomIndex = Math.floor(Math.random() * funFactsArray.length);
    return funFactsArray[randomIndex];
}

function patternMatch(userQuery, pattern) {
    const words = pattern.split(' ');
    return words.every(word => userQuery.includes(word));
}

  
  function displayMessage(message, sender) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");

    if (sender === "bot") {
        messageElement.className = "message bot-message";
    } else {
        messageElement.className = "message user-message";
    }

    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showchat() {
  var editProfile = document.querySelector('.chat');

  editProfile.classList.add('showchat');
  editProfile.style.top = '50%';

  const welcomeMessage = "Hi there! How can I help you?";
    displayMessage(welcomeMessage, "bot");

  setTimeout(function () {
      editProfile.style.visibility = 'visible';
      editProfile.style.opacity = '1';
  }, 50);
}

function removechat() {
  var editProfile = document.querySelector('.chat');

  editProfile.classList.remove('showchat');
  editProfile.style.top = '50%';
  
  const chatMessages = document.getElementById("chat-messages");
    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }

    const userInput = document.getElementById("user-input");
    userInput.value = "";

  setTimeout(function () {
      editProfile.style.visibility = 'hidden';
      editProfile.style.opacity = '0';
  }, 50);
}

function createListeningMessage() {
  const chatMessages = document.getElementById("chat-messages");

    const messageElement = document.createElement("div");
    messageElement.className = "message listening-message";
    messageElement.innerText = "Listening...";


    const botMessageWidth = chatMessages.clientWidth * 0.5;
    messageElement.style.width = `${botMessageWidth}px`;

    return messageElement;
}

function setupSpeechRecognition() {
  const recognition = new window.webkitSpeechRecognition || window.SpeechRecognition;
  
  recognition.lang = 'en-US';

  recognition.onstart = function() {
      console.log('Speech recognition started');
      isListening = true;

      listeningMessageElement = createListeningMessage();
      document.getElementById("chat-messages").appendChild(listeningMessageElement);
  };

  recognition.onresult = function(event) {
      const userSpeech = event.results[0][0].transcript;
      document.getElementById("user-input").value = userSpeech;
      sendUserMessage();
  };

  recognition.onerror = function(event) {
      console.error('Speech recognition error', event.error);
      isListening = false;
    
      if (listeningMessageElement) {
          listeningMessageElement.remove();
      }
  };

  recognition.onend = function() {
      console.log('Speech recognition ended');
      isListening = false;

      if (listeningMessageElement) {
          listeningMessageElement.remove();
      }
  };

  return recognition;
}


function startSpeechRecognition() {
  if (!isListening) {
      const recognition = setupSpeechRecognition();
      recognition.start();
  }
}

document.getElementById("start-mic").addEventListener("click", startSpeechRecognition);

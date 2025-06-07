
const faqs = [
  {
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' in Settings to reset it."
  },
  {
    question: "Where can I view my past orders?",
    answer: "Go to 'My Orders' from the account dropdown."
  },
  {
    question: "How can I contact support?",
    answer: "You can mail us at help@flipbasket.com."
  },
  {
    question: "How do I change my email address?",
    answer: "Go to Profile Settings and click on 'Edit Email'."
  },
  {
    question: "How do I get a refund?",
    answer: "Please contact our support team with your order details."
  },
  {
    question: "Can i return an item?",
    answer: "Yes, you can return items within 30 days of purchase."
  },
  {
    question: "What if my order is damaged?",
    answer: "Contact Customer Support within 48 hours of delivery."
  },
  {
    question: "Can i get my order earlier?",
    answer: "Our courier team works 24/7 to deliver your order asap, please be patient."
  },
  {
    question: "Can I contact a higher official?",
    answer: "Ofcourse! Here's the mail of our general manager - gm@flipbasket.com."
  },
  {
    question: "I am Still not satisfied with the service, what should I do?",
    answer: "We apologize for the inconvenience. Please contact our support team for further assistance."
  },
  {
    question: "Who is the CEO of FlipBasket?",
    answer: "The CEO of FlipBasket is Ujjwal Chauhan."
  },
];

function preprocess(text) {
  const stopwords = new Set(["i", "my", "is", "can", "how", "do", "the", "in", "on", "a", "to", "you", "for"]);
  const doc = nlp(text.toLowerCase());
  const terms = doc.terms().out('array').filter(w => !stopwords.has(w));
  return terms.join(" ");
}

function cosineSimilarity(vec1, vec2) {
  const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dot / (mag1 * mag2);
}

function vectorize(doc, vocabulary) {
  const words = doc.split(" ");
  return vocabulary.map(word => words.filter(w => w === word).length);
}

const processedQuestions = faqs.map(f => preprocess(f.question));
const vocab = [...new Set(processedQuestions.join(" ").split(" "))];
const faqVectors = processedQuestions.map(q => vectorize(q, vocab));

function getAnswer(input) {
  const cleaned = preprocess(input);
  const inputVec = vectorize(cleaned, vocab);
  const scores = faqVectors.map(vec => cosineSimilarity(inputVec, vec));
  const bestMatch = scores.indexOf(Math.max(...scores));
  return faqs[bestMatch].answer;
}

function handleChat() {
  const input = document.getElementById("userInput").value;
  if (!input.trim()) return;
  const answer = getAnswer(input);
  const chatlog = document.getElementById("chatlog");
  chatlog.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
  chatlog.innerHTML += `<p><strong>Bot:</strong> ${answer}</p>`;
  document.getElementById("userInput").value = "";
  chatlog.scrollTop = chatlog.scrollHeight;
}

window.onload = () => {
  const chatlog = document.getElementById("chatlog");
  const welcomeMsg = "Hi there! I'm your FlipBasket assistant. Ask me anything about orders, support, or your account!";
  chatlog.innerHTML += `<p class="bot"><strong>Bot:</strong> ${welcomeMsg}</p>`;
};
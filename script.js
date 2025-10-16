const input = document.querySelector("#wordInput");
const searchBtn = document.querySelector("#searchBtn");
const resultBox = document.querySelector("#resultBox");
const wordTitle = document.querySelector("#wordTitle");
const wordMeaning = document.querySelector("#wordMeaning");
const wordExample = document.querySelector("#wordExample");
const wordSynonyms = document.querySelector("#wordSynonyms");
const wordAntonyms = document.querySelector("#wordAntonyms");
const saveBtn = document.querySelector("#saveBtn");
// const saveWords = document.querySelector("#saveWords");
const saveList = document.querySelector("#wordList");
const loading = document.querySelector("#loading");
const quizBox = document.querySelector("#quizBox");
const quizQuestion = document.querySelector("#quizQuestion");
const quizAnswer = document.querySelector("#quizAnswer");
const checkQuiz = document.querySelector("#checkQuiz");
const quizResult = document.querySelector("#quizResult"); 



// Gemini API Key
  const ApiKey ="AIzaSyAIv7R0VeC0qEbk1IhRT-Cb-3daxfjcMW8"
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ApiKey}`;


 async function getWordDetails(word){
    loading.classList.remove("hidden");
    resultBox.classList.remove("hidden");
    quizBox.classList.remove("hidden");

    const prompt = `Explain the English word "${word}" with:
1. Meaning
2. Example sentence
3. 3 synonyms
4. 3 antonyms
5. A simple fill-in-the-blank quiz

Return ONLY JSON with keys: meaning, example, synonyms, antonyms, quiz
`;


try {
    let res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "qpplication/json",
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }]}],
        }),
    });
    // console.log(res);
    if(!res.ok) throw new Error(Error`${res.status}`);
      
    const data = await res.json();
    // console.log(data);


    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    // console.log(aiResponse);

    if(!aiResponse) throw new Error ("No Response From Gemini API");

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

    if(!jsonMatch) throw new Error("AI Did Not Return JSON");

    const parsedData = JSON.parse(jsonMatch[0]);
    console.log(parsedData);


    loading.classList.add("hidden");
    return parsedData;
    
} catch (error) {
    alert("Error in Fetching Words....");   
  }
 
}

searchBtn.addEventListener("click", async ()=>{
    const word = wordInput.value.trim();

    if(word === "") {
        alert ("Please Enter a Word");
        return;
    }
    const details = await getWordDetails(word)

    wordTitle.textContent = word.charAt(0).toUpperCase() + word.slice(1);
    wordMeaning.textContent = `Meaning : ${details.meaning}`;
    wordExample.textContent = `Example : ${details.example}`;
    wordSynonyms.textContent =`Synonyms: ${details.synonyms.join(", ")}`;
    wordAntonyms.textContent = `Antonyms: ${details.antonyms.join(", ")}`
    quizQuestion.textContent = details.quiz.question || details.quiz.sentence
    quizBox.classList.remove("hidden");
    quizAnswer.value = "";
    quizResult.textContent = "";

    resultBox.classList.remove("hidden");
});

let savedWords = JSON.parse(localStorage.getItem("wordBank")) || [];
displaySavedWords();



saveBtn.addEventListener("click", ()=>{
    const word = wordTitle.textContent;

    if(!savedWords.includes(word)){
        savedWords.push(word);
        localStorage.setItem("wordBank", JSON.stringify(savedWords));
        displaySavedWords();
        alert("word Saved Successfully");

    }else{
        alert("This Word is already Saved");
    }

});

function displaySavedWords() {
    wordList.innerHTML = "";
    savedWords.forEach((word) => {
        const li = document.createElement("li");
        li.innerHTML = `${word} <button class="text-red-500 text-3xl font-semibold"  
        onclick="deleteWord('${word}')">𐤕</button>`
        wordList.appendChild(li);
    });
}

function deleteWord(word){
    savedWords = savedWords.filter((w) => w !== word);
    localStorage.setItem("wordBank", JSON.stringify(savedWords));
    displaySavedWords();
    alert("Word Removed Successfully");
}










// ex->
// localStorage.setItem("key1", {name: "tarun"})
// localStorage.setItem("key1", JSON.stringify({name:"tarunsg"}))
// console.log(localStorage.getItem("key1"));
// console.log(JSON.parse(localStorage.getItem("key1")));

// JSON.parse() -> converts JSON string into objects.
// JSON.stringify() -> converts object to JSON string.
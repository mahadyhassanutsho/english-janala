// DOM Elements
const lessonSelector = document.getElementById("lesson-selector");
const lessonContainer = document.getElementById("lesson-container");

// Template Strings
const lessonContentEmpty = `
        <div
          class="col-span-3 py-14 w-full flex flex-col justify-center items-center gap-4"
          id="lesson-content-empty"
        >
          <p class="text-[#79716B] text-sm">
            আপনি যে Lesson টি Select করেছেন, সেটিতে কোন Content নেই।
          </p>
          <h3 class="text-2xl">এই Lesson এ কোন Content নেই।</h3>
        </div>`;
const lessonContentNotSelected = `
       <div
          class="col-span-3 py-14 w-full flex flex-col justify-center items-center gap-4"
          id="lesson-content-not-selected"
        >
          <p class="text-[#79716B] text-sm">
            আপনি এখনো কোন Lesson Select করেন নি।
          </p>
          <h3 class="text-2xl">একটি Lesson Select করুন।</h3>
      </div>`;

// Fetch Functions
const getLesson = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/level/${id}`
  );
  const content = await response.json();
  const data = await content.data;
  return data;
};

// Render Functions
const initialRender = () => {
  lessonContainer.innerHTML = lessonContentNotSelected;
};

const renderWord = (word) => `
        <div class="p-10 space-y-8 bg-white rounded-xl">
          <div class="space-y-2 text-center">
            <h3 class="font-bold text-4xl">${word.word}</h3>
            <p class="text-lg">Meaning/Pronunciation</p>
            <h3 class="text-3xl">"${word.meaning}/${word.pronunciation}"</h3>
          </div>
          <div class="flex items-center justify-between">
            <button
              class="p-4 bg-[#1a91ff1a] rounded-xl text-xl hover:bg-[#1a91ff33] transition-colors duration-500 ease-in-out cursor-pointer"
            >
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button
              class="p-4 bg-[#1a91ff1a] rounded-xl text-xl hover:bg-[#1a91ff33] transition-colors duration-500 ease-in-out cursor-pointer"
            >
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
        </div>`;

// Event Listeners
lessonSelector.addEventListener("click", async (e) => {
  const lessonId = e.target.dataset.lessonId;
  if (lessonId) {
    // Fetch Lesson Data
    const words = await getLesson(lessonId);
    // Empty Lesson Container
    lessonContainer.innerHTML = "";
    // Render Empty State
    if (words.length === 0) {
      lessonContainer.innerHTML = lessonContentEmpty;
    } else {
      const lessonContent = words.map((word) => renderWord(word)).join("");
      lessonContainer.innerHTML = lessonContent;
    }
  } else {
    lessonContainer.innerHTML = lessonContentNotSelected;
  }
});

// Initial Render
initialRender();

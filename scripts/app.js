// DOM Elements
const lessonSelector = document.getElementById("lesson-selector");
const lessonSelectorButtons = lessonSelector.querySelectorAll(
  "#lesson-selector button"
);
const lessonContainer = document.getElementById("lesson-container");

// Template Strings
const lessonContentEmpty = `
   <div
          class="col-span-3 py-14 w-full flex flex-col justify-center items-center gap-4"
          id="lesson-content-empty"
        >
          <img
            src="./assets/alert-error.png"
            alt="Alert Error Icon"
            class="h-16 w-16 object-contain"
          />
          <p class="text-[#79716B] text-sm">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h3 class="text-2xl">Next Lesson এ যান।</h3>
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
const lessonContentLoadingSkeleton = `
        <div class="p-10 space-y-8 bg-white rounded-xl">
          <div
            class="w-full space-y-2 flex flex-col justify-center items-center"
          >
            <div class="w-2/5 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div class="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="w-1/2 h-8 bg-gray-200 rounded animate-pulse"></div>
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

// Fetch Functions
const getLesson = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/level/${id}`
  );
  const content = await response.json();
  const data = await content.data;
  return data;
};

const getWordDetails = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/word/${id}`
  );
  const content = await response.json();
  const data = await content.data;
  return data;
};

// Render Functions
const initialRender = () => {
  lessonContainer.innerHTML = lessonContentNotSelected;
};

const renderWord = async (word) => {
  const wordDetails = await getWordDetails(word.id);
  return `
        <div class="p-10 space-y-8 bg-white rounded-xl cursor-pointer" onclick="modal_${
          word.level
        }_${word.id}.showModal()">
          <div class="space-y-2 text-center">
            <h3 class="font-bold text-4xl">${
              word.word || "শব্দ খুঁজে পাওয়া হয়নি"
            }</h3>
            <p class="text-lg">Meaning/Pronunciation</p>
            <h3 class="text-3xl">
              "${word.meaning || "অজানা অর্থ"}/${
    word.pronunciation || "অজানা উচ্চারণ"
  }"
            </h3>
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
        </div>
        
        
        <dialog id="modal_${word.level}_${word.id}" class="modal">
          <div class="modal-box p-8 space-y-5">
            <h3 class="text-4xl font-bold">
              ${
                wordDetails.word
              } (<i class="fa-solid fa-microphone-lines"></i> : ${
    wordDetails.pronunciation || "অজানা উচ্চারণ"
  })
            </h3>
            <div>
              <h4 class="font-bold text-2xl">Meaning</h4>
              <p class="text-2xl">${wordDetails.meaning || "অজানা অর্থ"}</p>
            </div>
            <div>
              <h4 class="font-bold text-2xl">Example</h4>
              <p class="text-2xl">${wordDetails.sentence || "অজানা উদাহরণ"}</p>
            </div>

            <div class="space-y-2">
              <h4 class="font-bold text-2xl">Synonyms</h4>
              <ul class="flex items-center gap-4">
                ${wordDetails.synonyms
                  .map(
                    (synonym) => `
                  <li
                    class="bg-blue-100 py-2 px-6 border border-blue-300 rounded-xl"
                  >
                    <p>${synonym || "অজানা প্রতিশব্দ"}</p>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>

            <div class="modal-action">
              <form method="dialog">
                <button class="btn btn-primary">Complete Learning</button>
              </form>
            </div>
          </div>
        </dialog>`;
};

// Event Listeners
lessonSelector.addEventListener("click", async (e) => {
  const lessonId = e.target.dataset.lessonId;
  if (lessonId) {
    // Empty Lesson Container
    lessonContainer.innerHTML = "";
    // Render Loading Skeleton
    lessonContainer.innerHTML = lessonContentLoadingSkeleton.repeat(3);
    // Make Clicked Button Active and Remove Active from Others
    lessonSelectorButtons.forEach((btn) => {
      btn.classList.add("btn-outline");
    });
    e.target.classList.remove("btn-outline");
    // Fetch Lesson Data
    const words = await getLesson(lessonId);
    // Render Empty State
    if (words.length === 0) {
      lessonContainer.innerHTML = lessonContentEmpty;
    } else {
      const lessonContent = await Promise.all(
        words.map(async (word) => await renderWord(word))
      );
      lessonContainer.innerHTML = lessonContent.join("");
    }
  } else {
    // Make Clicked Button Active and Remove Active from Others
    lessonSelectorButtons.forEach((btn) => {
      btn.classList.add("btn-outline");
    });
    // Render Not Selected State
    lessonContainer.innerHTML = lessonContentNotSelected;
  }
});

//  Initial Render
initialRender();

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

// Render Functions
const initialRender = () => {
  lessonContainer.innerHTML = lessonContentNotSelected;
};

const renderWord = (word) => `
        <div class="p-10 space-y-8 bg-white rounded-xl">
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
        </div>`;

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
      const lessonContent = words.map((word) => renderWord(word)).join("");
      lessonContainer.innerHTML = lessonContent;
    }
  } else {
    lessonContainer.innerHTML = lessonContentNotSelected;
  }
});

// Initial Render
initialRender();

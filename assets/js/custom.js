$(document).ready(function () {


 var loader= document.querySelectorAll('.loader');
   
  //  Candidate
// Fetching candidate data
  // First fetch for the first slider

  $(".loader").show();
  function firstSlider() {
 fetch('https://script.google.com/macros/s/AKfycbz9NGDtY572qo6jej1mYAGU_UNjQXInot72GT0ZmsI4M1qdnklFAKc8-2okuTk4FDE/exec')
  .then((res) => res.json())
  .then((data) => {
    $(".loader").hide();
    const candidates = data.content.lokShabha;
    initSlideshow("slideshow-container", candidates); // Initialize first slider
  })
  .catch((error) => {
    $("#loader").show();
    console.error("Error fetching candidate data:", error);
  });

// Function to initialize the slideshow for each container
function initSlideshow(containerId, candidates) {
  const slideshowContainer = document.getElementById(containerId);

  candidates.forEach(function (candidate) {
    const candidateDiv = document.createElement("div");
    candidateDiv.className = "candidate-slide";
    candidateDiv.innerHTML = `
          <div class="row g-3">
        <div class="col-xl-4 col-lg-4 col-md-3 col-3">
        <div class="position-relative">
          <div class="candidateImg">
           <img src="assets/images/dl-keycandidates/${candidate.Image || 'default'}.png" class="img-fluid" alt="${candidate.CandidateName || 'Candidate Image'}" />
          </div>
           </div>
        </div>
        <div class="col-xl-6 col-lg-4 offset-md-1 col-md-8 col-7">
        <div class="position-relative">
          <div class="candidateName">
          <div class="candidatePos">
           <h5>${candidate.CandidateName || 'Unknown Candidate'}</h5>
          <p>${candidate.Party || 'Unknown Party'} - <span>${candidate.Constituency || 'Unknown Constituency'}</span></p>
            </div>
          </div>
         <div ${candidate.Status ? '' : 'style="display: none;"'} class="wonPos">
                    <img 
                        src="assets/images/${(candidate.Status || 'user').toLowerCase()}.png" 
                        class="img-fluid customStateImg2 ${getImageSizeClass(candidate.Status)}" 
                        alt="${candidate.Status || 'Status'}"
                    />
            </div>
          <div class="mt-2">
            <p class="candidateText" ${candidate.Status ? 'style="display: none;"' : ''}></p>
          </div>
        </div>
          </div>
      </div>
    `;
    slideshowContainer.appendChild(candidateDiv);
  });



  // Start the slideshow after a delay
  setTimeout(() => startSlideshow(containerId), 1000);
}

// Function to start the slideshow
function startSlideshow(containerId) {
  const slides = document.querySelectorAll(`#${containerId} .candidate-slide`);
  let currentIndex = 0;

  if (slides.length === 0) return; // Ensure there are slides to loop through

  const changeSlide = () => {
    slides.forEach((slide, index) => {
      slide.style.opacity = index === currentIndex ? 1 : 0; // Show only the current slide
    });
  };

  // Initially, show the first slide
  changeSlide();

  // After 1 second, show the next slide and start 3-second intervals
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    changeSlide();

    // Start interval for 3-second changes
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      changeSlide();
    }, 3000); // 3 seconds
  }, 1000); // 1 second
}

  }


  firstSlider();


  function secondSlider() {
    // Second fetch for the second slider
  fetch(
    "https://script.google.com/macros/s/AKfycbzyymCpmP6Dksjt4GPQ5a7ALmA320xek3PtoDu79tbGSwz91Efu_QIliNRT2hmBda4/exec"
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      $(".loader").hide();
      const candidates = data.content.lokShabha;
      initSlideshowOne("slideshow-container1", candidates); // Initialize second slider
    })
    .catch((error) => {
      console.error("Error fetching candidate data:", error);
    });
  
  // Function to initialize the second slideshow for each container
  function initSlideshowOne(containerId, candidates) {
    const slideshowContainerOne = document.getElementById(containerId);
  
    candidates.forEach(function (candidate) {
      const candidateDiv = document.createElement("div");
      candidateDiv.className = "candidate-slide";
      candidateDiv.innerHTML = `
       <div class="row g-3">
        <div class="col-xl-4 col-lg-4 col-md-3 col-3">
        <div class="position-relative">
          <div class="candidateImg">
           <img src="assets/images/dl-keycandidates/${candidate.Image || 'default'}.png" class="img-fluid" alt="${candidate.CandidateName || 'Candidate Image'}" />
          </div>
           </div>
        </div>
        <div class="col-xl-6 col-lg-4 offset-md-1 col-md-8 col-7">
        <div class="position-relative">
          <div class="candidateName">
          <div class="candidatePos">
           <h5>${candidate.CandidateName || 'Unknown Candidate'}</h5>
          <p>${candidate.Party || 'Unknown Party'} - <span>${candidate.Constituency || 'Unknown Constituency'}</span></p>
            </div>
          </div>
         <div ${candidate.Status ? '' : 'style="display: none;"'} class="wonPos">
                    <img 
                        src="assets/images/${(candidate.Status || 'user').toLowerCase()}.png" 
                        class="img-fluid customStateImg2 ${getImageSizeClass(candidate.Status)}" 
                        alt="${candidate.Status || 'Status'}"
                    />
            </div>
          <div class="mt-2">
            <p class="candidateText" ${candidate.Status ? 'style="display: none;"' : ''}></p>
          </div>
        </div>
          </div>
      </div>
      `;
      slideshowContainerOne.appendChild(candidateDiv);
    });
  
    // Start the slideshow after a delay
    setTimeout(() => startSlideshow(containerId), 1000); // Corrected function call
      }
      // Function to start the slideshow
  // Function to start the slideshow
  function startSlideshow(containerId) {
    const slides = document.querySelectorAll(`#${containerId} .candidate-slide`);
    let currentIndex = 0;
  
    if (slides.length === 0) return; // Ensure there are slides to loop through
  
    const changeSlide = () => {
      slides.forEach((slide, index) => {
        slide.style.opacity = index === currentIndex ? 1 : 0; // Show only the current slide
      });
    };
  
    // Initially, show the first slide
    changeSlide();
  
    // After 1 second, show the next slide and start 3-second intervals
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      changeSlide();
  
      // Start interval for 3-second changes
      setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        changeSlide();
      }, 3000); // 3 seconds
    }, 1000); // 1 second
  }
    }
    secondSlider()

  
  //   Won & Lost : Large_img & Leading and trailing : small_img

    function getImageSizeClass(status) {
  if (!status) return ''; // Default case
  switch (status.toLowerCase()) {
    case 'won':
    case 'lost':
      return 'large-img'; 
    case 'leading':
    case 'trailing':
      return 'small-img'; 
    default:
      return ''; 
  }
}


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  





  

  
 

function fetchData() {
  // Jharkhand Table
  fetch('https://script.google.com/macros/s/AKfycbySTY6lS0MQhsYCOYKmt9Fc4a5ByFSxnbhcwXPtMAjh6B5f9Nr2pqjwJEYg9jiz73s/exec')
      .then(res => {
          if (!res.ok) {
              throw new Error('Network response was not ok');
          }
          $(".loader").hide();
          return res.json();
      })
      .then(data => {
          console.log('Fetched data:', data); 
          if (data.content) {
              console.log('Content exists:', data.content);          
              if (data.content.lokShabha) {
                  console.log('lokShabha exists:', data.content.lokShabha);
                  const lokShabhaData = data.content.lokShabha;

                  if (Array.isArray(lokShabhaData)) {
                      const partyTable = $('#partyTable');
                      partyTable.empty();

                      lokShabhaData.forEach(item => {
                          const row = `
                              <tr class="${item.Party.replace(/ /g, '-')} paddingBorder borderRight">
                                  <td class="bgjammu-har">
                                      <div class="party">
                                          <div class="roundColor"></div>
                                          ${item.Party} 
                                      </div>
                                      <div class="partyCountColor partyCountAlign">${item.Count} </div>
                                      <div class="leading">${item.Status}</div>
                                  </td>
                              </tr>
                          `;
                          partyTable.append(row);
                      });
                  } else {
                      console.error('lokShabha is not an array:', lokShabhaData);
                  }
              } else {
                  console.error('No lokShabha found in content');
              }
          } else {
              console.error('No content found in the response');
          }
      })
      .catch(error => console.error('Error fetching data:', error));
  // Jharkhand Table
}



  fetchData();


 setInterval(fetchData, 3000);
























});

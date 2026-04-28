$(function() {


const baseUrl = "https://script.google.com/macros/s/AKfycbzZflaqZHHyn6xx_hTJsOqU1e7ubnKQxOScjt7XoJyXeEdsuDqHaArRMyuJ-OUWD6OIFA/exec";

const fetchSheets = async (sheetArray) => {
  const allData = await Promise.all(
    sheetArray.map(sheet =>
      fetch(`${baseUrl}?sheetName=${sheet}`)
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text);

          return data.map(item => ({
            ...item,
            sheetName: sheet
          }));
        })
    )
  );

  // return allData.flat(); // 👈 flatten here itself
  return allData;
};


const sheets = [
  "tn_candidate_list",
  "wb_candidate_list",
  "assam_candidate_list",
  "kerala_candidate_list",
  "pondicherry_candidate_list",

];

const candidate_image = [
  "tn_img",
  "wb_img",
  "assam_img",
  "kerala_img",
  "pondicherry_img"
];

const partyTrends = [
  "tn_party_trends",
  "wb_party_trends",
  "assam_party_trends",
  "kerala_party_trends",
  "pondicherry_party_trends"
];


fetchSheets(sheets).then(data => {
  console.log("Candidate Data:", data);
});
fetchSheets(candidate_image).then(data => {
  console.log("Image Data:", data);
});
fetchSheets(partyTrends).then(data => {
  console.log("Party Trends:", data);
});








    var tableUrl= 'https://script.google.com/macros/s/AKfycbzsvX-nNDvYtOOqavidBCw34ApYDfbcMjla_gFmSRXGacpDRphmVGbRHJDRRtmvlE7D/exec';
    // var total_vote= 'https://script.google.com/macros/s/AKfycbzsvX-nNDvYtOOqavidBCw34ApYDfbcMjla_gFmSRXGacpDRphmVGbRHJDRRtmvlE7D/exec';
    // var candidate_url= 'https://script.google.com/macros/s/AKfycbyLic1WRfB1Okzlrqia1mOQVmxtQ2gPK4pWg6REc-oh8qF--_vrcYqj65XKjKpUNIyz/exec';
    var candidate_url= 'https://script.google.com/macros/s/AKfycby_XDmVGRN8E8FwQgqACCCvxI1DPWDdVqmJ-vBEkabUgyzuNeaRuwTFZz3E5bCSWaLv/exec';
    var party_trends= 'https://script.google.com/macros/s/AKfycbx1F-TDnZk_rsjUmPO_3LXUnPhkPKYO94BHnCZpxIkRS63NeksprMxdxi0JRsA_O7AC/exec';

   var img_table='https://script.google.com/macros/s/AKfycbx6r8Ss4alrS7OeoCxsKSJqsFpovU2Ccg8OOoErHkK_s8x-PoCokvkW28U61BIrFhOm/exec';






// async function bihar_table(){
//     try{
//         const response = await fetch(tableUrl);
//         const data = await response.json();
//         console.log(data);

//          const response1 = await fetch(total_vote);
//         const data1 = await response1.json();
//          console.log('Table Data:', data1);

//          const response2 = await fetch(candidate_url);
//         const data2 = await response2.json();
//          console.log('Table Data:', data2);

//           const response3 = await fetch(party_trends);
//         const data3 = await response3.json();
//          console.log('Table Data:', data3);

//         setProgressData(data);
//         setTotalData(data1);
//         setCandidateData(data2);
//         setPartyTable(data3);
//     }
//     catch(error){
//         console.error('Error fetching data:', error);
//     }
// }


async function bihar_table() {
  try {
    const [res1, res3] = await Promise.allSettled([
      fetch(img_table),
      // fetch(total_vote),
    
      fetch(party_trends)
    ]);

    if (res1.status === "fulfilled") {
      const data = await res1.value.json();
      console.log(data)
      setProgressData(data);
    }

    // if (res2.status === "fulfilled") {
    //   const data1 = await res2.value.json();
    //   setTotalData(data1);
  
    // }
    if (res3.status === "fulfilled") {
      const data3 = await res3.value.json();
      setPartyTable(data3);
    }

  } catch (error) {
    console.error("Unexpected error:", error);
  }
}




async function bihar_carousel() {
  try {
    const [candidate] = await Promise.allSettled([
      fetch(candidate_url),
    ]);
    if (candidate.status === "fulfilled") {
      const data2 = await candidate.value.json();
      setCandidateData(data2);
    }


  } catch (error) {
    console.error("Unexpected error:", error);
  }
}










function setProgressData(data) {
  let html = '';
  const maxCount = 243;
  const targetPercent = 50;

  data.forEach((item, index) => {
    const baseName = item.Party.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const partyLogo = `${baseName}.png`;

    let color;
    switch (item.Party.toUpperCase()) {
      case 'NDA+':
        color = '#f7941c';
        break;
      case 'MGB+':
      case 'JDU':
        color = '#1e7b1e';
        break;
      default:
        color = '#999999';
    }

    const candidateName = item.Name ? item.Name.replace(/\s+/g, '-') : 'unknown';

    // Initial GIF: only Walk or Run — never happy/sad
    const initialGIF = item.Status === "Run" ? "Run" : "Walk";

    html += `
      <div class="row align-items-end mb-1" id="candidate-${index}">
        <div class="col-2">
          <div class="logoPos">
            <div class="logoImg">
              <img src="assets/images/party_logo/${partyLogo}" class="img-fluid" alt="${item.Party}">
            </div>
            <p>${item.Party}</p>
          </div>
        </div>

        <div class="col-8 position-relative">
          <div class="target-line" style="left: ${targetPercent}%;"> </div>

          <!-- Initial GIF -->
          <img id="runner-${index}" 
               src="assets/images/${candidateName}-${initialGIF}.gif" 
               class="img-fluid imgWidth running-gif"
               style="left: 0%;" 
               alt="${item.Name}">

          <div class="progress">
            <div id="bar-${index}" 
                 class="progress-bar progress-bar-striped progress-bar-animated" 
                 style="width: 0%; background-color: ${color};"></div>
          </div>
        </div>

        <div class="col-2">
          <p id="count-${index}">0</p>
        </div>
      </div>
    `;
  });

  document.getElementById('progressTable').innerHTML = html;

  // Animation loop
  data.forEach((item, index) => {
    const progressBar = document.getElementById(`bar-${index}`);
    const runnerImg = document.getElementById(`runner-${index}`);
    const countDisplay = document.getElementById(`count-${index}`);

    const candidateName = item.Name ? item.Name.replace(/\s+/g, '-') : 'unknown';
    const finalProgress = Math.round((item.Count / maxCount) * 100);
    const finalCount = item.Count;

    let current = 0;
    let hasStartedMoving = false;

    const interval = setInterval(() => {
      if (current < finalProgress) {
        current++;

        // Once animation starts → Force Run animation
        if (!hasStartedMoving) {
          hasStartedMoving = true;
          runnerImg.src = `assets/images/${candidateName}-Run.gif`;
        }

        progressBar.style.width = `${current}%`;
        runnerImg.style.left = `calc(${current}% - 5%)`;
        countDisplay.textContent = Math.round((current / 100) * maxCount);
      } 
      else {
        clearInterval(interval);
        countDisplay.textContent = finalCount;

        // Final GIF based on API Status
        if (item.Status === "Win") {
          runnerImg.src = `assets/images/${candidateName}-Happy.gif`;
        } 
        else if (item.Status === "Lose") {
          runnerImg.src = `assets/images/${candidateName}-Sad.gif`;
        } 
        else {
          runnerImg.src = `assets/images/${candidateName}-Walk.gif`;
        }
      }
    }, 100);
  });
}








function setTotalData(data) {
  let html = `
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr class="table-header-bg">
            <th scope="col">Party</th>
            <th scope="col">Lead</th>
            <th scope="col">Won</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach((item, index) => {
    html += `
      <tr>
        <td>${item.Party}</td>
        <td>${item.Lead}</td>
        <td>${item.Won}</td>
        <td>${item.Total}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('totalTable').innerHTML = html;
}



function setCandidateData(data) {
  const html = data.map(item => {
    const status = item.Status ? item.Status.toLowerCase() : '';
    let statusImage = '';

    if (status === 'leading') statusImage = 'leading.png';
    else if (status === 'trailing') statusImage = 'trailing.png';
    else if (status === 'won') statusImage = 'won.png';
    else if (status === 'lost') statusImage = 'lost.png';
    // counting = no image

    return `
      <div class="card">
        <div class="candidate_image">
          <img src="assets/images/bihar_candidate/${item.Image.trim()}.png" class="img-fluid" alt="${item.CandidateName}">
        </div>
        <div class="candidate_details">
          <h4>${item.CandidateName}</h4>
          <p>${item.Party} - ${item.Constituency}</p>

          ${statusImage ? `<img src="assets/images/${statusImage}" class="img-fluid status-${status}" alt="${item.Status}">` : ''}

        </div>
      </div>
    `;
  }).join('');

  document.querySelector('.candidate_carousel').innerHTML = html;

  $('.candidate_carousel').trigger('destroy.owl.carousel');

  $('.candidate_carousel').owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 2 },
      600: { items: 1 },
      1000: { items: 3 }
    }
  });
}








const partyColors = {
  BJP: '#ff6600',
  JDU: '#228B22',
  "CPI(ML)": '#C41301',
  LPJ: '#5B006A',
  Congress: '#0F823F',
  RJD: '#056D05',
  others: '#cc0000'
};

function setPartyTable(data) {
  let html = '<tbody>';
  
  data.forEach(item => {
    const color = partyColors[item.Party] || '#999';
    html += `
      <tr>
        <td><span class="dot" style="background-color: ${color};"></span> ${item.Party}</td>
        <td class="count">${item.Total}</td>
      </tr>
    `;
  });

  html += '</tbody>';
  document.getElementById('partyTrends').innerHTML = html;
}



setInterval(() => {
    bihar_table();
}, 5000);
 bihar_table();
setInterval(bihar_carousel, 10000);

bihar_carousel();


/*$('.owl-carousel').owlCarousel({
	loop: true,
	margin: 20,
	nav: true,
	dots: false,
	items: 1,
	autoplay: true,
	autoplayTimeout: 3000,
	autoplayHoverPause: true,
	responsive: {
		0: {
			 items: 1 // mobile: one grid (1x1)
		 },
		 600: {
		 items: 1 // tablet: one grid (2x3 inside each slide)
		},
		1000: {
		 items: 1 // desktop: one grid (2x3)
		 }
	}
 });*/



















});

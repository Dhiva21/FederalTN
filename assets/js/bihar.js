$(function() {






    var tableUrl= 'https://script.google.com/macros/s/AKfycbyX0k-WBU-Nlv70_zg0c9PxqzDboCSnUisNlXK9x4FWksQtaXdM-ghFq_auSH6lgiaO/exec';
    var total_vote= 'https://script.google.com/macros/s/AKfycbzuFSAGFh34EgLiKqRtAURY4ybFkrtMmbG84SGUfxwI7ulomEc_CPsD_iVTK-UVBMyc/exec';
    var candidate_url= 'https://script.google.com/macros/s/AKfycbyLic1WRfB1Okzlrqia1mOQVmxtQ2gPK4pWg6REc-oh8qF--_vrcYqj65XKjKpUNIyz/exec';
    var party_trends= 'https://script.google.com/macros/s/AKfycbx1F-TDnZk_rsjUmPO_3LXUnPhkPKYO94BHnCZpxIkRS63NeksprMxdxi0JRsA_O7AC/exec';








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
    const [res1, res2, res3] = await Promise.allSettled([
      fetch(tableUrl),
      fetch(total_vote),
    
      fetch(party_trends)
    ]);

    if (res1.status === "fulfilled") {
      const data = await res1.value.json();
      setProgressData(data);
    }

    if (res2.status === "fulfilled") {
      const data1 = await res2.value.json();
      setTotalData(data1);
    }
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

    data.forEach(item => {
        const progress = Math.round((item.Count / maxCount) * 100);

       
        const baseName = item.Party.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        const partyLogo = `${baseName}.png`;

       
        let color;
        switch (item.Party.toUpperCase()) {
            case 'BJP':
                color = '#f7941c';
                break;
            case 'JDU':
                color = '#1e7b1e';
                break;
            case 'CPI':
                color = '#de0000';
                break;
            default:
                color = '#999999'; 
        }

        html += `
        <div class="row align-items-end mb-1">
            <div class="col-md-2">
                <div class="logoPos"> 
                    <div class="logoImg">
                        <img src="assets/images/party_logo/${partyLogo}" class="img-fluid" alt="${item.Party}">
                    </div>
                    <p>${item.Party}</p>
                </div>
            </div>

            <div class="col-md-8 position-relative">
                <img src="assets/images/run.gif" class="img-fluid imgWidth" 
                     style=" left: calc(${progress}% - 5%);" alt="">
                
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                         style="width: ${progress}%; background-color: ${color};"></div>
                </div>
            </div>

            <div class="col-md-2">
                <p>${item.Count}</p>
            </div>
        </div>
        `;
    });

     document.getElementById('progressTable').innerHTML = html;

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
  let html = '';

  for (let i = 0; i < data.length; i += 6) {
    const chunk = data.slice(i, i + 6);

    html += `
      <div class="candidate_slide">
        <div class="candidate_grid">
          ${chunk.map(item => {
            // Normalize the status safely
            const status = item.Status ? item.Status.toLowerCase() : '';

            // Determine which image to use
            let statusImage = 'counting.png'; // default image

            if (status === 'leading') statusImage = 'leading.png';
            else if (status === 'trailing') statusImage = 'trailing.png';
            else if (status === 'won') statusImage = 'won.png';
            else if (status === 'lost') statusImage = 'lost.png';

            return `
              <div class="card">
                <div class="candidate_image">
                  <img src="assets/images/dl-keycandidates/${item.Image}.png" class="img-fluid" alt="${item.CandidateName}">
                </div>
                <div class="candidate_details">
                  <h4>${item.CandidateName}</h4>
                  <p>${item.Party} - ${item.Constituency}</p>
                  <img src="assets/images/${statusImage}" class="img-fluid status-${status || 'counting'}" alt="${item.Status || 'Counting'}">
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  document.querySelector('.candidate_carousel').innerHTML = html;

  // Destroy existing carousel before re-initializing
  $('.candidate_carousel').trigger('destroy.owl.carousel');

  // Initialize Owl Carousel
  $('.candidate_carousel').owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: false,
    items: 1,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  });
}







const partyColors = {
  BJP: '#ff6600',
  Congress: '#008000',
  RJD: '#008000',
  JDU: '#008000',
  JSP: '#cc0000',
  LJP: '#008CFF'
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

// setInterval(bihar_carousel, 5000);

bihar_carousel();


//   $('.owl-carousel').owlCarousel({
//     loop: true,
//     margin: 20,
//     nav: true,
//     dots: false,
//     items: 1,
//     autoplay: false,
//     autoplayTimeout: 3000,
//     autoplayHoverPause: true,
//      responsive: {
//       0: {
//         items: 1 // mobile: one grid (1x1)
//       },
//       600: {
//         items: 1 // tablet: one grid (2x3 inside each slide)
//       },
//       1000: {
//         items: 1 // desktop: one grid (2x3)
//       }
//     }
//   });



















});

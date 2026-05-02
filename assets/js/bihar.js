$(function() {
    const baseUrl = "https://script.google.com/macros/s/AKfycbzZflaqZHHyn6xx_hTJsOqU1e7ubnKQxOScjt7XoJyXeEdsuDqHaArRMyuJ-OUWD6OIFA/exec";

    const states = [
        { id: 'tn', name: 'Tamil Nadu', sheet: 'tn_candidate_list',imgFolder: 'tn-candidates', imgSheet: 'tn_img', trendSheet: 'tn_party_trends', totalSeats: 234, targetSeats: 118 },
        { id: 'wb', name: 'West Bengal', sheet: 'wb_candidate_list',imgFolder: 'wb-candidates', imgSheet: 'wb_img', trendSheet: 'wb_party_trends', totalSeats: 294, targetSeats: 148 },
        { id: 'as', name: 'Assam', sheet: 'assam_candidate_list',imgFolder: 'as-candidates', imgSheet: 'assam_img', trendSheet: 'assam_party_trends', totalSeats: 126, targetSeats: 63 },
        { id: 'ke', name: 'Kerala', sheet: 'kerala_candidate_list',imgFolder: 'kl-candidates', imgSheet: 'kerala_img', trendSheet: 'kerala_party_trends', totalSeats: 140, targetSeats: 71 },
        { id: 'po', name: 'Pondicherry', sheet: 'pondicherry_candidate_list',imgFolder: 'po-candidates', imgSheet: 'pondicherry_img', trendSheet: 'pondicherry_party_trends', totalSeats: 30, targetSeats: 16 }
    ];
let isInitialLoad = true;
    function showSkeleton(tabPane) {
      
    let skeletonHtml = '';

    for (let i = 0; i < 4; i++) {
        skeletonHtml += `
        <div class="row align-items-end mb-2 skeleton-row">
            <div class="col-2">
                <div class="skeleton skeleton-logo"></div>
            </div>
            <div class="col-8">
                <div class="skeleton skeleton-bar"></div>
            </div>
            <div class="col-2">
                <div class="skeleton skeleton-text"></div>
            </div>
        </div>
        `;
    }

    tabPane.find('#progressTable').html(skeletonHtml);
const carouselContainer = tabPane.find('.candidate_carousel');
     if (carouselContainer.hasClass('owl-loaded')) {
        carouselContainer.trigger('destroy.owl.carousel');
        carouselContainer.removeClass('owl-loaded');
        carouselContainer.find('.owl-stage-outer').children().unwrap();
    }


    // Carousel skeleton
    let cardSkeleton = '';
    for (let i = 0; i < 3; i++) {
        cardSkeleton += `
        <div class="card">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-text mt-2"></div>
        </div>`;
    }
    tabPane.find('.candidate_carousel').html(cardSkeleton);

    // Party table skeleton
    let tableSkeleton = '<tbody>';
    for (let i = 0; i < 4; i++) {
        tableSkeleton += `
        <tr>
            <td><div class="skeleton skeleton-text"></div></td>
            <td><div class="skeleton skeleton-text"></div></td>
        </tr>`;
    }
    tableSkeleton += '</tbody>';

    tabPane.find('#partyTrends').html(tableSkeleton);
}

    // Global array to store intervals of the currently active tab
  
  
  
  
  
    let activeIntervals = [];

    const fetchSheet = (sheetName) => fetch(`${baseUrl}?sheetName=${sheetName}`)
        .then(res => res.json())
        .catch(err => {
            console.error(`Error fetching ${sheetName}:`, err);
            return [];
        });

    async function loadStateData(state, tabPane) {
            if (isInitialLoad) {
    showSkeleton(tabPane);
    isInitialLoad = false;
      await new Promise(requestAnimationFrame);
}
        console.log(`Loading data for ${state.name}...`);
        const [candidates, images, trends] = await Promise.all([
            fetchSheet(state.sheet),
            fetchSheet(state.imgSheet),
            fetchSheet(state.trendSheet)
        ]);

        tabPane.find('.totalCount h4').text(`Total Count - ${state.totalSeats}`);
        tabPane.find('.target_count h3').text(`Target - ${state.targetSeats}`);

        setProgressData(candidates,state.name, state.totalSeats, state.targetSeats, tabPane);
        setCandidateData(images, tabPane,state);
        setPartyTable(trends, tabPane);
    }


    const partyColors = {
    "DMK+": "#cf4444df",
    "AIADMK+": "#00a651",
    "TVK": "#4d0c0c",

    "LDF": "#e60000",
    "UDF": "#0F823F",
    "NDA": "#ff6600",

    "AITC": "#1aa3ff",
    "BJP": "#ff6600",
    "INC": "#0F823F",

    "BJP+": "#ff6600",
    "INC+": "#0F823F",
    "NDA+": "#ff6600",

    "Others": "#999999"
};

function setProgressData(data, name, totalSeats, targetSeats, tabPane) {

    var stateName = name;

    // Clear intervals
    activeIntervals.forEach(clearInterval);
    activeIntervals = [];

    let html = '';
    const maxCount = totalSeats;
    const targetPercent = (targetSeats / totalSeats) * 100;

    data.forEach((item, index) => {

        const baseName = item.Party.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        const partyLogo = `${baseName}.png`;

        // ✅ NEW COLOR LOGIC (GLOBAL MAP)
        const partyKey = item.Party ? item.Party.trim() : "Others";
        let color = partyColors[partyKey] || partyColors["Others"];

        const candidateName = item.Name
            ? item.Name.replace(/\s+/g, '-')
            : 'unknown';

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

                    <img id="runner-${index}" 
                         src="assets/images/reaction/${stateName}/${candidateName}-Run.gif" 
                         class="img-fluid imgWidth running-gif"
                         style="left: 0%;" 
                         alt="${item.Name}">

                    <div class="progress">
                        <div id="bar-${index}" 
                             class="progress-bar progress-bar-striped progress-bar-animated" 
                             style="width: 0%; background-color: ${color};">
                        </div>
                    </div>
                </div>
                <div class="col-2">
                    <p id="count-${index}">0</p>
                </div>
            </div>
        `;
    });

    const progressContainer = tabPane.find('#progressTable');
    progressContainer.html(html);

    data.forEach((item, index) => {

        const progressBar = progressContainer.find(`#bar-${index}`)[0];
        const runnerImg = progressContainer.find(`#runner-${index}`)[0];
        const countDisplay = progressContainer.find(`#count-${index}`)[0];

        if (!progressBar || !runnerImg || !countDisplay) return;

        const candidateName = item.Name
            ? item.Name.replace(/\s+/g, '-')
            : 'unknown';

        let rawCount = Number(item.Count);
        if (isNaN(rawCount)) rawCount = 0;

        const finalCount = Math.min(rawCount, maxCount);
        const finalProgress = Math.round((finalCount / maxCount) * 100);

        const status = item.Status ? item.Status.toLowerCase() : '';

        // Smooth animation
        progressBar.style.transition = "width 1s linear";
        runnerImg.style.transition = "left 1s linear";

        // Start RUN
        runnerImg.src = `assets/images/reaction/${stateName}/${candidateName}-Run.gif`;

        const safeLeft = Math.max(finalProgress - 5, 0);

        // Move
        progressBar.style.width = `${finalProgress}%`;
        runnerImg.style.left = `${safeLeft}%`;
        countDisplay.textContent = finalCount;

        // Final state
        let finished = false;
        function setFinalState() {
            if (finished) return;
            finished = true;

            if (status === "win") {
                runnerImg.src = `assets/images/reaction/${stateName}/${candidateName}-Happy.gif`;
            } else if (status === "lose") {
                runnerImg.src = `assets/images/reaction/${stateName}/${candidateName}-Sad.gif`;
            } else {
                runnerImg.src = `assets/images/reaction/${stateName}/${candidateName}-Run.gif`;
            }
        }

        // Transition end trigger
        progressBar.addEventListener("transitionend", function handler(e) {
            if (e.propertyName !== "width") return;

            progressBar.removeEventListener("transitionend", handler);
            setFinalState();
        });

        // Fallback
        setTimeout(setFinalState, 1200);
    });
}
    function setCandidateData(data, tabPane, state) {
    const html = data.map(item => {
        const status = item.Status ? item.Status.toLowerCase() : '';
        let statusImage = '';

        if (status === 'leading') statusImage = 'leading.png';
        else if (status === 'trailing') statusImage = 'trailing.png';
        else if (status === 'won') statusImage = 'won.png';
        else if (status === 'lost') statusImage = 'lost.png';

        const imageName = item.Image ? item.Image.trim() : 'default';

        return `
            <div class="card">
                <div class="candidate_image">
                    <img src="assets/images/${state.imgFolder}/${item.Image}.png"
                         class="img-fluid"
                         onerror="this.src='assets/images/default.png'">
                </div>
                <div class="candidate_details">
                    <h4>${item.CandidateName}</h4>
                    <p>${item.Party} - ${item.Constituency || ''}</p>
                    ${statusImage ? `<img src="assets/images/${statusImage}" class="img-fluid status-${status}">` : ''}
                </div>
            </div>
        `;
    }).join('');

    const carouselContainer = tabPane.find('.candidate_carousel');
    carouselContainer.html(html);

    if (carouselContainer.data('owl.carousel')) {
        carouselContainer.trigger('destroy.owl.carousel');
    }

    carouselContainer.owlCarousel({
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

    // const partyColors = {
    //     BJP: '#ff6600',
    //     JDU: '#228B22',
    //     "CPI(ML)": '#C41301',
    //     LPJ: '#5B006A',
    //     Congress: '#0F823F',
    //     RJD: '#056D05',
    //     others: '#cc0000'
    // };

 function setPartyTable(data, tabPane) {
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

    const table = tabPane.find('#partyTrends');
    table.html(html);

    // ✅ AUTO HEIGHT BASED ON ROW COUNT
    const rowCount = data.length;

    // Option 1: CSS variable (BEST)
    table.css('--rows', rowCount);
}

    function getActiveTabPane() {
        const activeTabButton = $('.nav-link.active');
        const targetId = activeTabButton.attr('data-bs-target');
        return $(targetId);
    }

    function getStateFromTab(tabButton) {
        const stateName = tabButton.text().trim();
        return states.find(s => s.name === stateName);
    }

    function refreshActiveTab() {
        const activePane = getActiveTabPane();
        const activeButton = $('.nav-link.active');
        const state = getStateFromTab(activeButton);
        if (state && activePane.length) {
            loadStateData(state, activePane);
        }
    }

    // Initial load
    refreshActiveTab();

    // Tab change listener
    $('.nav-link').on('shown.bs.tab', function (e) {
          isInitialLoad = true;
        refreshActiveTab();
    });

    // Auto-refresh every 6 seconds (clears intervals before new load)
    setInterval(() => {
        refreshActiveTab();
    }, 10000);

  
    $(window).on('beforeunload', function() {
        activeIntervals.forEach(clearInterval);
    });
});
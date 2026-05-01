$(function() {
    const baseUrl = "https://script.google.com/macros/s/AKfycbzZflaqZHHyn6xx_hTJsOqU1e7ubnKQxOScjt7XoJyXeEdsuDqHaArRMyuJ-OUWD6OIFA/exec";

    const states = [
        { id: 'tn', name: 'Tamil Nadu', sheet: 'tn_candidate_list',imgFolder: 'tn-candidates', imgSheet: 'tn_img', trendSheet: 'tn_party_trends', totalSeats: 234, targetSeats: 117 },
        { id: 'wb', name: 'West Bengal', sheet: 'wb_candidate_list',imgFolder: 'wb-candidates', imgSheet: 'wb_img', trendSheet: 'wb_party_trends', totalSeats: 294, targetSeats: 147 },
        { id: 'as', name: 'Assam', sheet: 'assam_candidate_list',imgFolder: 'as-candidates', imgSheet: 'assam_img', trendSheet: 'assam_party_trends', totalSeats: 126, targetSeats: 63 },
        { id: 'ke', name: 'Kerala', sheet: 'kerala_candidate_list',imgFolder: 'kl-candidates', imgSheet: 'kerala_img', trendSheet: 'kerala_party_trends', totalSeats: 140, targetSeats: 70 },
        { id: 'po', name: 'Pondicherry', sheet: 'pondicherry_candidate_list',imgFolder: 'po-candidates', imgSheet: 'pondicherry_img', trendSheet: 'pondicherry_party_trends', totalSeats: 30, targetSeats: 15 }
    ];

    // Global array to store intervals of the currently active tab
    let activeIntervals = [];

    const fetchSheet = (sheetName) => fetch(`${baseUrl}?sheetName=${sheetName}`)
        .then(res => res.json())
        .catch(err => {
            console.error(`Error fetching ${sheetName}:`, err);
            return [];
        });

    async function loadStateData(state, tabPane) {
        console.log(`Loading data for ${state.name}...`);
        const [candidates, images, trends] = await Promise.all([
            fetchSheet(state.sheet),
            fetchSheet(state.imgSheet),
            fetchSheet(state.trendSheet)
        ]);

        tabPane.find('.totalCount h4').text(`Total Count - ${state.totalSeats}`);
        tabPane.find('.target_count h3').text(`Target - ${state.targetSeats}`);

        setProgressData(candidates, state.totalSeats, state.targetSeats, tabPane);
        setCandidateData(images, tabPane,state);
        setPartyTable(trends, tabPane);
    }

    function setProgressData(data, totalSeats, targetSeats, tabPane) {
        // Clear all previous intervals to stop extra animations
        activeIntervals.forEach(clearInterval);
        activeIntervals = [];

        let html = '';
        const maxCount = totalSeats;
        const targetPercent = (targetSeats / totalSeats) * 100;

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

        const progressContainer = tabPane.find('#progressTable');
        progressContainer.html(html);

        data.forEach((item, index) => {
            const progressBar = progressContainer.find(`#bar-${index}`)[0];
            const runnerImg = progressContainer.find(`#runner-${index}`)[0];
            const countDisplay = progressContainer.find(`#count-${index}`)[0];

            if (!progressBar || !runnerImg || !countDisplay) return;

            const candidateName = item.Name ? item.Name.replace(/\s+/g, '-') : 'unknown';
            // Validate Count
            let rawCount = Number(item.Count);
            if (isNaN(rawCount)) rawCount = 0;
            const finalCount = Math.min(rawCount, maxCount);
            const finalProgress = Math.round((finalCount / maxCount) * 100);

            let current = 0;
            let hasStartedMoving = false;

            // If no progress, just set final values without animation
            if (finalProgress <= 0) {
                progressBar.style.width = '0%';
                runnerImg.style.left = '-5%';
                countDisplay.textContent = finalCount;
                if (item.Status === "Win") {
                    runnerImg.src = `assets/images/${candidateName}-Happy.gif`;
                } else if (item.Status === "Lose") {
                    runnerImg.src = `assets/images/${candidateName}-Sad.gif`;
                } else {
                    runnerImg.src = `assets/images/${candidateName}-Walk.gif`;
                }
                return;
            }

            const interval = setInterval(() => {
                if (current < finalProgress) {
                    current++;
                    if (!hasStartedMoving) {
                        hasStartedMoving = true;
                        runnerImg.src = `assets/images/${candidateName}-Run.gif`;
                    }
                    progressBar.style.width = `${current}%`;
                    runnerImg.style.left = `calc(${current}% - 5%)`;
                    countDisplay.textContent = Math.round((current / 100) * maxCount);
                } else {
                    clearInterval(interval);
                    // Remove from activeIntervals array
                    const idx = activeIntervals.indexOf(interval);
                    if (idx !== -1) activeIntervals.splice(idx, 1);
                    // Set final exact values
                    countDisplay.textContent = finalCount;
                    if (item.Status === "Win") {
                        runnerImg.src = `assets/images/${candidateName}-Happy.gif`;
                    } else if (item.Status === "Lose") {
                        runnerImg.src = `assets/images/${candidateName}-Sad.gif`;
                    } else {
                        runnerImg.src = `assets/images/${candidateName}-Walk.gif`;
                    }
                }
            }, 100);

            activeIntervals.push(interval);
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

    const partyColors = {
        BJP: '#ff6600',
        JDU: '#228B22',
        "CPI(ML)": '#C41301',
        LPJ: '#5B006A',
        Congress: '#0F823F',
        RJD: '#056D05',
        others: '#cc0000'
    };

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
        tabPane.find('#partyTrends').html(html);
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
        refreshActiveTab();
    });

    // Auto-refresh every 6 seconds (clears intervals before new load)
    setInterval(() => {
        refreshActiveTab();
    }, 10000);

    // Cleanup intervals on page unload (optional)
    $(window).on('beforeunload', function() {
        activeIntervals.forEach(clearInterval);
    });
});
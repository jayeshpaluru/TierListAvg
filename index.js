let votes = {};
let currentRound = 1;

const tierValues = {
    'S': 5,
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1,
    'F': 0
};

const tierRanges = [
    { min: 4.5, tier: 'S' },
    { min: 3.5, tier: 'A' },
    { min: 2.5, tier: 'B' },
    { min: 1.5, tier: 'C' },
    { min: 0.5, tier: 'D' },
    { min: 0, tier: 'F' }
];

function vote(tier) {
    const voterSelect = document.getElementById('voterSelect');
    const voter = voterSelect.value;
    
    if (!voter) {
        alert("Please select a voter first!");
        return;
    }

    if (!votes[currentRound]) {
        votes[currentRound] = {};
    }
    votes[currentRound][voter] = tier;

    console.log(`Vote recorded for ${voter}: tier ${tier} in round ${currentRound}`);
    console.log('Current votes:', votes);

    updateVotingHistory();
}

function updateVotingHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = '<h3>Voting History</h3>';
    
    for (const [round, roundVotes] of Object.entries(votes)) {
        historyElement.innerHTML += `<h4>Round ${round}</h4>`;
        for (const [voter, tier] of Object.entries(roundVotes)) {
            historyElement.innerHTML += `<p><strong>${voter}</strong>: ${tier}</p>`;
        }
    }
}

function calculateAverage() {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '<h3>Average Tier per Round</h3>';

    for (const [round, roundVotes] of Object.entries(votes)) {
        const tiers = Object.values(roundVotes);
        if (tiers.length === 0) continue;

        const sum = tiers.reduce((acc, tier) => acc + tierValues[tier], 0);
        const average = sum / tiers.length;
        const resultTier = tierRanges.find(range => average >= range.min).tier;

        resultElement.innerHTML += `<p>Round ${round}: ${resultTier} (${average.toFixed(2)})</p>`;
    }
}

function resetVotes() {
    if (votes[currentRound]) {
        delete votes[currentRound];
    }
    document.getElementById('result').textContent = '';
    updateVotingHistory();
    alert(`Votes for Round ${currentRound} have been reset`);
}

function resetEverything() {
    votes = {};
    currentRound = 1;
    document.getElementById('result').textContent = '';
    document.getElementById('history').innerHTML = '';
    document.getElementById('voterAverages').innerHTML = '';
    alert('All votes and history have been reset');
}

function nextRound() {
    currentRound++;
    updateVotingHistory();
    alert(`Moving to Round ${currentRound}`);
}

function calculateVoterAverages() {
    const voterAverages = {};
    const voterTotalVotes = {};

    for (const roundVotes of Object.values(votes)) {
        for (const [voter, tier] of Object.entries(roundVotes)) {
            if (!voterAverages[voter]) {
                voterAverages[voter] = 0;
                voterTotalVotes[voter] = 0;
            }
            voterAverages[voter] += tierValues[tier];
            voterTotalVotes[voter]++;
        }
    }

    for (const voter in voterAverages) {
        voterAverages[voter] /= voterTotalVotes[voter];
    }

    const voterAveragesElement = document.getElementById('voterAverages');
    voterAveragesElement.innerHTML = '<h3>Average Tier per Voter</h3>';

    for (const [voter, average] of Object.entries(voterAverages)) {
        const resultTier = tierRanges.find(range => average >= range.min).tier;
        voterAveragesElement.innerHTML += `<p><strong>${voter}</strong>: ${resultTier} (${average.toFixed(2)})</p>`;
    }
}


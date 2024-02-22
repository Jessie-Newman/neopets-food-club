dict = {
    'Dan': '1', 
    'Sproggie': '2',
    'Orvin': '3',
    'Lucky': '4',
    'Edmund': '5',
    'Peg Leg': '6',
    'Bonnie': '7',
    'Puffo': '8',
    'Stuff': '9',
    'Squire': '10',
    'Crossblades': '11',
    'Stripey':  '12',
    'Ned': '13',
    'Fairfax': '14',
    'Gooblah':  '15',
    'Franchisco':  '16',
    'Federismo': '17',
    'Blackbeard':  '18',
    'Buck': '19',
    'Tailhook':  '20'
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "parse") {
        parseMarkdownTable(request.table)
        sendResponse({status: "success", message: "noice"});
    }
});


function populateCompetitors(competitors) {
    competitors.map(number => {
        shift = 11
        bolds = document.getElementsByTagName('b')
        next = false
        maxBet = null
        Array.from(bolds).forEach((tag) => {
            if (next && !maxBet) { 
                maxBet = tag.innerHTML;
            } else if (tag.innerHTML == 'Leave') {
                next = true
            }
        })
        document.getElementsByTagName('input')[shift+5].value = maxBet

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < document.getElementsByTagName('select')[0].options.length; j++) {
                if (document.getElementsByTagName('select')[i].options[j].value == number) {
                    document.getElementsByTagName('input')[shift+i].click()
                    document.getElementsByTagName('select')[i].value = number
                }
            }
        }
    });
}

function parseMarkdownTable(markdownTable) {
    const rows = markdownTable.trim().split('\n');

    let validColumns = [];
    rows.map(row => {
        const columns = row.split('|').map(column => column.trim())
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(columns[0])) {
            validColumns.push(columns)
        }
    })

    let all_competitors = []
    validColumns.map(row => {
        let competitors = []
        row.map(cell => {
            if (cell in dict) {
                competitors.push(dict[cell])
            }
        })
        all_competitors.push(competitors)
    })


    all_competitors.map(competitors => {
        chrome.tabs.create({url: "https://www.neopets.com/pirates/foodclub.phtml?type=bet"}, function(tab) {
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: populateCompetitors,
                        args: [competitors]
                    }).then(result => {
                        console.log('Script result:', result);
                    }).catch(error => {
                        console.log('Script error:', error);
                    });
                }
            });
        });
    });
}


function parseTable() {
    const competitors_to_id = {
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

    let all_competitors = []
    const table = document.getElementsByClassName('chakra-table')[0].children[1]
    for (let i=0; i<10; i++) {
        let competitors = []
        const row = table.children[i]
        for (let j=8; j<13; j++) {
            const cell = row.children[j]
            competitors.push(competitors_to_id[cell.textContent])
        }
        all_competitors.push(competitors)
    }
    return all_competitors
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "run") {
        const maxBetOverride = request.maxBetOverride
        const placeBets = request.placeBets
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              function: parseTable
            }, function(results) {
              openTabs(results[0]['result'], maxBetOverride, placeBets)
            });
          });
        sendResponse({status: "success", message: "noice"});
    }
});

function openTabs(all_competitors, maxBetOverride, placeBets) {
    all_competitors.map(competitors => {
        chrome.tabs.create({url: "https://www.neopets.com/pirates/foodclub.phtml?type=bet"}, function(tab) {
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: populateBets,
                        args: [competitors, maxBetOverride, placeBets]
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

function populateBets(competitors, maxBetOverride, placeBets) {
    competitors.map(number => {
        // If maxBet is not provided, we need to scrape it from the page
        let maxBet = maxBetOverride
        if (!maxBet) {
            Array.from(document.querySelectorAll('.content p')).map((p) => {
                if (p.textContent.startsWith("You can only place up to")) {
                    maxBet = p.querySelector('b').textContent
                }
            })
        }
            
        // Set maxBet 
        const maxBetInput = document.querySelectorAll('.content form table')[1].querySelector('input')
        maxBetInput.value = maxBet

        // Set competitors
        const table = document.querySelector('.content form table')
        Array.from(table.querySelectorAll('tr')).map((tr) => {
            const select = tr.querySelector('select')
            if (select) {
                Array.from(select.querySelectorAll('option')).map((option) => {
                    if (option.value == number) {
                        tr.querySelector('input').checked = true
                        select.value = number
                    }
                })
            }
        })

        // Optionally, place the bets.
        if (placeBets) {
            const buttons = document.querySelectorAll('.content form input')
            const submitButton = buttons[buttons.length - 1]
            submitButton.click()

            // TODO: Close page after redirect.
        }
    });
}

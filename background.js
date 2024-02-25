function parseTable() {
    competitors_to_id = {
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
    table = document.getElementsByClassName('chakra-table')[0].children[1]
    for (let i=0; i<10; i++) {
        competitors = []
        row = table.children[i]
        for (let j=8; j<13; j++) {
            cell = row.children[j]
            competitors.push(competitors_to_id[cell.textContent])
        }
        all_competitors.push(competitors)
    }
    return all_competitors
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "parse") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              function: parseTable
            }, function(results) {
              openTabs(results[0]['result'])
            });
          });
        sendResponse({status: "success", message: "noice"});
    }
});

function openTabs(all_competitors) {
    all_competitors.map(competitors => {
        chrome.tabs.create({url: "https://www.neopets.com/pirates/foodclub.phtml?type=bet"}, function(tab) {
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func: populateBets,
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

function populateBets(competitors) {
    competitors.map(number => {
        shift = 11
        bolds = document.getElementsByTagName('b')
        let i = 0
        Array.from(bolds).some((tag) => {
            i++
            return tag.innerHTML == 'Leave'
        })
        maxBet = bolds[i].innerHTML
        document.getElementsByTagName('input')[shift+5].value = maxBet

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < document.getElementsByTagName('select')[0].options.length; j++) {
                if (document.getElementsByTagName('select')[i].options[j].value == number) {
                    document.getElementsByTagName('input')[shift+i].checked = true
                    document.getElementsByTagName('select')[i].value = number
                }
            }
        }
    });
}

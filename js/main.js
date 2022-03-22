'use strict';

var gElSelectedSeat = null;
var gCinema = createCinema();
renderCinema();

function createCinema() {
    var cinema = [];
    for (var i = 0; i < 7; i++) {
        cinema[i] = [];
        for (var j = 0; j < 15; j++) {
            var cell = {
                type: (j === 7) ? 'X' : 'S',
                isBooked : false,
                price: 2 + 10 * i
            }
            cinema[i][j] = cell 
        }
    }
    cinema[4][4].isBooked = true
    return cinema;
}

function countCinemaAround(pos) {
    var cinemaCount = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gCinema.length - 1) continue

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue
            if (j < 0 || j >= gCinema[i].length) continue
            if (gCinema[i][j].isBooked === false) cinemaCount++;
        }
    }
    return cinemaCount;
} 


function renderCinema() {
    var strHTML = '';
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            var cell = gCinema[i][j];
            var title = `Seat: ${i}, ${j}`
            // for cell of type SEAT add seat class
            var className = (cell.type === 'S')? 'seat' : ''
            // for cell that is booked add booked class
            if (cell.isBooked) {
                className += ' booked'
                title += '-Booked'
            }
            // Add a seat title: `Seat: ${i}, ${j}`
            strHTML += `\t<td title="${title}" class="cell ${className}" 
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    var elSeats = document.querySelector('.cinema-seats');
    elSeats.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) {
    var cell = gCinema[i][j]
    // TODO: ignore none seats and booked
    if (cell.type !== 'S' || cell.isBooked) return;
    console.log('Cell clicked: ', elCell, i, j);

    
    // Support selecting a seat
    elCell.classList.toggle('selected')
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }
    gElSelectedSeat = (elCell !== gElSelectedSeat)? elCell : null
    // Only a single seat should be selected
    // Support Unselecting a seat
    if (gElSelectedSeat) {
        showSeatDetails({i:i, j:j})
    }
}

function showSeatDetails(pos) {
    var elPopup = document.querySelector('.popup');
    var seat = gCinema[pos.i][pos.j];
    var seatCount = countCinemaAround(pos)
    elPopup.querySelector('h2 span').innerText = `${pos.i}-${pos.j}`
    elPopup.querySelector('h3 span').innerText = `$${seat.price}`
    elPopup.querySelector('h4 span').innerText = `${seatCount}`;
    const elBtn = elPopup.querySelector('button')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false;
}
function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function bookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn.dataset);
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j
    gCinema[i][j].isBooked = true
    renderCinema()
    unSelectSeat()
}

function unSelectSeat() {
    hideSeatDetails();
}


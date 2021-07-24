const months = {
    en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
};

function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return {
        year,
        month,
        day
    };
};

const VanillaCalender = function (container, options) {

    if (options) {
        this.dateFormat = options.dateFormat || 'dd.mm.yyyy';
        this.lang = options.lang || 'en';
        this.dateRangeEnabled = options.dateRangeEnabled || false
    } else {
        this.dateFormat = 'dd.mm.yyyy';
        this.lang = 'en';
        this.dateRangeEnabled = true;
    };

    this.container = container || document.querySelector('.vanilla-calender');
    this.months = months[this.lang];

    this.currentMonth = this.months[new Date().getMonth()];
    this.previousMonth = this.months[new Date().getMonth() - 1];
    this.followingMonth = this.months[new Date().getMonth() + 1];

    this.currentMonthIndex = new Date().getMonth();

    this.currentYear = new Date().getFullYear();

    this.daysInMonth = this.getNumberOfDays(this.currentYear, this.currentMonthIndex + 1);

    this.setSelectedDate;
    this.startDate;
    this.endDate;

    this.startDateIndex;
    this.endDateIndex;

    // get the first day of the selected month

    this.firstDayIndex = this.getIndexOfFirstDay(this.currentYear, this.currentMonth);
    if (this.container) {
        this.drawCalender(this.dateFormat);
    };
};

VanillaCalender.prototype.drawCalender = function () {

    const header = this.drawHeader(this.dateFormat);
    this.container.appendChild(header);

    const body = this.drawBody();
    this.container.appendChild(body);
    
};

VanillaCalender.prototype.getNumberOfDays = function(year,month){
    return new Date(year,month,0).getDate()
};

VanillaCalender.prototype.getIndexOfFirstDay = function(year,month){
    let date = new Date(month + ' 1,' + year);

    const days = ['sun','mon','tue','wed','thu','fri','sat'];
    const day = days[date.getDay()];

    let index;

    switch(day){
        case 'sun':
            index = 6;
        break;
        case 'mon':
            index = 0;
        break;
        case 'tue':
            index = 1;
        break;
        case 'wed':
            index = 2;
        break;
        case 'thu':
            index = 3;
        break;
        case 'fri':
            index = 4;
        break;
        case 'sat':
            index = 5;
        break;
    };

    return index;
}

VanillaCalender.prototype.drawHeader = function() {

    const date = getCurrentDate();

    const year = date.year;
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');

    let dateString;

    if (this.dateFormat === 'yyyy.mm.dd') {
        dateString = year + '.' + month + '.' + day;
    } else {
        dateString = day + '.' + month + '.' + year;
    }

    const header = document.createElement('div');

    header.classList.add('calender__head');
    header.style.backgroundColor = '#fff';

    const heading = document.createElement('h4');
    heading.classList.add('calender__head--date');
    heading.textContent = dateString;
    header.appendChild(heading);

    const toggleOpenCalender = document.createElement('div');
    toggleOpenCalender.classList.add('toggle-calender-button');
    header.appendChild(toggleOpenCalender);

    toggleOpenCalender.addEventListener('click', (e) => this.toggleCalenderBody(this));

    const arrowIcon = document.createElement('div');
    arrowIcon.classList.add('arrow-icon-down');
    toggleOpenCalender.appendChild(arrowIcon);

    return header;
};

VanillaCalender.prototype.drawBody = function() {
    
    const body = document.createElement('div');
    body.classList.add('calender__body');

    const monthDisplay = this.drawMonthDisplay(this.currentMonth, this.currentYear);
    body.appendChild(monthDisplay);

    const daysDisplay = document.createElement('div');
    daysDisplay.classList.add('calender__days-display');
    body.appendChild(daysDisplay);

    return body;
};

/**
 * drawMonthDisplay
 * @description renders the elements that contains the currently selected month` name and the toggles to navigate the months
 * @param {*} month - the current month to display
 * @returns {HTMLElement} 
 */

VanillaCalender.prototype.drawMonthDisplay = function(month,year) {

    // container for month-display elements
    const monthDisplay = document.createElement('div');
    monthDisplay.classList.add('calender__month-display');

    // navigate to previous month
    const prevToggle = document.createElement('div');
    prevToggle.classList.add('prev-toggle');
    prevToggle.addEventListener('click', (e) => this.setCurrentMonth(e,this));

    monthDisplay.appendChild(prevToggle);

    // element that holds the currently select month as textcontent
    const monthText = document.createElement('div');
    monthText.classList.add('month-text');

    const currentText = document.createElement('div');
    currentText.classList.add('current-text');
    currentText.textContent = month + " '" + this.getShortYearString();
    monthText.appendChild(currentText);

    monthDisplay.appendChild(monthText);

    // navigate to following month
    const nextToggle = document.createElement('div');
    nextToggle.classList.add('next-toggle');
    monthDisplay.appendChild(nextToggle);
    nextToggle.addEventListener('click', (e) => this.setCurrentMonth(e,this));
    // toggle icons
    const arrowIconLeft = document.createElement('div');
    arrowIconLeft.classList.add('arrow-icon-left');
    prevToggle.appendChild(arrowIconLeft);

    const arrowIconRight = document.createElement('div');
    arrowIconRight.classList.add('arrow-icon-right');
    nextToggle.appendChild(arrowIconRight);

    return monthDisplay;
};

VanillaCalender.prototype.setCurrentMonth = function(e,calender){
    const currentText = document.querySelector('.current-text');

    const type = e.target.classList.contains('prev-toggle') ? 'prev':'next';

    if(type === 'prev'){
        calender.currentMonthIndex--;
        if(calender.currentMonthIndex < 0){
            calender.currentMonthIndex = 11
            calender.currentYear--;
        };
        currentText.textContent = calender.months[calender.currentMonthIndex] + " '" + this.getShortYearString();
        this.daysInMonth = this.getNumberOfDays(this.currentYear, calender.currentMonthIndex + 1);
        this.firstDayIndex = this.getIndexOfFirstDay(this.currentYear, this.currentMonthIndex + 1);
        this.renderDayElements();
        
    } else if(type === 'next') {
        calender.currentMonthIndex++;
        if(calender.currentMonthIndex > 11){
            calender.currentMonthIndex = 0;
            calender.currentYear++;
        };
        currentText.textContent = calender.months[calender.currentMonthIndex] + " '" + this.getShortYearString();
        this.daysInMonth = this.getNumberOfDays(this.currentYear, calender.currentMonthIndex + 1);
        this.firstDayIndex = this.getIndexOfFirstDay(this.currentYear, this.currentMonthIndex + 1);
        this.renderDayElements();
    };

};

VanillaCalender.prototype.getShortYearString = function(){
    return String(this.currentYear).slice(-2);
};

VanillaCalender.prototype.toggleCalenderBody = function() {
    const body = document.querySelector('.calender__body');
    const toggleOpenCalenderButton = document.querySelector('.toggle-calender-button');

    body.classList.toggle('visible');
    toggleOpenCalenderButton.classList.toggle('active');
    this.renderDayElements();
};

VanillaCalender.prototype.renderDayElements = function(){
    const daysContainer = document.querySelector('.calender__days-display');
    daysContainer.innerHTML = '';
    for(let i = 0; i< this.firstDayIndex;i++){
        const emptyDaysElement = document.createElement('div');
        emptyDaysElement.classList.add('calender__days--element-empty');
        daysContainer.appendChild(emptyDaysElement);
    }
    for(let i = 1; i <= this.daysInMonth; i++){
        const dayElement = document.createElement('div');
        dayElement.classList.add('calender__days--element');
        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);
    };
    const dayElements = document.querySelectorAll('.calender__days--element');
    for(let day of dayElements){
        day.addEventListener('click', (e) => this.setSelectedDate(e))
    };   
};

VanillaCalender.prototype.setSelectedDate = function(e){

    const selectedDay = e.target.textContent;
    const dayElements = Array.from(document.querySelectorAll('.calender__days--element'));

    if(this.dateRangeEnabled && this.startDateIndex === undefined){
        this.startDate = selectedDay;
        this.startDateIndex = dayElements.indexOf(e.target);
        e.target.classList.add('selected');
    } else if(this.dateRangeEnabled && this.endDateIndex === undefined){
        this.endDate = selectedDay;
        const index  = dayElements.indexOf(e.target);
        if(index > this.startDateIndex){
            this.endDateIndex = index;
            e.target.classList.add('selected');
            for(let i = this.startDateIndex +1; i < this.endDateIndex; i++){
                dayElements[i].classList.add('selected__between');
            };
        };
    } else if(this.startDateIndex !== undefined && this.endDateIndex !== undefined){
        this.endDateIndex = undefined;
        this.startDateIndex = dayElements.indexOf(e.target);
        for(let day of dayElements){
            day.classList.remove('selected');
            day.classList.remove('selected__between');
        };
        dayElements[dayElements.indexOf(e.target)].classList.add('selected');
    };

    const date = {
        day: Number(selectedDay),
        month: this.currentMonthIndex + 1,
        year: this.currentYear
    };

    this.setHeaderDisplayDate(date);
};

VanillaCalender.prototype.setHeaderDisplayDate = function({day,month,year}){
    const headerDate = document.querySelector('.calender__head--date');
    day = String(day).padStart(2, '0');
    month = String(month).padStart(2, '0');
    headerDate.innerHTML = day + '.' + month + '.' + year;
};

const calender = new VanillaCalender();


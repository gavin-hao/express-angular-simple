/**
 * Created by zhigang on 14/12/1.
 */
angular.module('dongker.calendar', ['mgcrea.ngStrap.helpers.dateParser'])
    .service('calendarHelper', function ($locale, $dateParser, dateFilter) {
        /*var options = {
         startWeek: 0,
         startDate: 'today',
         dateFormat: 'shortDate',
         minDate: -Infinity,
         maxDate: +Infinity,
         dayFormat: 'd',
         daySplit: 7,
         daysOfWeekDisabled: ''
         };*/
        var defaults = this.defaults = {
            startWeek: 0,
            startDate: 'today',
            dateFormat: 'shortDate',
            minDate: -Infinity,
            maxDate: +Infinity,
            dayFormat: 'd',
            daySplit: 7,
            daysOfWeekDisabled: ''
        };

        // Split array into smaller arrays
        function split(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        }

        var self = this;
        var dateParser = $dateParser();
        var weekDaysMin = $locale.DATETIME_FORMATS.SHORTDAY;
        // Modulus operator
        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        /**
         *
         * @param collection events array like{date:Date,name:'String',prop:'Object'}
         * @param date
         * @returns {Array}
         */
        function findEvents(collection, date, endDate) {
            var result = [];
            var index = -1,
                length = collection ? collection.length : 0;

            while (++index < length) {
                var value = collection[index];
                var eventTime = new Date(value.date.getFullYear(), value.date.getMonth(), value.date.getDate()).getTime();
                var startTime = date.getTime();
                var endTime = angular.isDate(endDate) ? endDate.getTime() : new Date();
                var select = angular.isDate(value.date) && eventTime >= startTime && eventTime < endTime;
                if (select) {
                    result.push(value);
                }
            }

            return result;
        };

        function setDate(date) {
            var startDate = date || new Date();
            return {year: startDate.getFullYear(), month: startDate.getMonth(), date: startDate.getDate()};
        };

        function selectPanel(value) {
            var steps = this.steps;
            var viewDate = this.viewDate;
            var targetDate = new Date(Date.UTC(viewDate.year + ((steps.year || 0) * value), viewDate.month + ((steps.month || 0) * value), viewDate.date + ((steps.day || 0) * value)));
            angular.extend(viewDate, {year: targetDate.getUTCFullYear(), month: targetDate.getUTCMonth(), date: targetDate.getUTCDate()});
            this.build();
        };


        self.getMonthView = function (date, selectedDates, opts) {
            var options = angular.extend({}, defaults, opts || {});
            var startDate = date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
            var viewDate = {year: startDate.getFullYear(), month: startDate.getMonth(), date: startDate.getDate()};
            var view = {
                name: 'month',
                format: options.dayFormat,
                split: 7,
                steps: { month: 1 },
                selectedDates: selectedDates || [],
                viewDate: viewDate,
                build: function () {

                    var timezoneOffset = startDate.getTimezoneOffset() * 6e4;
                    var weekDaysLabels = weekDaysMin.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));

                    var firstDayOfMonth = new Date(this.viewDate.year, this.viewDate.month, 1),
                        firstDayOfMonthOffset = firstDayOfMonth.getTimezoneOffset();
                    var firstDate = new Date(+firstDayOfMonth - mod(firstDayOfMonth.getDay() - options.startWeek, 7) * 864e5),
                        firstDateOffset = firstDate.getTimezoneOffset();

                    var today = new Date().toDateString();
                    // Handle daylight time switch
                    if (firstDateOffset !== firstDayOfMonthOffset)
                        firstDate = new Date(+firstDate + (firstDateOffset - firstDayOfMonthOffset) * 60e3);
                    var days = [], day;
                    for (var i = 0; i < 42; i++) { // < 7 * 6
                        day = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i);
                        days.push({date: day,
                            isToday: day.toDateString() === today,
                            label: dateFilter(day, this.format),
                            selected: this.isSelected(day),
                            muted: day.getMonth() !== this.viewDate.month,
                            disabled: this.isDisabled(day)});
                    }

                    this.labels = weekDaysLabels;
                    this.showLabels = true;
                    this.rows = split(days, this.split);
                    this.built = true;
                    this.title = dateFilter(firstDayOfMonth, 'MMMM yyyy');
                },
                prev: function (onPostPrev) {
                    selectPanel.call(this, -1);
                    if (onPostPrev && angular.isFunction(onPostPrev)) {
                        onPostPrev();
                    }
                },
                next: function (onPostNext) {
                    selectPanel.call(this, 1);
                    if (onPostNext && angular.isFunction(onPostNext)) {
                        onPostNext();
                    }
                },
                setDate: function (date) {
                    this.viewDate = setDate(date);
                    this.build();
                },
                bindEvents: function (events) {
                    var evts = events || [];
                    if (this.rows) {
                        for (var i = 0; i < this.rows.length; i++) {
                            for (var j = 0; j < this.rows[i].length; j++) {
                                var date = this.rows[i][j].date;
                                this.rows[i][j].events = findEvents(events, date,
                                    new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
                            }
                        }
                    }
                },
                /*update: function (date, force) {
                 var viewDate = this.viewDate;
                 if (!this.built || force || date.getFullYear() !== viewDate.year || date.getMonth() !== viewDate.month) {
                 angular.extend(viewDate, {year: date.getFullYear(), month: date.getMonth(), date: date.getDate()});
                 this.build();
                 } else if (date.getDate() !== viewDate.date) {
                 viewDate.date = date.getDate();
                 this.updateSelected(date);
                 }
                 },*/
                updateSelected: function (date) {
                    if (this.rows) {
                        for (var i = 0; i < this.rows.length; i++) {
                            for (var j = 0; j < this.rows[i].length; j++) {
                                this.rows[i][j].selected = this.isSelected(this.rows[i][j].date);
                            }
                        }
                    }
                },
                isSelected: function (date) {
                    var select = false;
                    if (this.selectedDates && angular.isArray(this.selectedDates)) {
                        for (var i = 0; i < this.selectedDates.length; i++) {
                            var value = this.selectedDates[i];
                            select = angular.isDate(value) && date.getFullYear() === value.getFullYear()
                                && date.getMonth() === value.getMonth()
                                && date.getDate() === value.getDate();
                            if (select)
                                break;
                        }
                    }
                    return select;
                },
                isDisabled: function (date) {
                    var time = date.getTime();

                    // Disabled because of min/max date.
                    if (time < options.minDate || time > options.maxDate) return true;

                    // Disabled due to being a disabled day of the week
                    if (options.daysOfWeekDisabled.indexOf(date.getDay()) !== -1) return true;

                    // Disabled because of disabled date range.
                    if (options.disabledDateRanges) {
                        for (var i = 0; i < options.disabledDateRanges.length; i++) {
                            if (time >= options.disabledDateRanges[i].start && time <= options.disabledDateRanges[i].end) {
                                return true;
                            }
                        }
                    }

                    return false;
                }
            }
            return view;
        }

        self.getYearView = function (date, selectedDates, opts) {
            var options = angular.extend({}, defaults, opts || {});
            var startDate = date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
            var viewDate = {year: startDate.getFullYear(), month: startDate.getMonth(), date: startDate.getDate()};
            var view = {
                name: 'year',
                format: 'MMM',
                split: 4,
                steps: { year: 1 },
                selectedDates: selectedDates || [],
                viewDate: viewDate,
                build: function () {

                    var firstMonth = new Date(this.viewDate.year, 0, 1);
                    var months = [], month;
                    for (var i = 0; i < 12; i++) {
                        month = new Date(this.viewDate.year, i, 1);
                        months.push({date: month,
                            label: dateFilter(month, this.format),
                            selected: this.isSelected(month),
                            muted: month.getMonth() !== this.viewDate.month,
                            disabled: this.isDisabled(month)});
                    }
                    this.showLabels = false;
                    this.title = dateFilter(month, 'yyyy');
                    this.rows = split(months, this.split);
                    this.built = true;
                },
                prev: function () {
                    selectPanel.call(this, -1);
                },
                next: function () {
                    selectPanel.call(this, 1);
                },
                setDate: function (date) {
                    this.viewDate = setDate(date);
                    this.build();
                },
                bindEvents: function (events) {
                    var evts = events || [];
                    if (this.rows) {
                        for (var i = 0; i < this.rows.length; i++) {
                            for (var j = 0; j < this.rows[i].length; j++) {
                                this.rows[i][j].events = findEvents(events, this.rows[i][j].date,
                                    new Date(this.rows[i][j].date.getFullYear(), this.rows[i][j].date.getMonth() + 1, 1))
                            }
                        }
                    }
                },
                updateSelected: function (date) {
                    if (this.rows) {
                        for (var i = 0; i < this.rows.length; i++) {
                            for (var j = 0; j < this.rows[i].length; j++) {
                                this.rows[i][j].selected = this.isSelected(this.rows[i][j].date);
                            }
                        }
                    }
                },
                isSelected: function (date) {
                    var select = false;
                    if (selectedDates && angular.isArray(selectedDates)) {
                        for (var i = 0; i < selectedDates.length; i++) {
                            var value = selectedDates[i];

                            select = angular.isDate(value) && date.getFullYear() === value.getFullYear()
                                && date.getMonth() === value.getMonth();

                            if (select)
                                break;
                        }
                    }
                    return select;

                },
                isDisabled: function (date) {
                    var lastDate = +new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    return lastDate < options.minDate || date.getTime() > options.maxDate;
                }
            };
            return view;

        }
    });

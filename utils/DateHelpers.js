import moment from 'moment';

export const timeFormats = {
  day: 'L',
  dayOfMonth: 'MM/DD',
  month: 'MM/YYYY',
  monthShort: 'MM/YY',
  monthLong: 'MMMM YYYY',
  year: 'YYYY',
};
export const DMY_FORMAT = d => moment(d).format("DD/MM/yyyy");
export const DMY_FORMAT_DATE = d => moment(d).format("dd-MM-yyyy");
export const DMY_TIME = d => moment(d).format("DD/MM/yyyy HH:mm");
export const DATE_FORMAT_YYYY_MM_DD = d => moment(d).format("yyyy/MM/dd");
export const DATE_FORMAT_FOR_PARAMS = d => moment(d).format("yyyyMMdd");
export const SERVER_DATE_TIME = d => moment(d).format("yyyy-MM-dd HH:mm:ss");
export const TRANSACTION_DATE_TIME = d => moment(d).format("yyyy/MM/dd HH:mm:ss");
export const FULL_DATE_TIME_FORMAT = d => moment(d).format("yyyy-MM-dd'T'HH:mm:ss");
export const DELIVER_FORMAT_DATE = d => moment(d).format("YYYY-MM-dd'T'HH:mm:ss.SSS'Z'");
export const COMPLETED_DATE_TIME_FORMAT = d => moment(d).format("yyyy-MM-dd'T'HH:mm:ss'Z'");
export const DELIVER_FORMAT_TIME = d => moment(d).format("HHmm");
export const FORMAT_TIME = d => moment(d).format("HH:mm");
export const FULL_TIME = d => moment(d).format("dd-MM-yyyy HH:mm");

export const ADD_TRUCK_FORMAT_TIME = d => moment(d).format("HHmmss");

export const startOfMonth = (d = new Date()) =>
  moment(d).startOf('month').toDate();

export const startOfNextMonth = (d = new Date()) =>
  startOfMonth(moment(d).add(1, 'months').toDate());

export const formatMonthWithYear = (d, f = timeFormats.month) =>
  moment(d).format(f);

// eslint-disable-next-line
export const getMonths = (from, to, months) =>
  from.getTime() <= to.getTime()
    ? getMonths(startOfNextMonth(from), to, [...months, from])
    : months;
   
    export const EQUAL_DATE = 0;
    export const AFTER_DATE = 1;
    export const BEFORE_DATE = 2;
export const dateWithDots = d => moment(d).format('DD.MM.YYYY');
export const dateWithTime = d => d? moment(d).format('HH:mm | DD.MM.YYYY'):'';
export const dateFormat = d => moment(d).format('DD/MM/YYYY HH:mm');
export const dateWithSec = d => moment(d).format('DD/MM/YYYY');

export const startOfDay = moment().startOf('day');
export const startOfYesterday = moment().subtract(1, 'days').startOf('day');
export const back7days = moment().subtract(7, 'days').startOf('day');
export const back30days = moment().subtract(30, 'days').startOf('day');
export const startOfYear = moment().subtract(11, 'months').startOf('month');
export const startOfCurrentWeek = moment().startOf('week');
export const startOfCurrentMonth = moment().startOf('month');
export const startOfCurrentYear = moment().startOf('year');
export const startOfHalfYearAgo = moment()
  .subtract(5, 'months')
  .startOf('month');
export const startOf10YearsAgo = moment()
  .subtract(10, 'years')
  .startOf('month');

export const isToday = date =>
  date.startOf('day').isSame(moment().startOf('day'));
export const isYesterday = date =>
  date.isSame(moment().subtract(1, 'days').startOf('day'));
export const formatDateForFilter = d => {
  if (!d.format) {
    if (d.from === startOf10YearsAgo) {
      return 'All time';
    }
    return `${dateWithSec(d.from)} - ${dateWithSec(d.to)}`;
  }
  return dateWithSec(d);
};

export const formatDateForSubtitle = d => {
  if (!d.format) {
    if (d.from === startOf10YearsAgo) {
      return 'All time';
    }
    return `${dateWithDots(d.from)} - ${dateWithDots(d.to)}`;
  }
  return dateWithDots(d);
};
export const formatDateForPie = d => {
  if (!d.format) {
    return `${dateWithDots(d.from)}\n${dateWithDots(d.to)}`;
  }
  return dateWithDots(d);
};

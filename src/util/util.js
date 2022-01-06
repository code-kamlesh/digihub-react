export function calculateBatchFreezeDate(startDate,duration) 
{
    
    var min = Math.ceil(0.1 * (duration/7));
    if (min >= 10)
    {
        min = 10;
    }
    if(min <= 1)
    {
        min = 2;
    }

    var date = startDate.split("-");
    var c = new Date(date[0],date[1]-1,date[2]);
    c.setDate(c.getDate() + min);
    startDate = c.getDate()+"-"+c.getMonth()+"-"+c.getFullYear()
    var weekendDays=calculateWeekendDays(date[1]+"-"+date[2]+"-"+date[0],c.getMonth()+"-"+c.getDate()+"-"+c.getFullYear());

    if(weekendDays != 0)
    {
        c.setDate(c.getDate() + weekendDays);
      //  c.add(new Date(), weekendDays);
    //  startDate = c.getDate()+"-"+c.getMonth()+"-"+c.getFullYear()
    }
    startDate = c.getFullYear()+"-"+(c.getMonth()+1)+"-"+c.getDate()
  
    return startDate;
}


export function calculateWeekendDays(fromDate, toDate) 
{   

var start = new Date(fromDate);
var finish = new Date(toDate);

var dayMilliseconds = 1000 * 60 * 60 * 24;
var weekendDays = 0;
while (start <= finish) {
  var day = start.getDay()
  if (day == 0) {
      weekendDays++;
  }
  start = new Date(+start + dayMilliseconds);
}

return weekendDays;
}




// Calculate the difference of two dates in total days
export function diffDays(startDate, endDate)
{
  // Here are the two dates to compare
  // var date1 = d1;
  // var date2 = d2;

const diffInMs   = new Date(endDate) - new Date(startDate)
const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

console.log("====="+diffInDays);

  return diffInDays;
}
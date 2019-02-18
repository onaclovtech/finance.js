//Finance.js
//For more information, visit http://financejs.org
//Copyright 2014 - 2015 Essam Al Joubori, MIT license
// Modified by Tyson Bailey various times as recent as 2019

// Instantiate a Finance class
var Finance = function() {};

Finance.prototype.Inflation= function(){
    // from https://www.thebalance.com/u-s-inflation-rate-history-by-year-and-forecast-3306093
var pairs =
[["1929","0.60"],
["1930","-6.40"],
["1931","-9.30"],
["1932","-10.30"],
["1933","0.80"],
["1934","1.50"],
["1935","3.00"],
["1936","1.40"],
["1937","2.90"],
["1938","-2.80"],
["1939","0.00"],
["1940","0.70"],
["1941","9.90"],
["1942","9.00"],
["1943","3.00"],
["1944","2.30"],
["1945","2.20"],
["1946","18.10"],
["1947","8.80"],
["1948","3.00"],
["1949","-2.10"],
["1950","5.90"],
["1951","6.00"],
["1952","0.80"],
["1953","0.70"],
["1954","-0.70"],
["1955","0.40"],
["1956","3.00"],
["1957","2.90"],
["1958","1.80"],
["1959","1.70"],
["1960","1.40"],
["1961","0.70"],
["1962","1.30"],
["1963","1.60"],
["1964","1.00"],
["1965","1.90"],
["1966","3.50"],
["1967","3.00"],
["1968","4.70"],
["1969","6.20"],
["1970","5.60"],
["1971","3.30"],
["1972","3.40"],
["1973","8.70"],
["1974","12.30"],
["1975","6.90"],
["1976","4.90"],
["1977","6.70"],
["1978","9.00"],
["1979","13.30"],
["1980","12.50"],
["1981","8.90"],
["1982","3.80"],
["1983","3.80"],
["1984","3.90"],
["1985","3.80"],
["1986","1.10"],
["1987","4.40"],
["1988","4.40"],
["1989","4.60"],
["1990","6.10"],
["1991","3.10"],
["1992","2.90"],
["1993","2.70"],
["1994","2.70"],
["1995","2.50"],
["1996","3.30"],
["1997","1.70"],
["1998","1.60"],
["1999","2.70"],
["2000","3.40"],
["2001","1.60"],
["2002","2.40"],
["2003","1.90"],
["2004","3.30"],
["2005","3.40"],
["2006","2.50"],
["2007","4.10"],
["2008","0.10"],
["2009","2.70"],
["2010","1.50"],
["2011","3.00"],
["2012","1.70"],
["2013","1.50"],
["2014","0.80"],
["2015","0.70"],
["2016","2.10"],
["2017","2.10"],
["2018","1.90"],
["2019","1.90"],
["2020","2.10"],
["2021","2.10"]]
return pairs
}
// Present Value (PV)
Finance.prototype.PV = function (rate, cf1) {
  var rate = rate/100, pv;
  pv = cf1 / (1 + rate);
  return Math.round(pv * 100) / 100;
};

// Future Value (FV)
Finance.prototype.FV = function (rate, cf0, numOfPeriod) {
  var rate = rate/100, fv;
  fv = cf0 * Math.pow((1 + rate), numOfPeriod);
  return Math.round(fv * 100) / 100;
};

// Net Present Value (NPV)
Finance.prototype.NPV = function (rate) {
  var rate = rate/100, npv = arguments[1];
  for (var i = 2; i < arguments.length; i++) {
    npv +=(arguments[i] / Math.pow((1 + rate), i - 1));
  }
  return Math.round(npv * 100) / 100;
};

// seekZero seeks the zero point of the function fn(x), accurate to within x \pm 0.01. fn(x) must be decreasing with x.
function seekZero(fn) {
  var x = 1;
  while (fn(x) > 0) {
    x += 1;
  }
  while (fn(x) < 0) {
    x -= 0.01
  }
  return x + 0.01;
}

// Internal Rate of Return (IRR)
Finance.prototype.IRR = function(cfs) {
  var args = arguments;
  function npv(rate) {
    var rrate = (1 + rate/100);
    var npv = args[0];
    for (var i = 1; i < args.length; i++) {
      npv += (args[i] / Math.pow(rrate, i));
    }
    return npv;
  }
  return Math.round(seekZero(npv) * 100) / 100;
};

// Payback Period (PP)
Finance.prototype.PP = function(numOfPeriods, cfs) {
  // for even cash flows
  if (numOfPeriods === 0) {
    return Math.abs(arguments[1]) / arguments[2];
  }
  // for uneven cash flows
  var cumulativeCashFlow = arguments[1];
  var yearsCounter = 1;
  for (i = 2; i < arguments.length; i++) {
    cumulativeCashFlow += arguments[i];
    if (cumulativeCashFlow > 0) {
      yearsCounter += (cumulativeCashFlow - arguments[i]) / arguments[i];
      return yearsCounter;
    } else {
      yearsCounter++;
    }
  }
};

// Return on Investment (ROI)
Finance.prototype.ROI = function(cf0, earnings) {
  var roi = (earnings - Math.abs(cf0)) / Math.abs(cf0) * 100;
  return Math.round(roi * 100) / 100;
};

// Figures out what payment is required (extra) to achieve a target interest rate
Finance.prototype.AMByInterest = function (principal, rate, period, yearOrMonth, interest) {
var defaultpayment = Finance.prototype.AM(principal, rate, period, yearOrMonth);
var stepSize = 100;
var payment = defaultpayment / 2.0; // First we'll try adding half the payment to each period just to see
//var oldInterest = Finance.prototype.AMSchedule(principal, rate, period, yearOrMonth);
var newInterest = Finance.prototype.AMSchedule(principal, rate, period, yearOrMonth, payment); // get default interest first with our extra payment
while (Math.abs(newInterest['total interest'] - interest ) > 100){
    
    if (newInterest['total interest'] > interest){
        payment = payment + (stepSize /2.0);
        newInterest = Finance.prototype.AMSchedule(principal, rate, period, yearOrMonth, payment); // now we apply our extra payment
    }
    if (newInterest['total interest'] < interest){
        payment = payment - (stepSize /2.0);
        newInterest = Finance.prototype.AMSchedule(principal, rate, period, yearOrMonth, payment); // now we apply our extra payment
    }
    stepSize *= .9995;
}

return payment
}

Finance.prototype.AMTotalInterest = function (principal, rate, period, yearOrMonth) {
    var payment = Finance.prototype.AM(principal, rate, period, yearOrMonth);
    var totalCost = payment * period;
    return totalCost - principal
}

/*
Determining the breakdown of each monthly payment
Even though the monthly payment is fixed, the amount of money paid to interest varies each month. The remaining amount is used to pay off the loan itself. The complicated formula above ensures that after 360 payments, the mortgage balance will be $0.

For the first payment, we already know the total amount is $1,342.05. To determine how much of that goes toward interest, we multiply the remaining balance ($250,000) by the monthly interest rate: 250,000 x 0.416% = $1,041.67. The rest goes toward the mortgage balance ($1,342.05 - $1,041.67 = $300.39). So after the first payment, the remaining amount on the mortgage is $249,699.61 ($250,000 - $300.39 = $249,699.61).

The second payment's breakdown is similar except the mortgage balance has decreased. So the portion of the payment going toward interest is now slightly less: $1,040.42 ($249,699.61 * 0.416% = $1,040.42).
*/
Finance.prototype.AMSchedule = function (principal, rate, period, yearOrMonth, extraPmt) {
var payment = Finance.prototype.AM(principal, rate, period, yearOrMonth);
payment = payment + extraPmt
totalInterest = 0
schedule = []

for (var i = 0; i < period; i++) {
    var remaining = -1*((principal * (rate/12/100.0)) - payment);
    totalInterest += payment - remaining
    if ((principal - remaining) > 0){
        principal = principal - remaining
    }
    else{
       
       break;
       }
    schedule.push({"value": principal, "principal": remaining, "interest" : payment - remaining, "payment" : payment});
    
}
return {"total interest": totalInterest, 'schedule' : schedule, 'duration' : schedule.length}
}

Finance.prototype.FindSplit = function (principal, rate, period, yearOrMonth, extraPmt) {
    // The intent of this function (unfinished), was to compare two loans
    // and find a "optimal" split, basically, what makes sense to spend on each loan extra
    // given a set amount extra to spend on the loans. For example does spending $200 on one loan
    // and $400 on a second loan make more sense, or all to one loan?
    // need to figure it out.
    console.log('huh');
    return 0;
}

Finance.prototype.ExtraPmtByDuration = function (principal, rate, period, yearOrMonth, extraPmt, fromMonth, toMonth){
var normalpayment = Finance.prototype.AM(principal, rate, period, yearOrMonth);
//payment = payment + extraPmt
totalInterest = 0
schedule = []

for (var i = 0; i < period; i++) {
    if (i >= fromMonth && i <= toMonth){
        payment = normalpayment + extraPmt;
    }
    else{
        payment = normalpayment
    }
    var remaining = -1*((principal * (rate/12/100.0)) - payment);
    totalInterest += payment - remaining
    if ((principal - remaining) > 0){
        principal = principal - remaining
    }
    else{
       
       break;
       }
    schedule.push({"value": principal, "principal": remaining, "interest" : payment - remaining, "payment" : payment});
    
}
return {"total interest": totalInterest, 'schedule' : schedule, 'duration' : schedule.length}

}

// Amortization
Finance.prototype.AM = function (principal, rate, period, yearOrMonth, payAtBeginning) {
  var numerator, denominator, am;
  var ratePerPeriod = rate / 12 / 100;

  // for inputs in years
  if (!yearOrMonth) {
    numerator = buildNumerator(period * 12);
    denominator = Math.pow((1 + ratePerPeriod), period * 12) - 1;

  // for inputs in months
  } else if (yearOrMonth === 1) {
    numerator = buildNumerator(period)
    denominator = Math.pow((1 + ratePerPeriod), period) - 1;

  } else {
    console.log('not defined');
  }
  am = principal * (numerator / denominator);
  return Math.round(am * 100) / 100;

  function buildNumerator(numInterestAccruals){
    if( payAtBeginning ){
      //if payments are made in the beginning of the period, then interest shouldn't be calculated for first period
      numInterestAccruals -= 1;
    }
    return ratePerPeriod * Math.pow((1 + ratePerPeriod), numInterestAccruals);
  }
};

// Profitability Index (PI)
Finance.prototype.PI = function(rate, cfs){
  var totalOfPVs = 0, PI;
  for (var i = 2; i < arguments.length; i++) {
    var discountFactor;
    // calculate discount factor
    discountFactor = 1 / Math.pow((1 + rate/100), (i - 1));
    totalOfPVs += arguments[i] * discountFactor;
  }
  PI = totalOfPVs/Math.abs(arguments[1]);
  return Math.round(PI * 100) / 100;
};

// Discount Factor (DF)
Finance.prototype.DF = function(rate, numOfPeriods) {
  var dfs = [], discountFactor;
  for (var i = 1; i < numOfPeriods; i++) {
    discountFactor = 1 / Math.pow((1 + rate/100), (i - 1));
    roundedDiscountFactor = Math.ceil(discountFactor * 1000)/1000;
    dfs.push(roundedDiscountFactor);
  }
  return dfs;
};

// Compound Interest (CI)
Finance.prototype.CI = function(rate, numOfCompoundings, principal, numOfPeriods) {
  var CI = principal * Math.pow((1 + ((rate/100)/ numOfCompoundings)), numOfCompoundings * numOfPeriods);
  return Math.round(CI * 100) / 100;
};

// Compound Annual Growth Rate (CAGR)
Finance.prototype.CAGR = function(beginningValue, endingValue, numOfPeriods) {
  var CAGR = Math.pow((endingValue / beginningValue), 1 / numOfPeriods) - 1;
  return Math.round(CAGR * 10000) / 100;
};

// Leverage Ratio (LR)
Finance.prototype.LR = function(totalLiabilities, totalDebts, totalIncome) {
  return (totalLiabilities  + totalDebts) / totalIncome;
};

// Rule of 72
Finance.prototype.R72 = function(rate) {
  return 72 / rate;
};

// Weighted Average Cost of Capital (WACC)
Finance.prototype.WACC = function(marketValueOfEquity, marketValueOfDebt, costOfEquity, costOfDebt, taxRate) {
  E = marketValueOfEquity;
  D = marketValueOfDebt;
  V =  marketValueOfEquity + marketValueOfDebt;
  Re = costOfEquity;
  Rd = costOfDebt;
  T = taxRate;

  var WACC = ((E / V) * Re/100) + (((D / V) * Rd/100) * (1 - T/100));
  return Math.round(WACC * 1000) / 10;
};

Finance.prototype.GetBasePaid = function(principal, rate, period){
 total =  Finance.prototype.AMSchedule(principal, rate, period, 1,0)
 total_paid = 0;
 for (i=0; i<total["schedule"].length; i++){
     total_paid += total["schedule"][i]["principal"]
 }
 return total_paid
}
Finance.prototype.TimeToGo = function(balance, rate, payment){
    // Example Usage
    // finance.MonthsToGo(129000, 6.5, 1031.03)
    // The purpose of this function is to look at your monthly bill
    // and determine when your last payment will be.
    // We start at 360 months. Then we subtract a month and check again.
    // When the payment calculated based on the duration is less than the original calculated payment
    // well then it has to be darn close to the right number.
    // TODO experiment with my bill and calculate how many payments remain.
    // Realistically, there is a Schedule that will have a partial payment at the end
    // if you have paid ahead *at all* (of course you can pay off a multiple amount and then still
    // See the right value, but again, this should be able to calculate whole months, and then partial months)
    period = 360
    while (Finance.prototype.AM(balance, rate, period, 1) < payment){
        period -= 1
    }
    
    
                      
    // I could make this super complicated. And I might
    // For example, to reach the *exact* payment of 1031.03 as I noted in the example above
    // the total loan amount would need to be 129,128 to make exactly 210 payments.
    // this means that the first 209 payments would be a full payment.
    // The last payment will be a partial payment.
    // I can probably take the periods of 209 and 210 and diff the total amount to pay.
    // and well that is the final payment, but interest needs to be figured in to be fair
    Balance_Remaining = balance - Finance.prototype.GetBasePaid(balance, rate, Finance.prototype.AM(balance, rate, period, 1))
    period = period + 1
    return {"months" : period,
            "years" :
                     {"years"  : Math.floor(period/12),
                      "months" : Math.ceil(((period/12.0) - Math.floor(period/12))*12)
                     },
            "FinalMonthBalance" : Balance_Remaining }
}

// PMT calculates the payment for a loan based on constant payments and a constant interest rate
Finance.prototype.PMT = function(fractionalRate, numOfPayments, principal) {
  return -principal * fractionalRate/(1-Math.pow(1+fractionalRate,-numOfPayments))
};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Finance;
  }
}

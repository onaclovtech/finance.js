//Finance.js
//For more information, visit http://financejs.org
//Copyright 2014 - 2015 Essam Al Joubori, MIT license

// Instantiate a Finance class
var Finance = function() {};

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
return {"total interest": totalInterest, 'schedule' : schedule}
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

// PMT calculates the payment for a loan based on constant payments and a constant interest rate
Finance.prototype.PMT = function(fractionalRate, numOfPayments, principal) {
  return -principal * fractionalRate/(1-Math.pow(1+fractionalRate,-numOfPayments))
};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Finance;
  }
}

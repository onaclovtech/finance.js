[![Build Status](https://travis-ci.org/essamjoubori/finance.js.png)](https://travis-ci.org/essamjoubori/finance.js)
Finance.js
==========

Finance.js makes it easy to incorporate common financial calculations into your application. The library is built on pure JavaScript without any dependencies. For full documentation, please visit [financejs.org](http://financejs.org).

This project is [hosted on GitHub](https://github.com/essamjoubori/finance.js). You can report bugs and discuss features on the [GitHub issues page](https://github.com/essamjoubori/finance.js/issues). Finance.js is available for use under the [MIT software license](https://github.com/essamjoubori/finance.js/blob/master/LICENSE.md).

##Getting Started

### Installation

```shell
  npm install financejs --save
```
**or**

- Download or fork the repository from GitHub.
- Extract the file finance.js from the project and include it in your application on the client side.

### Example Usage

```js
  var Finance = require('financejs');
  var finance = new Finance();
  
  // To calculate Amortization
  finance.AM(20000, 7.5, 5, 0);
  // => 400.76
```
To see all available calculations and their usage, visit [financejs.org](http://financejs.org).

### Tests

```shell
   npm test
``` 

### Contributing

Contributions are welcome to aid in the expansion of the library. In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality, and please lint and test your code.

### To Do

- Expand library with more financial calculations
- Include edge cases in testing, if any
- 

### Example Usage in Browser
```js
<html>
<head>
<script src="finance.js"></script>
<script>
//var finance = Finance();
var finance = Finance.prototype;

//console.log(finance.AMSchedule(204800, 4.5, 360, 1,100))
//console.log(finance.AMSchedule(204800, 1.75, 360, 1, 0)["total interest"])
var targetInterest = finance.AMSchedule(204800, 1.75, 360, 1, 0)["total interest"];
//console.log(finance.AM(204800, 4.5, 360, 1, 0))
//console.log(finance.AMByInterest(204800, 4.5, 360, 1, targetInterest))
var targetPayment = finance.AMByInterest(204800, 4.5, 360, 1, targetInterest);
console.log(targetPayment);
console.log(targetInterest);

console.log(finance.AMSchedule(204800, 4.5, 360, 1,targetPayment));

var lineData = [];
for (i=0; i < 1500; i+=100){    
    lineData.push([i, finance.AMSchedule(204800, 4.5, 360, 1,i)["total interest"]]);
}
// Show the distribution of interest as your increase your payment
console.log(lineData);

</script>
</head>
<body>
</body>
</html>
```

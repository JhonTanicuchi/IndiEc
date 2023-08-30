const Handlebars = require("handlebars");

const helpers = {};

Handlebars.registerHelper("formatDate", function (date, format) {
  if (!date) {
    return "";
  }

  if (format === "datetime") {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  } else if (format === "date") {
    const month = date.getMonth() + 1;
    const formattedMonth = month < 10 ? "0" + month : month;
    return date.getFullYear() + "-" + formattedMonth + "-" + date.getDate();
  } else if (format === "time") {
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    return formattedMinutes + ":" + formattedSeconds;
  }

  return "";
});

Handlebars.registerHelper("formatText", function (text, format) {
  if (typeof text !== "string") {
    return "";
  }

  if (format === "capital") {
    return text[0].toUpperCase() + text.toLowerCase().slice(1);
  } else if (format === "lower") {
    return text.toLowerCase();
  } else if (format === "upper") {
    return text.toUpperCase();
  }

  return text;
});

Handlebars.registerHelper("length", function (list) {
  return list.length;
});

Handlebars.registerHelper("math", function (lvalue, operator, rvalue) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue,
  }[operator];
});

Handlebars.registerHelper("min", function (a, b) {
  return Math.min(a, b);
});

Handlebars.registerHelper("max", function (a, b) {
  return Math.max(a, b);
});

Handlebars.registerHelper("compare", function (value1, operator, value2) {
  const validOperators = ["==", "===", "!=", "!==", "<", ">", "<=", ">="];

  if (validOperators.indexOf(operator) === -1) {
    throw new Error("Invalid operator: " + operator);
  }

  switch (operator) {
    case "==":
      return value1 == value2;
    case "===":
      return value1 === value2;
    case "!=":
      return value1 != value2;
    case "!==":
      return value1 !== value2;
    case "<":
      return value1 < value2;
    case ">":
      return value1 > value2;
    case "<=":
      return value1 <= value2;
    case ">=":
      return value1 >= value2;
    default:
      throw new Error("Unsupported operator: " + operator);
  }
});

Handlebars.registerHelper("for", function(n, block) {
  let accum = '';
  for(let i = 0; i < n; ++i) {
    accum += block.fn(i);
  }
  return accum;
});

Handlebars.registerHelper('selectedIfEquals', function (value, comparison, options) {
  return value === comparison ? 'selected' : '';
});

Handlebars.registerHelper('pluralize', (count, singular, plural) => {
  return count === 1 ? singular : plural;
});



Handlebars.registerHelper('firstNamesAndSurnames', function(names, surnames) {
  const firstName = names.split(' ')[0];
  const firstSurname = surnames.split(' ')[0];
  return `${firstName} ${firstSurname}`;
});


Handlebars.registerHelper('initials', function(names, surnames) {
  const firstNameInitial = names.charAt(0);
  const surnameInitial = surnames.charAt(0);
  return `${firstNameInitial}${surnameInitial}`;
});




module.exports = helpers;

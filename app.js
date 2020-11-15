var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const math = require('mathjs');
const fs = require('fs');
const sr = require('secure-random');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 내 코드

const WEIGHT_ELEMENT_SIZE = 69636;
let weightCount = 0;

let addWeightList = math.zeros(WEIGHT_ELEMENT_SIZE);

const fileLocation = `W_0.json`;

const weights = fs.readFileSync(fileLocation, 'utf8');
// console.log(weights);
const splitWeights = weights.replace('[', '').replace(']', '').split(',');
// console.log(splitWeights);

let eachWeights = [];

splitWeights.forEach((iVal) => {
  const each = iVal.trim();
  eachWeights.push(parseFloat(each));
});

const weightMatrix = math.matrix(eachWeights); 
addWeightList = math.add(addWeightList, weightMatrix);
weightCount += 1;

console.log(addWeightList);
console.log(weightMatrix);

let maskTable = math.identity(3);
console.log(maskTable);

for (let i = 0; i < 3; i++) {
  for (let j = i + 1; j < 3; j++) {
    maskTable.subset(math.index(i, j), (sr(1)[0] + sr(1)[0] * 0.001));
  }
}

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < i; j++) {
    maskTable.subset(math.index(i, j), math.subset(maskTable, math.index(j, i)));
  }
}

console.log(maskTable);
console.log(maskTable.toString());

module.exports = app;

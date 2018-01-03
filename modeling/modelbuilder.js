const fs = require('fs');
const papa = require('papaparse');
const regress = require('js-regression');

var sexOnlyCsv = fs.readFileSync('./modeling/csv/sex-only.csv').toString();
var sexAgeCsv = fs.readFileSync('./modeling/csv/sex-age.csv').toString();
var sexAgeClassCsv = fs.readFileSync('./modeling/csv/sex-age-class.csv').toString();
var sexAgeClassFamilyCsv = fs.readFileSync('./modeling/csv/sex-age-class-family.csv').toString();

function printModelWeightsFromCsv(csv, name) {
    papa.parse(csv, {
        dynamicTyping: true,
        complete: function (results, file) {
            console.log(results);
            // remove the header and empty last element
            let X_train_array = results.data.slice(1, -1);
            console.log('parsed!');
            let logreg = new regress.LogisticRegression({
                alpha: 0.001,
                iterations: 1000,
                lambda: 0.0
            });
            logreg.fit(X_train_array);
            var test = logreg.transform(X_train_array);
            //TODO: check distribution of scores, reassess probability based on threshold value as new 50%
            console.log(`${name} model results:`);
            console.log(`dim: ${logreg.dim}`);
            console.log(`theta: ${logreg.theta}`);
            console.log(`threshold: ${logreg.threshold}\n`);
        }
    });
}

// printModelWeightsFromCsv(sexOnlyCsv, 'sex');
// printModelWeightsFromCsv(sexAgeCsv, 'sex, age');
printModelWeightsFromCsv(sexAgeClassCsv, 'sex, age, class');
// printModelWeightsFromCsv(sexAgeClassFamilyCsv, 'sex, age, class, family');

//TODO, have these functions return something more programmatically helpful than 

// var trainedModel = new regress.LogisticRegression({
//     alpha: 0.001,
//     iterations: 1000,
//     lambda: 0.0
// });

// trainedModel.dim = 6;
// trainedModel.theta = [
//     -0.003008250267947678,
//     -0.12264280669170756,
//     -0.012389751506417876,
//     0.06167734426610485,
//     0.01658666958902238,
//     -0.08127226412307487];
// trainedModel.threshold = 0.4556197895990125;
// var output = trainedModel.transform([1, 22.0, 0, 0, 1]);
// console.log(`constructed: ${output}`);


//var sexOnlyModel = sexOnlyLogReg.fit(X)
// Age + Sex
// Age + Sex + Class
// Age + Sex  + Class + Family Size



/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

// This file contains the Virgil Titanic Widget, a portable script
// that provides a GUI for estimating your hypothetical fate had you 
// been stuck aboard the Titanic when it sank.

// The widget makes use of multiple logistic regression models, each
// trained on a subset of historical information about the passengers
// aboard the actual Titanic, and predicts based on how much information
// the user has entered thus far.

// REQUIREMENTS:
// - jquery and jsregression must be imported before this file.
// - An ID'd, empty div to use as the Virgil Titanic Widget's container.
// - No elements with the IDs 'virgil', 'virgil-title', 'virgil-input',
//   or 'virgil-action', as these will be created/used by the widget.
// - For now this also uses a 'virgil-survival-percentage' element to display
//   the current chance

// TODO:
// - Make more portable/easy to use
// - Proper function protection/hygiene
// - Improve model => widget pipeline
// - Improve model
// - Styling?
// - I feel like this could be condensed/made less redundant

// Create Session Data Array
var sessionData = {
    age: '',
    sex: '',
    ticketClass: '',
    familySize: '',
    currentSurvivalChance: ''
};

// ***************************
// REGRESSION  MODELING  STUFF
// ***************************


// sex model
var sexOnlyModel = new jsregression.LogisticRegression();
sexOnlyModel.dim = 2;
sexOnlyModel.theta = [-0.0890331968767244,-0.17862025682715546];
sexOnlyModel.threshold = 0.43348325917417196;

// sex, age model
var sexAgeModel = new jsregression.LogisticRegression();
sexAgeModel.dim = 3;
sexAgeModel.theta = [-0.004372842872488401, -0.12396621206479115,
    -0.01284647753865258];
sexAgeModel.threshold = 0.4647621315211539;

// sex, age, class model
var sexAgeClassModel = new jsregression.LogisticRegression();
sexAgeClassModel.dim = 6;
sexAgeClassModel.theta = [-0.003008250267947678, -0.12264280669170756,
    -0.012389751506417876, 0.06167734426610485, 0.01658666958902238,
    -0.08127226412307487];
sexAgeClassModel.threshold = 0.4556197895990125;

// sex, age, class, family size model
var sexAgeClassFamilyModel = new jsregression.LogisticRegression();
sexAgeClassFamilyModel.dim = 9;
sexAgeClassFamilyModel.theta = [-0.003107044404184854, -0.12195172570423148,
    -0.01212545292656712, 0.061265104739074636, 0.016396944932942983,
    -0.08076909407620243, -0.042448836917240045, 0.05352978679357333, 
    -0.014187994280518111];
sexAgeClassFamilyModel.threshold = 0.45237142598325225;


// *************
// WIDGET  STUFF
// *************

// Initialize Virgil: takes an ID of an HTML element (e.g., 'virgil-div')
// on the page and sets up said element as the Virgil Widget's container
function initVirgil(containerElementId) {
    // Create Virgil elements if they don't already exist
    if(!$('#virgil').length) {
        $(`#${containerElementId}`).html('<div id="virgil"><div id="virgil-title"></div><div id="virgil-input"></div><div id="virgil-action"></div></div>');
    }
    // Set Initial Virgil Content
    var title = 'Virgil\'s Titanic Challenge';
    var input = 'In this challenge, Virgil predicts if you live or die in the Titanic, and shows you how to improve your chance for survival.';
    var action  = '<button onclick="doFirstTask()">Start Challenge</div>';
    setVirgil(title, input, action);
}

function setVirgil(title, input, action) {
    // Set Title
    $('#virgil-title').html(title);
    // Set Input
    $('#virgil-input').html(input);
    // Set Action
    $('#virgil-action').html(action);
}

// First Task - ask for sex
function doFirstTask() {
    // Set Virgil Content
    var title = 'What\'s your sex?';
    var input = '<select><option value="">Select..</option><option value="male">Male</option><option value="female">Female</option></select>';
    var action  = '<button onclick="doSecondTask()">Next</div>';
    setVirgil(title, input, action);

    // If value exists, add value to input
    $('input').val(sessionData.sex);

    // Update sessionData
    $('select').change(function() {
        var sexValue = $(this).val();
        sessionData.sex = sexValue;
        sessionData.currentSurvivalChance = getSurvivalChance(sessionData);
        console.log(sessionData);
        document.getElementById('virgil-survival-percentage').innerHTML = sessionData.currentSurvivalChance;
    });
}  

// Second Task - ask for age
function doSecondTask() {
    // Set Virgil Content
    var title = 'What\'s your age?';
    var input = '<input id="age" type="text">';
    var action  = '<button onclick="doFirstTask()">Previous</button> <button onclick="doThirdTask()">Next</div>';
    setVirgil(title, input, action);

    // If value exists, add value to select
    $('select').val(sessionData.age);

    // Update sessionData
    $('input').keyup(function() {
        var ageValue = $(this).val();
        sessionData.age = ageValue;
        sessionData.currentSurvivalChance = getSurvivalChance(sessionData);
        console.log(sessionData);
        document.getElementById('virgil-survival-percentage').innerHTML = sessionData.currentSurvivalChance;
    });
}  
      
// Third Task - ask for class
function doThirdTask() {
    // Set Virgil Content
    var title = 'What class would you travel on the Titanic?';
    var input = '<select><option value="">Select..</option><option value="first">First</option><option value="second">Second</option><option value="third">Third</option></select>';
    var action  = '<button onclick="doSecondTask()">Previous</button> <button onclick="doFourthTask()">Next</div>';
    setVirgil(title, input, action);

    // If value exists, add value to select
    $('select').val(sessionData.ticketClass);

    // Update sessionData
    $('select').change(function() {
        var ticketClassValue = $(this).val();
        sessionData.ticketClass = ticketClassValue;
        sessionData.currentSurvivalChance = getSurvivalChance(sessionData);
        console.log(sessionData);
        document.getElementById('virgil-survival-percentage').innerHTML = sessionData.currentSurvivalChance;
    });
}  


// Fourth Task - ask for family
function doFourthTask() {
    // Set Virgil Content
    var title = 'How many family members will be accompanying you?';
    var input = '<input id="age" type="text">';
    var action  = '<button onclick="doThirdTask()">Previous</div>';
    setVirgil(title, input, action);

    // If value exists, add value to select
    $('select').val(sessionData.port);

    // Update sessionData
    $('input').keyup(function() {
        var familySize = $(this).val();
        sessionData.familySize = familySize;
        sessionData.currentSurvivalChance = getSurvivalChance(sessionData);
        console.log(sessionData);
        document.getElementById('virgil-survival-percentage').innerHTML = sessionData.currentSurvivalChance;
    });
}

// Uses the most sophisticated model available, defaulting to sex only
// (and it should at least have that when called)
// Returns a percentage
function getSurvivalChance(data) {
    var features;
    if (data.familySize){
        features = getSexAgeClassFamilyFeatures(data);
        return computeChance(features, sexAgeClassFamilyModel);
    } else if (data.ticketClass){
        features = getSexAgeClassFeatures(data);
        return computeChance(features,sexAgeClassModel);        
    } else if (data.age){
        features = getSexAgeFeatures(data);
        return computeChance(features, sexAgeModel);
    } else {
        features = getSexOnlyFeatures(data);
        return  computeChance(features, sexOnlyModel);        
    }
}

function getSexOnlyFeatures(data) {
    if (data.sex == 'male')
        return [1];
    return [0];
}

function getSexAgeFeatures(data) {
    var features = getSexOnlyFeatures(data);
    features.push(Number(data.age));
    return features;
}

function getSexAgeClassFeatures(data) {
    var features = getSexAgeFeatures(data);
    if (data.ticketClass == 'first')
        features = features.concat([1, 0, 0]);
    else if (data.ticketClass == 'second')
        features = features.concat([0, 1, 0]);
    else
        features = features.concat([0, 0, 1]);
    return features;
}

function getSexAgeClassFamilyFeatures(data) {
    var features = getSexAgeClassFeatures(data);
    if (data.familySize < 1)
        features = features.concat([1, 0, 0]);
    else if (data.familySize < 5)
        features = features.concat([0, 1, 0]);
    else
        features = features.concat([0, 0, 1]);
    return features;
}

function computeChance(features, model) {
    output = model.transform(features);
    threshold = model.threshold;
    //TODO: re-scale output
    return output;
}
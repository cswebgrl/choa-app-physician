/*global
 Chart, GC, PointSet, Raphael, console, $,
 jQuery, debugLog,
 XDate, setTimeout, getDataSet*/

/*jslint undef: true, eqeq: true, nomen: true, plusplus: true, forin: true*/
(function(NS, $)
{

    "use strict";

    var selectedIndex = -1,
        PATIENT,

        /**
         * The cached value from GC.App.getMetrics()
         */
        metrics = null,

        PRINT_MODE = $("html").is(".before-print"),

        EMPTY_MARK = PRINT_MODE ? "" : "&#8212;",

        MILISECOND = 1,
        SECOND     = MILISECOND * 1000,
        MINUTE     = SECOND * 60,
        HOUR       = MINUTE * 60,
        DAY        = HOUR * 24,
        WEEK       = DAY * 7,
        MONTH      = WEEK * 4.348214285714286,
        YEAR       = MONTH * 12,

        shortDateFormat =
        {
            "Years"   : "y",
            "Year"    : "y",
            "Months"  : "m",
            "Month"   : "m",
            "Weeks"   : "w",
            "Week"    : "w",
            "Days"    : "d",
            "Day"     : "d",
            separator : " "
        };

    function isPhysicianViewVisible()
    {
        console.log("start");
        return GC.App.getViewType() == "view";
    }

    function renderPhysicianView(container) {
        $(container).empty();
        var topContainer = $("<div></div>").addClass("row");
        topContainer.attr("id", "thePatient-div");
        $(container).append(topContainer);
        var thePatient = $("<div></div>").addClass("col-xs-6 col-xs-offset-1").attr("id", "thePatientInfo-div");
        topContainer.append(thePatient);
        var patientInfo = $("<div></div>").addClass("col-xs-4");
        patientInfo.attr("id", "patientDBInfo-div");
        var patientID = (window.sessionStorage.getItem('patientID')) ?
            window.sessionStorage.getItem('patientID') : "18791941";
        var patientCall = (function () {
            var patientCall = null;
            $.ajax({
                async: false,
                global: false,
                url: 'http://52.72.172.54:8080/fhir/baseDstu2/Patient?_id=' + patientID,
                dataType: 'json',
                success: function (data) {
                    patientCall = data;
                }
            });
            return patientCall;
        })();
        var questionnaireResponseCall = (function () {
            var questionnaireResponseCall = null;
            $.ajax({
                async: false,
                global: false,
                url: 'http://52.72.172.54:8080/fhir/baseDstu2/QuestionnaireResponse?patient=' + patientID,
                dataType: 'json',
                success: function (data) {
                    questionnaireResponseCall = data;
                }
            });
            return questionnaireResponseCall;
        })();
        var theAnalysis = $("<div></div>").addClass("col-xs-10 col-xs-offset-1");
        theAnalysis.attr("id", "theAnalysis-div");
        $(container).append(theAnalysis);
        var theSurvey = $("<div></div>").addClass("col-xs-10 col-xs-offset-1");
        theSurvey.attr("id", "theSurvey-div");
        $(container).append(theSurvey);
        var questionsID = (window.sessionStorage.getItem('questionsID')) ?
            window.sessionStorage.getItem('questions_id') : "18791835";
        var questionnaireCall = (function () {
            var questionnaireCall = null;
            $.ajax({
                async: false,
                global: false,
                url: 'http://52.72.172.54:8080/fhir/baseDstu2/Questionnaire?_id=' + questionsID,
                dataType: 'json',
                success: function (data) {
                    questionnaireCall = data;
                }
            });
            return questionnaireCall;
        })();


        // var json_data ={
        //           "resourceType": "Observation",
        //           "status": "final",
        //           "code": {
        //             "coding": [
        //               {
        //                 "system": "http://loinc.org",
        //                 "code": "39156-5",
        //                 "display": "BMI"
        //               }
        //             ]
        //           },
        //           "subject": {
        //             "reference": "Patient/18791941"
        //           },
        //            "performer": [{
        //               "display": "A. Langeveld"
        //             }],
        //           "issued": "2013-04-04T13:27:00+01:00",
        //           "effectiveDateTime": "2013-04-02",
        //           "valueQuantity": {
        //             "value": 31.0,
        //           }
        //         };

        // var WeightHeightHeadBMIObservationsPOST = (function (){
        //     var WeightHeightHeadBMIObservationsPOST = null;
        //     //refer to http://docs.smarthealthit.org/tutorials/server-quick-start/
        //     //Note LOINC Codes: 3141-9, 8302-2, 8287-5, 39156-5 are for Weight, Height, Head Circumference, and BMI Observations
        //     $.ajax({
        //         type: 'POST',
        //         async: false,
        //         global: false,
        //         url: 'http://52.72.172.54:8080/fhir/baseDstu2/Observation',
        //         data: JSON.stringify(json_data),
        //         dataType: 'json',
        //         contentType: 'application/json',
        //         success: function (data) {
        //             WeightHeightHeadBMIObservationsPOST = data;
        //             console.log( WeightHeightHeadBMIObservationsPOST);
        //         }
        //     });
        //     return WeightHeightHeadBMIObservationsPOST;
        // })();


        var WeightHeightHeadBMIObservationsCall = (function () {
            var WeightHeightHeadBMIObservationsCall = null;
            //refer to http://docs.smarthealthit.org/tutorials/server-quick-start/

            //Note LOINC Codes: 3141-9, 8302-2, 8287-5, 39156-5 are for Weight, Height, Head Circumference, and BMI Observations
            $.ajax({
                async: false,
                global: false,
                //url: 'http://52.72.172.54:8080/fhir/baseDstu2/Observation?subject:Patient=' + patientID + '&code=3141-9,8302-2,8287-5,39156-5&_count=50',
                url: 'http://52.72.172.54:8080/fhir/baseDstu2/Observation?subject:Patient=' + patientID + '&code=39156-5&_count=50',
                dataType: 'json',
                success: function (data) {
                    WeightHeightHeadBMIObservationsCall = data;
                    // console.log( WeightHeightHeadBMIObservationsCall);
                }
            });
            return WeightHeightHeadBMIObservationsCall;
        })();
        //$.when(patientCall, questionnaireResponseCall, questionnaireCall, WeightHeightHeadBMIObservationsCall,WeightHeightHeadBMIObservationsPOST  ).then(function() {
        $.when(patientCall, questionnaireResponseCall, questionnaireCall, WeightHeightHeadBMIObservationsCall ).then(function() {

            console.log("thePatient BMI observations: " + JSON.stringify(WeightHeightHeadBMIObservationsCall));
            if (WeightHeightHeadBMIObservationsCall.entry) {
                var BMIObservation = WeightHeightHeadBMIObservationsCall.entry[0].resource;
            }
            console.log(BMIObservation);
            //var patientBMI = (BMIObservation.id ? BMIObservation.id : "");


            console.log("thePatient: " + patientCall);
            if (patientCall.entry) {
                var patient = patientCall.entry[0].resource;
            }
            if (WeightHeightHeadBMIObservationsCall.entry) {
                var bmiVitals = WeightHeightHeadBMIObservationsCall.entry[0].resource;
            }

            console.log(patient);
            console.log(bmiVitals);

            var patientId = (patient.id ? patient.id : "");
            var patientVersion = (patient.meta.versionId) ? patient.meta.versionId : "";
            var patientLastUpdated = patient.meta.lastUpdated ? patient.meta.lastUpdated : "";
            var patientName = patient.name[0] ? patient.name[0].given[0] + " " + patient.name[0].family[0] : "";
            var patientGender = patient.gender ? patient.gender : "";
            var patientBDay = patient.birthDate ? patient.birthDate : "";
            var address = (patient.address ?
            (patient.address[0].line ?
            patient.address[0].line + "</br>" : "") +
            (patient.address[0].city ?
            patient.address[0].city + ", " : "") +
            (patient.address[0].state ?
            patient.address[0].state + " " : "") +
            (patient.address[0].postalCode ?
            patient.address[0].postalCode + "" : "") : "");
            var contact = (patient.telecom ?
            (patient.telecom[0].system ?
            patient.telecom[0].system + " " : "") +
            (patient.telecom[0].value ?
                patient.telecom[0].value : "") : "");

            var BMI = bmiVitals.valueQuantity.value;
            console.log("BMI " + BMI);
            var BMIClassification;
            switch (true) {
                case (BMI <= 18.5):
                    BMIClassification = $("<div></div>")
                        .append($("<strong></strong>")
                            .addClass("text-warning")
                            .html("Underweight </br> BMI: " + BMI));
                    break;
                case (18.5 < BMI && BMI <= 25):
                    BMIClassification = $("<div></div>")
                        .append($("<strong></strong>")
                            .addClass("text-info")
                            .html("Normal weight </br> BMI: " + BMI));
                    break;
                case (25 < BMI && BMI <= 30):
                    BMIClassification = BMIClassification = $("<div></div>")
                        .append($("<strong></strong>")
                            .addClass("text-warning ")
                            .html("Overweight </br> BMI: " + BMI));
                    break;
                case (30 < BMI && BMI <= 35):
                    BMIClassification = $("<div></div>")
                        .append($("<strong></strong>")
                            .addClass("text-danger ")
                            .html("Class I obesity </br> BMI: " + BMI));
                    break;
                case (35 < BMI && BMI <= 40):
                    BMIClassification = $("<div></div>")
                        .append($("<strong></strong>")
                            .addClass("text-danger ")
                            .html("Class II obesity </br> BMI: " + BMI));
                    break;
                case (40 < BMI):
                    BMIClassification = $("<div></div>")
                        .append($("<strong></strong>")
                            .addClass("text-danger ")
                            .html("Class III obesity </br> BMI: " + BMI));
                default:
                    BMIClassification = "BMI: ー"
            }
            thePatient.append($("<blockquote></blockquote>") 
                .append($("<div></div>") 
                    .addClass("patient-info") 
                    .append($("<div></div>")
                        .addClass("patient-fullname")
                        .attr("id", "patient-fullname")
                        .append($("<strong></strong>")
                            .html(patientName)))
                    .append($("<div></div>")
                        .addClass("patient-contact")
                        .attr("id", "patient-contact")
                        .append($("<abbr></abbr>")
                            .attr("title", "Contact")
                            .html(contact)))
                    .append($("<div></div>")
                        .addClass("patient-address")
                        .attr("id", "patient-address")
                        .append($("<address></address>")
                            .html(address)))
                    .append($("<div></div>") 
                        .attr("id", "patient-BMI")
                        .append(BMIClassification))
                    .append($("<small></small>")
                        .append($("<div></div>")
                            .addClass("patient-gender text-capitalize")
                            .attr("id", "patient-gender")
                            .html("<strong>Patient ID: </strong>" + patientId)))));  

            topContainer.append(patientInfo);
            patientInfo.append($("<div></div>")
                .addClass("patient-info")
                .append($("<blockquote></blockquote>")
                    .addClass("blockquote-reverse")
                    .attr("id", "patient-BMI")
                    .append(BMIClassification)
                    .append($("<div></div>")
                        .addClass("patient-gender text-capitalize")
                        .attr("id", "patient-gender")
                        .html("<strong>Gender: </strong>" + patientGender))
                    .append($("<div></div>")
                        .addClass("patient-bday dt")
                        .attr("id", "patient-bday")
                        .html("<strong>Birthdate: </strong>" + patientBDay))
                    .append($("<div></div>")
                        .append($("<footer></footer>")
                            .append("<small></small>")
                            .append($("<div></div>")
                                .addClass("patient-version")
                                .attr("id", "patient-version")
                                .html("<strong>DB Version: </strong>" + patientVersion))
                            .append($("<div></div>")
                                .addClass("patient-lastUpdated")
                                .attr("id", "patient-lastUpdated")
                                .html("<strong>Last updated: </strong>" + patientLastUpdated.split("T")[0]))))));

            if (questionnaireCall.entry) {
                var questionnaire = questionnaireCall.entry[0].resource;
            }
            if (questionnaireResponseCall.entry) {
                var response = questionnaireResponseCall.entry[0].resource;
            }

            var questionnaireId = (questionnaire.id ? questionnaire.id : "");
            var questionnaireVersion = (questionnaire.meta.versionId ? questionnaire.meta.versionId : "");
            var questionnaireLastUpdated = (questionnaire.meta.lastUpdated ? questionnaire.meta.lastUpdated.split("T")[0] : "");
            var responseLastUpdated = (response.meta.lastUpdated ? response.meta.lastUpdated.split("T") : "");
            var qAndA = [];
            for(var i = 0; i < questionnaire.group.question.length; i++) {
                //search for validated by LinkId final answer
                var question_link_ID = questionnaire.group.question[i].linkId;
                var qr_index = -1;
                for (var x = 0; x < response.group.question.length ; x++) {
                    //console.log(question_link_ID);
                    //console.log( qr.resource.group.question[x].linkId);
                    if(question_link_ID == response.group.question[x].linkId){
                        //console.log( "validated linkId of question to a LinkID in the questionare-response");
                        qr_index = x;
                        break;
                    }
                }
                if(qr_index == -1){
                    console.log("ERROR: could not validate linkId of question to any existing LinkID in the questionare-response");
                    return;
                }
                var final_answer = response.group.question[qr_index].answer[0].valueInteger;
                qAndA.push({question:(questionnaire.group.question[i].text), answer:(questionnaire.group.question[i].option[final_answer].display), answerCode:final_answer});

            }
            var result = questionnaire_ranking(qAndA);
            console.log(result);

            var blurb_5210 = "5-2-1-0 is an evidence-based prevention message centered on recommendations for Childhood Obesity Assessment, Prevention and Treatment\
            sponsored by the <abbr title='Centers for Disease Control and Prevention'>CDC</abbr>.\
            5-2-1-0 recommends 5 or More Fruits & Vegetables a day, 2 Hours or Less of Screen Time a day, 1 Hour or More of Active Play a day, \
            and 0 Sugary Drinks a day.";

            var focus_score = 3; //temp until arun fixes his code
            var analysisRow = $("<div></div>")
                .addClass("btn-group btn-group-sm")
                .attr("data-toggle", "buttons")
                .attr("role", "group")
            for(var i = 0; i < result.length; i++) {
                if(i < focus_score) {
                    analysisRow.append($("<div></div>")
                        .addClass("btn-group")
                        .attr("role", "group")
                        .append($("<a></a>")
                            .addClass("btn btn-primary btn-responsive disabled")
                            .attr("type", "button")
                            .html(result[i])));
                }
                else {
                    analysisRow.append($("<div></div>")
                        .addClass("btn-group")
                        .attr("role", "group")
                        .append($("<a></a>")
                            .addClass("btn btn-default btn-responsive disabled")
                            .attr("type", "button")
                            .html(result[i])));
                }
            }
            theAnalysis.append($("<div></div>")
                .addClass("row well")
                .append($("<div></")
                    .addClass("text-center")
                    .append($("<h4></h4>")
                        .html("5-2-1-0 analysis recommendations:")))
                .append($("<div></div>")
                    .addClass("col-sm-11 col-sm-offset-1 bb")
                    .append(analysisRow)));
            theAnalysis.append($("<div></div>")
                .addClass("col-xs-12 bb text-justify 5210-div")
                .append($("<small></small>")
                    .html(blurb_5210)));

            var surveyRow = $("<div></div>")
                .addClass("btn-group btn-group-sm")
                .attr("data-toggle", "buttons")
                .attr("role", "group")
            for(var i = 0; i < questionnaire.group.question.length; i++) {
                var options = [];
                for(var j = 0; j < questionnaire.group.question[i].option.length; j++) {
                    options.push(questionnaire.group.question[i].option[j].display);
                }
                for (var j = 0; j < options.length; j++) {
                        if (qAndA[i].answerCode == j) {
                            surveyRow.append($("<div></div>")
                                .addClass("btn-group")
                                .attr("role", "group")
                                .append($("<a></a>")
                                    .addClass("btn btn-secondary btn-responsive active disabled")
                                    .attr("type", "button")
                                    .html(options[j])));                        }
                        else {
                            surveyRow.append($("<div></div>")
                                .addClass("btn-group")
                                .attr("role", "group")
                                .append($("<a></a>")
                                    .addClass("btn btn-secondary btn-responsive disabled")
                                    .attr("type", "button")
                                    .html(options[j])));
                        }
                }
                theSurvey.append($("<div></div>")
                    .addClass("row well")
                    .append($("<div></div>")
                        .addClass("text-center")
                        .append($("<label></label>")
                            .html(options[i])))
                    .append($("<div></div>")
                        .addClass("col-sm-11 col-sm-offset-1 bb")
                        .append(surveyRow)));
            }
        });
    }

    // for(var j = 0; j < qAndA.length; j++) {
    //     for (var k = 0; k < options.length; k++) {
    //         if (qAndA.answerCode[j] == options[l]) {
    //             console.log(options[k]);
    //                         surveyRow.append($("<div></div>")
    //                             .addClass("btn-group")
    //                             .attr("role", "group")
    //                             .append($("<a></a>")
    //                                 .addClass("btn btn-secondary btn-responsive active disabled")
    //                                 .attr("type", "button")
    //                                 .html(options[l])));
    //         }
    //         else {
    //                         surveyRow.append($("<div></div>")
    //                             .addClass("btn-group")
    //                             .attr("role", "group")
    //                             .append($("<a></a>")
    //                                 .addClass("btn btn-secondary btn-responsive disabled")
    //                                 .attr("type", "button")
    //                                 .html(options[l])));
    //         }
    //                 theSurvey.append($("<div></div>")
    //                     .addClass("row well")
    //                     .append($("<div></div>")
    //                         .addClass("text-center")
    //                         .append($("<label></label>")
    //                             .html(options[i])))
    //                     .append($("<div></div>")
    //                         .addClass("col-sm-11 col-sm-offset-1 bb")
    //                         .append(surveyRow)));
    //     }
    // }
//------------------------------5-2-1-0-Algorithm-------------------------

    function questionnaire_ranking(qAndA)
    {

        console.log('QUESTION');
        console.log(JSON.stringify(qAndA));

        // Answers to behavior questions
        var ans_q1 = qAndA[0]['answerCode'] + 1;
        var ans_q2 = qAndA[1]['answerCode'] + 1;
        var ans_q3 = qAndA[2]['answerCode'] + 1;
        var ans_q4 = qAndA[3]['answerCode'] + 1;
        var ans_q5 = qAndA[4]['answerCode'] + 1;
        var ans_q6 = qAndA[5]['answerCode'] + 1;

        // Answers to preference questions
        var ans_q7 = qAndA[6]['answerCode'];
        var ans_q8 = qAndA[7]['answerCode'] + 1;
        var ans_q9 = qAndA[8]['answerCode'] + 1;

        // Initialize map and set to default weights

        // fd = food habits
        // s = sedentary behavior
        // p = physical activity
        // dd = drink habits

        var scores = [];
        scores['fd'] = 1;
        scores['s'] = 1;
        scores['p'] = 1;
        scores['dd'] = 1;

        // Adjust weightings based on patient's responses
        scores['fd'] = scores['fd'] * ((convertResponse(ans_q5) + ans_q2) - ans_q1) / 4;
        scores['s'] = scores['s'] * (convertResponse(ans_q6) / 4);
        scores['p'] = scores['p'] * (ans_q3 / 4);
        scores['dd'] = scores['dd'] * (ans_q4 / 4);
        console.log('SCORES');
        console.log(scores);

        // Adjust weight based on patient's preferences
        var pref_key = convertAnsToKey(ans_q7);
        var pref_score = (ans_q8 + ans_q9) / 4;
        scores[pref_key] = scores[pref_key] / pref_score;
        var focus_score = Math.floor(pref_score);

        // Sort the map by value to get the rankings for an ideal plan
        var result = Object.keys(scores).sort(function (a, b) {
            return scores[a] - scores[b];
        });

        var recommendation = [];
        for (var y = 0; y < result.length ; y++) {
            if( result[y] == 'fd' )
                recommendation[y]  =  " Underconsumption of fruits and vegetables";
            if( result[y] == 's' )
                recommendation[y]  =  " Too much screen time";
            if( result[y] == 'p' )
                recommendation[y]  =  " Lack of active play time";
            if( result[y] == 'dd' )
                recommendation[y]  =  " Overconsumption of sugary drinks";
        }
        return recommendation;
    }

    // Sometimes the responses are in reverse order so we need to covert them
    function convertResponse(resp)
    {
        return (resp*-1) + 5;
    }


    // Sloppy, but I think its more clear to keep the index's strings rather then integers for now
    function convertAnsToKey(resp)
    {
        // Make half your plate veggies and fruits = 0
        // Be more active = 1
        // Limit screen time = 2
        // Drink more water and limit sugary drinks = 3

        if(resp == 0)
            return 'fd';
        else if(resp == 1)
            return 'p';
        else if(resp == 2)
            return 's';
        else if (resp == 3)
            return 'dd';
    }

//----------------------------------------------------------------

    NS.PhysicianView =
    {
        render : function()
        {

            renderPhysicianView("#view-physician");

        }
    };

    $(function()
    {
        if (!PRINT_MODE)
        {

            $("html").bind("set:viewType set:language", function(e)
            {
                if (isPhysicianViewVisible())
                {
                    renderPhysicianView("#view-physician");
                }
            });

            GC.Preferences.bind("set:metrics set:nicu set:currentColorPreset", function(e)
            {
                if (isPhysicianViewVisible())
                {
                    renderPhysicianView("#view-physician");
                }
            });

            GC.Preferences.bind("set", function(e)
            {
                if (e.data.path == "roundPrecision.velocity.nicu" ||
                    e.data.path == "roundPrecision.velocity.std")
                {
                    if (isPhysicianViewVisible())
                    {
                        renderPhysicianView("#view-physician");
                    }
                }
            });

            GC.Preferences.bind("set:timeFormat", function(e)
            {
                renderPhysicianView("#view-physician");
            });
        }
    });

}(GC, jQuery));
/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

// All pages to be loaded
var pages = [
	"instructions/instruct.html", // TO DO
	"memory_experiment.html"
];

const init = (async () => {
    await psiTurk.preloadPages(pages);
})()

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var memoryQuestionnaire = function() {

	/* Initialize variables */
  var phase = 1;
  var nPhases = 5;
	var nTrials;
	var ncatch = 9;
  var curTrial = 1;
  var minCount = 150;
  var startTime;
  var rt;
  var qname;
  var intype;
	var trialData;
	var words;
	var returnedToTrials = [];
	var checkboxes;
	var currentMem;
	var tboxes;
	var words;
	var subTrial = {'emotionA':1, 'emotionB':1, 'wordCloudA':1, 'wordCloudB':1};
	var validKeys = new Array(48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 190, 8);
	var numChecked = 0;
	var showError = false;
	var keyPresses = {'responseID_memoryA_generation':{'txt':[], 'time':[]},
	                  'responseID_memoryB_generation':{'txt':[], 'time':[]}
	                 };
	var memStartTime = {};
	var raiseError = false;
	var memID = '';
	var keyPressed = 0;
	var endit = false; // boolean switch to display the end page
	var eventA = '';
	var eventB = '';

	var questionID;
	var questionList;

	var shuffleStart;
	var keepShuffling;

	var memories;

	var selectedSeries = '';

	/*****************************
  * START FUNCTION DEFINITIONS *
  *****************************/

	function getResponse() {
		if (intype == 'checkbox') {
			qname = "'" + qname + '[]' + "'";
			response = jQuery.makeArray($("input[name=" + qname + "]").filter(':checked').map(function () {return $(this).val();}));
		} else if (intype == 'text') {
			response = $('input[name=' + qname + ']').val();
		} else {
			response = $('input[name=' + qname + ']:checked').val();
		}
	};

	function buttonClicked() {
		showError = false;
		rt = new Date().getTime() - startTime;
		qname = 'responseName_' + questionID;
		intype = $('#' + questionID + ' ' + 'input').attr('type');
		getResponse(); // gets the response value for this annotation trial
		if (response.length == 0) {
			showError = true;
		}
		if (showError) {
			$('.responseError').show();
		} else {
			if (questionID == 'tv_series'){
				selectedSeries = response;
				$('.selected_series').html(selectedSeries);
			} else if (questionID == 'moreRecentAB') {
			// if (phase == 1 && trialOrder[phase-1][curTrial-1] == 11) {
				if (document.getElementsByName('responseName_moreRecentAB')[0].checked) {
					document.getElementById('moreRecent').innerHTML = '<span style="color: green">Memory A</span>';
					document.getElementById('lessRecent').innerHTML = '<span style="color: blue">Memory B</span>';
				} else {
					document.getElementById('lessRecent').innerHTML = '<span style="color: green">Memory A</span>';
					document.getElementById('moreRecent').innerHTML = '<span style="color: blue">Memory B</span>';
				}
			}
			$('#' + questionID).hide();
			$('.responseError').hide();
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function textSubmitted() {
		if ((questionID == 'memoryA_generation') || (questionID == 'memoryB_generation')) {
			if ($('#' + 'responseID_' + questionID).val().length < minCount) {
				raiseError = true;
				$('#count_' + questionID).text('Please enter a minimum of ' + minCount + ' characters. Your current response has ' + $('#' + 'responseID_' + questionID).val().length + ' characters.');
			} else {
				var mem = questionID.slice(-2, -1);
				psiTurk.recordUnstructuredData('keyPressesMem' + mem, keyPresses['responseID_' + questionID]);
				raiseError = false;
			}
		} else if ((questionID == 'activityTextA') || (questionID == 'activityTextB')) {
			if ($('#' + 'responseID_' + questionID).val().length == 0) {
				raiseError = true;
				$('.responseError').show();
			} else {
				raiseError = false;
			}
		}
		if (!raiseError) {
			rt = new Date().getTime() - startTime;
			$('#' + questionID).hide();
			$('.responseError').hide();
			// qname = 'q' + phase + '_' + trialOrder[phase-1][curTrial-1];
			// $('#' + questionID + '_store').val($('#' + 'responseID_' + questionID).val());
			response = $('#' + 'responseID_' + questionID).val();
			if (questionID == 'memoryA_generation') {
				eventA = response;
			} else if (questionID == 'memoryB_generation') {
				eventB = response;
			}
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function atLeastOneCheck(checkboxes)
	{
			var okay=false;
			for(var i=0,l=checkboxes.length;i<l;i++)
			{
					if(checkboxes[i].checked)
					{
							okay=true;
							break;
					}
			}
			return okay;
	};

	function emotionSubmitted() {
		currentMem = questionID.slice(-1);
		checkboxes = document.getElementsByName('responseName_' + questionID + '[]');
		numChecked = 0;
		if (atLeastOneCheck(checkboxes)) {
			rt = new Date().getTime() - startTime;
			$('#' + questionID).hide();
			$('.emotionError').hide();
			// loop over them all
			response = [];
			for (var i=0; i<checkboxes.length; i++) {
				 // And stick the checked ones onto an array...
				 if (checkboxes[i].checked) {
					 response.push(checkboxes[i].value);
				 }
			}
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
									 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
		else {
			$('.emotionError').show();
		}
	};

	function submitEmotionRatings() {
		rt = new Date().getTime() - startTime;
		var parent = '#' + questionID;
		var child = '.emotionButton';
		var emotionNames = jQuery.makeArray($(parent + ' ' + child).filter(':checked').map(function() {return $(this).attr('name');}));
		if (emotionNames.length != numChecked) {
			$('.emotionError2').show();
		} else {
			$('#' + questionID).hide();
			$('.emotionError2').hide();
			var selectedEmotions = [];
			for (var i=0; i<emotionNames.length; i++) {
				selectedEmotions.push(emotionNames[i].slice(13, -1));
			}
			var emotionVals = jQuery.makeArray($(parent + ' ' + child).filter(':checked').map(function() {return $(this).val();}));
			response = [selectedEmotions, emotionVals];
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function atLeastOneBox(textboxes) {
			var okay=false;
			for (var i = 0, l = textboxes.length; i < l; i++) {
					if (textboxes[i].value.length > 0) {
							okay=true;
							break;
					}
			}
			return okay;
	};

	function wordSubmitted() {
		currentMem = questionID.slice(-1);
		tboxes = $('#' + questionID + ' input[type=text]');
		words = [];
		if (atLeastOneBox(tboxes)) {
			$('#textbox_' + questionID).hide();
			$('.wordError').hide();
			$('#' + questionID + '_rating').show();
			// loop over them all
			for (var i = 0; i < tboxes.length; i++) {
				 // And stick the checked ones onto an array...
				 if (tboxes[i].value.length > 0) {
						words.push(tboxes[i].value);
						var wordnum = i + 1;
						$('#word' + currentMem + wordnum).html('<b>' + tboxes[i].value + '</b>');
						$('#wordDiv' + currentMem + wordnum).show();
				 }
			}
			$('#wordSubmit' + currentMem).show();
			subTrial[questionID]++;
		}
		else {
			$('.wordError').show();
		}
	};

	function submitWordRatings() {
		rt = new Date().getTime() - startTime;
		var parent = '#' + questionID;
		var child = '.wordButton';
		var wordVals = jQuery.makeArray($(parent + ' ' + child).filter(':checked').map(function() {return $(this).val();}));
		if (wordVals.length != words.length) {
			$('.wordError2').show();
		} else {
			$('#' + questionID).hide();
			$('.wordError2').hide();
			response = [words, wordVals];
			trialData = {'phase':phase,
									 'trial':curTrial,
									 'question':questionID,
									 'response':response,
									 'rt':rt,
								 	 'timeStamp':new Date()};
			psiTurk.recordTrialData(trialData);
			nextTrial();
		}
	};

	function shuffle(a) {
			var j, x, i;
			for (i = a.length - 1; i > 0; i--) {
					j = Math.floor(Math.random() * (i + 1));
					x = a[i];
					a[i] = a[j];
					a[j] = x;
			}
			return a;
	};

	function checkShuffleP2(questionList) {
		var consecutiveCount = 1;
		var badShuffle = false;
		var mem1 = '';
		var mem2 = '';
		if ($('#' + questionList[0] + ':contains("Memory A")').length > 0) {
			mem1 = 'A';
		} else {
			mem1 = 'B';
		}
		for (var i = 1; i < questionList.length; i++) {
			if ($('#' + questionList[i] + ':contains("Memory A")').length > 0) {
				mem2 = 'A';
			} else {
				mem2 = 'B';
			}
			if (mem1 == mem2) {
				consecutiveCount++;
			} else {
				consecutiveCount = 1;
			}
			/* don't want more than questions for the same memory consecutively */
			if (consecutiveCount > 4) {
				badShuffle = true;
				break;
			}
			mem1 = mem2;
		}
		return badShuffle;
	};

	function checkShuffleP3(questionList) {
		/* a is an array of the type of SAM question. Can't have two of the same type in a row */
		var badShuffle = false;

		for (var i = 1; i < questionList.length; i++) {
			/* don't want two SAM questions of the same type in a row */
			if (questionList[i].slice(0, -1) == questionList[i-1].slice(0, -1)) {
				badShuffle = true;
				break;
			}
		}
		return badShuffle;
	};

	function getQuestionIDs(className) {
		var idArray = [];
		$('.' + className).each(function () {
		    idArray.push(this.id);
		});
		return idArray;
	};

	function goForward() {
		$('#' + questionID).hide();
		rt = new Date().getTime() - startTime;
		trialData = {'phase':phase,
								 'trial':curTrial,
								 'question':questionID,
								 'rt':rt,
								 'timeStamp':new Date()};
		psiTurk.recordTrialData(trialData);
		nextTrial();
	}

	function recordKeyPresses(e) {
	  memID = this.id;
		keyPresses[memID]['txt'].push(e.which);
		keyPresses[memID]['time'].push(new Date().getTime());
  }

	function nextTrial() {
		if (curTrial == nTrials[phase-1]) {
			curTrial = 1;
			if (phase == nPhases) {
				endit = true;
			} else {
				phase++;
				if (phase == 2) {
					$('.rowContainer').show();
				}
			}
		} else {
			curTrial++;
		}

		if (endit) {
			endExperiment();
		} else {
			showNext();
		}
	}

	function showNext() {
		questionID = questionList[phase-1][curTrial-1];
		$('#' + questionID).show();
		startTime = new Date().getTime();

		if (questionID == 'relateAB') {
			$('.columnContainer').css('border-style', 'solid');
			$('.columnContainer').css('border-width', '2px');
			memLabelA = "<span style=\"color: green\">Memory A:</span><br>";
			memLabelB = "<span style=\"color: blue\">Memory B:</span><br>";
			// document.getElementById('responseA').innerHTML = '<span style="color: green">Memory A:</span><br>' + $('#promptA2_store').val();
			// document.getElementById('responseB').innerHTML = '<span style="color: blue">Memory B:</span><br>' + $('#promptB2_store').val();
			$('#responseA').html(memLabelA + eventA);
			$('#responseB').html(memLabelB + eventB);
			$('#responseA').show();
			$('#responseB').show();
		}
	}

	function initializeExperiment() {
		//
		// this function initializes the trial orders for the current pair of events being judged
		//

		questionList = globalQuestionList;

		/* shuffle catch trial order */
		questionList[nPhases] = shuffle(questionList[nPhases]);
		questionList[nPhases] = questionList[nPhases].slice(0, ncatch);

		questionID = questionList[phase-1][curTrial-1];

		/* shuffle phase 1 trial order after the "overallSimilarityAB" question */
		shuffleStart = questionList[0].indexOf('overallSimilarityAB') + 1;
		questionList[0].splice(questionList[0].indexOf('moreRecentAB'), 1);
		questionList[0].splice(questionList[0].indexOf('causalAB'), 1);
		questionList[0] = questionList[0].slice(0, shuffleStart).concat(shuffle(questionList[0].slice(shuffleStart)));
		/* reinsert the 'moreRecent' and 'causal' questions directly next to each other at a random location */
		insertIndex = Math.floor(Math.random() * (questionList[0].length - shuffleStart)) + shuffleStart;
		questionList[0].splice(insertIndex, 0, 'moreRecentAB', 'causalAB');


		/* remove the word cloud questions before shuffling phase 2 order */
		questionList[1].splice(questionList[1].indexOf('wordCloudA'), 1);
		questionList[1].splice(questionList[1].indexOf('wordCloudB'), 1);

		/* shuffle phase 2 trial order */
		/* check that shuffled phase 2 trial order doesn't have more than four consecutive questions about the same memory */
		keepShuffling = true;
		while (keepShuffling) {
			questionList[1] = shuffle(questionList[1]);
			keepShuffling = checkShuffleP2(questionList[1]);
		}
		/* add the word cloud questions back to the end of phase 2 */
		questionList[1] = questionList[1].concat(['wordCloudA', 'wordCloudB']);


		// ************************************************* //
		// ************************************************* //



		/* insert catch trials in phase 1 */
		questionList[0].splice(shuffleStart + 2, 0, questionList[nPhases][0]);
		questionList[0].splice(questionList[0].length, 0, questionList[nPhases][1]);

		/* insert catch trials in phase 2 */
		var ncatch2 = ncatch - 2;
		var inc = Math.floor(questionList[1].length/ncatch2);
		for (i = 0; i < ncatch2; i++) {
			questionList[1].splice(inc*(i + 1), 0, questionList[nPhases][i + 2]);
		}

	  nTrials = [];
		for (i = 0; i < nPhases; i++) {
			nTrials.push(questionList[i].length);
		}

		/* record order of trials */
		psiTurk.recordTrialData({'trialOrder':questionList});

	  $('#' + questionList[0][0]).show();
		globalStartTime = new Date().getTime();
	  startTime = new Date().getTime();
	}

	function endExperiment() {
		trialData = {'memoryA':eventA,
								 'memoryB':eventB,
								 'condition':mycondition};

		psiTurk.recordTrialData(trialData);
		$('.rowContainer').hide();
		$('#end').show();
		$('#submitButton').show();
	}

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt);
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });


			},
			error: prompt_resubmit
		});
	};

	/***************************
  * END FUNCTION DEFINITIONS *
  ***************************/

	/* show experiment start page */
  psiTurk.showPage('memory_experiment.html');


	/* populate condition-dependent DOMs */
	// $('#promptA1 .innerDiv').html(htmlByCondition[mycondition]['promptA1']);
	// $('#promptB1 .innerDiv').html(htmlByCondition[mycondition]['promptB1']);
	// $('#relateAB .innerDiv').html(htmlByCondition[mycondition]['relateAB']);
	// $('#additionalTextAB .innerDiv').html(htmlByCondition[mycondition]['additionalTextAB']);

	var globalQuestionList = [getQuestionIDs('phase1'), getQuestionIDs('phase2'),
														getQuestionIDs('phase3'), getQuestionIDs('phase4'),
														getQuestionIDs('phase5'), getQuestionIDs('catch')]; // add question names to this list, separated by phase

	initializeExperiment();

  /* Wait for clicks */
  $('.questionSubmit').click(textSubmitted);
  $('.responseButton').click(buttonClicked);
  $('.feedbackSubmit').click(buttonClicked);
  $('.responseSubmit').click(buttonClicked);
  $('.emotionSubmit').click(emotionSubmitted);
  $('.emotionFinish').click(submitEmotionRatings);
	$('.wordSubmit').click(wordSubmitted);
	$('.wordFinish').click(submitWordRatings);
	// $('#backButton').click(goBack);
	$('.forwardButton').click(goForward);
	// $('#forwardButton').click(goForward);
	// $('.chbox').click(chboxClicked);
	$('#responseID_memoryA_generation').keyup(recordKeyPresses);
	$('#responseID_memoryB_generation').keyup(recordKeyPresses);
  $("#finish").click(function () {
		finishData = {'totalElapsedTime':new Date().getTime() - globalStartTime,
									'returnedTo':returnedToTrials};
		psiTurk.recordTrialData(finishData);
    psiTurk.saveData({
    	success: function(){
      	psiTurk.completeHIT();
      },
      error: prompt_resubmit});
	});
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
 // In this example `task.js file, an anonymous async function is bound to `window.on('load')`.
 // The async function `await`s `init` before continuing with calling `psiturk.doInstructions()`.
 // This means that in `init`, you can `await` other Promise-returning code to resolve,
 // if you want it to resolve before your experiment calls `psiturk.doInstructions()`.

 // The reason that `await psiTurk.preloadPages()` is not put directly into the
 // function bound to `window.on('load')` is that this would mean that the pages
 // would not begin to preload until the window had finished loading -- an unnecessary delay.
$(window).on('load', async () => {
    await init;
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new memoryQuestionnaire(); } // what you want to do when you are done with instructions
    );
});

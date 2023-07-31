/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

var mycondition = 2; // hardcode the condition because we want to bypass psiTurk's flawed counterbalancing mechanism
psiTurk.recordUnstructuredData('trueCondition', mycondition); // record actual condition, which could be different from the one assigned by psiTurk

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
* MEMORY QUESTIONNAIRE *
********************/

var memoryQuestionnaire = function() {

	/* Initialize variables */
  var phase = 1;
  var nPhases = 5;
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
	var keyPresses = {'responseID_promptA2':{'txt':[], 'time':[]},
	                  'responseID_promptB2':{'txt':[], 'time':[]}
	                 };
	var memStartTime = {};
	var raiseError = false;
	var memID = '';
	var keyPressed = 0;

	/*****************************
  * START FUNCTION DEFINITIONS *
  *****************************/

	function buttonClicked() {
		showError = false;
		rt = new Date().getTime() - startTime;
		qname = 'responseName_' + questionID;
		intype = $('#' + questionID + ' ' + 'input').attr('type');
		if ((questionID == 'spatialDistanceAB') || (questionID == 'temporalDistanceAB')) {
			response = [$('#responseID_' + questionID + '_1').val(), $('#responseID_' + questionID + '_2').val()];
			if (response[0].length == 0) {
				showError = true;
			}
		} else {
			if (intype == 'checkbox') {
				qname = "'" + qname + '[]' + "'";
				response = jQuery.makeArray($("input[name=" + qname + "]").filter(':checked').map(function () {return $(this).val();}));
			} else if (intype == 'text') {
				response = $('input[name=' + qname + ']').val();
			} else {
				response = $('input[name=' + qname + ']:checked').val();
			}
			if (response.length == 0) {
				showError = true;
			}
		}
		if (showError) {
			$('.responseError').show();
		} else {
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
		if ((questionID == 'promptA2') || (questionID == 'promptB2')) {
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
			$('#' + questionID + '_store').val($('#' + 'responseID_' + questionID).val());
			response = $('#' + 'responseID_' + questionID).val();
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
			$('#checkbox_' + questionID).hide();
			$('.emotionError').hide();
			// loop over them all
			for (var i=0; i<checkboxes.length; i++) {
				 // And stick the checked ones onto an array...
				 if (checkboxes[i].checked) {
					 $('#' + checkboxes[i].value + currentMem).show();
					 numChecked++;
				 }
			}
			$('#emotionSubmit' + currentMem).show();
			subTrial[questionID]++;
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

	function goBack() {
		if ((questionID.slice(0, -1) == 'emotion') && (subTrial[questionID] == 2)) {
			for (var i=0; i<checkboxes.length; i++) {
				 // And stick the checked ones onto an array...
				 if (checkboxes[i].checked) {
					 $('input[name=responseName_' + checkboxes[i].value + currentMem + ']').attr('checked',false);
					 $('#' + checkboxes[i].value + currentMem).hide();
				 }
			}
			$('#emotionSubmit' + currentMem).hide();
			$('#checkbox_' + questionID).show();
			subTrial[questionID]--;
		} else if ((questionID.slice(0, -1) == 'wordCloud') && (subTrial[questionID] == 2)) {
			words = [];
			for (var i = 0; i < tboxes.length; i++) {
				wordnum = i + 1;
				$('input[name=responseName_wordCloud' + currentMem + wordnum + ']').attr('checked',false);
				$('#word' + currentMem + wordnum).text('');
				$('#wordDiv' + currentMem + wordnum).hide();
			}
			$('#' + questionID + '_rating').hide();
			$('#wordSubmit' + currentMem).hide();
			$('#textbox_' + questionID).show();
			subTrial[questionID]--;
		} else {
			$('#' + questionID).hide();
			if (questionID == 'relateAB') {
				$('#responseA').hide();
				$('#responseB').hide();
				$('.columnContainer').css('border-style', 'none');
			} else if (questionID == 'promptA2') {
				$('#backButton').hide();
			}
			previousTrial();
			questionID = questionList[phase-1][curTrial-1];
			$('#' + questionID).show();
			startTime = new Date().getTime();
			returnedToTrials.push(questionID);
		}
		$('.emotionError').hide();
		$('.emotionError2').hide();
		$('.wordError').hide();
		$('.wordError2').hide();
		$('.responseError').hide();
	};

	function goForward() {
		$('#' + questionID).hide();
		trialData = {'phase':phase,
								 'trial':curTrial,
								 'question':questionID,
								 'rt':rt,
								 'timeStamp':new Date()};
		psiTurk.recordTrialData(trialData);
		nextTrial();
		if (phase > nPhases) {
			$('#container').hide();
			$('#end').show();
		} else {
			questionID = questionList[phase-1][curTrial-1];
			$('#' + questionID).show();
			startTime = new Date().getTime();
			if (questionID == 'promptA2') {
	      $('#backButton').show();
	      memStartTime['responseID_promptA2'] = startTime;
				psiTurk.recordUnstructuredData('memAStartTime', startTime);
	    } else if (questionID == 'promptB2') {
	      memStartTime['responseID_promptB2'] = startTime;
				psiTurk.recordUnstructuredData('memBStartTime', startTime);
	    }
		}
	}

	function recordKeyPresses(e) {
	  memID = this.id;
		keyPresses[memID]['txt'].push(e.which);
		keyPresses[memID]['time'].push(new Date().getTime());
  }

	function nextTrial() {
		if (curTrial == nTrials[phase-1]) {
			curTrial = 1;
			increment = true;
			while (increment) {
				phase++;
				if (phase > nPhases) {
					increment = false;
				} else {
					if (phase == 3) {
						$('.rowContainer').hide();
					}
					if (nTrials[phase-1] != 0) {
						increment = false;
					}
				}
			}
		} else {
			curTrial++;
		}

		if (phase > nPhases) {
			$('#container').hide();
			$('#backButton').hide();
			$('#end').show();
			$('#submitButton').show();
		} else {
			if (questionID == 'moreRecentAB') {
			// if (phase == 1 && trialOrder[phase-1][curTrial-1] == 11) {
				if (document.getElementsByName('responseName_moreRecentAB')[0].checked) {
					document.getElementById('moreRecent').innerHTML = '<span style="color: green">Memory A</span>';
					document.getElementById('lessRecent').innerHTML = '<span style="color: blue">Memory B</span>';
				} else {
					document.getElementById('lessRecent').innerHTML = '<span style="color: green">Memory A</span>';
					document.getElementById('moreRecent').innerHTML = '<span style="color: blue">Memory B</span>';
				}
			}
			else if (questionID == 'retrievalStrategy1') {
				if (response == '1') {
					// remove memory B prompt; we ask for the one they triggered directly.
					questionList[0].splice(questionList[0].indexOf('promptB1'), 1);
					nTrials[0]--; // total number of trials is reduced by 1
					questionList[0].splice(questionList[0].indexOf('retrievalStrategy2'), 1);
					questionList[0].splice(questionList[0].indexOf('promptB2')+1, 0, 'retrievalStrategy2');
					$('#promptB2 .innerDiv').html('Describe this other memory that was triggered by the one you just described in the text box below.');
				}
			}
			questionID = questionList[phase-1][curTrial-1];
			if (questionID == 'relateAB') {
				$('.columnContainer').css('border-style', 'solid');
				$('.columnContainer').css('border-width', '2px');
				document.getElementById('responseA').innerHTML = '<span style="color: green">Memory A:</span><br>' + $('#promptA2_store').val();
				document.getElementById('responseB').innerHTML = '<span style="color: blue">Memory B:</span><br>' + $('#promptB2_store').val();
				$('#responseA').show();
				$('#responseB').show();
			}
			$('#' + questionID).show();
			startTime = new Date().getTime();
		}

	}

	function previousTrial() {
		if ((curTrial == 1) && (phase > 1)) {
			// phase--;
			// curTrial = nTrials[phase-1];
			increment = true;
			while (increment) {
				phase--;
				if (phase == 1) {
					increment = false;
				} else {
					if (phase == 2) {
						$('.rowContainer').show();
					}
					if (nTrials[phase-1] != 0) {
						increment = false;
					}
				}
			}
			curTrial = nTrials[phase-1];
		} else {
			curTrial--;
		}
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
					psiTurk.completeHIT();
			},
			error: prompt_resubmit
		});
	};

	/***************************
  * END FUNCTION DEFINITIONS *
  ***************************/

	/* show experiment start page */
  psiTurk.showPage('memory_experiment.html');

	/* define the condition-dependent html */
	var htmlByCondition = {
													0:{
														'promptA1':'Consider the last week of your life.<br><br>Can you think of any <em>specific, memorable event </em> that happened in that time?<br><br>Try to place yourself back in that situation. Make your memory as specific as possible.<br><br>Once you have your memory in mind, click below to continue.<br>',
														'promptB1':'Think about the memory you just described.<br><br>Can you think of any other <em>specific</em> event from your life that is <em>very similar</em> to the one you just described?<br><br>Take a moment to think of this other memory.<br><br>Click to continue once you have your second memory in mind.<br>',
														'relateAB':'Let\'s call the first memory you described "<span style="color: green">Memory A</span>". We\'ll refer to the second memory you described as "<span style="color: blue">Memory B</span>". What makes <span style="color: green">Memory A</span> and <span style="color: blue">Memory B</span> similar to one another?',
														'additionalTextAB':'Is there anything else we may not have asked about that you\'d like to share regarding the similarities between the two memories? Feel free to speculate.'
														},
													1:{
														'promptA1':'Consider the last week of your life.<br><br>Can you think of any <em>specific, memorable event </em> that happened in that time?<br><br>Try to place yourself back in that situation. Make your memory as specific as possible.<br><br>Once you have your memory in mind, click below to continue.<br>',
														'promptB1':'Think about the memory you just described.<br><br>Can you think of any other <em>specific</em> event from your life that is <em>very dissimilar</em> from the one you just described?<br><br>Take a moment to think of this other memory.<br><br>Click to continue once you have your second memory in mind.<br>',
														'relateAB':'Let\'s call the first memory you described "<span style="color: green">Memory A</span>". We\'ll refer to the second memory you described as "<span style="color: blue">Memory B</span>". What makes <span style="color: green">Memory A</span> and <span style="color: blue">Memory B</span> different from one another?',
														'additionalTextAB':'Is there anything else we may not have asked about that you\'d like to share regarding the differences between the two memories? Feel free to speculate.'
														},
													2:{
														'promptA1':'Consider the last week of your life.<br><br>Can you think of any <em>specific, memorable event </em> that happened in that time?<br><br>Try to place yourself back in that situation. Make your memory as specific as possible.<br><br>Once you have your memory in mind, click below to continue.<br>',
														'promptB1':'Now we are going to ask you about another memory.<br><br>Can you think of any other <em>specific</em> event from your life?<br><br>Take a moment to think of this other memory.<br><br>Click to continue once you have your second memory in mind.<br>',
														'relateAB':'Let\'s call the first memory you described "<span style="color: green">Memory A</span>". We\'ll refer to the second memory you described as "<span style="color: blue">Memory B</span>". Is there anything about the two memories that makes them similar? Is there anything that makes them different? Please elaborate.',
														'additionalTextAB':'Is there anything else we may not have asked about that you\'d like to share regarding the differences/similarities between the two memories? Feel free to speculate.'
														}
												};

	/* populate condition-dependent DOMs */
	$('#promptA1 .innerDiv').html(htmlByCondition[mycondition]['promptA1']);
	$('#promptB1 .innerDiv').html(htmlByCondition[mycondition]['promptB1']);
	$('#promptB2 .innerDiv').html('Describe your second memory in the text box below.');
	$('#relateAB .innerDiv').html(htmlByCondition[mycondition]['relateAB']);
	$('#additionalTextAB .innerDiv').html(htmlByCondition[mycondition]['additionalTextAB']);


	var questionList = [getQuestionIDs('phase1'), getQuestionIDs('phase2'),
											getQuestionIDs('phase3'), getQuestionIDs('phase4'),
											getQuestionIDs('phase5'), getQuestionIDs('catch')]; // add question names to this list, separated by phase
	var questionID = questionList[phase-1][curTrial-1];

  /* shuffle catch trial order */
	questionList[5] = shuffle(questionList[5]);
	questionList[5] = questionList[5].slice(0, 9);

	/* shuffle phase 1 trial order after the "overallSimilarityAB" question */
	if (mycondition == 2) {
		questionList[0].splice(questionList[0].indexOf('retrievalStrategy1Alternate'), 1);
	}
	else {
		questionList[0].splice(questionList[0].indexOf('retrievalStrategy1'), 1);
	}
	var shuffleStart = questionList[0].indexOf('overallSimilarityAB') + 1;
	/* remove the "moreRecentAB", "causalAB", and "additionalTextAB" questions before shuffling phase 1 order */
	questionList[0].splice(questionList[0].indexOf('moreRecentAB'), 1);
	questionList[0].splice(questionList[0].indexOf('causalAB'), 1);
	questionList[0].splice(questionList[0].indexOf('additionalTextAB'), 1);
	questionList[0] = questionList[0].slice(0, shuffleStart).concat(shuffle(questionList[0].slice(shuffleStart)));
	/* reinsert the 'moreRecent' and 'causal' questions directly next to each other at a random location */
	insertIndex = Math.floor(Math.random() * (questionList[0].length - shuffleStart)) + shuffleStart;
	questionList[0].splice(insertIndex, 0, 'moreRecentAB', 'causalAB');
	/* reinsert the 'additionalText' question at the end */
	questionList[0].push('additionalTextAB');

	/* insert catch trial at the very end of phase 1 */
	questionList[0].push(questionList[5][0]);

	/* hardcode the positions of the catch trials in phase 2 */
	var catchIndex = [11, 22, 33, 44, 55, 66, 77, 88];

	/* remove the temporalLocation(A,B) questions from phase 2 if condition > 5 */
	if (mycondition > 5) {
		questionList[1].splice(questionList[1].indexOf('temporalLocationA'), 1);
		questionList[1].splice(questionList[1].indexOf('temporalLocationB'), 1);
	}
	/* remove the word cloud questions before shuffling phase 2 order */
	questionList[1].splice(questionList[1].indexOf('wordCloudA'), 1);
	questionList[1].splice(questionList[1].indexOf('wordCloudB'), 1);

	/* shuffle phase 2 trial order */
	/* check that shuffled phase 2 trial order doesn't have more than four consecutive questions about the same memory */
	var keepShuffling = true;
	while (keepShuffling) {
		questionList[1] = shuffle(questionList[1]);
		keepShuffling = checkShuffleP2(questionList[1]);
	}
	/* add the word cloud questions back to the end of phase 2 */
	questionList[1] = questionList[1].concat(['wordCloudA', 'wordCloudB']);

	/* insert catch trials into phase 2 */
	for (var i = 1; i < questionList[5].length; i++) {
		questionList[1].splice(catchIndex[i-1], 0, questionList[5][i]);
	}

	/* shuffle phase 3 (SAM) trial order */
	/* check that shuffled phase 3 trial order doesn't have more than four consecutive questions about the same memory type */
	keepShuffling = true;
	while (keepShuffling) {
		questionList[2] = questionList[2].slice(0, 2).concat(shuffle(questionList[2].slice(2)));
		keepShuffling = checkShuffleP3(questionList[2].slice(2));
	}

  var nTrials = [];
	for (i = 0; i < nPhases; i++) {
		nTrials.push(questionList[i].length);
	}

	/* record order of trials */
	psiTurk.recordTrialData({'trialOrder':questionList});

  $('#' + questionList[0][0]).show();
	globalStartTime = new Date().getTime();
  startTime = new Date().getTime();

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
	$('#responseID_promptA2').keyup(recordKeyPresses);
	$('#responseID_promptB2').keyup(recordKeyPresses);
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

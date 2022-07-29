var qno=0;
var ind_interval;
var color_codes;

var ind_time=new Array();
$(document).ready(function(){
			$('.spinner-border').show();
			var quid=localStorage.getItem('quid');
			
			let arg={user_token:localStorage.getItem('user_token'),id:quid};
			$.post(api_site_url+"quiz/getList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						$('#title').html('#'+value.id+ ' '+value.quiz_name);
						var quiz_name=value.quiz_name;
						$('#quizName').html(quiz_name.substr(0,25));
					});
				}
				
			let arg={user_token:localStorage.getItem('user_token'),quid:quid};			
			$.post(api_site_url+"quiz/validateQuiz",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data.ind_time.split(',')).each(function(i,t){
						ind_time[i]=parseInt(t);
					});
					 
					countDown(parseInt(result.maximum_datetime));
					const assigned_qids=result.data.assigned_qids;
					localStorage.setItem('rid',result.rid);
					var rid=result.rid;
					var uid=result.data.uid;
					var response_time=result.data.response_time;
					color_codes=result.data.color_codes.split(',');
			let arg={user_token:localStorage.getItem('user_token'),quid:quid,rid:rid,uid:uid,assigned_qids:assigned_qids,response_time:response_time};			
			$.post(api_site_url+"quiz/getQuestions",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					
					let questionContainer=$('#question-container').html();
					$('#question-container').html("");
					$(result.data).each(function(index,value){
						let color_codes_css="notvisited";
						try{
							color_codes_css=color_codes[index];
						}catch(ex){
							
						}
						let btn="<button type='button' class='qbtn "+color_codes_css+"' id='qbtn-"+index+"' data-qid='"+index+"'>"+(index+1)+"</button>";
						$('.question-number-holder').append(btn);
						let questionData=questionContainer;
						questionData=questionData.replace("QQNO", "Q"+(index+1)+"");
						questionData=questionData.replace(/QNO/g, index);
						questionData=questionData.replace("QUESTION",atob(value.question.question));
						questionData=questionData.replace("QTYP",value.question.question_type);
						let options="";
						if(value.options){
							$(value.options).each(function(i,v){
								 
								let selected="";
								if(value.user_response.indexOf(v.id) != -1)
								{  
								   selected=" checked ";
								}
								console.log(selected);
								if(value.question.question_type=="Multiple Choice Single Answer"){
								options=options+"<div class='option'><input type='radio' name='option-"+index+"' class='option-"+index+"' value='"+v.id+"' data-qno='"+index+"' onClick='answeredBtn(this);' "+selected+" > "+atob(v.question_option)+"  </div>";
								}
								if(value.question.question_type=="Multiple Choice Multiple Answers"){
								options=options+"<div class='option'><input type='checkbox' name='option-"+index+"' class='option-"+index+"' value='"+v.id+"'  data-qno='"+index+"'  onClick='answeredBtn(this);' "+selected+"> "+atob(v.question_option)+"  </div>";
								}
							});
							
						}
						 if(value.question.question_type=="Short Answer"){
							 if(value.user_response==""){
								 	 options=options+"<div class='option'><input type='text' name='option-"+index+"' class='option-"+index+" short-answer-textbox'   data-qno='"+index+"'  onKeyup='answeredBtnText(this);'  value='' placeholder='Type your answer here' autocomplete=off >  </div>";
							
							 }else{
									 options=options+"<div class='option'><input type='text' name='option-"+index+"' class='option-"+index+" short-answer-textbox'  data-qno='"+index+"' onKeyup='answeredBtnText(this);' value='"+value.user_response+"' placeholder='Type your answer here' autocomplete=off >  </div>";
							 
							 }
							}

							if(value.question.question_type=="Long Answer"){
								if(value.user_response==""){
								options=options+"<div class='option'><textarea name='option-"+index+"' class='option-"+index+" long-answer-textbox'   data-qno='"+index+"' onKeyup='answeredBtnText(this);' ></textarea>  </div>";
							
								}else{
									options=options+"<div class='option'><textarea name='option-"+index+"' class='option-"+index+" long-answer-textbox'   data-qno='"+index+"' onKeyup='answeredBtnText(this);'  >"+value.user_response+"</textarea>  </div>";
								
								}
							}
							if(value.question.question_type=="Multiple Choice Single Answer"){
								options=options+"<br><a href='javascript:clearResponse();' style='font-size:12px;'>Clear Response</a>";
							}
							questionData=questionData.replace("OPTION",options);
						$('#question-container').append(questionData);
					});
					let h=parseInt(((window.innerHeight)*40)/100);
					$('.question').css('height',h+"px");
					$('.options').css('height',h+"px");
					$(document).on('click','.qbtn',function(){
						let i=$(this).attr('data-qid');
						 
						showQuestion(i);
						qno=parseInt(i);
						if($('.question-body').length == (qno+1)){
							$('#nextQBtn').hide();
							$('#saveQBtn').show();
						}else{
							$('#nextQBtn').show();
							$('#saveQBtn').hide();
						}
						if(qno==0){
							$('#backQBtn').attr('disabled',true);
						}else{
							$('#backQBtn').attr('disabled',false);
						}
					});
					
					showQuestion(0);
					ind_interval=setInterval(function(){
						ind_time[qno] +=1;
						$('#ind-timer-'+qno).html(ind_time[qno]+" Sec");
						$('#ind_time-'+qno).val(ind_time[qno]);
						 
					},1000);
					
				}else{
					flashMessage(result.message);
					 
				}
				$('#main-area-quiz').show();
				$('.spinner-border').hide();
				applyMathajax();
			});
			
					
					
					
					
				}else{
					flashMessage(result.message);
					setTimeout(function(){
						window.location="dashboard.html";
					},8000);
					$('.spinner-border').hide();
				}
				
				
			});
			
			
			});
	

	
	
});



function showQuestion(n){
	
	$('.question-body').hide();
	$('#qn-'+n).show();
	 if($('#qbtn-'+n).hasClass('notvisited')){
		 console.log('notvisited'+n);
		$('#qbtn-'+n).removeClass('answered');
		$('#qbtn-'+n).removeClass('reviewlater');
		$('#qbtn-'+n).removeClass('notvisited');
		$('#qbtn-'+n).addClass('notanswered');
		 
		color_codes[n]="notanswered";
		
	 }
	
}


function clearResponse(){
	$('.option-'+qno).each(function(){
		$(this)[0].checked=false;
	});
		
		$('#qbtn-'+qno).removeClass('answered');
		$('#qbtn-'+qno).removeClass('reviewlater');
		$('#qbtn-'+qno).removeClass('notvisited');
		$('#qbtn-'+qno).addClass('notanswered');
		 
		color_codes[qno]="notanswered";	
}

function answeredBtn(e){
	if($(e)[0].checked == true){
		$('#qbtn-'+qno).removeClass('notanswered');
		$('#qbtn-'+qno).removeClass('reviewlater');
		$('#qbtn-'+qno).removeClass('notvisited');
		$('#qbtn-'+qno).addClass('answered');
		color_codes[qno]="answered";
	}else{
			let jj=0;
			$('.option-'+qno).each(function(){
				if($(this)[0].checked == true){
						jj +=1;
				}
			});
			if(jj==0){
					$('#qbtn-'+qno).removeClass('answered');
					$('#qbtn-'+qno).removeClass('reviewlater');
					$('#qbtn-'+qno).removeClass('notvisited');
					$('#qbtn-'+qno).addClass('notanswered');
					color_codes[qno]="notanswered";	
			}
	}
}
function answeredBtnText(e){
	if($(e).val() != ""){
		$('#qbtn-'+qno).removeClass('notanswered');
		$('#qbtn-'+qno).removeClass('reviewlater');
		$('#qbtn-'+qno).removeClass('notvisited');
		$('#qbtn-'+qno).addClass('answered');
		color_codes[qno]="answered";
	}else{
		$('#qbtn-'+qno).removeClass('answered');
		$('#qbtn-'+qno).removeClass('reviewlater');
		$('#qbtn-'+qno).removeClass('notvisited');
		$('#qbtn-'+qno).addClass('notanswered');
		color_codes[qno]="notanswered";		
	}
}

function reviewLater(){
		$('#qbtn-'+qno).removeClass('answered');
		$('#qbtn-'+qno).removeClass('notanswered');
		$('#qbtn-'+qno).removeClass('notvisited');
		if(!$('#qbtn-'+qno).hasClass('reviewlater')){
			$('#qbtn-'+qno).addClass('reviewlater');
			color_codes[qno]="reviewlater";	
				 
		}else{
			$('#qbtn-'+qno).removeClass('reviewlater');
			$('#qbtn-'+qno).addClass('notanswered');
		}
		

}


function nextQ(){
	
	qno+=1;
	
	showQuestion(qno);
	
						if($('.question-body').length == (qno+1)){
							$('#nextQBtn').hide();
							$('#saveQBtn').show();
						}else{
							$('#nextQBtn').show();
							$('#saveQBtn').hide();
						}
	if(qno==0){
	$('#backQBtn').attr('disabled',true);
	}else{
	$('#backQBtn').attr('disabled',false);
	}	
	saveQ();
	
}




function backQ(){
	
	qno-=1;
	showQuestion(qno);
						if($('.question-body').length == (qno+1)){
							$('#nextQBtn').hide();
							$('#saveQBtn').show();
						}else{
							$('#nextQBtn').show();
							$('#saveQBtn').hide();
						}
	if(qno==0){
	$('#backQBtn').attr('disabled',true);
	}else{
	$('#backQBtn').attr('disabled',false);
	}	
}



function saveQ(){
	const rid=localStorage.getItem('rid');

	fData=JSON.stringify($('#quizForm').serializeArray()); 
	 		var quid=localStorage.getItem('quid');
			var color_codes_p=color_codes.join('-');
			let arg={user_token:localStorage.getItem('user_token'),quid:quid,rid:rid,fData:fData,color_codes_p:color_codes_p};
			$.post(api_site_url+"quiz/saveAnswer",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$('#answerSavedStatusSuccess').show();
					setTimeout(function(){
						$('#answerSavedStatusSuccess').hide();
					},3000);
					
				}else{
					$('#answerSavedStatusFailed').show();
						setTimeout(function(){
						$('#answerSavedStatusFailed').hide();
					},3000);
					
				}
			});				
}



function submitQuizWarning(){
	$('#submitWarning').modal('show');
}


function closeSubmitQuiz(){
	$('#submitWarning').modal('hide');
}


function saveQL(){
		setTimeout(function(){
			saveQ();
		},1000);
}

function submitQuiz(){
	const rid=localStorage.getItem('rid');

	 		var quid=localStorage.getItem('quid');
			let arg={user_token:localStorage.getItem('user_token'),quid:quid,rid:rid};
			$.post(api_site_url+"quiz/submitQuiz/"+rid+"/User",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					flashMessage(result.message);
					$('#submitWarning').modal('hide');
					$('#main-area-quiz').hide();
					setTimeout(function(){
						window.location="dashboard.html";
					},5000);
				}else{
					flashMessage(result.message);
					$('#submitWarning').modal('hide');
				}
			});		
}

var x;

function countDown(ms){
	
	// Set the date we're counting down to
var countDownDate = new Date(ms).getTime();

// Update the count down every 1 second
x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("timer").innerHTML = hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "0";
	submitQuiz();
  }
}, 1000);

}


function toggleRightBar(){
	$('.mobile-right-bar').toggle();
}



	
function updateOnlineStatus(){
	
   $.ajax({
    url: api_site_url+"login/checkInternet",
    timeout: 10000,
    error: function(jqXHR) { 
        if(jqXHR.status==0) {
            $('#connectionStatus').html("Internet disconnected <a href='javascript:updateOnlineStatus();' style='color:#fdfafa;' ><i class='fa fa-sync-alt'></i></a>");  $('#connectionStatus').removeClass('connected'); $('#connectionStatus').addClass('notConnected'); 
  
        }
    },
    success: function() {
          $('#connectionStatus').html("Connected with internet"); $('#connectionStatus').addClass('connected'); $('#connectionStatus').removeClass('notConnected');

    }
	});


}




function applyMathajax(){
try{ MathJax.Hub.Typeset(); }catch(ex){ console.log(ex); }
}


var checkInternet=setInterval(function(){
	updateOnlineStatus();
},30000);


 

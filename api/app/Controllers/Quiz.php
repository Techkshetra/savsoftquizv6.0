<?php namespace App\Controllers;
use CodeIgniter\HTTP\RequestInterface;

class Quiz extends BaseController
{
	 
	 
    public function __construct()
    {
         
    }

	
	public function remove(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$id = $this->request->getVar('id');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('quizRemove');
		if($authAccess != "success"){ return $authAccess; } 
		if($id==null){ $id='';	}
			$where="";
				if($id != ''){
						$where=" and sq_quiz.id='".$id."' ";
				}
				$sql=" update sq_quiz set trash_status='1' where sq_quiz.trash_status='0' $where ";
				$query = $db1->query($sql);
				$json_arr['status']="success"; 	$json_arr['message']="Quiz removed successfully";
			 
		
			 return json_encode($json_arr);	
			
		
	}
 	
 
 	public function getList(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$search = $this->request->getVar('search');
		if($search==null){ $search='';	}
		$id = $this->request->getVar('id');
		if($id==null){ $id='';	}
		$limit = $this->request->getVar('limit');
		$maxRowsPerPage = $this->request->getVar('maxRowsPerPage');
		if($limit==null){ $limit=0;	}
		if($maxRowsPerPage==null){ $maxRowsPerPage=30;	}
		
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('quizList');
		if($authAccess != "success"){ return $authAccess; } 
		if($search==''){
		$where="";
			if($id != ''){
					$where=" and sq_quiz.id='".$id."' ";
			}

		$query = $db2->query("select sq_quiz.* from sq_quiz where  sq_quiz.trash_status='0'  $where order by sq_quiz.id desc limit $limit, $maxRowsPerPage");
		}else{
		$query = $db2->query("select sq_quiz.* from sq_quiz where  sq_quiz.trash_status='0' and sq_quiz.quiz_name like '%$search%'  order by sq_quiz.id desc limit $limit, $maxRowsPerPage");
			
		}
		
		$result=$query->getResultArray();
		if(count($query->getResultArray()) >= 1){
			$json_arr['status']="success"; 	$json_arr['message']="";
			$json_arr['data']=$result;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="No record found ";
		}
		
		 return json_encode($json_arr); 	
	}
	
 	public function getMyList(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$search = $this->request->getVar('search');
		if($search==null){ $search='';	}
		$id = $this->request->getVar('id');
		if($id==null){ $id='';	}
		$limit = $this->request->getVar('limit');
		$maxRowsPerPage = $this->request->getVar('maxRowsPerPage');
		if($limit==null){ $limit=0;	}
		if($maxRowsPerPage==null){ $maxRowsPerPage=30;	}
		
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('myQuiz');
		if($authAccess != "success"){ return $authAccess; } 
		$query = $db2->query("select id, group_ids from sq_user where  user_token='$user_token' ");
		$user=$query->getRowArray();			
		$group_ids=$user['group_ids'];
		
		if($search==''){
		$where="";
			if($id != ''){
					$where=" and sq_quiz.id='".$id."' ";
			}
		$sql="select sq_quiz.* from sq_quiz where  sq_quiz.trash_status='0' and FIND_IN_SET($group_ids,gids) $where order by sq_quiz.id desc limit $limit, $maxRowsPerPage";
		$query = $db2->query($sql);
		}else{
			$sql="select sq_quiz.* from sq_quiz where  sq_quiz.trash_status='0' and FIND_IN_SET($group_ids,gids) and sq_quiz.quiz_name like '%$search%'  order by sq_quiz.id desc limit $limit, $maxRowsPerPage";
			
		$query = $db2->query($sql);
			
		}
		
		$result=$query->getResultArray();
		if(count($query->getResultArray()) >= 1){
			$json_arr['status']="success"; 	$json_arr['message']="";
			$json_arr['data']=$result;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="No record found ";
		}
		
		 return json_encode($json_arr); 	
	}
	
	
	
	public function add(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('quizList');
		if($authAccess != "success"){ return $authAccess; } 

		$fData=json_decode($this->request->getVar('fData'));
		if(isset($fData[0])){
			$fData=$this->makeRequiredArrayFormat($fData);
		}
		$gids=0;
		if(is_array($fData['gids'])){
			$gids=implode(',',$fData['gids']);
		}else{
			$gids=$fData['gids'];
		}
		$userdata=array(
		'quiz_name'=>$fData['quiz_name'],
		'description'=>$fData['description'],
		'start_datetime'=>strtotime(str_replace("T"," ",$fData['start_datetime'])),
		'end_datetime'=>strtotime(str_replace("T"," ",$fData['end_datetime'])),
		'gids'=>$gids,
		'max_attempt'=>$fData['max_attempt'],
		'min_pass_percentage'=>$fData['min_pass_percentage'],
		'correct_score'=>$fData['correct_score'],
		'incorrect_score'=>$fData['incorrect_score'],
		'instant_result'=>$fData['instant_result'],
		'duration'=>$fData['duration'],
		'show_result'=>$fData['show_result'],
		'show_result_on_date'=>strtotime(str_replace("T"," ",$fData['show_result_on_date']))		
		);
		
		if($db1->table('sq_quiz')->insert($userdata)){
			$id=$db1->insertID();
			$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Quiz added successfully"; return json_encode($json_arr); 
				
		}else{
			$msg=$db1->error();
			$json_arr['status']="failed"; 	$json_arr['message']=$msg; return json_encode($json_arr); 
		}
		return json_encode($json_arr);
	}
	
	




	public function edit(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$id = $this->request->getVar('id');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('quizList');
		if($authAccess != "success"){ return $authAccess; } 

		$fData=json_decode($this->request->getVar('fData'));
		if(isset($fData[0])){
			$fData=$this->makeRequiredArrayFormat($fData);
		}
		$userdata=array(
		'quiz_name'=>$fData['quiz_name'],
		'description'=>$fData['description'],
		'start_datetime'=>strtotime(str_replace("T"," ",$fData['start_datetime'])),
		'end_datetime'=>strtotime(str_replace("T"," ",$fData['end_datetime'])),
		'gids'=>implode(',',$fData['gids']),
		'max_attempt'=>$fData['max_attempt'],
		'min_pass_percentage'=>$fData['min_pass_percentage'],
		'correct_score'=>$fData['correct_score'],
		'incorrect_score'=>$fData['incorrect_score'],
		'instant_result'=>$fData['instant_result'],
		'duration'=>$fData['duration'],
		'show_result'=>$fData['show_result'],
		'show_result_on_date'=>strtotime(str_replace("T"," ",$fData['show_result_on_date']))		
		);
		$builder = $db1->table('sq_quiz');
		$builder->where('id',$id);
		$builder->update($userdata);		
		$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Quiz added successfully"; return json_encode($json_arr); 
		 
	}
	
	public function addQuestionIntoQuiz(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$quid = $this->request->getVar('quid');
		$qid = $this->request->getVar('qid');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('addQuestionIntoQuiz');
		if($authAccess != "success"){ return $authAccess; } 
		$query = $db2->query("select qids from sq_quiz where  id='$quid' ");
		$row=$query->getRowArray();	
		$qids=explode(',',$row['qids']);
		$qids[]=$qid;
		$qids=array_filter($qids);
		$qids=array_unique($qids);
		$qids=implode(',',$qids);
		$db1->query("update sq_quiz set qids='$qids' where  id='$quid' ");
		
	}
	
	
		public function removeQuestionIntoQuiz(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$quid = $this->request->getVar('quid');
		$qid = $this->request->getVar('qid');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('addQuestionIntoQuiz');
		if($authAccess != "success"){ return $authAccess; } 
		$query = $db2->query("select qids from sq_quiz where  id='$quid' ");
		$row=$query->getRowArray();	
		$qids=explode(',',$row['qids']);
		foreach($qids as $k => $v){
			if($v==$qid){
				unset($qids[$k]);
			}
		}
		$qids=array_filter($qids);
		$qids=array_unique($qids);
		$qids=implode(',',$qids);
		$db1->query("update sq_quiz set qids='$qids' where  id='$quid' ");
		
	}
	
	public function changeQidsOrder(){
	 
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$quid = $this->request->getVar('quid');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('addQuestionIntoQuiz');
		if($authAccess != "success"){ return $authAccess; } 
		$query = $db2->query("select * from sq_quiz where  id='$quid' ");
		$quiz=$query->getRowArray();
		$assigned_gids=array();
		foreach(json_decode($_POST['assigned_qids'])  as $k => $v){
			$assigned_gids[$k]=$v;
		}
		$assigned_gids=implode(',',$assigned_gids);
		$db1->query("update sq_quiz set qids='$assigned_gids' where  id='$quid' ");
		$json_arr['status']="success";  	$json_arr['message']="Order updated successfully"; return json_encode($json_arr); 
		
	}
	
	public function validateQuiz(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$quid = $this->request->getVar('quid');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('attemptQuiz');
		if($authAccess != "success"){ return $authAccess; } 
		$query = $db2->query("select * from sq_quiz where  id='$quid' ");
		$quiz=$query->getRowArray();
		$assigned_gids=explode(',',$quiz['gids']);
		$max_attempt=$quiz['max_attempt'];
		$duration=$quiz['duration'];
		$end_datetime=$quiz['end_datetime'];
		$start_datetime=$quiz['start_datetime'];
		$qids=$quiz['qids'];
		$query = $db2->query("select id, group_ids from sq_user where  user_token='$user_token' ");
		$user=$query->getRowArray();			
		$uid=$user['id'];
		$group_ids=$user['group_ids'];
		$result=array();
		$query = $db2->query("select * from sq_result where quid='$quid' and uid='$uid' and result_status='Open' ");
		$query2 = $db2->query("select id from sq_result where quid='$quid' and uid='$uid' ");
		if(count($query->getResultArray()) == 0){
			// validate 
			if(!in_array($group_ids,$assigned_gids)){
				$json_arr['status']="failed"; 	$json_arr['message']="Quiz is not assigned to your group"; return json_encode($json_arr); 
			}				
			if($end_datetime < time()){
				$json_arr['status']="failed"; 	$json_arr['message']="Quiz has been ended. Please check end date-time"; return json_encode($json_arr); 
			}				
			if($start_datetime > time()){
				$json_arr['status']="failed"; 	$json_arr['message']="Quiz is not available yet. Please check start date-time"; return json_encode($json_arr); 
			}				
			if(count($query2->getResultArray()) >= $max_attempt){
				$json_arr['status']="failed"; 	$json_arr['message']="You have reached maximum attempt available (".count($query2->getResultArray())."/".$max_attempt.") for this quiz"; return json_encode($json_arr); 
			}
			// generate rseult id (rid) 
			$userdata=array();
			$userdata['quid']=$quid;
			$userdata['uid']=$uid;
			$userdata['attempted_datetime']=time();
			$maximum_datetime=(time()+($duration*60))*1000;
			$userdata['result_status']="Open";
			$userdata['assigned_qids']=$qids;
			$qids_status=array();
			$ind_score=array();
			$ind_time=array();
			foreach(explode(',',$qids) as $k => $v){
				$qids_status[]=0;
				$color_codes[]="notvisited";
			}
			foreach(explode(',',$qids) as $k => $v){
				$ind_score[]=0;
			}
			foreach(explode(',',$qids) as $k => $v){
				$ind_time[]=0;
			}
			$userdata['qids_status']=implode(',',$qids_status);
			$userdata['ind_score']=implode(',',$ind_score);
			$userdata['obtained_score']="0";
			$userdata['color_codes']=implode(',',$color_codes);
			$userdata['obtained_percentage']="0";
			$userdata['time_spent']="0";
			$userdata['ind_time']=implode(',',$ind_time);
			if($db1->table('sq_result')->insert($userdata)){
				$rid=$db1->insertID();
				$json_arr['status']="success"; $json_arr['rid']=$rid;	$json_arr['message']=""; $json_arr['maximum_datetime']=$maximum_datetime; $json_arr['data']=$userdata; return json_encode($json_arr); 
			}			
		}else{
			$result=$query->getRowArray();	
			$rid=$result['id'];
		// validate end time and duration 
			$time_spent=time()-$result['attempted_datetime'];
			if($time_spent >= ($duration*60)){
				$this->submitQuiz($rid,'System');
				$json_arr['status']="failed"; 	$json_arr['message']="Time over!"; return json_encode($json_arr); 
			}
			$tim=time();
			$db1->query("update sq_result set last_ping='$tim' where  id='$rid' ");
			$maximum_datetime=($result['attempted_datetime']+($duration*60))*1000;
			
			$json_arr['status']="success"; $json_arr['rid']=$rid;	$json_arr['message']=""; $json_arr['maximum_datetime']=$maximum_datetime; $json_arr['data']=$result; return json_encode($json_arr); 
			
		}
		
	}
	
	
	public function submitQuiz($rid,$rby='System'){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');		
		$query = $db2->query("select * from sq_result where id='$rid'  ");
		$result=$query->getRowArray();	
		$ind_score=explode(',',$result['ind_score']);
		$ind_time=explode(',',$result['ind_time']);
		$attempted_datetime=$result['attempted_datetime'];
		$quid=$result['quid'];
		$query = $db2->query("select * from sq_quiz where  id='$quid' ");
		$quiz=$query->getRowArray();
		$assigned_gids=explode(',',$quiz['gids']);
		$max_attempt=$quiz['max_attempt'];
		$duration=$quiz['duration'];
		$end_datetime=$quiz['end_datetime'];
		$start_datetime=$quiz['start_datetime'];

		$qids=$quiz['qids'];
		$correct_score=explode(',',$quiz['correct_score']);
		$nc=array();
		if(count($correct_score) <= 1){
			foreach(explode(',',$qids) as $k => $v){
				$nc[]=$correct_score[0];
			}
		}
		$max_score=array_sum($nc);
		$obtained_score=array_sum($ind_score);
		$min_pass_percentage=$quiz['min_pass_percentage'];
		$obtained_percentage=round(((array_sum($ind_score)/$max_score)*100),2);
			$result_status='Open';
		if($min_pass_percentage <= $obtained_percentage){
			$result_status="Pass";
		}else{
			$result_status="Fail";
			
		}
		$tim=time();
		 $time_spent=array_sum($ind_time);
		 if($rby=='User'){
			$time_spent=time()-$attempted_datetime; 
		 }
		$db1->query("update sq_result set obtained_percentage='$obtained_percentage', result_status='$result_status', result_generated_time='$tim', time_spent='$time_spent', obtained_score='$obtained_score',  result_generated_by='$rby' where  id='$rid' ");
		if($rby != "System"){
			$json_arr['status']="success"; $json_arr['rid']=$rid;	$json_arr['message']="Quiz submitted successfully";  return json_encode($json_arr); 
			
		}			
	}
	
	
	
	public function getQuestions(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$quid = $this->request->getVar('quid');
		$rid = $this->request->getVar('rid');
		$uid = $this->request->getVar('uid');
		$response_time = $this->request->getVar('response_time');
		$assigned_qids = $this->request->getVar('assigned_qids');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$query = $db2->query("select id, question_type, question, category_ids from sq_question where id in ($assigned_qids) and trash_status='0' ORDER BY FIELD(id, $assigned_qids) ");
		$result=$query->getResultArray();	
		$questions=$result;
		$sql3="select id, question_id, user_response from sq_answer where  rid='$rid' and quid='$quid' and uid='$uid' and response_time='$response_time' ORDER BY FIELD(id, $assigned_qids)  ";
		$query3 = $db2->query($sql3);
		$answers=$query3->getResultArray();	
		$user_response=array();
		foreach($answers as $ak => $answer){
			$user_response[$answer['question_id']][]=$answer['user_response'];
		}
		 
		 
		$query = $db2->query("select id, question_id, question_option from sq_option where question_id in ($assigned_qids) and trash_status='0' ORDER BY FIELD(question_id, $assigned_qids) ");
		$result=$query->getResultArray();	
		$options=$result;
		$ques_arr=array();
		foreach($questions as $k => $val){
			$val['question']=base64_encode($val['question']);
			$ques_arr[$k]['question']=$val;
			if(isset($user_response[$val['id']])){
			$ques_arr[$k]['user_response']=$user_response[$val['id']];				
			}else{
			$ques_arr[$k]['user_response']="";
			}
			if($val['question_type']=="Multiple Choice Single Answer" || $val['question_type']=="Multiple Choice Multiple Answers"){
			foreach($options as $ok => $oval){
				if($oval['question_id']==$val['id']){
					$oval['question_option']=base64_encode($oval['question_option']);
					$ques_arr[$k]['options'][]=$oval;	
				}
			}
		 }
		}
		$json_arr['status']="success"; 	$json_arr['message']=""; $json_arr['data']=$ques_arr; return json_encode($json_arr); 
					
		
	}
	
	
	public function saveAnswer(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$quid = $this->request->getVar('quid');
		$color_codes_p = $this->request->getVar('color_codes_p');
		
		$rid = $this->request->getVar('rid');
		$query = $db2->query("select id from sq_user where  user_token='$user_token' ");
		$user=$query->getRowArray();			
		$uid=$user['id'];
		$attempted_questions=array();
		$fData=json_decode($this->request->getVar('fData'));
		if(isset($fData[0])){
			$fData=$this->makeRequiredArrayFormat($fData);
		}

		
		$query = $db2->query("select * from sq_result where id='$rid' ");
		$result=$query->getRowArray();
		$ind_score=array();
		$ind_time=array();
		$answers=array();
		$assigned_qids=$result['assigned_qids'];
		$query = $db2->query("select * from sq_quiz where  id='$quid' ");
		$quiz=$query->getRowArray();

		$correct_score=explode(',',$quiz['correct_score']);
		$nc=array();
		if(count($correct_score) <= 1){
			foreach(explode(',',$assigned_qids) as $k => $v){
				$nc[]=$correct_score[0];
			}
		}
		
		$incorrect_score=explode(',',$quiz['incorrect_score']);
		$nic=array();
		if(count($incorrect_score) <= 1){
			foreach(explode(',',$assigned_qids) as $k => $v){
				$nic[]=$incorrect_score[0];
			}
		}
		$qids=explode(',',$assigned_qids);
		$flipped_qids=array_flip($qids);
		$query = $db2->query("select id, question_id, question_option, score from sq_option where question_id in ($assigned_qids) and trash_status='0' ORDER BY FIELD(question_id, $assigned_qids) ");
		$options=$query->getResultArray();
		$new_op=array();
		$new_ops=array();
		foreach($options as $ok => $op){
			$new_op[$op['id']]=$op['score'];
			$new_ops[$flipped_qids[$op['question_id']]]=$op['question_option'];
		}
		foreach(explode(',',$assigned_qids) as $k => $val){
			if(isset($fData['ind_time-'.$k])){
				$ind_time[]=$fData['ind_time-'.$k];
			}else{
				$ind_time[]=0;
			}
			if(isset($fData['option-'.$k])){
				$answers[]=$fData['option-'.$k];
				if($fData['option-'.$k] != ""){
				$attempted_questions[$k]=1;
				}else{
					$attempted_questions[$k]=0;
				}
			}else{
				$answers[]=0;
				$attempted_questions[$k]=0;
			}
			
			 
		}
		
		
		 $tim=time();
		$score_collected=array();
		// print_r($answers);
		//print_r($new_op);
	
		foreach($answers as $k => $val){
			if($fData['question_type-'.$k]=="Multiple Choice Single Answer" || $fData['question_type-'.$k]=="Multiple Choice Multiple Answers"){
				if($val == 0){
					$score_collected[$k]="NA";
				}else{
					if(!is_array($val)){
						$score_collected[$k]=$new_op[trim($val)];
					}else{
						foreach($val as  $vk => $vv){
							if(isset($score_collected[$k])){
								$score_collected[$k] += $new_op[trim($vv)];	
							}else{
								 
								 
								$score_collected[$k]=$new_op[trim($vv)];	
							}
						}
					}
				}
			}
			
			if($fData['question_type-'.$k]=="Short Answer"){
				 
				$correct_Answer=explode(',',$new_ops[$k]);
				$correct_Answer_lower=array();
				foreach($correct_Answer as $ck => $cv){
					$correct_Answer_lower[]=strtolower($cv);
				}
				if(in_array(strtolower($val),$correct_Answer_lower)){
					$score_collected[$k]=1;
				}else{
					$score_collected[$k]=0;
				}
			}
			 
			if($fData['question_type-'.$k]=="Long Answer"){
				 
				$score_collected[$k]=0;
			}
			 
			if($val != '0'){
				 
				if(!is_array($val)){
					
					$userdata=array(
					'rid'=>$rid,
					'quid'=>$quid,
					'uid'=>$uid,
					'question_id'=>$qids[$k],
					'user_response'=>$val,
					'response_time'=>$tim
					);
					
					if($db1->table('sq_answer')->insert($userdata)){
					}
					
				}else{
					
					foreach($val as $vjk => $vj){
					$userdata=array(
					'rid'=>$rid,
					'quid'=>$quid,
					'uid'=>$uid,
					'question_id'=>$qids[$k],
					'user_response'=>$vj,
					'response_time'=>$tim
					);
					if($db1->table('sq_answer')->insert($userdata)){
					}
					}					
				}
				
			}
		}
		foreach($score_collected as $k => $sc){
			$sc=trim($sc);
			if($sc=="NA"){
				$ind_score[$k]=0;   
			}else if($sc == 1){
				$ind_score[$k]=$nc[$k];  
			}else{
				$ind_score[$k]=$nic[$k];       
			}
			  
			
		}
		 
		  
		$ind_time=implode(',',$ind_time);
		$ind_score=implode(',',$ind_score);
		$attempted_questions=implode(',',$attempted_questions);
		$color_codes=str_replace('-',',',$color_codes_p);
		$db1->query("update sq_result set ind_time='$ind_time', ind_score='$ind_score', attempted_questions='$attempted_questions', response_time='$tim', color_codes='$color_codes' where  id='$rid' ");
		$json_arr['status']="success"; 	$json_arr['message']="";   return json_encode($json_arr); 
				
		
	}
	
	public function updateScore(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$id = $this->request->getVar('id');
		$qno = $this->request->getVar('qno');
		$score = $this->request->getVar('score');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('updateScore');
		if($authAccess != "success"){ return $authAccess; } 
		$where="";
			if($id != ''){
					$where=" and sq_result.id='".$id."' ";
			}

		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_quiz.duration, sq_quiz.correct_score, sq_quiz.incorrect_score, sq_user.username,   sq_user.email,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open'  $where  ");
		 
		
		$result=$query->getRowArray();
		$ind_score=explode(',',$result['ind_score']);
		
		$attempted_questions=explode(',',$result['attempted_questions']);
	 
		
			$ind_score[$qno]=$score;
			$attempted_questions[$qno]=1;
			$attempted_questions=implode(',',$attempted_questions);
			$ind_score=implode(',',$ind_score);
			$sql="update sq_result set  ind_score='$ind_score', attempted_questions='$attempted_questions'  where  id='$id' ";
			 
			$db1->query($sql);
		$this->submitQuiz($id,'System');
		$json_arr['status']="success"; 	$json_arr['message']="Score updated successfully";   return json_encode($json_arr); 
		
	}

	
	public function makeRequiredArrayFormat($arr){
		
		$narr=array();
		foreach($arr as $k => $val){
		
			if(isset($narr[$val->name])){
				if(is_array($narr[$val->name])){
				$narr[$val->name][]=$val->value;
				}else{
				$narr[$val->name]=array($narr[$val->name],$val->value);
				}
			}else{
			$narr[$val->name]=$val->value;
			}
			
		}
		return $narr;
	}
	
	
	
	
 	public function validateToken(){
		$db = \Config\Database::connect('readDB');
		$user_token = $this->request->getVar('user_token');
		$query=$db->query(" select id from sq_user where user_token='$user_token' ");
		if(count($query->getResultArray()) == 0){
			 $json_arr['status']="failed"; 	$json_arr['message']="Invalid token, Re-login"; return json_encode($json_arr);
		}
		
		return "success";	
		
	}
	
	public function authAccess($dataRequested=''){
		$db = \Config\Database::connect('readDB');
		$user_token = $this->request->getVar('user_token');
		$query=$db->query(" select id,account_type_id from sq_user where user_token='$user_token' ");
		$row=$query->getRowArray();
		$account_type_id=$row['account_type_id'];
		$sql=" select * from sq_account_type where id='$account_type_id' and (FIND_IN_SET('$dataRequested',access_permissions) || FIND_IN_SET('all',access_permissions))  ";
		$query=$db->query($sql);
		if(count($query->getResultArray()) == 0){
			 $json_arr['status']="failed"; 	$json_arr['message']="Permission denied to access requested data with given user's token"; return json_encode($json_arr);
		}
		return "success";
		
	}

	


 
 
 
 
}
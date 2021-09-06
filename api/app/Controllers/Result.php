<?php namespace App\Controllers;
use CodeIgniter\HTTP\RequestInterface;

class Result extends BaseController
{
	 
	 
    public function __construct()
    {
         
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
		$authAccess=$this->authAccess('resultList');
		if($authAccess != "success"){ return $authAccess; } 
		if($search==''){
		$where="";
			if($id != ''){
					$where=" and sq_result.id='".$id."' ";
			}

		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_user.username,   sq_user.email,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open'  $where order by sq_result.id desc limit $limit, $maxRowsPerPage");
		}else{
		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_user.username,   sq_user.email,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open'  and (sq_quiz.quiz_name like '%$search%' or sq_result.id like '%$search%'  or sq_user.username like '%$search%'   or sq_user.email like '%$search%'     or sq_user.full_name like '%$search%'  ) order by sq_result.id desc limit $limit, $maxRowsPerPage");
			
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
		$authAccess=$this->authAccess('myResult');
		if($authAccess != "success"){ return $authAccess; } 
		
		$query = $db2->query("select id, group_ids from sq_user where  user_token='$user_token' ");
		$user=$query->getRowArray();			
		$uid=$user['id'];
		
		if($search==''){
		$where="";
			if($id != ''){
					$where=" and sq_result.id='".$id."' ";
			}

		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_user.username,   sq_user.email,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open' and sq_result.uid='$uid'  $where order by sq_result.id desc limit $limit, $maxRowsPerPage");
		}else{
		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_user.username,   sq_user.email,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open' and sq_result.uid='$uid'  and (sq_quiz.quiz_name like '%$search%' or sq_result.id like '%$search%'  or sq_user.username like '%$search%'   or sq_user.email like '%$search%'     or sq_user.full_name like '%$search%'  ) order by sq_result.id desc limit $limit, $maxRowsPerPage");
			
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
	
	public function view(){
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
		$authAccess=$this->authAccess('resultView');
		if($authAccess != "success"){ return $authAccess; } 
		if($search==''){
		$where="";
			if($id != ''){
					$where=" and sq_result.id='".$id."' ";
			}

		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_quiz.duration, sq_quiz.correct_score, sq_quiz.incorrect_score, sq_user.username,   sq_user.email,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open'  $where order by sq_result.id desc limit $limit, $maxRowsPerPage");
		}else{
		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_quiz.duration, sq_quiz.correct_score, sq_quiz.incorrect_score, sq_user.username,   sq_user.email,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open'  and (sq_quiz.quiz_name like '%$search%' or sq_result.id like '%$search%'  or sq_user.username like '%$search%'   or sq_user.email like '%$search%'     or sq_user.full_name like '%$search%'  )order by sq_result.id desc limit $limit, $maxRowsPerPage");
			
		}
		
		$result=$query->getRowArray();
		if(count($query->getResultArray()) >= 1){
			$json_arr['status']="success"; 	$json_arr['message']="";
			$correct_score=explode(',',$result['correct_score']);
			$attempted_questions=explode(',',$result['attempted_questions']);
			$ind_score=explode(',',$result['ind_score']);
			$nc=array();
			if(count($correct_score) <= 1){
				foreach(explode(',',$result['assigned_qids']) as $k => $v){
					$nc[]=$correct_score[0];
				}
			}
			$no_corrected=0;
			$no_incorrected=0;
			foreach($ind_score as $k => $val){
				if($val > 0){
					$no_corrected +=1;
				}else{
					if($attempted_questions[$k] == 1){
					$no_incorrected +=1;	
					}
				}
			}
			$max_score=array_sum($nc);
			$result['max_score']=$max_score;
			$result['attempted_no_questions']=array_sum($attempted_questions);
			$result['time_spent_in_min']=gmdate("H:i:s", $result['time_spent']);
			$result['no_corrected']=$no_corrected;
			$result['no_incorrected']=$no_incorrected;
			
			$json_arr['data']=$result;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="No record found ";
		}
		
		 return json_encode($json_arr); 	
	}
	
	
	
	public function getQuestions(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$response_time = $this->request->getVar('response_time');
		$ind_score = explode(',',$this->request->getVar('ind_score'));
		$ind_time = explode(',',$this->request->getVar('ind_time'));
		$attempted_questions = explode(',',$this->request->getVar('attempted_questions'));
		$assigned_qids = $this->request->getVar('assigned_qids');
		$rid = $this->request->getVar('rid');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$query = $db2->query("select sq_question.id, sq_question.question_type, sq_question.question, sq_question.description, sq_question.category_ids, sq_category.category_name from sq_question join sq_category on sq_category.id=sq_question.category_ids where sq_question.id in ($assigned_qids) and sq_question.trash_status='0' ORDER BY FIELD(sq_question.id, $assigned_qids) ");
		$result=$query->getResultArray();	
		$questions=$result;
		$sql3="select id, question_id, user_response from sq_answer where  rid='$rid' and response_time='$response_time' ORDER BY FIELD(id, $assigned_qids)  ";
		$query3 = $db2->query($sql3);
		$answers=$query3->getResultArray();	
		$user_response=array();
		foreach($answers as $ak => $answer){
			$user_response[$answer['question_id']][]=$answer['user_response'];
		}

		$sqlOption="select id, question_id, question_option, score from sq_option where question_id in ($assigned_qids) and trash_status='0' ORDER BY FIELD(question_id, $assigned_qids) ";
		  
		$query = $db2->query($sqlOption);
		$result=$query->getResultArray();	
		$options=$result;
		$category_labels=array(); 
		$ques_arr=array();
		foreach($questions as $k => $val){
			$val['question']=base64_encode($val['question']);
			$val['description']=base64_encode($val['description']);
			$ques_arr[$k]['question']=$val;
			if(!isset($category_labels[$val['category_ids']])){
				$category_labels[$val['category_ids']]['category_name']=$val['category_name'];
				$category_labels[$val['category_ids']]['category_id']=$val['category_ids'];
				$category_labels[$val['category_ids']]['attempted_question']=0;
				$category_labels[$val['category_ids']]['correct']=0;
				$category_labels[$val['category_ids']]['incorrect']=0;
				$category_labels[$val['category_ids']]['score']=0;
				$category_labels[$val['category_ids']]['total_questions']=1;
				$category_labels[$val['category_ids']]['time']=$ind_time[$k];
			}else{
				$category_labels[$val['category_ids']]['total_questions'] +=1;
				$category_labels[$val['category_ids']]['time'] +=$ind_time[$k];
			}
			if($attempted_questions[$k] == 0){
				$category_labels[$val['category_ids']]['attempted_question'] +=0;
				$category_labels[$val['category_ids']]['score'] +=0;
				$category_labels[$val['category_ids']]['correct'] +=0;
				$category_labels[$val['category_ids']]['incorrect'] +=0;
			}else{
				if($ind_score[$k] > 0){
				$category_labels[$val['category_ids']]['attempted_question'] +=1;
				$category_labels[$val['category_ids']]['score'] +=$ind_score[$k];
				$category_labels[$val['category_ids']]['correct'] +=1;
				$category_labels[$val['category_ids']]['incorrect'] +=0;					
				}else{
				$category_labels[$val['category_ids']]['attempted_question'] +=1;
				$category_labels[$val['category_ids']]['score'] +=$ind_score[$k];
				$category_labels[$val['category_ids']]['correct'] +=0;
				$category_labels[$val['category_ids']]['incorrect'] +=1;					
				}
			}
			if(isset($user_response[$val['id']])){
			$ques_arr[$k]['user_response']=$user_response[$val['id']];				
			}else{
			$ques_arr[$k]['user_response']="";
			}
			if($val['question_type']=="Multiple Choice Single Answer" || $val['question_type']=="Multiple Choice Multiple Answers" || $val['question_type']=="Short Answer"){
			foreach($options as $ok => $oval){
				if($oval['question_id']==$val['id']){
					if($val['question_type']=="Short Answer"){
						 $oval['question_option']=str_replace(","," or ",$oval['question_option']);
						 $oval['question_option']=base64_encode($oval['question_option']);
					
					$ques_arr[$k]['options'][]=$oval;
					}else{
						$oval['question_option']=base64_encode($oval['question_option']);
					
					$ques_arr[$k]['options'][]=$oval;	
					}
				}
			}
		 }
		}
		$category_labels_new=array();
		$i=0;
		foreach($category_labels as $catK => $ckval){
			$ckval['time']=gmdate("H:i:s", $ckval['time']);
			$category_labels_new[$i]=$ckval;
			$i +=1;
		}
		$json_arr['category_labels']=$category_labels_new;
		$json_arr['status']="success"; 	$json_arr['message']=""; $json_arr['data']=$ques_arr; return json_encode($json_arr); 


		
	}
	
	public function downloadReport(){
		helper("filesystem");
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('resultList');
		if($authAccess != "success"){ return $authAccess; } 
		$from=$this->request->getVar('fromDate');
		$to=$this->request->getVar('toDate');
		if($from==null){ $from=0;	}
		if($to==null){ $to=0;	}
		$fromDate=strtotime(str_replace("T"," ",$from));
		$toDate=strtotime(str_replace("T"," ",$to));
		$group_id=str_replace("T"," ",$this->request->getVar('group_id'));
		$where="";
		if($group_id != "0"){
			$where=" and  sq_user.group_ids='".$group_id."' ";
		}
		if($from != 0){
			$where=" and  sq_result.attempted_datetime >='".$fromDate."' ";
		}
		if($to != 0){
			$where=" and  sq_result.attempted_datetime <='".$toDate."' ";
		}
		$query = $db2->query("select sq_result.*, sq_quiz.quiz_name, sq_user.username,   sq_user.email, sq_user.group_ids,   sq_user.full_name from sq_result join  sq_quiz on sq_quiz.id=sq_result.quid join sq_user on sq_user.id=sq_result.uid where  sq_result.trash_status='0' and sq_result.result_status !='Open'  $where order by sq_result.id desc ");
		$result=$query->getResultArray();
		$csvData="Result ID,Username,Email,Full Name, Quiz Name, Obtained Marks, Obtained Percentage, Result, Attempted Time, Total Time Spent, Total Questions, Attempted Questions, Correct Answers, Incorrect Answers";
		foreach($result as $k => $row){
			$csvData=$csvData." ".PHP_EOL;
			$at=explode(',',$row['attempted_questions']);
			$attempted_questions=array_sum(explode(',',$row['attempted_questions']));
			$correct=0;
			$incorrect=0;
			$ind_score=explode(',',$row['ind_score']);
			foreach($ind_score as $k => $v){
				if($v <= 0){
					if($at[$k] == 1){
						$incorrect +=1;
					}
				}else{
					$correct +=1;
				}
			}
		$csvData=$csvData."".$row['id'].",".$row['username'].",".$row['email'].",".$row['full_name'].",".$row['quiz_name'].",".$row['obtained_score'].",".$row['obtained_percentage'].",".$row['result_status'].",".date('Y-m-d H:i:s',$row['attempted_datetime']).",".gmdate("H:i:s", $row['time_spent']).",".count(explode(',',($row['assigned_qids']))).",".$attempted_questions.",".$correct.",".$incorrect;
		}
		// Type#3 - Write file inside /public folder and return value
		$fill=time();
		$filename=getenv('FILE_UPLOAD_ABSOLUTE_PATH') . $fill.".csv";
		if (!write_file($filename, $csvData)){
		$json_arr['status']="failed"; 	$json_arr['message']="Unable to write file on server";
		}else{
		$json_arr['status']="success"; 	$json_arr['path']=$fill;
		}				
		return json_encode($json_arr); 
		
	}
	
	public function downloadFile($csv){
			$fileDown = readfile(getenv('FILE_UPLOAD_ABSOLUTE_PATH') . $csv .".csv");

		print_r($fileDown); 
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
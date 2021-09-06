<?php namespace App\Controllers;
use CodeIgniter\HTTP\RequestInterface;

class Qbank extends BaseController
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
		$cid = $this->request->getVar('cid');
		if($cid==null){ $cid='';	}
		$limit = $this->request->getVar('limit');
		$maxRowsPerPage = $this->request->getVar('maxRowsPerPage');
		if($limit==null){ $limit=0;	}
		if($maxRowsPerPage==null){ $maxRowsPerPage=30;	}
		
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('questionList');
		if($authAccess != "success"){ return $authAccess; } 
		if($search==''){
		$where="";
			if($id != ''){
					$where=" and sq_question.id='".$id."' ";
			}
			if($cid != ''){
				if($cid != 0){
					$where=" and sq_question.category_ids='".$cid."' ";
				}
			}
			
			if(isset($_POST['quid']) && isset($_POST['showAssignedQuestions'])){
			if($_POST['showAssignedQuestions']=="1"){	
			$quid=$_POST['quid'];
			$query = $db2->query("select sq_quiz.* from sq_quiz where  sq_quiz.trash_status='0'  and sq_quiz.id='$quid' ");
			$quiz=$query->getRowArray();
			$qids=$quiz['qids'];
			
			$sql="select sq_question.*, sq_category.category_name from sq_question  join sq_category on sq_category.id=sq_question.category_ids where  sq_question.trash_status='0'  and sq_question.id in ($qids)  ORDER BY FIELD(sq_question.id, $qids)   ";
			}else{
			$sql="select sq_question.*, sq_category.category_name from sq_question  join sq_category on sq_category.id=sq_question.category_ids where  sq_question.trash_status='0'   $where order by sq_question.id desc  limit $limit, $maxRowsPerPage";
			
			}				
			}else{
			$sql="select sq_question.*, sq_category.category_name from sq_question  join sq_category on sq_category.id=sq_question.category_ids where  sq_question.trash_status='0'   $where order by sq_question.id desc  limit $limit, $maxRowsPerPage";
			}
		$query = $db2->query($sql);
		
		}else{
			$sql="select sq_question.*, sq_category.category_name from sq_question  join sq_category on sq_category.id=sq_question.category_ids where  sq_question.trash_status='0'  and sq_question.question like '%$search%' order by sq_question.id desc limit $limit, $maxRowsPerPage ";
			
		$query = $db2->query($sql);
			
		}
		$result=$query->getResultArray();
		if(count($query->getResultArray()) >= 1){
			$json_arr['status']="success"; 	$json_arr['message']="";  
			$json_arr['data']=$result;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="No record found";
		}
		
		 return json_encode($json_arr); 	
	}
	 
	public function getQuestion(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$id = $this->request->getVar('id');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('getQuestion');
		if($authAccess != "success"){ return $authAccess; } 
		if($id==null){ $json_arr['status']="failed"; 	$json_arr['message']="Question id required";	return json_encode($json_arr); 	}		
		$query = $db2->query("select * from sq_question where id ='$id' and trash_status='0' ");
		$question=$query->getRowArray();	
		 
		$query = $db2->query("select * from sq_option where question_id  ='$id' and trash_status='0'  ");
		$options=$query->getResultArray();	
		$json_arr['status']="success"; 	$json_arr['message']=""; $json_arr['data']=$question; $json_arr['options']=$options; return json_encode($json_arr); 
				
	}
	

	public function remove(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$id = $this->request->getVar('id');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('questionRemove');
		if($authAccess != "success"){ return $authAccess; } 
		if($id==null){ $id='';	}
			$where="";
				if($id != ''){
						$where=" and sq_question.id='".$id."' ";
				}
				$sql=" update sq_question set trash_status='1' where sq_question.trash_status='0' $where ";
				$query = $db1->query($sql);
				$json_arr['status']="success"; 	$json_arr['message']="Question removed successfully";
			 
		
			 return json_encode($json_arr);	
			
		
	}
 	
	
	public function add(){
		 
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$category_id=$this->request->getVar('category_id');
		$question_type=$this->request->getVar('question_type');
		$userdata=array();
		$fData=json_decode($this->request->getVar('fData'));
		
		if(isset($fData[0])){
			$fData=$this->makeRequiredArrayFormat($fData);
		}
		
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('questionAdd');
		if($authAccess != "success"){ return $authAccess; } 
		$userdata['question_type']=$question_type;
		$userdata['question']=$fData['question'];		
		$userdata['description']=$fData['description'];
		$userdata['category_ids']=$category_id;

				if($db1->table('sq_question')->insert($userdata)){
					
				$id=$db1->insertID();
				if(isset($fData['option'])){
					foreach($fData['option'] as $k => $v){
						$userdata=array();
						$userdata['question_id']=$id;
						$userdata['question_option']=$v;
						if(isset($fData['answer'])){
						$answer=explode(',',$fData['answer']);
						$p=$k+1;
						
						if(in_array($p,$answer)){
						$userdata['score']=round((1/(count($answer))),2);
						}else{
						$userdata['score']=0;	
						}
						}else{
							$userdata['score']=1;
						}
						
						$db1->table('sq_option')->insert($userdata);
					}
				}
				$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Question added successfully"; return json_encode($json_arr); 
				}else{
					$msg=$db1->error();
					$json_arr['status']="failed"; 	$json_arr['message']=$msg; return json_encode($json_arr); 
				}
		 
		
		 return json_encode($json_arr); 
					
	}

 	public function edit(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$id = $this->request->getVar('id');
		
		$user_token=$this->request->getVar('user_token');
		$fData=json_decode($this->request->getVar('fData'));
		
		if(isset($fData[0])){
			$fData=$this->makeRequiredArrayFormat($fData);
		} 
		$userdata=array();
		$userdata['question']=$fData['question'];		
		$userdata['description']=$fData['description'];
		
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('questionEdit');
		if($authAccess != "success"){ return $authAccess; } 
	
		$builder = $db1->table('sq_question');
		$builder->where('id',$id);
		$builder->update($userdata);

					foreach($fData['option'] as $k => $v){
						$userdata=array();
						 $userdata['question_option']=$v;
						if(isset($fData['answer'])){
						$answer=explode(',',$fData['answer']);
						$p=$k;
						
						if(in_array($p,$answer)){
						$userdata['score']=round((1/(count($answer))),2);
						}else{
						$userdata['score']=0;	
						}
						}else{
							$userdata['score']=1;
						}
								$builder = $db1->table('sq_option');		
								$builder->where('id',$fData['oid'][$k]);
								$builder->update($userdata);
					}

		
		$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Question updated successfully"; return json_encode($json_arr); 
				 
		 
		
		 return json_encode($json_arr); 
					
	}
	
	
	public function makeRequiredArrayFormat($arr){
		
		$narr=array();
		foreach($arr as $k => $val){
			if($val->name=="question_type"){
				$narr['question_type']=$val->value;
			}		
			if($val->name=="question"){
				$narr['question']=$val->value;
			}		
			if($val->name=="description"){
				$narr['description']=$val->value;
			}		
			if($val->name=="answer"){
				if(isset($narr['answer'])){ 
					$narr['answer']=$narr['answer'].",".$val->value;
				}else{
					$narr['answer']=$val->value;
				}
			}		
			if($val->name=="option"){
				$narr['option'][]=$val->value;
			}		
			if($val->name=="oid"){
				$narr['oid'][]=$val->value;
			}		
		}
		return $narr;
	}
 
 	public function getCategoryList(){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('categoryList');
		if($authAccess != "success"){ return $authAccess; } 
		$id = $this->request->getVar('id');
		if($id==null){ $id='';	}
		$where="";
			if($id != ''){
					$where=" and sq_category.id='".$id."' ";
			}
		$query = $db2->query("select * from sq_category  where trash_status='0'  ".$where." order by id asc ");
		$result=$query->getResultArray();
		if(count($query->getResultArray()) >= 1){
			$json_arr['status']="success"; 	$json_arr['message']="";
			$json_arr['data']=$result;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="No record found";
		}
		
		 return json_encode($json_arr); 	
	}
	
 	public function getCategoryListByParentId($parent_id){
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('categoryList');
		if($authAccess != "success"){ return $authAccess; } 
		$id = $this->request->getVar('id');
		if($id==null){ $id='';	}
		$where="";
			if($id != ''){
					$where=" and sq_category.id='".$id."' ";
			}
		$query = $db2->query("select * from sq_category  where trash_status='0'  ".$where." and parent_id='".$parent_id."' order by id asc ");
		$result=$query->getResultArray();
		if(count($query->getResultArray()) >= 1){
			$json_arr['status']="success"; 	$json_arr['message']="";
			$json_arr['data']=$result;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="No more child category ";
		}
		
		 return json_encode($json_arr); 	
	}
	


	public function removeCategory(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$id = $this->request->getVar('id');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('categoryRemove');
		if($authAccess != "success"){ return $authAccess; } 
		if($id==null){ $id='';	}
		// protect admin user to remove
		if($id == "1"){ 
		$json_arr['status']="failed"; 	$json_arr['message']="You can not remove default category";

		}else{
			$query = $db2->query("select id from sq_question where trash_status='0' and category_ids ='$id'  ");
			
			if(count($query->getResultArray()) == 0){
				$where="";
				if($id != ''){
						$where=" and sq_category.id='".$id."' ";
				}
				$sql=" update sq_category set trash_status='1' where sq_category.trash_status='0' $where ";
				$query = $db1->query($sql);
				$json_arr['status']="success"; 	$json_arr['message']="Category removed successfully";
			}else{
				$json_arr['status']="failed"; 	$json_arr['message']="Unable to remove category! <br>There are some questions assigned to this category. Remove or move that questions to another category.";
			}
		}
			 return json_encode($json_arr);	
			
		
	}
 	
	
	public function addCategory(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$userdata=array();
		$userdata['category_name']=$this->request->getVar('category_name');
		$userdata['parent_id']=$this->request->getVar('parent_id');
		
		
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('categoryAdd');
		if($authAccess != "success"){ return $authAccess; } 

				if($db1->table('sq_category')->insert($userdata)){
					
				$id=$db1->insertID();
				$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Category added successfully"; return json_encode($json_arr); 
				}else{
					$msg=$db1->error();
					$json_arr['status']="failed"; 	$json_arr['message']=$msg; return json_encode($json_arr); 
				}
		 
		
		 return json_encode($json_arr); 
					
	}

 	public function editCategory(){
		
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$json_arr=array();
		$id = $this->request->getVar('id');
		$user_token=$this->request->getVar('user_token');
		$userdata=array();
		$userdata['category_name']=$this->request->getVar('category_name');
		$userdata['parent_id']=$this->request->getVar('parent_id');		
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('categoryEdit');
		if($authAccess != "success"){ return $authAccess; } 
	
		$builder = $db1->table('sq_category');
		$builder->where('id',$id);
		$builder->update($userdata);			
		$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Category updated successfully"; return json_encode($json_arr); 
				 
		 
		
		 return json_encode($json_arr); 
					
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
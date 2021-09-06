<?php namespace App\Controllers;
use CodeIgniter\HTTP\RequestInterface;

class Commondata extends BaseController
{
	 
	 
    public function __construct()
    {
         
    }

 

	
	public function getList($tableName='sq_user'){
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$limit = $this->request->getVar('limit');
		$maxRowsPerPage = $this->request->getVar('maxRowsPerPage');
		$search = $this->request->getVar('search');
		$id = $this->request->getVar('id');
		if($user_token==null){ $json_arr['status']="failed"; 	$json_arr['message']="Token required"; return json_encode($json_arr); 	}
		if($limit==null){ $limit=0;	}
		if($maxRowsPerPage==null){ $maxRowsPerPage=30;	}
		if($search==null){ $search='';	}
		if($id==null){ $id='';	}
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('userList');
		if($authAccess != "success"){ return $authAccess; } 
		$db = \Config\Database::connect();
		if($search==''){
			$where="";
			if($id != ''){
					$where=" and id='".$id."' ";
			}
			$query = $db->query("select * from $tableName where trash_status='0' $where order by id asc limit $limit, $maxRowsPerPage");
		}else{
				$query = $db->query("SHOW COLUMNS FROM $tableName ");
				$result=$query->getResultArray();
				$col=array();
				foreach($result as $k => $r){
					$col[]=$r['Field'];
				}
				$cols=implode(',',$col);
			$query = $db->query("select * from $tableName WHERE LOWER(CONCAT($cols)) LIKE LOWER('%$search%') and trash_status='0' order by id asc  limit $limit, $maxRowsPerPage");
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
	

	public function get($tableName='sq_user'){
		// check required post data
		$json_arr=array();
		$user_token = $this->request->getVar('user_token');
		$limit = $this->request->getVar('limit');
		$maxRowsPerPage = $this->request->getVar('maxRowsPerPage');
		$search = $this->request->getVar('search');
		$id = $this->request->getVar('id');
		if($user_token==null){ $json_arr['status']="failed"; 	$json_arr['message']="Token required"; return json_encode($json_arr); 	}
		if($limit==null){ $limit=0;	}
		if($maxRowsPerPage==null){ $maxRowsPerPage=30;	}
		if($search==null){ $search='';	}
		if($id==null){ $id='';	}
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('userList');
		if($authAccess != "success"){ return $authAccess; } 
		$db = \Config\Database::connect();
		if($search==''){
			$where="";
			if($id != ''){
					$where=" and id='".$id."' ";
			}
			$query = $db->query("select * from $tableName where trash_status='0' $where order by id asc limit $limit, $maxRowsPerPage");
		}else{
				$query = $db->query("SHOW COLUMNS FROM $tableName ");
				$result=$query->getResultArray();
				$col=array();
				foreach($result as $k => $r){
					$col[]=$r['Field'];
				}
				$cols=implode(',',$col);
			$query = $db->query("select * from $tableName WHERE LOWER(CONCAT($cols)) LIKE LOWER('%$search%') and trash_status='0' order by id asc  limit $limit, $maxRowsPerPage");
		}
		$result=$query->getRowArray();
		
		if(count($query->getResultArray()) >= 1){
			$json_arr['status']="success"; 	$json_arr['message']="";
			$json_arr['data']=$result;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="No record found";
		}
		
		 return json_encode($json_arr); 
	}
	
	public function add($tableName='sq_user'){
		$db = \Config\Database::connect();
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('userList');
		if($authAccess != "success"){ return $authAccess; } 
		if($user_token==null){ $json_arr['status']="failed"; 	$json_arr['message']="Token required"; return json_encode($json_arr); 	}
		
		$query = $db->query("SHOW COLUMNS FROM $tableName ");
		$result=$query->getResultArray();
		$col=array();
		foreach($result as $k => $r){
			$col[]=$r['Field'];
		}
		$userdata=array();
		foreach($_POST as $k => $p){
			if(in_array($k,$col)){
				$userdata[$k]=$p;
			}
		}
		if($db->table($tableName)->insert($userdata)){
			
		$id=$db->insertID();
		$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Data inserted successfully"; return json_encode($json_arr); 
		}else{
			$msg=$db->error();
			$json_arr['status']="failed"; 	$json_arr['message']=$msg; return json_encode($json_arr); 
		}
		 
		
		
	}
	
	public function edit($tableName='sq_user'){
		$db = \Config\Database::connect();
		$json_arr=array();
		$user_token=$this->request->getVar('user_token');
		$id=$this->request->getVar('id');
		$validateToken=$this->validateToken();
		if($validateToken != "success"){ return $validateToken;  }
		$authAccess=$this->authAccess('userList');
		if($authAccess != "success"){ return $authAccess; } 
		if($user_token==null){ $json_arr['status']="failed"; 	$json_arr['message']="Token required"; return json_encode($json_arr); 	}
		if($id==null){ $json_arr['status']="failed"; 	$json_arr['message']="ID required"; return json_encode($json_arr); 	}
		
		$query = $db->query("SHOW COLUMNS FROM $tableName ");
		$result=$query->getResultArray();
		$col=array();
		foreach($result as $k => $r){
			$col[]=$r['Field'];
		}
		$userdata=array();
		foreach($_POST as $k => $p){
			if(in_array($k,$col)){
				$userdata[$k]=$p;
			}
		}
		$builder = $db->table('sq_user');
		$builder->where('id',$id);
		$builder->update($userdata);
		$json_arr['status']="success"; $json_arr['id']=$id;	$json_arr['message']="Data update successfully"; return json_encode($json_arr); 
		 
		 
		
		
	}
	
	
	public function validateToken(){
		$db = \Config\Database::connect();
		$user_token = $this->request->getVar('user_token');
		$query=$db->query(" select id from sq_user where user_token='$user_token' ");
		if(count($query->getResultArray()) == 0){
			 $json_arr['status']="failed"; 	$json_arr['message']="Invalid token, Re-login"; return json_encode($json_arr);
		}
		
		return "success";	
		
	}
	
	public function authAccess($dataRequested=''){
		$db = \Config\Database::connect();
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

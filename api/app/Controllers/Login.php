<?php namespace App\Controllers;
use CodeIgniter\HTTP\RequestInterface;

class Login extends BaseController
{
	 
	 
    public function __construct()
    {
         
    }

 

	
	public function index(){
		// check required post data
		$json_arr=array();
		$username = $this->request->getVar('username');
		$password = $this->request->getVar('passworde');
		$email = $this->request->getVar('email');
		if($password==null){ $json_arr['status']="failed"; 	$json_arr['message']="Password missing"; return json_encode($json_arr); 	}
		if($username==null && $email==null){ $json_arr['status']="failed"; 	$json_arr['message']="Username or Email missing"; return json_encode($json_arr); 		}
		
		$password=md5($password);
		$db = \Config\Database::connect();
		$query = $db->query("select id,username,email,full_name,user_token,account_type_id,group_ids,created_time from sq_user where password='$password' and ( username='$username' || email='$email' ) and trash_status='0' ");
		$row=$query->getRowArray();
		if(isset($row['username']) && $row['username']==$username){
			$uid=$row['id'];
			$user_token=rand(111,999)."-".$uid."-".time();
			$db->query(" update sq_user set user_token='$user_token' where id='$uid'  ");
			$json_arr['status']="success"; 	$json_arr['message']="Login success";
			$row['user_token']=$user_token;
			$json_arr['data']=$row;
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="Invalid username or password";
		}
		
		 return json_encode($json_arr); 
	}
	
	public function checkInternet(){
		echo "Done";
	}
	
	
	
	public function resetPassword(){
		$json_arr=array();
		$email = $this->request->getVar('email');
		$db1 = \Config\Database::connect('writeDB');
		$db2 = \Config\Database::connect('readDB');
		$sql="select * from sq_user where  trash_status='0' and email='$email' ";
		$query = $db2->query($sql);
		
		$user=$query->getRowArray();
		
		if(count($query->getResultArray()) >= 1){
			$query = $db2->query("select * from sq_setting order by order_by asc ");
			$setting=$query->getResultArray();
			$smtp_arr=array();
			foreach($setting as $k => $val){
				if($val['setting_name']=="smtp_host"){
					$smtp_arr['smtp_host']=$val['setting_value'];
				}
				if($val['setting_name']=="smtp_username"){
					$smtp_arr['smtp_username']=$val['setting_value'];
				}
				if($val['setting_name']=="smtp_password"){
					$smtp_arr['smtp_password']=$val['setting_value'];
				}
				if($val['setting_name']=="smtp_port"){
					$smtp_arr['smtp_port']=$val['setting_value'];
				}
			}
			$password=md5(rand(111111,999999));
			
			$subject="Reset password";
			$message="Hi, \n\r Your new password is: ".$password." \n\r \n\r Thanks";
			
			$email = \Config\Services::email();
			$email->SMTPHost=$smtp_arr['smtp_host'];
			$email->SMTPUser=$smtp_arr['smtp_username'];
			$email->SMTPPass=$smtp_arr['smtp_password'];
			$email->SMTPPort=$smtp_arr['smtp_port'];
			$email->protocol="smtp";
			$email->setFrom($smtp_arr['smtp_username'], $smtp_arr['smtp_username']);
			$email->setTo($user['email']);
			
			$email->setSubject($subject);
			$email->setMessage($message);

			if($email->send()){		
				$query = $db2->query("update sq_user set password='$password' ");
			
				$json_arr['status']="success"; 	$json_arr['message']="Email sent with updated password";
			}else{
					$json_arr['status']="failed"; 	$json_arr['message']=$email->printDebugger();
			}
		
		}else{
			$json_arr['status']="failed"; 	$json_arr['message']="Account not found with given email address";
		}			
		 return json_encode($json_arr); 
		
	}
	
	
	

}

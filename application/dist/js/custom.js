var api_base_url="https://YOUR-DOMAINNAME/api/public/";
var api_site_url="https://YOUR-DOMAINNAME/api/public/index.php/";
// 0 for disabled 1 for enabled
var debug_mode=0;
var user_data;
var rowLimit=0;
var numberOfRowPerPage=30;
var addNewUserVar=0;
var optionNumber=1;
var newQuizForm=1;
var editQuizForm=1;
var showAssignedQuestions=0;

function flashMessage(msg){
		$('.flashMessage').show();
		$('.flashMessage').html(msg);
		setTimeout(function(){
			$('.flashMessage').hide();
		},8000);
}


function fillPassword(p){
		
		$('#password').val(p);
}


function addNew(contr,modalId){
	$(modalId).modal('show');
}

function removeRow(contr,id){
	if(confirm("Do you really want to remove this entry")){
		
		const arg={user_token:localStorage.getItem('user_token'),id:id};
		$.post(api_site_url+"user/remove",arg,function(data){
			var result=JSON.parse(data.trim());
			flashMessage(result.message);
			// call function to reload current page
			window[contr]();
		});
	
	}
}



function removeRows(contr){
	var ids="";
	$('input.selectRow:checkbox').each(function(){
			if($(this)[0].checked==true){
				if(ids==""){ ids=$(this).val(); }else{  ids=ids+","+$(this).val(); }
			}		
	});
	if(ids !=""){
	if(confirm("Do you really want to remove selected entries")){

		const arg={user_token:localStorage.getItem('user_token'),id:ids};
		$.post(api_site_url+"user/removeMultiple",arg,function(data){
			var result=JSON.parse(data.trim());
			flashMessage(result.message);
			// call function to reload current page
			window[contr]();
		});
		
	}
	}else{
		
		flashMessage("Select one or more rows to remove");
	}
}


function login(){
	const username=$('#username').val();
	const passworde=$('#passworde').val();
	if(username == "" || passworde == ""){
		flashMessage("Username and password required");
		return;
	}
	$('.spinner-border').show();
	const arg={username:username,passworde:passworde};
	$.post(api_site_url+"login/index",arg,function(data){
		const result=JSON.parse(data.trim()); 
		if(result.status=="success"){
			localStorage.setItem('user_token',result.data.user_token);
			localStorage.setItem('user_data',JSON.stringify(result.data));
			window.location="dashboard.html";
		}else{
			flashMessage(result.message);
			$('.spinner-border').hide();
			 
		return;
		}
		
	}).fail(function(xhr, status, error) {
		if(debug_mode==1){
			flashMessage("Request failed to API url: "+api_site_url+"login/index <br>Check api and base url path in dist/js/custom.js file. if api application is hosted on different host (domain) then add CORS of application domain. eg. in index.php of api folder add header('Access-Control-Allow-Origin: *');  ");
		}else{
			flashMessage("Request failed, try again");
		}
    });
	    
	
}




function dashboard(){
	$('.spinner-border').show();
	if(localStorage.getItem('user_token') == undefined){
		window.location="index.html";
		return;
	}
	const arg={user_token:localStorage.getItem('user_token')}
	$.post(api_site_url+"commondata/validateToken",arg,function(data){
		if(data.trim()!="success"){
			window.location="index.html";
			return;	
		}
	});
	if(localStorage.getItem('user_data') == undefined){
		window.location="index.html";
		return;
	}
	
	 user_data=JSON.parse(localStorage.getItem('user_data'));
	 $('#loggedInUser').html(user_data.username);
	 
	$.post("dash.html",{},function(data){
		 $('#main_content').html(data);
		 $('.spinner-border').hide();
		 dashboardStat();
	});	 
	
}


function addNewUser(){
	addNewUserVar=1;
	user();
	 
}


function getGroupList(){
	$('#sq_user-group_ids').html("");
	$('#sq_user-group_ids-edit').html("");
	const arg={user_token:localStorage.getItem('user_token')};
	$.post(api_site_url+"user/getGroupList",arg,function(data){
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				$('#sq_user-group_ids').append("<option value='"+value.id+"'>"+value.group_name+"</option>");
				$('#sq_user-group_ids-edit').append("<option value='"+value.id+"'>"+value.group_name+"</option>");
			});
		}

	});
}


function getAccountTypeList(){
	$('#sq_user-account_type_id').html("");
	$('#sq_user-account_type_id-edit').html("");
	const arg={user_token:localStorage.getItem('user_token')};
	$.post(api_site_url+"user/getAccountTypeList",arg,function(data){
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				$('#sq_user-account_type_id').append("<option value='"+value.id+"'>"+value.account_name+"</option>");
				$('#sq_user-account_type_id-edit').append("<option value='"+value.id+"'>"+value.account_name+"</option>");
			});
		}

	});
}



function user(){
	$('#title').html("User list");
	$('#search').val("");
	rowLimit=-30;
	$('.spinner-border').show();
	$.post("userList.html",{},function(data){
		 $('#main_content').html(data);
		 getUserList('p');
		 getGroupList();
		 getAccountTypeList();
		 if(addNewUserVar == 1){
			 addNew('user','#newUserModal');
			 addNewUserVar=0;
		 }
		 
	});	 
	
	
}

function getUserList(p){
	 $('#rowContent').html("");
	if(p=="p"){
		rowLimit += numberOfRowPerPage;
	}else{
		rowLimit -= numberOfRowPerPage;
	}
	if(rowLimit < 0){
		rowLimit=0;
	}
	if(rowLimit<=0){
		$('#backBtn').hide();
	}else{
		$('#backBtn').show();
	}
	var search=$('#search').val();
	let arg;
	if(search !=""){
	 arg={user_token:localStorage.getItem('user_token'),limit:0,search:search};		
	}else{
	 arg={user_token:localStorage.getItem('user_token'),limit:rowLimit,maxRowsPerPage:numberOfRowPerPage};
	}
	$.post(api_site_url+"user/getList",arg,function(data){
		const result=JSON.parse(data);
		if(result.status=="success"){
			 
			$(result.data).each(function(index,value){
				var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>    <a class='dropdown-item' href=javascript:editUser('user','#editUserModal','"+value.id+"'); >Edit</a>    <a class='dropdown-item' href=javascript:removeRow('user','"+value.id+"');>Remove</a>  </div></div>"
				var hiddenRow="<tr><td><input type='checkbox' class='selectRow' value='"+value.id+"'></td><td>"+value.id+"</td><td>"+value.username+"</td><td>"+value.email+"</td><td>"+value.full_name+"</td><td>"+value.group_name+"</td><td>"+value.account_name+"</td><td>"+dropDownAction+"</td></tr>";
				  
				 $('#rowContent').append(hiddenRow);  
				 
			});
		 
			$('.dropdown-toggle').dropdown();
		}else{
			flashMessage(result.message);
		}
		$('.spinner-border').hide();
	});

}



function editUser(contr,modalId,id){
	$(modalId).modal('show');
	$('#sq_user-id').val(id);
	arg={user_token:localStorage.getItem('user_token'),id:id};
	
	$.post(api_site_url+"user/getList",arg,function(data){
		const result=JSON.parse(data);
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				$('#sq_user-account_type_id-edit').val(value.account_type_id);
				$('#sq_user-group_ids-edit').val(value.group_ids);
				$('#sq_user-username-edit').val(value.username);
				$('#sq_user-email-edit').val(value.email);
				$('#sq_user-full_name-edit').val(value.full_name);
			});
		}
	});
	
}

function submitAddUser(){
	$('#formValidationNew').html("");
	var username=$('#sq_user-username').val();
	var email=$('#sq_user-email').val();
	var password=$('#sq_user-password').val();
	var full_name=$('#sq_user-full_name').val();
	var group_ids=$('#sq_user-group_ids').val();
	var account_type_id=$('#sq_user-account_type_id').val();
	if(username=="" || email=="" || password == "" || full_name == "" || group_ids == "" || account_type_id == ""){
		$('#formValidationNew').html("All fileds required ");
		
	}else{
		$('.spinner-border').show();
		const arg={user_token:localStorage.getItem('user_token'),username:username,email:email,full_name:full_name,password:password,group_ids:group_ids,account_type_id:account_type_id};
		$.post(api_site_url+"user/add",arg,function(data){
			$('.spinner-border').hide();
			var result=JSON.parse(data.trim());
			if(result.status=="success"){
				flashMessage(result.message);
				$('#newUserModal').modal('hide');
				user();
			}else{
					$('#formValidationNew').html(result.message);
			}
		});
		
	}
	
}


function submitEditUser(){
	$('#formValidationEdit').html("");
	var id=$('#sq_user-id').val();
	var username=$('#sq_user-username-edit').val();
	var email=$('#sq_user-email-edit').val();
	var password=$('#sq_user-password-edit').val();
	var full_name=$('#sq_user-full_name-edit').val();
	var group_ids=$('#sq_user-group_ids-edit').val();
	var account_type_id=$('#sq_user-account_type_id-edit').val();
	if(username=="" || email=="" || full_name == "" || group_ids == "" || account_type_id == ""){
		$('#formValidationEdit').html("All fileds required ");
		
	}else{
		$('.spinner-border').show();
		const arg={user_token:localStorage.getItem('user_token'),id:id,username:username,email:email,full_name:full_name,password:password,group_ids:group_ids,account_type_id:account_type_id};
		$.post(api_site_url+"user/edit",arg,function(data){
			$('.spinner-border').hide();
			var result=JSON.parse(data.trim());
			if(result.status=="success"){
				flashMessage(result.message);
				$('#editUserModal').modal('hide');
				user();
			}else{
					$('#formValidationEdit').html(result.message);
			}
		});
		
	}
	
}






function sq_group(){
	$('#rowContent').html("");
	$('#title').html("Group list");
	$('.spinner-border').show();
	$.post("groupList.html",{},function(data){
		 $('#main_content').html(data);
		 	const arg={user_token:localStorage.getItem('user_token')};
			$.post(api_site_url+"user/getGroupList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>    <a class='dropdown-item' href=javascript:editGroup('sq_group','#editGroupModal','"+value.id+"'); >Edit</a>    <a class='dropdown-item' href=javascript:removeRowGroup('sq_group','"+value.id+"');>Remove</a>  </div></div>"
						var hiddenRow="<tr><td>"+value.group_name+"</td><td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
			});
	});	 
	
}



function addNewGroup(contr,modalId){
	
	$(modalId).modal('show');
	
}




function editGroup(contr,modalId,id){
	$(modalId).modal('show');
	$('#sq_group-id').val(id);
	arg={user_token:localStorage.getItem('user_token'),id:id};
	
	$.post(api_site_url+"user/getGroupList",arg,function(data){
		const result=JSON.parse(data);
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				$('#sq_group-group_name-edit').val(value.group_name);
				
			});
		}
	});
	
}




function submitAddGroup(){
	$('#formValidationNew').html("");
	var group_name=$('#sq_group-group_name').val();
	if(group_name == ""){
		$('#formValidationNew').html("Group name required ");
		
	}else{
		$('.spinner-border').show();
		const arg={user_token:localStorage.getItem('user_token'),group_name:group_name};
		$.post(api_site_url+"user/addGroup",arg,function(data){
			$('.spinner-border').hide();
			var result=JSON.parse(data.trim());
			if(result.status=="success"){
				flashMessage(result.message);
				$('#newGroupModal').modal('hide');
				sq_group();
			}else{
					$('#formValidationNew').html(result.message);
			}
		});
		
	}
	
}




function submitEditGroup(){
	$('#formValidationEdit').html("");
	var id=$('#sq_group-id').val();
	var group_name=$('#sq_group-group_name-edit').val();
	if(group_name == ""){
		$('#formValidationEdit').html("Group name required ");
		
	}else{
		$('.spinner-border').show();
		const arg={user_token:localStorage.getItem('user_token'),id:id,group_name:group_name};
		$.post(api_site_url+"user/editGroup",arg,function(data){
			$('.spinner-border').hide();
			var result=JSON.parse(data.trim());
			if(result.status=="success"){
				flashMessage(result.message);
				$('#editGroupModal').modal('hide');
				sq_group();
			}else{
					$('#formValidationEdit').html(result.message);
			}
		});
		
	}
	
}


function removeRowGroup(contr,id){
	if(confirm("Do you really want to remove this entry")){
		
		const arg={user_token:localStorage.getItem('user_token'),id:id};
		$.post(api_site_url+"user/removeGroup",arg,function(data){
			var result=JSON.parse(data.trim());
			flashMessage(result.message);
			// call function to reload current page
			window[contr]();
		});
	
	}
}







function sq_category(){
	$('#rowContent').html("");

	$('#title').html("Category list");
	$('.spinner-border').show();
	$.post("categoryList.html",{},function(data){
		 $('#main_content').html(data);
		 	$('#sq_category-parent_id-edit').html("");
			$('#sq_category-parent_id').html("");
			$('#sq_category-parent_id-edit').append("<option value='0'>No Parent</option>");
			$('#sq_category-parent_id').append("<option value='0'>No Parent</option>");
		 	const arg={user_token:localStorage.getItem('user_token')};
			$.post(api_site_url+"Qbank/getCategoryList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>    <a class='dropdown-item' href=javascript:editCategory('sq_category','#editCategoryModal','"+value.id+"'); >Edit</a>    <a class='dropdown-item' href=javascript:removeRowCategory('sq_category','"+value.id+"');>Remove</a>  </div></div>"
						var hiddenRow="<tr><td>"+value.category_name+"</td><td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
						$('#sq_category-parent_id').append("<option value='"+value.id+"'>"+value.category_name+"</option>");
						$('#sq_category-parent_id-edit').append("<option value='"+value.id+"'>"+value.category_name+"</option>");
						
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
			});
	});	 
	
}



function sq_category_parent(pid){
	

		 	if(pid==0){ $('#mainCategory').html(""); }
			const arg={user_token:localStorage.getItem('user_token')};
			$.post(api_site_url+"Qbank/getCategoryListByParentId/"+pid,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					var selectEle="<select name='category_id' class='category_id' id='pid-"+pid+"' onchange=sq_category_parent(this.value) ><option value='0'>Select Category</option>";
					$(result.data).each(function(index,value){
						selectEle=selectEle+"<option value='"+value.id+"'>"+value.category_name+"</option>";
						 
					});
					if(document.getElementById('pid-'+pid) == undefined){
						$('#mainCategory').append(selectEle);
					}
					
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				 
			});
	  
	
}






function sq_category_parent3(pid){
	
			
		 	if(pid==0){ $('#mainCategory3').html(""); }
			const arg={user_token:localStorage.getItem('user_token')};
			$.post(api_site_url+"Qbank/getCategoryListByParentId/"+pid,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					var selectEle="<select name='category_id3' class='category_id3' id='pid3-"+pid+"' onchange=sq_category_parent3(this.value) ><option value='0'>Select Category</option>";
					$(result.data).each(function(index,value){
						selectEle=selectEle+"<option value='"+value.id+"'>"+value.category_name+"</option>";
						 
					});
					if(document.getElementById('pid3-'+pid) == undefined){
						$('#mainCategory3').append(selectEle);
					}
				getQuestionList('0');	
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				 
			});
	  
	
}


function sq_category_parent4(pid){
	
			
		 	if(pid==0){ $('#mainCategory4').html(""); }
			const arg={user_token:localStorage.getItem('user_token')};
			$.post(api_site_url+"Qbank/getCategoryListByParentId/"+pid,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					var selectEle="<select name='category_id4' class='category_id4' id='pid4-"+pid+"' onchange=sq_category_parent4(this.value) ><option value='0'>Select Category</option>";
					$(result.data).each(function(index,value){
						selectEle=selectEle+"<option value='"+value.id+"'>"+value.category_name+"</option>";
						 
					});
					if(document.getElementById('pid4-'+pid) == undefined){
						$('#mainCategory4').append(selectEle);
					}
				getQuestionListQuiz('0');	
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				 
			});
	  
	
}



function sq_category_parentEdit(pid){
	

		 	if(pid==0){ $('#mainCategory').html(""); }
			const arg={user_token:localStorage.getItem('user_token')};
			$.post(api_site_url+"Qbank/getCategoryListByParentId/"+pid,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					var selectEle="<select name='category_id' class='category_id' id='pid-"+pid+"' onchange=sq_category_parentEdit(this.value) ><option value='0'>Select Category</option>";
					$(result.data).each(function(index,value){
						selectEle=selectEle+"<option value='"+value.id+"'>"+value.category_name+"</option>";
						 
					});
					if(document.getElementById('pid-'+pid) == undefined){
						$('#mainCategoryEdit').append(selectEle);
					}
					
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				 
			});
	  
	
}



function addNewCategory(contr,modalId){
	
	$(modalId).modal('show');
	
}




function editCategory(contr,modalId,id){
	$(modalId).modal('show');
	$('#sq_category-id').val(id);
	arg={user_token:localStorage.getItem('user_token'),id:id};
	
	$.post(api_site_url+"Qbank/getCategoryList",arg,function(data){
		const result=JSON.parse(data);
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				$('#sq_category-category_name-edit').val(value.category_name);
				$('#sq_category-parent_id-edit').val(value.parent_id);
				
			});
		}
	});
	
}




function submitAddCategory(){
	$('#formValidationNew').html("");
	var category_name=$('#sq_category-category_name').val();
	var parent_id=$('#sq_category-parent_id').val();
	if(category_name == ""){
		$('#formValidationNew').html("Category name required ");
		
	}else{
		$('.spinner-border').show();
		const arg={user_token:localStorage.getItem('user_token'),category_name:category_name,parent_id:parent_id};
		$.post(api_site_url+"Qbank/addCategory",arg,function(data){
			$('.spinner-border').hide();
			var result=JSON.parse(data.trim());
			if(result.status=="success"){
				flashMessage(result.message);
				$('#newCategoryModal').modal('hide');
				sq_category();
			}else{
					$('#formValidationNew').html(result.message);
			}
		});
		
	}
	
}




function submitEditCategory(){
	$('#formValidationEdit').html("");
	var id=$('#sq_category-id').val();
	var parent_id=$('#sq_category-parent_id-edit').val();
	var category_name=$('#sq_category-category_name-edit').val();
	if(category_name == ""){
		$('#formValidationEdit').html("Category name required ");
		
	}else{
		$('.spinner-border').show();
		const arg={user_token:localStorage.getItem('user_token'),id:id,category_name:category_name,parent_id:parent_id};
		$.post(api_site_url+"Qbank/editCategory",arg,function(data){
			$('.spinner-border').hide();
			var result=JSON.parse(data.trim());
			if(result.status=="success"){
				flashMessage(result.message);
				$('#editCategoryModal').modal('hide');
				sq_category();
			}else{
					$('#formValidationEdit').html(result.message);
			}
		});
		
	}
	
}


function removeRowCategory(contr,id){
	if(confirm("Do you really want to remove this entry")){
		
		const arg={user_token:localStorage.getItem('user_token'),id:id};
		$.post(api_site_url+"Qbank/removeCategory",arg,function(data){
			var result=JSON.parse(data.trim());
			flashMessage(result.message);
			// call function to reload current page
			window[contr]();
		});
	
	}
}







var ini_add_new_question=0;
function sq_question_new(){
	ini_add_new_question=1;
	sq_question();
	
}




function sq_question(){
	$('#rowContent').html("");
	$('#title').html("Question list");
	$('.spinner-border').show();
	$.post("questionList.html",{},function(data){
		 $('#main_content').html(data);
		 	const arg={user_token:localStorage.getItem('user_token'),maxRowsPerPage:numberOfRowPerPage};
			$.post(api_site_url+"qbank/getList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>    <a class='dropdown-item' href=javascript:editQuestion('sq_question','#editQuestionModal','"+value.id+"'); >Edit</a>    <a class='dropdown-item' href=javascript:removeRowQuestion('sq_question','"+value.id+"');>Remove</a>  </div></div>"
						var hiddenRow="<tr><td><input type='checkbox' class='selectRow' value='"+value.id+"'></td><td>"+value.id+"</td><td>"+value.question_type+"</td><td>"+value.question+"</td><td>"+value.category_name+"</td><td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
						
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
				if(ini_add_new_question == 1){
				ini_add_new_question=0;
				addNew('sq_question','#newQuestionModal');
				}
				sq_category_parent('0');
				sq_category_parent3('0');
				applyMathajax();
			});
	});	 
	
}



function getQuestionList(p){
	var cid=0;
	$('.spinner-border').show();
	$('#rowContent').html("");	
		if(p=="p"){
		rowLimit += numberOfRowPerPage;
	}else{
		rowLimit -= numberOfRowPerPage;
	}
	if(p=="0"){ 
		rowLimit=0;
	}
	if(rowLimit < 0){
		rowLimit=0;
	}
	if(rowLimit<=0){
		$('#backBtn').hide();
	}else{
		$('#backBtn').show();
	}
	
	$('.category_id3').each(function(){
			if($(this).val() != "0"){
			cid=$(this).val();
			}
	});	
	
	var search=$('#search').val();
	let arg;
	if(search !=""){
	 arg={user_token:localStorage.getItem('user_token'),limit:0,search:search};		
	}else{
	 arg={user_token:localStorage.getItem('user_token'),limit:rowLimit,maxRowsPerPage:numberOfRowPerPage,cid:cid};
	}
			$.post(api_site_url+"qbank/getList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>    <a class='dropdown-item' href=javascript:editQuestion('sq_question','#editQuestionModal','"+value.id+"'); >Edit</a>    <a class='dropdown-item' href=javascript:removeRowQuestion('sq_question','"+value.id+"');>Remove</a>  </div></div>"
						var hiddenRow="<tr><td><input type='checkbox' class='selectRow' value='"+value.id+"'></td><td>"+value.id+"</td><td>"+value.question_type+"</td><td>"+value.question+"</td><td>"+value.category_name+"</td><td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 

					});
				}else{
					flashMessage(result.message);
				}
			$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
						sq_category_parent('0');
					applyMathajax();	 
			});				
	
}


function editQuestion(contr,mid,id){
	localStorage.setItem('qid',id);
	$('#edit-questionForm-1').hide();
	$('#edit-questionForm-2').hide();
	$('#edit-questionForm-3').hide();
	$('#edit-questionForm-4').hide();
	$('.REMOVECLASS').remove();
	$(mid).modal('show');
	const arg={user_token:localStorage.getItem('user_token'),id:id};
	
			$.post(api_site_url+"qbank/getQuestion",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
							optionNumber=1;
							localStorage.setItem('question_type',result.data.question_type);
							if(result.data.question_type == "Multiple Choice Single Answer"){
								$('#edit-questionForm-1').show();	
								$('#edit-f1-question').val(result.data.question);
								$('#edit-f1-description').val(result.data.description);
								
								for(var j=1; j < result.options.length; j++){
									addMoreOption('#edit-f1-options','#edit-f1-default-option');
								}
								$(result.options).each(function(index,value){
									$('.edit-f1-option').each(function(i,v){
										if(index == i){
											$(this).val(value.question_option);	
										}
									});
								});
								$(result.options).each(function(index,value){
									console.log(value);
									$('.edit-f1-oid').each(function(i,v){
										if(index == i){
											$(this).val(value.id);	
										}
									});
								});
								$(result.options).each(function(index,value){
									$('.edit-f1-option-correct').each(function(i,v){
										if(index == i){
											$(this).val(i);	
											if(parseFloat(value.score) > 0){
												$(this)[0].checked = true;
											}
										}
									});
								});
							}
							if(result.data.question_type == "Multiple Choice Multiple Answers"){
								$('#edit-questionForm-2').show();	
								$('#edit-f2-question').val(result.data.question);
								$('#edit-f2-description').val(result.data.description);
								for(var j=1; j < result.options.length; j++){
									addMoreOption('#edit-f2-options','#edit-f2-default-option');
								}
								$(result.options).each(function(index,value){
									$('.edit-f2-option').each(function(i,v){
										if(index == i){
											$(this).val(value.question_option);	
										}
									});
								});
								$(result.options).each(function(index,value){
									$('.edit-f2-oid').each(function(i,v){
										if(index == i){
											$(this).val(value.id);	
										}
									});
								});
								$(result.options).each(function(index,value){
									$('.edit-f2-option-correct').each(function(i,v){
										if(index == i){
											$(this).val(i);	
											if(parseFloat(value.score) > 0){
												$(this)[0].checked = true;
											}
										}
									});
								});
							}
							if(result.data.question_type == "Short Answer"){
								$('#edit-questionForm-3').show();	
								$('#edit-f3-question').val(result.data.question);
								$('#edit-f3-description').val(result.data.description);
								$(result.options).each(function(index,value){
									$('.edit-f3-option').val(value.question_option);
								});
								 
							}
							if(result.data.question_type == "Long Answer"){
								$('#edit-questionForm-4').show();
								$('#edit-f4-question').val(result.data.question);
								$('#edit-f4-description').val(result.data.description);								
							}
					
				}
			});
	
}



function submitAddQuestion(){
	saveTinymceContent();
	$('.spinner-border').show();
		var category_id="0";
		$('.category_id').each(function(){
			if($(this).val() != "0"){
			category_id=$(this).val();
			}
		});
		if(category_id == "0"){
			flashMessage("Select any category");
			return false;
		}
		var question_type=$('#sq_question-question_type').val();
		var fData="";
		if(question_type == "Multiple Choice Single Answer"){
			fData=JSON.stringify($('#form-1').serializeArray()); 
		}
		if(question_type == "Multiple Choice Multiple Answers"){
			fData=JSON.stringify($('#form-2').serializeArray()); 
		}
		if(question_type == "Short Answer"){
			fData=JSON.stringify($('#form-3').serializeArray()); 
		}
		if(question_type == "Long Answer"){
			fData=JSON.stringify($('#form-4').serializeArray()); 
		}
		const arg={user_token:localStorage.getItem('user_token'),category_id:category_id,fData:fData,question_type:question_type};
		$.post(api_site_url+"qbank/add",arg,function(data){	
			var result=JSON.parse(data.trim());
				if(result.status=="success"){
					flashMessage(result.message);
					$('#newQuestionModal').modal('hide');
					sq_question();
				}else{
					flashMessage(result.message);
					$('#newQuestionModal').modal('hide');
				}
				
		});	
}




function updateQuestion(){
	saveTinymceContent();
	$('.spinner-border').show();
		var question_type=localStorage.getItem('question_type');
		var qid=localStorage.getItem('qid');
		 
		var fData="";
		if(question_type == "Multiple Choice Single Answer"){
			fData=JSON.stringify($('#edit-form-1').serializeArray()); 
		}
		if(question_type == "Multiple Choice Multiple Answers"){
			fData=JSON.stringify($('#edit-form-2').serializeArray()); 
		}
		if(question_type == "Short Answer"){
			fData=JSON.stringify($('#edit-form-3').serializeArray()); 
		}
		if(question_type == "Long Answer"){
			fData=JSON.stringify($('#edit-form-4').serializeArray()); 
		}
		const arg={user_token:localStorage.getItem('user_token'),id:qid,fData:fData,question_type:question_type};
		$.post(api_site_url+"qbank/edit",arg,function(data){	
			var result=JSON.parse(data.trim());
				if(result.status=="success"){
					flashMessage(result.message);
					$('#editQuestionModal').modal('hide');
					sq_question();
				}else{
					flashMessage(result.message);
					$('#editQuestionModal').modal('hide');
				}
				
		});	
}






function removeRowQuestion(contr,id){
	if(confirm("Do you really want to remove this entry")){
		
		const arg={user_token:localStorage.getItem('user_token'),id:id};
		$.post(api_site_url+"Qbank/remove",arg,function(data){
			var result=JSON.parse(data.trim());
			flashMessage(result.message);
			// call function to reload current page
			window[contr]();
		});
	
	}
}



















function addMoreOption(i,k){
	optionNumber+=1;
	var d=$(k).html();
	console.log(optionNumber);
	d=d.replace('1',optionNumber);
	d=d.replace('xxxx',optionNumber);
	console.log(d);
	d=d.replace('DYCLASS','REMOVECLASS');
	$(i).append(d);
	
	
}




function toggleOption(v){
	if(v=="Multiple Choice Single Answer" || v=="Multiple Choice Multiple Answers"){
		$('#nOptionHolder').show();
		$('#nOption').val('4');
	}
	if(v=="Short Answer"){
		$('#nOptionHolder').hide();
		$('#nOption').val('1');
	}
	if(v=="Long Answer"){
		$('#nOptionHolder').hide();
		$('#nOption').val('0');
	}
}


function submitAddPreQuestion(){
	$('#preQuestionForm').hide();
	$('#nextBtnQuestion').hide();
	$('#backBtnQuestion').show();
	$('#submitButtonQuestion').show();
	optionNumber=1;
	$('.REMOVECLASS').remove();

	 if($('#sq_question-question_type').val()=="Multiple Choice Single Answer"){
		$('#questionForm-1').show(); 
			var i=parseInt($('#nOption').val());
			for(var j=2; j <= i; j++){
				addMoreOption('#f1-options','#f1-default-option');
			}
	 }else if($('#sq_question-question_type').val()=="Multiple Choice Multiple Answers"){
		$('#questionForm-2').show();
			var i=parseInt($('#nOption').val());
			for(var j=2; j <= i; j++){
				addMoreOption('#f2-options','#f2-default-option');
			}		
	 }else if($('#sq_question-question_type').val()=="Short Answer"){
		$('#questionForm-3').show(); 
	 }else if($('#sq_question-question_type').val()=="Long Answer"){
		$('#questionForm-4').show(); 
	 }
	

}

function showPreQuestion(){
	$('#preQuestionForm').show();
	$('#nextBtnQuestion').show();
	$('#backBtnQuestion').hide();
	$('#submitButtonQuestion').hide();
	$('#questionForm-1').hide(); 
	$('#questionForm-2').hide(); 
	$('#questionForm-3').hide(); 
	$('#questionForm-4').hide(); 
	
	
}










function addNewQuiz(contr,modalId){
	$('#newQuizGroup').html('');
 	const arg={user_token:localStorage.getItem('user_token')};
	$.post(api_site_url+"user/getGroupList",arg,function(data){
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				var d="<input type='checkbox' class=' newQuizGids' value='"+value.id+"' name='gids'> "+value.group_name+"<br>";
				 $('#newQuizGroup').append(d);
				 
			});
		}

	});
	
	$(modalId).modal('show');
	

}




var ini_add_new_quiz=0;
function sq_quiz_new(){
	ini_add_new_quiz=1;
	sq_quiz();
	
}


function removeRowQuiz(contr,id){
	if(confirm("Do you really want to remove this entry")){
		
		const arg={user_token:localStorage.getItem('user_token'),id:id};
		$.post(api_site_url+"quiz/remove",arg,function(data){
			var result=JSON.parse(data.trim());
			flashMessage(result.message);
			// call function to reload current page
			window[contr]();
		});
	
	}
}

	

function sq_quiz(){
	newQuizForm=1;
	$('#rowContent').html("");
	$('#title').html("Quiz list");
	$('.spinner-border').show();
	$.post("quizList.html",{},function(data){
		 $('#main_content').html(data);
		 let actype=1;
		 
		 	const arg={user_token:localStorage.getItem('user_token'),maxRowsPerPage:numberOfRowPerPage};
			var uri="getList";
			if(isAdminUser()){ 
			var uri="getList";
			}else{
			var uri="getMyList";
			}
			$.post(api_site_url+"quiz/"+uri,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>   <a class='dropdown-item' href=javascript:sq_quiz_add_questions('"+value.id+"'); >Add Questions</a>    <a class='dropdown-item' href=javascript:editQuiz('sq_quiz','#editQuizModal','"+value.id+"'); >Edit</a>    <a class='dropdown-item' href=javascript:removeRowQuiz('sq_quiz','"+value.id+"');>Remove</a>  </div></div>"
						var hiddenRow="<tr><td><input type='checkbox' class='selectRow' value='"+value.id+"'></td><td>"+value.id+"</td><td>"+value.quiz_name+"</td><td>"+unixToDateTime(value.start_datetime)+"</td><td>"+unixToDateTime(value.end_datetime)+"</td><td>"+value.duration+"</td><td><button class='btn btn-success' type='button' onClick='quizDetail("+value.id+");'>Attempt</button></td><td class=' admin-only' >"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
						if(isAdminUser()){ sq_category_parent('0'); }
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
				if(ini_add_new_quiz == 1){
				ini_add_new_quiz=0;
				addNewQuiz('sq_quiz','#newQuizModal');
				}
					hideAdminOnly();
			});
	});	 
	// numberOfRowPerPage=0;
}


function sqQuizList(p){
	newQuizForm=1;
	editQuizForm=1;
	$('#rowContent').html("");
	$('.spinner-border').show();
		if(p=="p"){
		rowLimit += numberOfRowPerPage;
	}else{
		rowLimit -= numberOfRowPerPage;
	}
	if(p=="0"){ 
		rowLimit=0;
	}
	if(rowLimit < 0){
		rowLimit=0;
	}
	if(rowLimit<=0){
		$('#backBtn').hide();
	}else{
		$('#backBtn').show();
	}
	var search=$('#search').val();
	let arg;
	if(search !=""){
	 arg={user_token:localStorage.getItem('user_token'),limit:0,search:search};		
	}else{
	 arg={user_token:localStorage.getItem('user_token'),limit:rowLimit,maxRowsPerPage:numberOfRowPerPage};
	}
			var uri="getList";
			if(isAdminUser()){ 
			var uri="getList";
			}else{
			var uri="getMyList";
			}
			$.post(api_site_url+"quiz/"+uri,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>   <a class='dropdown-item' href=javascript:sq_quiz_add_questions('"+value.id+"'); >Add Questions</a>   <a class='dropdown-item' href=javascript:editQuiz('sq_quiz','#editQuizModal','"+value.id+"'); >Edit</a>    <a class='dropdown-item' href=javascript:removeRowQuiz('sq_quiz','"+value.id+"');>Remove</a>  </div></div>"
						var hiddenRow="<tr><td><input type='checkbox' class='selectRow' value='"+value.id+"' ></td><td>"+value.id+"</td><td>"+value.quiz_name+"</td><td>"+unixToDateTime(value.start_datetime)+"</td><td>"+unixToDateTime(value.end_datetime)+"</td><td>"+value.duration+"</td><td><button class='btn btn-success' type='button' onClick='quizDetail("+value.id+");'>Attempt</button></td><td class='admin-only' >"+dropDownAction+"</td></tr>";
				 
						$('#rowContent').append(hiddenRow); 
						if(isAdminUser()){ sq_category_parent('0'); } 
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
				hideAdminOnly();
			});

 

}



function editQuiz(contrl,mid,id){
	localStorage.setItem('quid',id);
	
	$('#editQuizGroup').html('');
	const arg2={user_token:localStorage.getItem('user_token')};
	$.post(api_site_url+"user/getGroupList",arg2,function(data){
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				 var d="<input type='checkbox' class=' editQuizGids' value='"+value.id+"' name='gids'> "+value.group_name+"<br>";
				 $('#editQuizGroup').append(d);
			});
		}

	});
	
	
	
	$('#editQuizModal').modal('show');
	$('.spinner-border').show();
	
	
	const arg={user_token:localStorage.getItem('user_token'),limit:rowLimit,maxRowsPerPage:numberOfRowPerPage,id:id};
	 
			$.post(api_site_url+"quiz/getList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						
						$('#edit-quiz_name').val(value.quiz_name);
						$('#edit-description').val(value.description);
						$('#edit-start_datetime').val(unixToDateTime2(value.start_datetime).replace(" ","T"));
						$('#edit-end_datetime').val(unixToDateTime2(value.end_datetime).replace(" ","T"));
						$('#edit-max_attempt').val(value.max_attempt);
						$('#edit-correct_score').val(value.correct_score);
						$('#edit-duration').val(value.duration);
						$('#edit-show_result').val(value.show_result);
						$('#edit-show_result_on_date').val(unixToDateTime2(value.show_result_on_date).replace(" ","T"));
						$('#edit-min_pass_percentage').val(value.min_pass_percentage);
						$('#edit-incorrect_score').val(value.incorrect_score);
						$('#edit-instant_result').val(value.instant_result);
						$(value.gids.split(',')).each(function(i,v){
							  
							 $(".editQuizGids:checkbox[value="+v+"]").prop("checked","true");
						});
						
						 
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide(); 
			});
			
			
			
}

function addQuizNext(){
	newQuizForm += 1;
	if(newQuizForm < 1){
		newQuizForm=1;
	}
	if(newQuizForm >= 2){
		newQuizForm=2;
		$('#addNewNextBtn').hide();
		$('#addNewSubmitBtn').show();
	}else{
		$('#addNewNextBtn').show();
		$('#addNewSubmitBtn').hide();
	}
	if(newQuizForm > 1){
		$('#addNewBackBtn').show();
	}else{
		$('#addNewBackBtn').hide();
	}
	$('.newQuizForm').hide();
	$('#newQuizForm-'+newQuizForm).show();
	
}


function addQuizBack(){
	newQuizForm -= 1;
	if(newQuizForm < 1){
		newQuizForm=1;
	}
	if(newQuizForm >= 2){
		newQuizForm=2;
		$('#addNewNextBtn').hide();
		$('#addNewSubmitBtn').show();
	}else{
		$('#addNewNextBtn').show();
		$('#addNewSubmitBtn').hide();
	}
	if(newQuizForm > 1){
		$('#addNewBackBtn').show();
	}else{
		$('#addNewBackBtn').hide();
	}
	$('.newQuizForm').hide();
	$('#newQuizForm-'+newQuizForm).show();
	
}


function addQuizSubmit(){
	$('#formValidationNew').html('');
	if($('#sq_quiz-quiz_name').val()==""){
		$('#formValidationNew').html('Quiz Name required');
		return;
	}
	
	if($('#sq_quiz-start_datetime').val()==""){
		$('#formValidationNew').html('Start date time required');
		return;
	}
	if($('#sq_quiz-end_datetime').val()==""){
		$('#formValidationNew').html('End date time required');
		return;
	}
	let gids=0;
	$('.newQuizGids').each(function(){
		if($(this)[0].checked == true){
			gids +=1;
		}
	});
	if(gids==0){
		$('#formValidationNew').html('Asssign to one or more group');
		return;
	}
	saveTinymceContent();
	var fData=JSON.stringify($('#addQuizForm').serializeArray()); 
	$('.spinner-border').show();
	const arg={user_token:localStorage.getItem('user_token'),fData:fData};
	$.post(api_site_url+"quiz/add",arg,function(data){
		$('.spinner-border').hide();
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$('#newQuizModal').modal('hide');
			sq_quiz_add_questions(result.id);
		}
	});
	
	
}


















function editQuizNext(){
	editQuizForm += 1;
	if(editQuizForm < 1){
		editQuizForm=1;
	}
	if(editQuizForm >= 2){
		editQuizForm=2;
		$('#editNewNextBtn').hide();
		$('#editNewSubmitBtn').show();
	}else{
		$('#editNewNextBtn').show();
		$('#editNewSubmitBtn').hide();
	}
	if(editQuizForm > 1){
		$('#editNewBackBtn').show();
	}else{
		$('#editNewBackBtn').hide();
	}
	$('.editQuizForm').hide();
	$('#editQuizForm-'+editQuizForm).show();
	
}


function editQuizBack(){
	editQuizForm -= 1;
	if(editQuizForm < 1){
		editQuizForm=1;
	}
	if(editQuizForm >= 2){
		editQuizForm=2;
		$('#editNewNextBtn').hide();
		$('#editNewSubmitBtn').show();
	}else{
		$('#editNewNextBtn').show();
		$('#editNewSubmitBtn').hide();
	}
	if(editQuizForm > 1){
		$('#editNewBackBtn').show();
	}else{
		$('#editNewBackBtn').hide();
	}
	$('.editQuizForm').hide();
	$('#editQuizForm-'+editQuizForm).show();
	
}


function editQuizSubmit(){
	$('#formValidationEdit').html('');
	if($('#edit-quiz_name').val()==""){
		$('#formValidationEdit').html('Quiz Name required');
		return;
	}
	
	if($('#edit-start_datetime').val()==""){
		$('#formValidationEdit').html('Start date time required');
		return;
	}
	if($('#edit-end_datetime').val()==""){
		$('#formValidationEdit').html('End date time required');
		return;
	}
	let gids=0;
	$('.editQuizGids').each(function(){
		if($(this)[0].checked == true){
			gids +=1;
		}
	});
	if(gids==0){
		$('#formValidationEdit').html('Asssign to one or more group');
		return;
	}
	
	var fData=JSON.stringify($('#editQuizForm').serializeArray()); 
	$('.spinner-border').show();
	const arg={user_token:localStorage.getItem('user_token'),fData:fData,id:localStorage.getItem('quid')};
	$.post(api_site_url+"quiz/edit",arg,function(data){
		$('.spinner-border').hide();
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$('#editQuizModal').modal('hide');
			flashMessage(result.message); 
			sq_quiz();
		}
	});
	
	
}



function addQuestionIntoQuiz(e,id){
	if($(e).hasClass('btn-primary')){
		$(e).removeClass('btn-primary');
		$(e).addClass('btn-danger');
		$(e).html('Remove');
		const quid=localStorage.getItem('quid');
		const arg={user_token:localStorage.getItem('user_token'),quid:quid,qid:id};
		$.post(api_site_url+"quiz/addQuestionIntoQuiz",arg,function(data){

		});
	}else{
		$(e).addClass('btn-primary');
		$(e).removeClass('btn-danger');	
		$(e).html('Add');
		const quid=localStorage.getItem('quid');
		const arg={user_token:localStorage.getItem('user_token'),quid:quid,qid:id};
		$.post(api_site_url+"quiz/removeQuestionIntoQuiz",arg,function(data){

		});

	}

} 

 

function sq_quiz_add_questions(id){
	showAssignedQuestions=0;
	localStorage.setItem('quid',id);
	$('#rowContent').html("");
	$('#title').html("Add question into quiz");
	$('.spinner-border').show();
	$.post("questionListQuiz.html",{},function(data){
		 $('#main_content').html(data);
		 	const arg={user_token:localStorage.getItem('user_token')};
			$.post(api_site_url+"qbank/getList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<button id='qid-"+value.id+"' onclick='addQuestionIntoQuiz(this,"+value.id+")'class='btn btn-primary'>Add</button>";
						var hiddenRow="<tr> <td>"+value.id+"</td> <td>"+value.question_type+"</td><td>"+value.question+"</td><td>"+value.category_name+"</td><td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
						 
					});
					applyMathajax();
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();

			let arg={user_token:localStorage.getItem('user_token'),id:id};
	 
			$.post(api_site_url+"quiz/getList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						$('#quizName').html('#'+value.id+ ' '+value.quiz_name);
						localStorage.setItem('qids',value.qids);
						addedBtn();
					});
				}
			});
			
			
			
			});
			sq_category_parent4('0');
				hideAdminOnly();
	});		
	
}








function getQuestionListQuiz(p){
	var cid=0;
	$('.spinner-border').show();
	$('#rowContent').html("");	
		if(p=="p"){
		rowLimit += numberOfRowPerPage;
	}else{
		rowLimit -= numberOfRowPerPage;
	}
	if(p=="0"){ 
		rowLimit=0;
	}
	if(rowLimit < 0){
		rowLimit=0;
	}
	if(rowLimit<=0){
		$('#backBtn').hide();
	}else{
		$('#backBtn').show();
	}
	$('.category_id4').each(function(){
			if($(this).val() != "0"){
			cid=$(this).val();
			}
	});	
	var search=$('#search').val();
	let arg;
	if(search !=""){
	 arg={user_token:localStorage.getItem('user_token'),limit:0,search:search};		
	}else{
		
		 
	 arg={user_token:localStorage.getItem('user_token'),limit:rowLimit,cid:cid,showAssignedQuestions:showAssignedQuestions,quid:localStorage.getItem('quid')};
	}
	if(showAssignedQuestions == 1){
		$('#orderCol').show();
	}else{
		$('#orderCol').hide();
	}
			$.post(api_site_url+"qbank/getList",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var orderEle="";
						if(showAssignedQuestions == 1){
						var dropDownAction="<button id='qid-"+value.id+"' onclick='addQuestionIntoQuiz(this,"+value.id+")'class='btn btn-primary'>Add</button>";
							 orderEle="<td><input type='number' class='qno-order' value='"+(index)+"' data-qid='"+value.id+"' style='width:50px;' ></td>";
						}else{
						var dropDownAction="<button id='qid-"+value.id+"' onclick='addQuestionIntoQuiz(this,"+value.id+")'class='btn btn-primary'>Add</button>";
							
						}
						var hiddenRow="<tr> <td>"+value.id+"</td> <td>"+value.question_type+"</td><td>"+value.question+"</td><td>"+value.category_name+"</td>"+orderEle+"<td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
						 
					});
				}else{
					flashMessage(result.message);
				}
			$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
				
							const quid=localStorage.getItem('quid');
							let arg={user_token:localStorage.getItem('user_token'),id:quid};
							$.post(api_site_url+"quiz/getList",arg,function(data){
								var result=JSON.parse(data.trim());
								if(result.status=="success"){
									$(result.data).each(function(index,value){
										$('#quizName').html('#'+value.id+ ' '+value.quiz_name);
										localStorage.setItem('qids',value.qids);
										addedBtn();
									});
								}
							});
			
			applyMathajax();
				
			});				
	
}




function saveQorder(){
	var orderNumer=[];
	var qids=new Map();
	let final_qids={};
	$('.qno-order').each(function(){
		
		var i=parseInt($(this).val());
		var qid=$(this).attr('data-qid');
		
		if(orderNumer.indexOf(i) < 0){
			orderNumer.push(i);
			qids.set(i,qid);
		}else{
			flashMessage("Duplicate order number");
			return false;
		}
	});
	 qids.forEach((value, key) => {  
		final_qids[key] = value  
	});  
	let assigned_qids=JSON.stringify(final_qids);
	const quid=localStorage.getItem('quid');
	let arg={user_token:localStorage.getItem('user_token'),quid:quid,assigned_qids:assigned_qids};
	$.post(api_site_url+"quiz/changeQidsOrder",arg,function(data){
		var result=JSON.parse(data.trim());
		flashMessage(result.message);
		if(result.status=="success"){
			getQuestionListQuizAssigned();
		}
	});
	
}


function getQuestionListQuizAssigned(){
 			
	showAssignedQuestions=1;
	getQuestionListQuiz('0');
}



function getQuestionListQuizAll(){
 			
	showAssignedQuestions=0;
	getQuestionListQuiz('0');
}


function addedBtn(){
	var qids=localStorage.getItem('qids').split(',');
	$(qids).each(function(index,value){
		$('#qid-'+value).removeClass('btn-primary');
		$('#qid-'+value).addClass('btn-danger');
		$('#qid-'+value).html('Remove');
		
	});
	
}












function quizDetail(id){
	localStorage.setItem('quid',id);
	$('#rowContent').html("");
	$('#title').html("Attempt Quiz");
	$('.spinner-border').show();
	$.post("quizDetail.html",{},function(data){
		$('#main_content').html(data);
		 var uri="getList";
			if(isAdminUser()){ 
			var uri="getList";
			}else{
			var uri="getMyList";
			}
			let arg={user_token:localStorage.getItem('user_token'),id:id};
			$.post(api_site_url+"quiz/"+uri,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						$('#quizName').html('#'+value.id+ ' '+value.quiz_name);
						var br="<br>";
						if($( window ).width() >= 1024){
							var br="";
						}
						$('#availableTime').html('Available time from '+br+'<span class="timechip">'+unixToDateTime(value.start_datetime)+ '</span> to  <span class="timechip">'+unixToDateTime(value.end_datetime)+'</span>');
						$('#description').html(value.description);
						$('#duration').html(value.duration);
						try{ $('#noq').html(value.qids.split(',').length); }catch(ex){  $('#noq').html('0'); }
						$('.spinner-border').hide();
						applyMathajax();
					});
				}
			});
	
	});	 
	
	
	
}






function valiDateTos(){
	if($('#tos')[0].checked==true){
		$('#attemptBtn').attr('disabled',false);
	}else{
		$('#attemptBtn').attr('disabled',true);
	}
}




function attemptQuiz(){
	var quid=localStorage.getItem('quid');
	$('.spinner-border').show();
		let arg={user_token:localStorage.getItem('user_token'),quid:quid};
		$.post(api_site_url+"quiz/validateQuiz",arg,function(data){
			var result=JSON.parse(data.trim());
				if(result.status=="success"){
				localStorage.setItem('rid',result.rid);
				window.location="quizAttempt.html";
				
				}else{
					flashMessage(result.message);
				}
			$('.spinner-border').hide();
		});
	
	
}








function countWords(str){
	return str.split(' ').length;
}




function viewResult(id){
	newQuizForm=1;
	$('#rowContent').html("");
	$('#title').html("Result list");
	$('.spinner-border').show();
	$.post("resultView.html",{},function(data){
		 $('#main_content').html(data);
		 	const arg={user_token:localStorage.getItem('user_token'),id:id};
			$.post(api_site_url+"result/view",arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){ 
					 
						$('#result_id').html('Result ID: #'+result.data.id);
						$('#duration').html(''+result.data.duration+" Min.");
						$('#quiz_name').html(result.data.quiz_name);
						$('#attempted_questions').html(result.data.attempted_no_questions);
						$('#max_score').html(result.data.max_score);
						$('#time_spent').html(result.data.time_spent_in_min);
						$('#incorrect_answers').html(result.data.no_incorrected);
						$('#correct_answers').html(result.data.no_corrected);
						$('#obtained_score').html(result.data.obtained_score);
						$('#result_status').html(result.data.result_status);
						$('#obtained_percentage').html(result.data.obtained_percentage+"%");
						$('#noq').html(''+((result.data.assigned_qids).split(',').length)+"");
						var assigned_qids=result.data.assigned_qids;
						var ind_score=result.data.ind_score.split(',');
						var ind_time=result.data.ind_time.split(',');
						var attempted_questions=result.data.attempted_questions.split(',');
						var response_time=result.data.response_time;
						 
						const arg={user_token:localStorage.getItem('user_token'),rid:id,assigned_qids:assigned_qids,response_time:response_time, ind_time:result.data.ind_time, ind_score:result.data.ind_score,attempted_questions:result.data.attempted_questions };
						$.post(api_site_url+"result/getQuestions",arg,function(data){
							$('#questionReport').html("<table class='table'><tr><td><i class='fa fa-check-circle status_icon_correct  '></i><br>Correct Answer</td><td><i class='fa fa-times-circle status_icon_incorrect  '></i><br>Incorrect Answer</td><td><i class='fa fa-check-circle status_icon_empty  '></i><br>Not Attempted</td></tr></table>");
							var questions=JSON.parse(data.trim());
							if(questions.status=="success"){
								console.log(questions.category_labels);
									$(questions.category_labels).each(function(ci,cval){
									 
										$('#categoryWise').append("<tr><td>"+cval.category_name+"</td><td>"+cval.total_questions+"</td><td>"+cval.attempted_question+"</td><td>"+cval.correct+"</td><td>"+cval.incorrect+"</td><td>"+cval.score+"</td><td>"+cval.time+"</td></tr>");
									});
								$(questions.data).each(function(index,value){
									let options="";
									let status_icon="<i class='fa fa-check-circle status_icon_correct fa-2x'></i> ";
									let yourAnswer="";
									let correctOption="";
									let updateScore="";
										
									$(value.options).each(function(i,v){
										let cl="";
										if(parseFloat(v.score) > 0){
											cl="result-correct-option";
											if(correctOption == ""){
											correctOption=atob(v.question_option);
											}else{
											correctOption=correctOption+","+atob(v.question_option);
											}
											
											if(value.user_response.indexOf(v.id) != -1)
											{  
											   if(yourAnswer == ""){
												yourAnswer=atob(v.question_option);
												}else{
												yourAnswer=yourAnswer+","+atob(v.question_option);
												}
											}
											
										}
										options=options+"<div class='result-option "+cl+"'>"+(i+1)+") "+atob(v.question_option)+"</div>";
									});
									
									 if(value.question.question_type=="Short Answer"){
												try{
													yourAnswer=value.user_response[0];
													correctOption="";
												}catch(ex){
													console.log(ex);
												}
								
									}
									 if(value.question.question_type=="Long Answer"){
												try{
													let strc=value.user_response[0];
													yourAnswer="<span class='result-sublabel'>Word count: "+countWords(value.user_response[0])+" &nbsp;&nbsp;&nbsp;&nbsp; Character  Count: "+(strc.length)+"</span><br>"+value.user_response[0];
													updateScore="<div class='admin-only updateScore'>Update marks for this answer: <input type='number' style='width:60px;' value='"+ind_score[index]+"'> <button type='button' class='btn btn-sm btn-primary' style='border-radius:0px;' onclick=updateScore("+id+","+index+",this); >Update</button></div>"; 
												}catch(ex){
													console.log(ex);
												}
								
									}
									if(parseInt(ind_score[index]) > 0){
										status_icon="<i class='fa fa-check-circle status_icon_correct fa-2x'></i> ";
									}else{
										if(parseInt(attempted_questions[index]) == 1){
											status_icon="<i class='fa fa-times-circle status_icon_incorrect fa-2x'></i> ";
										}else{
											status_icon="<i class='fa fa-exclamation-triangle status_icon_empty fa-2x'></i> ";
										}											
									}
									let qData="<div class='result-question-container'><div class='result-question'>"+status_icon+" <span class='result-ind_time'>Time spent: Approx. "+ind_time[index]+" Seconds</span><b>Q "+(index+1)+")</b> "+atob(value.question.question)+"</div><div class='result-options'>"+options+"</div><div class='result-correct-answer'><b>Correct Answers:</b> "+correctOption+"</div><div class='result-your-answer'><b>Your Answer:</b> "+yourAnswer+"</div><div class='result-description'><b>Description:</b><br>"+atob(value.question.description)+"</div>"+updateScore+"</div>";
									
									$('#questionReport').append(qData);
									
									
									


								});
								
								
									
									var ctx = document.getElementById('questionChart').getContext('2d');
									let correctBorder="rgb(54, 162, 235)";
									let incorrectBorder="rgb(255, 99, 132)";
									let naBorder="rgb(201, 203, 207)";
									
									let correctBG="rgba(54, 162, 235, 0.2)";
									let incorrectBG="rgba(255, 99, 132, 0.2)";
									let naBG="rgba(201, 203, 207, 0.2)";
let labels=[];								
let backgroundColor=[];								
let borderColor=[];	
let score=[];							
let tim=[];							
 $(assigned_qids.split(',')).each(function(i,v){
	 labels.push((i+1));
	tim.push(parseInt(ind_time[i]));
	score.push(parseInt(ind_score[i]));
	 
	 								if(parseInt(ind_score[i]) > 0){
										backgroundColor.push(correctBG);
										borderColor.push(correctBorder);
										
									}else{
										if(parseInt(attempted_questions[i]) == 1){
											backgroundColor.push(incorrectBG);
										borderColor.push(incorrectBorder);
										}else{
											backgroundColor.push(naBG);
											borderColor.push(naBorder);
										}											
									}
									
									
 });
 

const data = {
  labels: labels,
  datasets: [{
    label: '',
    data: tim,
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    borderWidth: 1
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
};
try{
var myChart = new Chart(ctx,config);
}catch(ex){ console.log(ex); }



var ctx2 = document.getElementById('scoreChart').getContext('2d');
									
const data2 = {
  labels: labels,
  datasets: [{
    label: '',
    data: score,
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    borderWidth: 1
  }]
};

const config2 = {
  type: 'line',
  data: data2,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
};
try{
var myChart = new Chart(ctx2,config2);
}catch(ex){ console.log(ex); }
								
									
							}
							hideAdminOnly();
						});
					 
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
					hideAdminOnly();
			});
	});
	
}



function updateScore(rid,qno,e){
	var score=$(e).prev('input').val();
	console.log(score);
	$('.spinner-border').show();
		 	const arg={user_token:localStorage.getItem('user_token'),id:rid,qno:qno,score:score};
			$.post(api_site_url+"quiz/updateScore",arg,function(data){
				var result=JSON.parse(data.trim());
				flashMessage(result.message);
				$('.spinner-border').hide();
			});
	
	
}



function sq_result(){
	newQuizForm=1;
	$('#rowContent').html("");
	$('#title').html("Result list");
	$('.spinner-border').show();
	$.post("resultList.html",{},function(data){
		 $('#main_content').html(data);
		 	const arg={user_token:localStorage.getItem('user_token'),maxRowsPerPage:numberOfRowPerPage};
			var uri="getList";
			if(isAdminUser()){ 
			var uri="getList";
			}else{
			var uri="getMyList";
			}
			$.post(api_site_url+"result/"+uri,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){ 
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>   <a class='dropdown-item' href=javascript:viewResult('"+value.id+"'); >View</a>    </div></div>"
						var hiddenRow="<tr><td>"+value.id+"</td><td>"+value.username+"</td><td>"+value.full_name+"</td><td>"+value.quiz_name+"</td><td>"+value.result_status+"</td><td>"+value.obtained_percentage+"%</td><td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
						 
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
				if(ini_add_new_quiz == 1){
				ini_add_new_quiz=0;
				addNewQuiz('sq_quiz','#newQuizModal');
				}
			});
			
				hideAdminOnly();
	});	 
	// numberOfRowPerPage=0;
	
	$('#group_id').html("<option value='0'>All</option>");
	const arg={user_token:localStorage.getItem('user_token')};
	$.post(api_site_url+"user/getGroupList",arg,function(data){
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$(result.data).each(function(index,value){
				$('#group_id').append("<option value='"+value.id+"'>"+value.group_name+"</option>"); 
			});
		}

	});
}


function getResultList(p){
	newQuizForm=1;
	$('#rowContent').html("");
	$('.spinner-border').show();
		if(p=="p"){
		rowLimit += numberOfRowPerPage;
	}else{
		rowLimit -= numberOfRowPerPage;
	}
	if(p=="0"){ 
		rowLimit=0;
	}
	if(rowLimit < 0){
		rowLimit=0;
	}
	if(rowLimit<=0){
		$('#backBtn').hide();
	}else{
		$('#backBtn').show();
	}
	var search=$('#search').val();
	let arg;
	if(search !=""){
	 arg={user_token:localStorage.getItem('user_token'),limit:0,search:search};		
	}else{
	 arg={user_token:localStorage.getItem('user_token'),limit:rowLimit,maxRowsPerPage:numberOfRowPerPage};
	}
			var uri="getList";
			if(isAdminUser()){ 
			var uri="getList";
			}else{
			var uri="getMyList";
			}
			$.post(api_site_url+"result/"+uri,arg,function(data){
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					$(result.data).each(function(index,value){
						var dropDownAction="<div class='dropdown'>  <button class='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>    Action  </button>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>   <a class='dropdown-item' href=javascript:viewResult('"+value.id+"'); >View</a>    </div></div>"
						var hiddenRow="<tr><td>"+value.id+"</td><td>"+value.username+"</td><td>"+value.full_name+"</td><td>"+value.quiz_name+"</td><td>"+value.result_status+"</td><td>"+value.obtained_percentage+"%</td><td>"+dropDownAction+"</td></tr>";
				
						$('#rowContent').append(hiddenRow); 
						 
					});
				}else{
					flashMessage(result.message);
				}
				$('.spinner-border').hide();
				$('.dropdown-toggle').dropdown();
			});

 

}






function generateResultReport(){
	
	const group_id=$('#group_id').val();
	const fromDate=$('#fromDate').val();
	const toDate=$('#toDate').val();
	
	const arg={user_token:localStorage.getItem('user_token'),group_id:group_id,fromDate:fromDate,toDate:toDate};
	$.post(api_site_url+"result/downloadReport",arg,function(data){
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			const downloadPath=result.path;
			const uri=api_site_url+"result/downloadFile/"+downloadPath;
			downloadURI(uri,downloadPath+".csv");
		}else{
			flashMessage(result.message);
		}

	});
	
	
}







function sq_setting(){
	
	$('#rowContent').html("");
	$('#title').html("Settings");
	$('.spinner-border').show();
	$.post("setting.html",{},function(data){
	$('#main_content').html(data);

	var arg={user_token:localStorage.getItem('user_token')};
	$('#settingRow').html('');
	$.post(api_site_url+"user/setting",arg,function(data){
		$('.spinner-border').hide();
		const result=JSON.parse(data);
		if(result.status=="success"){
			$(result.data).each(function(index,value){
			 
			var d="<div class='form-group'><label>SETTING_LABEL</label><input type='text' class='form-control' name='SETTING_NAME'  value='SETTING_VALUE'></div>";
			d=d.replace('SETTING_LABEL',value.label_name);
			d=d.replace('SETTING_NAME',value.setting_name);
			d=d.replace('SETTING_VALUE',value.setting_value);
			$('#settingRow').append(d);
			
			});
		}
	});
	
	});
	
}



function updateSetting(){
	
	var fData=JSON.stringify($('#formSetting').serializeArray()); 
	$('.spinner-border').show();
	const arg={user_token:localStorage.getItem('user_token'),fData:fData};
	$.post(api_site_url+"user/updateSetting",arg,function(data){
		$('.spinner-border').hide();
		var result=JSON.parse(data.trim());
		if(result.status=="success"){
			$('#editQuizModal').modal('hide');
			flashMessage(result.message); 
			 
		}
	});
	
	
}



function resetPassword(){
		
			$('.spinner-border').show();
			var inputEmail=$('#inputEmail').val();
			const arg={user_token:localStorage.getItem('user_token'),email:inputEmail};
			$.post(api_site_url+"login/resetPassword",arg,function(data){
				$('.spinner-border').hide();
				var result=JSON.parse(data.trim());
				if(result.status=="success"){
					 
					 
				}
				flashMessage(result.message); 
				
			});			
			
			
}


function myAccount(){
	
	$('#rowContent').html("");
	$('#title').html("My Account");
	$('.spinner-border').show();
	$.post("myAccount.html",{},function(data){
	$('#main_content').html(data);
	var user_data=JSON.parse(localStorage.getItem('user_data'));
	$('#sq_user-id').val(user_data.id);
	var arg={user_token:localStorage.getItem('user_token'),id:user_data.id};
	
	$.post(api_site_url+"user/myInfo",arg,function(data){
		$('.spinner-border').hide();
		const result=JSON.parse(data);
		if(result.status=="success"){
			$(result.data).each(function(index,value){
			 
				$('#sq_user-username-edit').val(value.username);
				$('#sq_user-email-edit').val(value.email);
				$('#sq_user-full_name-edit').val(value.full_name);
			});
		}
	});
	
	});
	
}



function updateMyAccount(){
	var full_name=$('#sq_user-full_name-edit').val();
	var email=$('#sq_user-email-edit').val();
	var password=$('#sq_user-password-edit').val();
	var id=$('#sq_user-id').val();
	if(full_name == "" || email == ""){
		flashMessage("Name and email required");
		return;
	}
	if(password !=""){
		if(confirm("Do you really want to change password?")){
			
		}else{
			return false;
		}
	}
	var arg={user_token:localStorage.getItem('user_token'),id:id,full_name:full_name,password:password,email:email};
	
	$.post(api_site_url+"user/updateMyAccount",arg,function(data){
		$('.spinner-border').hide();
		const result=JSON.parse(data);
		 flashMessage(result.message);
	});
	
}



function dashboardStat(){
	$('.spinner-border').show();
	var arg={user_token:localStorage.getItem('user_token')};
	
		$.post(api_site_url+"user/dashboardStat",arg,function(data){
		$('.spinner-border').hide();
		const result=JSON.parse(data);
		if(result.status=="success"){
			$('#user_count').html(result.data.user);
			$('#question_count').html(result.data.question);
			$('#quiz_count').html(result.data.quiz);
			$('#result_count').html(result.data.result);
		}
	});
	
	hideAdminOnly();
}




function sq_enterprise(){
	$('#title').html("Savsoftquiz.com - Enterprise Version");
		$('.spinner-border').show();
	var arg={sq_path:window.location.href};
	
		$.post("https://www.savsoftquiz.com/enterprise.php",arg,function(data){
		$('.spinner-border').hide();
		$('#main_content').html(data);
	});
	
}



function logout(){
	$('.spinner-border').show();

	var arg={user_token:localStorage.getItem('user_token')};
	$.post(api_site_url+"user/clearToken",arg,function(data){
		$('.spinner-border').hide();
		const result=JSON.parse(data);
		
	localStorage.removeItem('user_token');
	flashMessage(result.message);
	window.location="index.html";
	
	});
	
}



function hideAdminOnly(){
		var user_data=JSON.parse(localStorage.getItem('user_data'));
		if(parseInt(user_data.account_type_id) != 1){
			$('.admin-only').hide();
		}else if(parseInt(user_data.account_type_id) == 1){
			// $('.admin-only').show();
		}
}


function isAdminUser(){
	var user_data=JSON.parse(localStorage.getItem('user_data'));
		if(parseInt(user_data.account_type_id) == 1){
		return true;
		}else{
		return false;
		}
}











$(document).on('click','#selectAll',function(){
    $('input.selectRow:checkbox').not(this).prop('checked', this.checked);
});

$(document).on('click','.removeParent',function(){
	$(this).parent().parent().remove();
});


function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


function unixToDateTime(t){
	
	let unix_timestamp = t;
	var date = new Date(unix_timestamp * 1000);
	var year =  date.getFullYear();
	var month =  "0" + (date.getMonth()+1);
	var day =  "0" + date.getDate();
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	var formattedTime = year + '-' + month.substr(-2) + '-' + day.substr(-2) + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;

}


function unixToDateTime2(t){
	
	let unix_timestamp = t;
	var date = new Date(unix_timestamp * 1000);
	var year =  date.getFullYear();
	var month =  "0" + (date.getMonth()+1);
	var day =  "0" + date.getDate();
	var hours = "0" + date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	var formattedTime = year + '-' + month.substr(-2) + '-' + day.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;

}



function toggleEle2(id){
	$(id).toggle();
}

function toggleEle(v,id){
	if(v=="0"){
		$(id).hide();
	}
	if(v=="1"){
		$(id).show();
	}
}



  

function toggleEditor(){
		try{
		
		tinymce.init({
		  selector: 'textarea',
		  plugins: 'mathslate',
		});

	}catch(ex){ }
}


function saveTinymceContent(){
	try{ tinyMCE.triggerSave(); }catch(ex){ console.log(ex);} 
}



function applyMathajax(){
try{ MathJax.Hub.Typeset(); }catch(ex){ console.log(ex); }
}
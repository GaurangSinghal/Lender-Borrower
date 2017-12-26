var express = require('express');
var router = express.Router();
var userModel  = require("../schema/users");
var creditModel= require("../schema/creditRequest");

// registeration
router.post('/register',function(req,res)
{   //console.log(req.body);
	var user=new userModel(req.body);

	if(req.body.role==='Lender')
	{   userModel.find({role:'Lender'}, function(err, users)
		{   if(err)
				res.send(err);
			else if(users.length)
				res.send("There is already a lender registered in the system.")
			else
			{   userModel.find({email:req.body.email}, function(err, users)
				{   if(err)
						res.send(err);
					else if(users.length)
					{	console.log("This email is already taken");
						res.send("This email is already taken");
					}
					else
					{   user.save(function(err,doc)
						{   if(err)
								res.send(err);
							else    
								res.send({"result":"success"});
						});     
					}   
				});
			}                 
		});       
	}
	else
	{   userModel.find({email:req.body.email}, function(err, users)
		{   if(err)
			{	console.log(err);
				res.send(err);
			}
			else if(users.length)
				res.send("This email is already taken");
			else
			{   user.save(function(err,doc)
				{   if(err)
					{	console.log(err);
						res.send(err);
					}
					else    
						res.send({"result":"success"});
				});     
			}   
		});
	}
});



// login
router.post('/login',function(req,res)
{   //console.log(req.body);
	var email= req.body.email;
	var password= req.body.password;
	var role= req.body.role;
	userModel.authenticate(email, password, role, function(err, user)
		{   if(err)
			  {	console.log(err);
			  	res.send(err);
			  }                      
			else
			{   if(!user)
				{	console.log("Wrong Username Or Password");
					res.send("Wrong Username Or Password");
				}	      
				else
				{   //console.log(req.session);
					req.session.user=user;    
					//console.log(req.session);  
					//console.log("logged in");
					res.send({"result":"success"});     
				}
			}
		});
});



// Welcome page for a registered user
router.get('/profile',function(req,res)
	{   
		if(!req.session.user)
		{	console.log("session expired");
			res.json({"result":"fail"});			
		}
		else
		{	//console.log("Inside server side dashboard fuction");
			res.send({"result":"yes"});			
		}
	        
	});
	



// Log Out
router.delete('/logout',function(req,res)
	{   //console.log("logged out");
		req.session.destroy();
		res.send({"result":"success"});    
	});




// to get the list of all users in the database
router.get('/users',function(req,res)
{   
	userModel.find({}, function(err, users)
		{   if(!err)
				res.json(users);    
		});
});




// New credit request by a user
router.post('/newCreditRequest', function(req, res)
{   //console.log(req.body);
	var amnt=req.body.amount;
	userModel.findOne({_id:req.session.user._id}, function(err, user)
	{   if(err)
			res.send(err);
		else 
		{   user.credit=user.credit-amnt;
			user.save(function(err, doc)
			{   if(err)
					res.send("credit request exceeded");
				else
				{   var credit=new creditModel();
					credit.userId=req.session.user._id;
					credit.requestedBy= user.FirstName+" "+user.LastName;
					credit.requestedAt= Date();
					credit.amount=amnt;
					credit.isRepaymentDone=false;

					credit.save(function(err, doc)
					{   if(err)
							res.send(err);
						else                                                            
							res.json(doc);               
					});                 
				}   
			});             
		}               
	}); 
});

// All credit requests by a user 
router.get('/userRequests', function(req,res)
	{   /*if(req.session.user)
			console.log(req.session.user._id);*/
		creditModel.find({ userId: req.session.user._id}, function(err, doc)
		{   if(err)
				res.send(err);
			else
			{	console.log(doc);
				res.json(doc);
			}                          
		})          
});

// List of all the borrowers in the system
router.get('/borrowers', function(req,res)
	{   userModel.find({role:'Borrower'}, function(err, doc)
		{   console.log(doc);
			if(err)
				res.send(err);
			else
				res.json(doc);                          
		})          
});

// All credit requests by all users
router.get('/allRequests', function(req,res)
	{   creditModel.find({}, function(err, doc)
		{   console.log(doc);
			if(err)
				res.send(err);
			else
				res.json(doc);                          
		})          
});

router.put('/done/:id',function(req,res)
	{   var id=req.params.id; 
		creditModel.findOne({_id:id}, function(err, doc)
			{   if(err)
					res.send(err);
				else if(!doc)
					res.send("ID is wrong");
				else
				{   doc.isRepaymentDone=true;
					doc.repaymentDate=Date();
					doc.save(function(err,saveddoc)
					{   if(err)
						{	console.log(err);
							res.send(err);
						}
						else
						{	console.log(saveddoc);
							userModel.findOne({_id:saveddoc.userId}, function(err,user)
							{   if(err)
									console.log(err);
								else if(user)
								{   user.credit=user.credit+saveddoc.amount;     
									user.save(function(err,saveduser)
									{   if(err)
										{	console.log(err);
											res.send(err);
										}
										else
										{	console.log(saveduser);
											res.send(saveduser);      
										}                  
									})  
								}  
								else
								{	console.log("ID not found");									
								}  
							}) 									
						}                     
					})					         
						
				}                       
			})          
	});


module.exports=router;
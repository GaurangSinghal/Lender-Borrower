var mongoose   = require('mongoose');
var bcrypt 	   = require('bcrypt');

var userSchema= new mongoose.Schema(
{	FirstName: {type:String, required:true},
	LastName: {type:String, required:true},
	email: {type:String, required:true},
	role: {type:String, enum:['Borrower', 'Lender']},
	password : {type:String, required:true},
	credit : {type:Number, min:0, max:100000, default:100000}
});

userSchema.statics.authenticate = function(email, password, role, callback)
{	
	User.findOne({email: email, role: role}, function(err, user)
	{   if(err)
		{   //cosnole.log("error here");
			return callback(err); 
		}                     
		else
		{   if(!user)
			{	console.log(email+" "+role);
				return callback();
			}      
			else
			{	//console.log("user password: "+user.password);
			    bcrypt.compare(password, user.password, function(err,result)
				{	if(err)
					{	console.log("error here");
						return callback(err);
					}
					else if(result===true)
					{	
						return callback(null,user); 						
					}		
					else
					{	
						return callback();					
					}			
				})
				     
			}
		}
	});
}

userSchema.pre('save', function(next)
{	var user=this;
	
	bcrypt.hash(user.password, 10, function(err, hash) 
		{	if(err)
				return next(err);
			console.log(hash);	
			user.password=hash;
			next();	
		});	
});	

var User=mongoose.model('User',userSchema);
module.exports=User;
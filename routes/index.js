var express = require('express');
var router = express.Router();
const commentController = require('../controllers/commentController');
const postController = require('../controllers/postController');
var userController = require('../controllers/userController')
const jwt = require('jsonwebtoken')


function authtoken(req,res,next){
  
        // check header or url parameters or post parameters for token
     const authorization = req.headers.authorization;
      console.log(26,authorization)
      var token; 
      if(req.headers.authorization){
      const len = authorization.length;
      token = authorization.substring(6, len);
      // console.log("from middleware",token, typeof token);
        
      }
        if(token){
          //Decode the token
          jwt.verify(token.trim(),"passmaster",(err,decod)=>{
            if(err){
              res.status(403).json({
                message:"Wrong Token"
              });
	          console.log("wrong token")

            }
            else{
              //If decoded then call next() so that respective route is called.
              req.decoded=decod;
              next();
            }
          });
        }
        else{
          res.status(403).json({
            message:"No Token"
          });
          console.log("no token")
        }
}







router.post('/register/user', (req,res)=>{

})

router.get('/users', userController.user_get_list);

router.post('/users/login', userController.login);

router.post('/users/create', userController.user_create);

router.get('/users/posts/:userid', userController.user_posts);


/*router.post('/users/create', function (req, res) {
  res.send(req.body)
});
*/

router.post('/users/delete/:id', userController.user_delete);
router.get('/posts', postController.post_list);

router.get('/posts/comments/:id', postController.post_detail);

router.post('/posts/create',authtoken, postController.create_post);

router.post('/posts/delete/:postid',authtoken, postController.post_delete);

router.post('/posts/update/:postid',authtoken, postController.post_update);




router.get('/comments', commentController.comment_list);

router.get('/posts/:id/comments', commentController.get_comment);


router.post('/comments/create',authtoken, commentController.comment_create);

router.post('/comments/delete/:id',authtoken, commentController.comment_delete)




module.exports = router;

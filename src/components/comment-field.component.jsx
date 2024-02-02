import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster,toast } from "react-hot-toast";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentField = ({action, index = undefined, replyingTo = undefined, setReplying}) =>{
 
    
    const [comment, setComment] = useState("");
    const { blog, blog:{ _id, author: { _id: blog_author},  comments,comments: { results : commentsArr },activity,activity:{total_comments ,total_parent_comments}}, setBlog,setTotalParentCommentsLoaded } = useContext(BlogContext);
    
const {userAuth:{access_token, username , fullname, profile_img}} = useContext(UserContext);



const handleComment =() =>
{
    if(!access_token){
        return toast.error("Login first to leave a comment")
    }
    if(!comment.length){
        return toast.error("Write Something to leave a comment...")
    }
     axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/add-comment",{ _id, blog_author, comment, replying_to: replyingTo},
     {
        headers:{
            'Authorization': `Bearer ${access_token}`
        }
     }).then(({data}) =>{
        console.log(data);
        setComment("");
        data.commented_by = { personal_info: {username, profile_img, fullname }} 
        let newCommentArr;

        if(replyingTo){
            commentsArr[index].children.push(data._id);
            data.childrenLevel = commentsArr[index].childrenLevel + 1;
            data.parentIndex = index;
            commentsArr[index].isReplyLoaded =true;
            commentsArr.splice(index + 1, 0, data);
            newCommentArr = commentsArr;
            setReplying(false);
        }else {

            data.childrenLevel = 0;

            newCommentArr = [data, ...commentsArr];
        }
       

        let ParentCommentIncreamentVal = replyingTo ? 0 : 1; // its ParentCommentIncreamentVal

        setBlog({...blog, comments: {...comments, results: newCommentArr},activity: { ...activity, total_comments: total_comments + 1,total_parents_comments: total_parent_comments + ParentCommentIncreamentVal}})

        setTotalParentCommentsLoaded (preVal => preVal + ParentCommentIncreamentVal)
     })
     .catch(err => {
        console.log(err);
     })
}
    return(
       <>
       <Toaster/>
       <textarea value={comment} onChange={(e)=>{
        setComment(e.target.value)
       }} placeholder="Leave a Comment..." className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"></textarea>
       <button className="btn-dark mt-5 px-10" onClick = {handleComment}>{action}</button>
       </>
    )
}
export default CommentField
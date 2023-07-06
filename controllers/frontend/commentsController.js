import Comments from '../../models/comments.js';
import Party from '../../models/party.js';
const addComment = async(req, res, next) => {
    // obtain comment
    const {comment} = req.body;
    // Add the comment on to the database
    await Comments.create({
        message: comment,
        userId: req.user.id,
        partyId: req.params.id
    });
    // Redirect to the same page
    res.redirect('back');
    next();
}
const deleteComment = async(req, res, next) => {
    // Get the comment ID
    const {commentId} = req.body;
    // Check the comment
    const comment = await Comments.findOne({where: {id: commentId}});
    // Verify that the comment exists in the database
    if(!comment) {
        res.status(404).send('Action not allowed');
        return next();
    };
    // Check the party of the comment
    const party = await Party.findOne({where: {id: comment.partyId}});
    // Check the user of the comment before deleting the comment
    if(comment.userId === req.user.id || party.userId === req.user.id) {
        await Comments.destroy({where: {id: comment.id}});
        res.status(200).send('Comment deleted successfully');
        return next();
    }else{
        res.status(403).send('Action not allowed');
        return next();
    }
}
export {addComment, deleteComment};
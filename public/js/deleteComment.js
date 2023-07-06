import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const deleteComments = document.querySelectorAll(".delete-comment");
  // If exist any comments iterate through all
  if (deleteComments.length > 0) {
    deleteComments.forEach((comment) => {
      comment.addEventListener("submit", deleteComment);
    });
  }
});

function deleteComment(e) {
  e.preventDefault();
  Swal.fire({
    title: "Delete comment?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0800ff",
    cancelButtonColor: "#d80000",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, thanks",
  }).then((result) => {
    if (result.value) {
      // Get the comment id
      const commentId = this.children[0].value;
      // Create the object
      const data = {
          commentId
      }
      // Execute Axios with the data
      axios.post(this.action, data).then((response) => {
        Swal.fire("Deleted", response.data, "success");
        // Delete from the dom
        this.parentElement.parentElement.remove();
      }).catch((error) => {
        if(error.response.status === 403 || error.response.status === 404){
          Swal.fire("Error", error.response.data, "error");
        }
      });
    }
  });
}

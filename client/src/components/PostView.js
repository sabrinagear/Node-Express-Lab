import React, { Component } from "react";
import axios from "axios";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";

//PostView is the class that displays a single note. This class deploys the editNote() and deleteNote() functions, which live in the App.js file

class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      open: false
    };
  }

  //Mounts fetched note from fetch() function to state
  componentDidMount() {
    window.scrollTo(0, 0);
    const id = this.props.match.params.id;
    console.log(id);
    this.fetch(id);
  }

  //Fetches an individual note by id and sets its values to state of this component.
  fetch = id => {
    axios
      .get(`https://node3-practice.herokuapp.com/api/posts/${id}`)
      .then(res => {
        console.log("PostView", res);
        this.setState(() => ({
          id: res.data[0].id,
          title: res.data[0].title,
          contents: res.data[0].contents
        }));
      })
      .catch(err => {
        console.dir(err);
      });
  };

  /****** Edit Handling Functions *******/

  //Toggles the edit form
  toggleEdit = e => {
    e.preventDefault();
    this.setState({ editing: true });
  };

  //Validates form input and then triggers edit() function
  editSubmitHandler = e => {
    e.preventDefault();
    if (this.state.title.length < 1 || this.state.contents.length < 1) {
      alert("Field cannot be empty!");
    } else {
      this.props.editPost({
        id: this.state.id,
        title: this.state.title,
        contents: this.state.contents
      });
      this.setState({
        editing: false
      });
    }
  };

  //Change Handler
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  /****** Delete Handling Functions *******/

  //Opens delete modal
  openModal = () => {
    this.setState({ open: true });
  };

  //Closes delete modal
  closeModal = () => {
    this.setState({ open: false });
  };

  //Triggers the delete function and renders the main page view
  delete = e => {
    e.preventDefault();
    this.props.deletePost(this.state.id);
    this.props.history.push("/");
  };

  render() {
    const { open, title, contents } = this.state;

    if (this.state.editing) {
      return (
        <div className="edit-form">
          <div className="edit-head">
            <h1>Edit Note:</h1>
          </div>

          <form onSubmit={this.editSubmitHandler}>
            <div>
              <input
                className="edit-title"
                name="title"
                type="text"
                placeholder="new title"
                value={title}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <textarea
                className="edit-body"
                name="contents"
                type="textarea"
                placeholder="new note"
                value={contents}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <button className="form-submit" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="note-view">
        <div className="svg" />
        <div className="note-title">{this.state.title}</div>

        <div className="note-body">
          <p>{this.state.contents}</p>
        </div>
        <div className="note-buttons">
          <button onClick={this.toggleEdit}>edit</button>

          <button onClick={this.openModal}>delete</button>
        </div>
        <Modal
          open={open}
          onClose={this.closeModal}
          center
          showCloseIcon={false}
        >
          <div className="modal">
            <p>Are you sure you want to delete this?</p>

            <button className="modal-delete" onClick={this.delete}>
              Delete
            </button>
            <button onClick={this.closeModal} className="modal-no">
              No
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

//Type validation for props
PostView.propTypes = {
  id: PropTypes.string,
  editPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

export default PostView;



document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 4066 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetchImage();

  addLikeListener();

  addCommentListener();

  addDeleteListener();

  function addDeleteListener() {
    const commentsUl = document.getElementById('comments')
    commentsUl.addEventListener('click', function(event) {
      if (event.target.className === 'delete-btn') {
        const target = event.target
        const deleteId = target.previousElementSibling.id
        target.previousElementSibling.remove()
        target.remove()


        fetch(`https://randopic.herokuapp.com/comments/${deleteId}`, {method: 'DELETE'})
        .then(resp => resp.json())
        .then(message => console.log(message))
      }
    })
  }



  function addCommentListener() {
    const commentsUl = document.getElementById('comments')
    const commentForm = document.getElementById('comment_form')

    commentForm.addEventListener('submit', function(event) {
      event.preventDefault()

      const newComment = document.createElement('li')
      const deleteBtn = document.createElement('button')
      deleteBtn.innerText = 'Delete'
      deleteBtn.className = 'delete-btn'
      newComment.innerText = event.target.children[0].value
      commentsUl.append(newComment, deleteBtn)

      const reqObj = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_id: imageId, content: newComment.innerText })
      }

      fetch(commentsURL, reqObj)
      .then(resp => resp.json())
      .then(comment => {
        newComment.id = comment.id
      })

      event.target.reset()
    })
  }
  



  function fetchImage() {
    // fetch request to imageURL
    // grab each specific tag that requires image info and add it to them 
  
    fetch(imageURL)
    .then(resp => resp.json())
    .then(image => renderImage(image))
  }

  function renderImage(image) {
    const img = document.getElementById('image')
    img.src = image.url

    const title = document.getElementById('name')
    title.innerText = image.name

    const likes = document.getElementById('likes')
    likes.innerText = image.like_count

    const comments = document.getElementById('comments')
    image.comments.forEach(comment => {
      const contentLi = document.createElement('li')
      contentLi.innerText = comment.content
      contentLi.id = comment.id
      const deleteBtn = document.createElement('button')
      deleteBtn.innerText = 'Delete'
      deleteBtn.className = 'delete-btn'
      comments.append(contentLi, deleteBtn)
    })
  }

  function addLikeListener() {
    const likeBtn = document.getElementById('like_button')
    const likes = document.getElementById('likes')
    likeBtn.addEventListener('click', function(event) {
      likes.innerText ++

    const reqObj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_id: imageId })
    }

    fetch(likeURL, reqObj)
    .then(resp => resp.json())
    .then(like => console.log(like))
    })
  }




})

// script.js

// Get references to the menu button and menu
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');

// Event listener for the menu button
if (menuButton) {
    menuButton.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// --- Admin User Check and Panel Display ---
function checkAdminStatus() {
    const user = auth.currentUser;
    if (user) {
        // For demonstration, let's assume a specific email is the admin
        if (user.email === "admin@example.com") { // Replace with your admin check
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) {
                adminPanel.classList.remove('hidden');
            }
        }
    }
}

// --- Firebase Authentication ---
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        checkAdminStatus(); //check for admin
    } else {
        // User is signed out
        console.log('User is signed out');
    }
});

// --- Sign Up ---
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const signupMessage = document.getElementById('signupMessage');

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('Sign up successful:', user);
                signupMessage.textContent = 'Sign up successful! Redirecting...';
                // Update the user's profile with the username.
                user.updateProfile({
                    displayName: username
                }).then(function() {
                    // Profile updated successfully.
                    console.log("Username updated successfully");
                    window.location.href = 'index.html'; // Redirect
                }).catch(function(error) {
                    // An error happened.
                    console.log("Error updating username:", error);
                    signupMessage.textContent = 'Sign up successful! But error updating username:' + error.message;
                    window.location.href = 'index.html'; //redirect
                });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign up error:', error);
                signupMessage.textContent = 'Sign up error: ' + errorMessage;
            });
    });
}


// --- Sign In ---
const signinForm = document.getElementById('signinForm');
if (signinForm) {
    signinForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        const signinMessage = document.getElementById('signinMessage');

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('Sign in successful:', user);
                signinMessage.textContent = 'Sign in successful! Redirecting...';
                window.location.href = 'index.html'; // Redirect
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign in error:', error);
                signinMessage.textContent = 'Sign in error: ' + errorMessage;
            });
    });
}

// --- Sign Out ---
function signOut() {
    auth.signOut()
        .then(() => {
            console.log('User signed out');
            window.location.href = 'index.html'; // Redirect to home
        })
        .catch((error) => {
            console.error('Sign out error:', error);
        });
}

// --- Add Blog ---
const addBlogButton = document.getElementById('addBlogButton');
if (addBlogButton) {
    addBlogButton.addEventListener('click', () => {
        const blogTitle = document.getElementById('blogTitle').value;
        const blogContent = document.getElementById('blogContent').value;

        if (blogTitle.trim() === '' || blogContent.trim() === '') {
            alert('Please enter both title and content!');
            return;
        }

        // Get a reference to the database
        const db = firebase.firestore();

        // Add a new document with a generated id.
        db.collection("blogs").add({
            title: blogTitle,
            content: blogContent,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            alert('Blog added successfully!');
            document.getElementById('blogTitle').value = '';  // Clear input
            document.getElementById('blogContent').value = ''; // Clear input
            displayBlogs(); //refresh the list
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            alert('Error adding blog!');
        });
    });
}

// --- Display Blogs ---
function displayBlogs() {
    const blogList = document.getElementById('blogList');
    if (!blogList) return; // Exit if blogList doesn't exist

    const db = firebase.firestore();
    db.collection("blogs").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        blogList.innerHTML = ''; // Clear old blogs
        querySnapshot.forEach((doc) => {
            const blog = doc.data();
            const blogDiv = document.createElement('div');
            blogDiv.classList.add('blog-post');
            blogDiv.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
            `;
            blogList.appendChild(blogDiv);
        });
    })
    .catch((error) => {
        console.error("Error getting blogs: ", error);
        blogList.innerHTML = '<p>Error loading blogs.</p>';
    });
}
//display blogs
displayBlogs();

// --- Add Video ---
const addVideoButton = document.getElementById('addVideoButton');
if (addVideoButton) {
    addVideoButton.addEventListener('click', () => {
        const videoTitle = document.getElementById('videoTitle').value;
        const videoUrl = document.getElementById('videoUrl').value;

        if (videoTitle.trim() === '' || videoUrl.trim() === '') {
            alert('Please enter both title and URL!');
            return;
        }

        // Basic URL validation
        try {
            new URL(videoUrl);
        } catch (_) {
            alert('Invalid URL!');
            return;
        }

        // Get a reference to the database
        const db = firebase.firestore();

        // Add a new document with a generated id.
        db.collection("videos").add({
            title: videoTitle,
            url: videoUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            alert('Video added successfully!');
            document.getElementById('videoTitle').value = '';  // Clear input
            document.getElementById('videoUrl').value = '';    // Clear input
             displayVideos();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            alert('Error adding video!');
        });
    });
}

// --- Display Videos ---
function displayVideos() {
    const videoList = document.getElementById('videoList');
    if (!videoList) return;

    const db = firebase.firestore();
    db.collection("videos").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        videoList.innerHTML = ''; // Clear old videos
        querySnapshot.forEach((doc) => {
            const video = doc.data();
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video-item');
            videoDiv.innerHTML = `
                <h3>${video.title}</h3>
                <iframe width="560" height="315" src="${video.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            videoList.appendChild(videoDiv);
        });
    })
    .catch((error) => {
        console.error("Error getting videos: ", error);
        videoList.innerHTML = '<p>Error loading videos.</p>';
    });
}

displayVideos();

// --- Contact Form Submission ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        const contactMessageDisplay = document.getElementById('contactMessageDisplay');

        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            contactMessageDisplay.textContent = 'Please fill in all fields.';
            return;
        }

         // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            contactMessageDisplay.textContent = 'Invalid email address.';
            return;
        }

        // Get a reference to the database
        const db = firebase.firestore();

        // Add a new document with a generated id.
        db.collection("contacts").add({
            name: name,
            email: email,
            message: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            contactMessageDisplay.textContent = 'Message sent successfully!';
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactMessage').value = '';
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            contactMessageDisplay.textContent = 'Error sending message: ' + error.message;
        });
    });
}

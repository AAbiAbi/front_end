let selectedServerIP = "34.125.228.26:8088"; // Default server IP

        function updateServerIP(serverIP) {
            // Ping the server before updating
            fetch(`http://${serverIP}/ping`)
                .then((response) => {
                    if (response.ok) {
                        // Server is reachable, update the selected server
                        selectedServerIP = serverIP;
                        showNotification(`Connected to server: ${serverIP}`);
                        console.log(selectedServerIP);
                    } else {
                        // Server is not reachable, show error message
                        showNotification(`Error connecting to server: ${serverIP}`);
                    }
                })
                .catch((error) => {
                    // Error occurred, show error message
                    showNotification(`Error connecting to server: ${serverIP}`);
                });
        }

        document.addEventListener("DOMContentLoaded", function() {
            // Retrieve the username from localStorage
            const username = localStorage.getItem("username");

            // Update the label with the username
            const usernameLabel = document.getElementById("username-label");
            usernameLabel.textContent = `${username}:`;
        });
        

        // Get the username from the query parameter in the URL
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const username = urlParams.get('username');

            // Update the page title with the username
            const usernameTitle = document.getElementById('username-title');
            usernameTitle.textContent = username;

        document.getElementById("server-options").addEventListener("click", (event) => {
            const clickedOptionId = event.target.id;
            if (clickedOptionId === "server-option-1") {
              updateServerIP("34.125.228.26:8088");
            } else if (clickedOptionId === "server-option-2") {
              updateServerIP("34.16.130.141:8088");
            } else if (clickedOptionId === "server-option-3") {
              updateServerIP("34.125.123.234:8088");
            }
          });

          document.getElementById("recent-posts-button").addEventListener("click", displayRecentPosts);

            function displayRecentPosts() {
                const recentPostsList = document.getElementById("recent-posts-list");
                recentPostsList.innerHTML = ""; // Clear the recent posts list

                // Retrieve the recently posted file IDs from localStorage
                const recentFileIds = JSON.parse(localStorage.getItem("recentFileIds")) || [];

                recentFileIds.forEach(fileId => {
                    // Make an API request to fetch the individual blog post using the file ID
                    fetch(`http://${selectedServerIP}/getFile?id=${fileId}`)
                        .then(response => response.json())
                        .then(data => {
                            // Create list items for each recent blog post
                            const listItem = document.createElement("li");
                            listItem.textContent = `${data.title}: ${data.content}`;
                            console.log(data.title)
                            recentPostsList.appendChild(listItem);
                        })
                        .catch(error => {
                            console.error("Error fetching blog post:", error);
                        });
                });
            }

          function showNotification(message) {
            const notificationElement = document.createElement("div");
            notificationElement.classList.add("notification");
            notificationElement.textContent = message;
            document.body.appendChild(notificationElement);
               // Remove the notification after a certain duration
                setTimeout(() => {
                    notificationElement.remove();
                }, 3000); // Adjust the duration as needed
            }

        

        // Function to fetch and display all blog posts
        async function displayBlogPosts() {
            const postList = document.getElementById("post-list");
            postList.innerHTML = ""; // Clear the post list

            try {
                // Make an API request to fetch all blog posts
                const response = await fetch(`http://${selectedServerIP}/api/posts`);
                //console.log(postId);
                const responseData = await response.json();
                console.log("response");
                console.log(responseData );

                if (Array.isArray(responseData.message)) {
                    responseData.message.forEach((post) => {
                        const postContent = JSON.parse(post.content);
                        const username = postContent.title.split(":")[0].trim(); // Extract the username from the title
                        const actualTitle = postContent.title.split(":")[1].trim(); // Extract the actual title from the title
                        const listItem = document.createElement("li");
                        const link = document.createElement("a");
                        link.href = `javascript:displayIndividualPost('${post.id}')`;
                        link.textContent = `${username}: ${actualTitle}: ${postContent.content}`;
                        listItem.appendChild(link);
                        postList.appendChild(listItem);
                    });
                    
                } else {
                    console.error("Error fetching blog posts: Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            }
        }

       // Function to create a new blog post
        async function createBlogPost(event) {
            event.preventDefault(); // Prevent form submission
        
            const form = document.getElementById("new-post-form");
            const titleInput = document.getElementById("title");
            const contentInput = document.getElementById("content");

            const username = localStorage.getItem("username");
            const postData = {
                title: `${username}: ${titleInput.value}`,
                content: contentInput.value,
                timestamp: parseInt(new Date().getTime() / 1000).toString(), // Add the timestamp property
   
            };
        
            // const postData = {
            // title: titleInput.value,
            // content: contentInput.value,
            // };
        
            try {
            // Make an API request to create a new blog post
            const response = await fetch(`http://${selectedServerIP}/addFile`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
        
            if (response.ok) {
                const data = await response.json();
                const postId = data.message; // Extract the postId from the response
                console.log('success');
        
                // Blog post created successfully
                titleInput.value = "";
                contentInput.value = "";
        
                // Update the blog post list with the newly created post
                const postList = document.getElementById("post-list");
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = `javascript:displayIndividualPost('${postId}')`;
                console.log(postId);
                link.textContent = postData.title;
                listItem.appendChild(link);
                postList.appendChild(listItem);

                // Update the recentFileIds in localStorage
                const recentFileIds = JSON.parse(localStorage.getItem("recentFileIds")) || [];
                recentFileIds.unshift(postId); // Add the new file ID at the beginning
                localStorage.setItem("recentFileIds", JSON.stringify(recentFileIds));
                // Update the recent posts list
                 displayRecentPosts();

        
                alert("Blog post created successfully!");
        
                displayBlogPosts();
            } else {
                console.error("Error creating blog post:", response.status);
            }
            } catch (error) {
            console.error("Error creating blog post:", error);
            }
        }
        
            // Function to display an individual blog post
//             async function displayIndividualPost() {
//                 const postId = new URLSearchParams(window.location.search).get("id");
//                 // 用于从 URL 查询字符串中检索“id”参数的值。
//                 const postTitle = document.getElementById("post-title");
//                 const postContent = document.getElementById("post-content");
                
//             // 因此，在您提供的代码片段的上下文中，
//             // const postId = new URLSearchParams(window.location.search).get("id");
//             //从当前 URL 的查询字符串中提取“id”参数的值并将其分配给变量postId。此值稍后可在代码中使用，
//             //例如，根据其 ID 获取和显示单个博客文章。
//                 try {
//                     // Make an API request to fetch the individual blog post
//                     const response = await fetch(`http://${selectedServerIP}/getFile?id=${postId}`);
// //
//                     const data = await response.json();
                
//                 postTitle.textContent = data.title;
//                 postContent.textContent = data.content;
//             } catch (error) {
//                 console.error("Error fetching blog post:", error);
//             }
//         }
            async function displayIndividualPost(postId) {
                const postTitle = document.getElementById("post-title");
                const postContent = document.getElementById("post-content");

                try {
                    // Make an API request to fetch the individual blog post
                    const response = await fetch(`http://${selectedServerIP}/getFile?id=${postId}`);
                    const data = await response.json();
                    console.log("Response:", response);
                    console.log("Data:", data);

                    postTitle.textContent = data.title;
                    postContent.textContent = data.content;
                } catch (error) {
                    console.error("Error fetching blog post:", error);
                }
            }


//          // Function to display all blog posts
         async function showAllPosts() {
            const postList = document.getElementById("post-list");
            postList.innerHTML = ""; // Clear the post list

            try {
                // Make an API request to fetch all blog posts
                const response = await fetch(`http://${selectedServerIP}/api/posts`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    data.forEach((post) => {
                        // Create list items for each blog post
                        const listItem = document.createElement("li");
                        const link = document.createElement("a");
                        link.href = `/posts/${post.id}`;
                        link.textContent = post.title;
                        listItem.appendChild(link);
                        postList.appendChild(listItem);
                    });
                } else {
                    console.error("Error fetching blog posts: Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            }
        }
        // Event listeners
        document.addEventListener("DOMContentLoaded", displayBlogPosts);
        document.getElementById("new-post-form").addEventListener("submit", createBlogPost);
       // document.addEventListener("DOMContentLoaded", displayIndividualPost);
$(".shuffle-friends").addEventListener("click", function () {
    let shuffled = Array.from(document.querySelectorAll(".friends-list .user")).sort(() => 0.5 - Math.random());
    $(".friends-list").innerHTML = shuffled.map(u => u.outerHTML).join("");
})



$(".send-message").addEventListener("click", function () {
    let button = this;
    let message = $("#message").value;

    if (message.trim().length < 3) return $("#message").reportValidity();

    button.disabled = true;
    db.ref(`messages`).push({
        date: Date.now(),
        message: message
    }).then(() => {
        $("#message").value = "";
        button.disabled = false;
    })
})


$(".posts").on("click", "button.send-comment", function () {
    let button = this,
        post = button.closest(".post"),
        post_id = post.getAttribute("data-id"),
        comment_input = this.siblings(".comment-input")[0],
        content = comment_input.value;

    if (content.trim().length < 3) return comment_input.reportValidity();

    button.disabled = true;
    comment_input.disabled = true;

    db.ref(`posts/${post_id}/comments`).push({
        date: Date.now(),
        content: content
    }).then(() => {
        button.disabled = false;
        comment_input.disabled = false;
        comment_input.value = "";
        let comment_temp = $("#comment-temp").innerHTML
            .replace("{{date}}", TimeAgo(Date.now()))
            .replace("{{content}}", content);
        post.querySelector(".post-comments").prepend(comment_temp);
        post.toggleClass("comments-open")
    })
})



// Get Posts
db.ref(`posts`).orderByChild("date").get().then((snapshot) => {
    let posts_wrapper = $(".posts");

    snapshot.forEach((item) => {
        let post = item.val();
        let media = "";
        if (post.media) {
            media = post.media.map((media) => {
                if (media.type.startsWith("image")) return `<li><img src="${media.url}" loading="lazy"></li>`
                if (media.type.startsWith("video")) return `<li><video src="${media.url}" loading="lazy" controls playsinline></li>`
                if (media.type.startsWith("audio")) return `<li><audio src="${media.url}" loading="lazy" controls></li>`
            }).join("")
        }
        if (post.type == "post") {
            let temp = $("#post-temp").innerHTML
                .replace("{{id}}", item.key)
                .replace("{{post}}", post.content || "")
                .replace("{{likes}}", post.likes || 0)
                .replace("{{media}}", media)
                .replace("{{media_count}}", post.media && post.media.length)
                .replace("{{date}}", TimeAgo(post.date));
            posts_wrapper.prepend(temp);

            if (localStorage.getItem(`liked-${item.key}`)) $(`.post[data-id="${item.key}"] button.like-post`).addClass("liked");

            if (post.comments) {
                let comments = post.comments;
                let comments_wrapper = $(`.post[data-id="${item.key}"]`).addClass("comments-open").querySelector(".post-comments");

                Object.keys(comments).forEach((comment_id) => {
                    let comment = comments[comment_id];
                    let comment_temp = $("#comment-temp").innerHTML
                        .replace("{{id}}", comment_id)
                        .replace("{{date}}", TimeAgo(comment.date))
                        .replace("{{content}}", comment.content);
                    comments_wrapper.append(comment_temp)
                })
            }
        }
        if (post.type == "message") {
            let temp = $("#message-temp").innerHTML
                .replace("{{id}}", item.key)
                .replace("{{date}}", TimeAgo(post.date))
                .replace("{{message}}", post.content)
                .replace("{{likes}}", post.likes || 0)
                .replace("{{reply}}", post.reply.content)
                .replace("{{reply_date}}", TimeAgo(post.reply.date))
            posts_wrapper.prepend(temp);

            if (localStorage.getItem(`liked-${item.key}`)) $(`.post[data-id="${item.key}"] button.like-post`).addClass("liked");

            if (post.comments) {
                let comments = post.comments;
                let comments_wrapper = $(`.post[data-id="${item.key}"]`).addClass("comments-open").querySelector(".post-comments");

                Object.keys(comments).forEach((comment_id) => {
                    let comment = comments[comment_id];
                    let comment_temp = $("#comment-temp").innerHTML
                        .replace("{{id}}", comment_id)
                        .replace("{{date}}", TimeAgo(comment.date))
                        .replace("{{content}}", comment.content);
                    comments_wrapper.append(comment_temp)
                })
            }
        }
    })
})

// Get Friends
db.ref("friends").get().then((snapshot) => {
    let friends_wrapper = $(".friends-list");

    snapshot.forEach((item) => {
        let friend = item.val();
        let temp = $("#friend-temp").innerHTML
            .replace("{{id}}", item.key)
            .replace("{{name}}", friend.name)
            .replace("{{username}}", friend.username)
            .replace("{{username}}", friend.username)
            .replace("{{avatar}}", friend.avatar);
        friends_wrapper.append(temp);
    });
    $("[data-id='-NhxoRLWzwW0YpGzrZF8']").addClass("bff");
    $("button.shuffle-friends").dispatchEvent(new Event("click"))
})
$(".posts").on("input", ".post-actions textarea", function () {
    this.style.height = 0;
    this.style.height = this.scrollHeight - 20 + 'px';
})
$(".posts").on("click", ".toggle-comments", function () {
    this.closest(".post").toggleClass("comments-open")
})
$(".posts").on("click", ".like-post", async function () {
    let button = this,
        post = this.closest(".post"),
        post_id = post.getAttribute("data-id"),
        is_liked = button.hasClass("liked");

    button.disabled = true;

    db.ref(`posts/${post_id}/likes`).transaction((current) => {
        return current ? current + (is_liked ? -1 : +1) : 1
    }).then(() => {
        button.disabled = false;
        button[is_liked ? "removeClass" : "addClass"]("liked");

        if (is_liked) delete localStorage[`liked-${post_id}`];
        else localStorage.setItem(`liked-${post_id}`, 1);

        let current_count = +button.getAttribute("data-count");
        button.setAttribute("data-count", is_liked ? current_count - 1 : current_count + 1);

    })
})
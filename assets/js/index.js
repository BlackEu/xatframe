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



// Get Posts
db.ref(`posts`).orderByChild("date").get().then((snapshot) => {
    let posts_wrapper = $(".posts");

    snapshot.forEach((item) => {
        let post = item.val();
        let content = "";
        let media = "";
        if (post.media) {
            media = post.media.map((media) => {
                if (media.type.startsWith("image")) return `<img src="${media.url}" loading="lazy">`
                if (media.type.startsWith("video")) return `<video src="${media.url}" loading="lazy" controls playsinline>`
                if (media.type.startsWith("audio")) return `<audio src="${media.url}" loading="lazy" controls>`
            }).join("")
        }
        if (post.type == "post") {
            let temp = $("#post-temp").innerHTML
                .replace("{{id}}", item.key)
                .replace("{{post}}", post.content || "")
                .replace("{{media}}", media)
                .replace("{{media_count}}", post.media && post.media.length)
                .replace("{{date}}", TimeAgo(post.date));
            posts_wrapper.prepend(temp);
        }
        if (post.type == "message") {
            let temp = $("#message-temp").innerHTML
                .replace("{{id}}", item.key)
                .replace("{{date}}", TimeAgo(post.date))
                .replace("{{message}}", post.content)
                .replace("{{reply}}", post.reply.content)
                .replace("{{reply_date}}", TimeAgo(post.reply.date))
            posts_wrapper.prepend(temp);
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
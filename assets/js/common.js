NodeList.prototype.forEach = function (callback) {
    return Array.prototype.forEach.call(this, callback);
}
NodeList.prototype.map = function (callback) {
    return Array.prototype.map.call(this, callback);
}
NodeList.prototype.filter = function (callback) {
    return Array.prototype.filter.call(this, callback);
}
NodeList.prototype.find = function (callback) {
    return Array.prototype.find.call(this, callback);
}
NodeList.prototype.addEventListener = function (eventname, callback) {
    this.forEach((el) => el.addEventListener(eventname, callback));
    return this;
}
NodeList.prototype.addClass = Array.prototype.addClass = function (classname) {
    this.forEach((el) => el && !el.classList.contains(classname) && el.classList.add(classname));
    return this;
}
NodeList.prototype.removeClass = Array.prototype.removeClass = function (classname) {
    this.forEach((el) => el && el.classList.contains(classname) && el.classList.remove(classname));
    return this;
}
Element.prototype.addClass = function (classname) {
    this.classList.add(classname);
    return this;
}
Element.prototype.removeClass = function (classname) {
    this.classList.remove(classname);
    return this;
}
Element.prototype.toggleClass = function (classname) {
    this.classList.contains(classname) ? this.classList.remove(classname) : this.classList.add(classname);
    return this;
}
Element.prototype.siblings = function (selector = "*") {
    return this.parentElement.querySelectorAll(selector).filter(node => !this.isEqualNode(node))
}
Element.prototype.before = function (content) {
    this[typeof content == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforebegin", content);
    return this;
}
Element.prototype.prepend = function (content) {
    this[typeof content == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterbegin", content);
    return this;
}
Element.prototype.append = function (content) {
    this[typeof content == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforeend", content);
    return this;
}
Element.prototype.after = function (content) {
    this[typeof content == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterend", content);
    return this;
}
Element.prototype.on = function (event_name, selector, callback) {
    let _this = this;
    this.addEventListener(event_name, function (e) {
        if (e.target.isEqualNode(_this.querySelector(selector))) callback.call(this.querySelector(selector), e);
    });
    return this;
}

window.$ = function (selector) {
    let results = document.querySelectorAll(selector);
    if (results.length) {
        if (results.length > 1) {
            return results
        } else {
            return document.querySelector(selector);
        }
    } else {
        return [];
    }
}

function LocalDate(timestap) {
    let date = new Date(timestap).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return date;
}

function TimeAgo(timestamp) {
    let diff = Date.now() - timestamp;
    let days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 24);
    let hours = Math.floor((diff / (1000 * 60 * 60)) % 60);
    let minutes = Math.floor((diff / (1000 * 60)) % 60);
    let result = "";

    if (days > 0) {
        result = `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
        if (hours > 0) {
            result = `${hours} hour${hours > 1 ? "s" : ""} ago`
        } else {
            if (minutes > 0) {
                result = `${minutes} minute${minutes > 1 ? "s" : ""} ago`
            } else {
                result = "A few moments ago"
            }
        }
    }
    return result;
}
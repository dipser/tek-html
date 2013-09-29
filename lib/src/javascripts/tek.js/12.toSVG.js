exports.toSVG = function (html, w, h) {
    if (typeof(Blob) === undefined) return null;
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>" +
        "<foreignObject width='100%' height='100%'>" +
        "<div xmlns='http://www.w3.org/1999/xhtml'>" +
        html +
        "</div>" +
        "</foreignObject>" +
        "</svg>";
    return  new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
};
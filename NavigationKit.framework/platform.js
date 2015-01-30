function showBoothInfo(boothId) {
        console.log("Sending callback via iOS mechanism");
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "schicka:booth:" + encodeURIComponent(JSON.stringify(boothId)));
        // For some reason we need to set a non-empty size for the iOS6 simulator...
        iframe.setAttribute("height", "1px");
        iframe.setAttribute("width", "1px");
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
}
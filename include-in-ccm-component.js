var f = "ccm." + component.name + (component.version ? "-" + component.version.join(".") : "") + ".js";
if (window.ccm && null === window.ccm.files[f]) window.ccm.files[f] = component;
else {
    var n = window.ccm && window.ccm.components[component.name];
    n && n.ccm && (component.ccm = n.ccm), "string" == typeof component.ccm && (component.ccm = {
        url: component.ccm
    });
    // NEW VERSION
    (function l(obj) {
        var resolve = function () {
            window.ccm_loader.resolve(obj);
        }
        if (!window.ccm_loader) {
            var e = document.createElement("script");
            document.head.appendChild(e);
            e.onload = function () {
                resolve();
            };
            e.src = "https://oberpro.github.io/ccm_loader/ccm_loader.js";
        } else {
            resolve();
        }
    })(component);
}
if (!window.ccm_loader) ccm_loader = {

    makeUrl: function (url, newVersion) {
        var first = (url + '').substring(0, url.lastIndexOf("/") + 1);
        var last = url.substring(url.lastIndexOf("/") + 1, url.length);
        var part = last.split("-");
        if (part.length > 1) {
            var version = part[1];
            version = version.substring(0, version.indexOf('.js'));
            if (newVersion === 'latest') {
                part.splice(1, 1);
            } else {
                part[1] = newVersion;
            }
        } else {
            part = [];
            part.push("ccm");
            if (newVersion !== 'latest') {
                part.push(newVersion);
            }
        }
        return first + part.join("-") + ".min.js";
    },
    resolve: function (component) {
        var v = component.ccm.url.split("/").pop().split("-");
        v.length > 1 ? (v = v[1].split("."), v.pop(), "min" === v[v.length - 1] && v.pop(), v = v.join(".")) : v = "latest";
        if (window.ccm_version) {
            //has version
            var min_version = window.ccm_version;
            var prefix = min_version.charAt(0);
            if (prefix === '+' || prefix === '^') {
                var vers = min_version.substring(1).split('.');
                if (vers.length > 0) {
                    vers = vers.map(v => parseInt(v));
                    if (window.ccm_loader.matchVersion(vers, v.split('.').map(v => parseInt(v)))) {
                        //ok load
                        window.ccm_loader.load(component, v);
                    } else {
                        //load fixed version
                        window.ccm_loader.load(component, min_version.substring(1));
                    }
                } else {
                    window.ccm_loader.load(component, v);
                }
            } else {
                //load fixed version
                window.ccm_loader.load(component, min_version);
            }
        } else {
            //load all because no limitation
            window.ccm_loader.load(component, v);
        }
    },
    add: function (v, component) {
        if (!window.ccm.dependencies) {
            window.ccm.dependencies = {};
        }
        window.ccm.dependencies[component.name] = {
            version: v,
            children: {}
        };
        window.ccm[v].component(component);
    },
    matchVersion: function (limit, wanted) {
        for (var i = 0; i < Math.min(limit.length, wanted.length); i++) {
            if (limit[i] > wanted[i]) {
                return false;
            }
        }
        return true;
    },
    load: function (component, v) {
        var url = window.ccm_loader.makeUrl(component.ccm.url, v);
        if (window.ccm && window.ccm[v]) {
            window.ccm_loader.add(v, component);
        } else {
            var e = document.createElement("script");
            document.head.appendChild(e), component.ccm.crossorigin && e.setAttribute("crossorigin", component.ccm.crossorigin), e.onload = function () {
                window.ccm_loader.add(v, component), document.head.removeChild(e);
            }, e.src = url;
        }
    }
};
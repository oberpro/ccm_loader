# ccm_loader
A Loader for better version management of the ccm_framework

## How to use ##
You have to include the content of the `include-in-ccm-component.js` inside your ccm component.  
__Example__:
```js
(function () {
    var component = {
        name: 'hello-world',
        version: [1, 0, 1],
        ccm: {
            url: 'https://ccmjs.github.io/ccm/versions/ccm-16.6.1.js'
        },
        config: {
            hello: 'World'
        },
        Instance: function () {
            this.start = callback => {
                //LOAD DATA
                this.element.innerHTML = 'Hello ' + this.hello + '!';
                callback && callback();
            }
        }
    };
    //############# THIS PART: #########################
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
    // #### ENDS HERE ######
})();
```
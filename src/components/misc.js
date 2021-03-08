import assertFunc from './assert.js'

const BLANK_ADDR = '0x0000000000000000000000000000000000000000'

class Misc {
    blankAddress = BLANK_ADDR

    assert (cond) { return assertFunc(cond) }

    sleepAsync (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    addCommas (x) {
        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    copyToClipboard (str) {
        // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
        const el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';                 
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        const selected =            
            document.getSelection().rangeCount > 0        // Check if there is any content selected previously
                ? document.getSelection().getRangeAt(0)     // Store selection if found
                : false;                                    // Mark as false to know no selection existed before
                el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
            document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
            document.getSelection().addRange(selected);   // Restore the original selection
        }
    }

    isNumber (num) {
        if (num.match(/^-?\d+$/)) {
            return true
        } else if(num.match(/^\d+\.\d+$/)){
            return true
        } else {
            return false
        }
    }

    getCookie (name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);

        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) {
                return null
            }
        } else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
        }

        return decodeURI(dc.substring(begin + prefix.length, end));
    }
    
    getUrlRef = () => {
        const url_string = window.location.href;
        const url = new URL(url_string);
        const address = url.searchParams.get("ref");
        return address
    }

    deleteAllCookies () {
        var cookies = document.cookie.split(";");
    
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    setReferral = (address) => {
        const self = this
        self.assert(typeof address === 'string')
        const theCookie = `ref=${address}`
    
        if (address !== null) {
            // const toSet = "ref=" + url.searchParams.get("ref");
            document.cookie = theCookie;
        } else {
            const refCookie = self.getCookie("ref");
    
            if (refCookie === null) {
                console.log("Ref cookie null. Setting to default.");
                document.cookie = `ref=${BLANK_ADDR}`
            } else {
                // do nothing if the cookie is already set and there is no new mnode link	
            }
        }
    }
}

export default new Misc()

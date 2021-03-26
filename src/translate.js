const frappejs = require("frappejs");

//For Translation
const frappe = require('frappejs');
frappe._messages = {};

frappe._ = function(txt, replace) {
    if(!txt)
        return txt;
    if(typeof(txt) != "string")
        return txt;
    var ret = frappe._messages[txt.replace(/\n/g, "")] || txt;
    if(replace && typeof(replace) === "object") {
        ret = $.format(ret, replace);
    }
    return ret;
};
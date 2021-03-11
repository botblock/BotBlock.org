const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = res => {
    return (new JSDOM(res.text)).window.document;
};

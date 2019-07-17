const Markdown = require('markdown-it');
const i18n = require('i18n');

class Renderer {
    constructor() {
        this.__md = Markdown({
            html: true,
            xhtmlOut: true,
            breaks: true,
            linkify: true,
            typographer: true
        });
        this.__var = i18n.__;
    }

    variables(text) {
        var reg = /{{(.*?)}}/g;
        var result;
        while ((result = reg.exec(text)) !== null) {
            const lookup = this.__var(result[1]);
            if (lookup) text = text.replace(result[0], lookup);
        }
        return text;
    }

    __custom_links(html) {
        html = html.replace(/<a(.*?)href=["'](.*?)["'](.*?)>(.*?) nofollow<\/a>/g, '<a$1href="$2" rel="nofollow"$3>$4</a>');
        html = html.replace(/<a(.*?)href=["'](.*?)["'](.*?)>(.*?)<\/a>/g, '<a$1href="$2" target="_blank"$3>$4</a>');
        return html;
    }

    markdown(text) {
        text = this.__md.render(text);
        text = this.__custom_links(text);
        return text;
    }

    render(text) {
        text = this.variables(text);
        text = this.markdown(text);
        return text;
    }
}

module.exports = Renderer;

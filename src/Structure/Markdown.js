const i18n = require('../Util/i18n');
const Markdown = require('markdown-it');

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
        // Find all variables
        const pattern = new RegExp(/{{(.+?)}}/g);
        const matches = {};
        let m;
        while (m = pattern.exec(text)) {
            const match = m[1];
            if (match in matches) continue;
            matches[match] = this.__var(match);
        }

        // Replace all variables
        Object.keys(matches).forEach(key => {
            text = text.replace(new RegExp(`{{${key}}}`, 'g'), matches[key]);
        });
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


'use strict';

module.exports = function(content, file, conf){
    var EOL = '\n';
    function compileTmpl(tmpl) {
        var res = [], strict = (/\bit\b/).test(tmpl);
        tmpl.replace(/<\/script>/ig, '</s<%=""%>cript>');
        res.push([
            "return function (it, opt) {",
            "    it = it || {};",
            "    with(it) {",
            "        var _$out_= [];",
                "        _$out_.push('" + tmpl
                .replace(/\r\n|\n|\r/g, "\v")
                .replace(/(?:^|%>).*?(?:<%|$)/g, function ($0) {
                    return $0.replace(/('|\\)/g, "\\$1").replace(/[\v\t]/g, "").replace(/\s+/g, " ")
                })
                .replace(/[\v]/g, EOL)
                .replace(/<%==(.*?)%>/g, "', opt.encodeHtml($1), '")
                .replace(/<%=(.*?)%>/g, "', $1, '")
                .replace(/<%(<-)?/g, "');" + EOL + "      ")
                .replace(/->(\w+)%>/g, EOL + "      $1.push('")
                .split("%>").join(EOL + "      _$out_.push('") + "');",
            "      return _$out_.join('');",
            "    }",
            "}"
        ].join(EOL).replace(/_\$out_\.push\(''\);/g, ''));

        return res.join('');
    }

    return compileTmpl(content);
};
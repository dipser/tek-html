/**
 * User: okunishitaka
 * Date: 9/16/13
 * Time: 12:14 AM
 */

var PATTERNS = {
    ZENKAKU: /[！-～]/g,
    HANKAKU: /[\!-\~]/g,
    HIRAGANA: /[ぁ-ん]/g,
    KATAKANA: /[ァ-ン]/g
};
exports.string = {};
/**
 * ひらがなへ変換
 * @param str
 * @returns {*}
 */
exports.string.toHiragana = function (str) {
    return str && str.replace(PATTERNS.KATAKANA, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
    });
};

/**
 * カタカナへ変換
 * @param str
 * @returns {*}
 */
exports.string.toKatakana = function (str) {
    return str && str.replace(PATTERNS.HIRAGANA, function (s) {
        return String.fromCharCode(s.charCodeAt(0) + 0x60);
    });
};

/**
 * 半角へ変換
 * @param str
 * @returns {*}
 */
exports.string.toHankaku = function (str) {
    return str && str.replace(PATTERNS.ZENKAKU, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};

/**
 * 全角へ変換
 * @param str
 * @returns {*}
 */
exports.string.toZenkaku = function (str) {
    return str && str.replace(PATTERNS.HANKAKU, function (s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
};

/**
 * 曖昧一致
 */
exports.string.ambiguousMatch = function (string1, string2) {
    if (!string1) string1 = '';
    if (!string2) string2 = '';
    var toHankaku = exports.string.toHankaku,
        toHiragana = exports.string.toHiragana;

    function format(string) {
        return toHankaku(toHiragana(string.trim()));
    }

    return format(string1) === format(string2);
};
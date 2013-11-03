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
exports.string.ambiguousMatch = function (searchWord, pattern) {
    if (!pattern) return false;
    if (!searchWord) return false;
    searchWord = searchWord.trim();

    var string = exports.string;
    return !!pattern.match(searchWord) ||
        !!string.toHankaku(pattern).match(searchWord) ||
        !!string.toZenkaku(pattern).match(searchWord) ||
        !!string.toHiragana(pattern).match(searchWord) ||
        !!string.toKatakana(pattern).match(searchWord)
        ;
};
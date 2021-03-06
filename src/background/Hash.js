/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

class Hash {

    constructor() {

        let hasherBuilder = function (Math) {

            var Base = (function () {
                function F() {
                }

                return {
                    /**
                     * Creates a new object that inherits from this object.
                     *
                     * @param {Object} overrides Properties to copy into the new object.
                     *
                     * @return {Object} The new object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var MyType = Base.extend({
			     	 *         field: 'value',
				     *         method: function () {
				     *         }
				     *     });
                     */
                    extend: function (overrides) {
                        // Spawn
                        F.prototype = this;
                        var subtype = new F();

                        // Augment
                        if (overrides) {
                            subtype.mixIn(overrides);
                        }

                        // Create default initializer
                        if (!Object.prototype.hasOwnProperty.call(subtype, 'init')) {
                            subtype.init = function () {
                                subtype.$super.init.apply(this, arguments);
                            };
                        }

                        // Initializer's prototype is the subtype object
                        subtype.init.prototype = subtype;

                        // Reference supertype
                        subtype.$super = this;

                        return subtype;
                    },

                    /**
                     * Extends this object and runs the init method.
                     * Arguments to create() will be passed to init().
                     *
                     * @return {Object} The new object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var instance = MyType.create();
                     */
                    create: function () {
                        var instance = this.extend();
                        instance.init.apply(instance, arguments);

                        return instance;
                    },

                    /**
                     * Initializes a newly created object.
                     * Override this method to add some logic when your objects are created.
                     *
                     * @example
                     *
                     *     var MyType = Base.extend({
				 *         init: function () {
				 *             // ...
				 *         }
				 *     });
                     */
                    init: function () {
                    },

                    /**
                     * Copies properties into this object.
                     *
                     * @param {Object} properties The properties to mix in.
                     *
                     * @example
                     *
                     *     MyType.mixIn({
				 *         field: 'value'
				 *     });
                     */
                    mixIn: function (properties) {
                        for (var propertyName in properties) {
                            if (Object.prototype.hasOwnProperty.call(properties, propertyName)) {
                                this[propertyName] = properties[propertyName];
                            }
                        }

                        // IE won't copy toString using the loop above
                        if (Object.prototype.hasOwnProperty.call(properties, 'toString')) {
                            this.toString = properties.toString;
                        }
                    },

                    /**
                     * Creates a copy of this object.
                     *
                     * @return {Object} The clone.
                     *
                     * @example
                     *
                     *     var clone = instance.clone();
                     */
                    clone: function () {
                        return this.init.prototype.extend(this);
                    }
                };
            }());

            /**
             * An array of 32-bit words.
             *
             * @property {Array} words The array of 32-bit words.
             * @property {number} sigBytes The number of significant bytes in this word array.
             */
            var WordArray = Base.extend({
                /**
                                             * Initializes a newly created word array.
                                             *
                                             * @param {Array} words (Optional) An array of 32-bit words.
                                             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                                             *
                                             * @example
                                             *
                                             *     var wordArray = WordArray.create();
                                             *     var wordArray = WordArray.create([0x00010203, 0x04050607]);
                                             *     var wordArray = WordArray.create([0x00010203, 0x04050607], 6);
                                             */
                init: function (words, sigBytes) {
                    words = this.words = words || [];

                    if (sigBytes !== undefined) {
                        this.sigBytes = sigBytes;
                    } else {
                        this.sigBytes = words.length * 4;
                    }
                },

                /**
                                             * Converts this word array to a string.
                                             *
                                             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: Hex
                                             *
                                             * @return {string} The stringified word array.
                                             *
                                             * @example
                                             *
                                             *     var string = wordArray + '';
                                             *     var string = wordArray.toString();
                                             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
                                             */
                toString: function (encoder) {
                    return (encoder || Hex).stringify(this);
                },

                /**
                                             * Concatenates a word array to this word array.
                                             *
                                             * @param {WordArray} wordArray The word array to append.
                                             *
                                             * @return {WordArray} This word array.
                                             *
                                             * @example
                                             *
                                             *     wordArray1.concat(wordArray2);
                                             */
                concat: function (wordArray) {
                    // Shortcuts
                    var thisWords = this.words;
                    var thatWords = wordArray.words;
                    var thisSigBytes = this.sigBytes;
                    var thatSigBytes = wordArray.sigBytes;

                    // Clamp excess bits
                    this.clamp();

                    // Concat
                    if (thisSigBytes % 4) {
                        // Copy one byte at a time
                        for (var i = 0; i < thatSigBytes; i++) {
                            var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8))
                                                                       & 0xff;
                            thisWords[(thisSigBytes + i) >>> 2] |=
                                                            thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                        }
                    } else if (thatWords.length > 0xffff) {
                        // Copy one word at a time
                        for (var ii = 0; ii < thatSigBytes; ii += 4) {
                            thisWords[(thisSigBytes + ii) >>> 2] = thatWords[ii >>> 2];
                        }
                    } else {
                        // Copy all words at once
                        thisWords.push.apply(thisWords, thatWords);
                    }
                    this.sigBytes += thatSigBytes;

                    // Chainable
                    return this;
                },

                /**
                                             * Removes insignificant bits.
                                             *
                                             * @example
                                             *
                                             *     wordArray.clamp();
                                             */
                clamp: function () {
                    // Shortcuts
                    var words = this.words;
                    var sigBytes = this.sigBytes;

                    // Clamp
                    words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                    words.length = Math.ceil(sigBytes / 4);
                },

                /**
                                             * Creates a copy of this word array.
                                             *
                                             * @return {WordArray} The clone.
                                             *
                                             * @example
                                             *
                                             *     var clone = wordArray.clone();
                                             */
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone.words = this.words.slice(0);

                    return clone;
                },

                /**
                                             * Creates a word array filled with random bytes.
                                             *
                                             * @param {number} nBytes The number of random bytes to generate.
                                             *
                                             * @return {WordArray} The random word array.
                                             *
                                             * @static
                                             *
                                             * @example
                                             *
                                             *     var wordArray = CryptoJS.lib.WordArray.random(16);
                                             */
                random: function (nBytes) {
                    var words = [];
                    for (var i = 0; i < nBytes; i += 4) {
                        words.push((Math.random() * 0x100000000) | 0);
                    }

                    return new WordArray.init(words, nBytes);
                }
            });

            /**
             * Hex encoding strategy.
             */
            var Hex = {
                /**
                 * Converts a word array to a hex string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The hex string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hexString = Hex.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var hexChars = [];
                    for (var i = 0; i < sigBytes; i++) {
                        var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        hexChars.push((bite >>> 4).toString(16));
                        hexChars.push((bite & 0x0f).toString(16));
                    }

                    return hexChars.join('');
                },

                /**
                 * Converts a hex string to a word array.
                 *
                 * @param {string} hexStr The hex string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = Hex.parse(hexString);
                 */
                parse: function (hexStr) {
                    // Shortcut
                    var hexStrLength = hexStr.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < hexStrLength; i += 2) {
                        words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                    }

                    return new WordArray.init(words, hexStrLength / 2);
                }
            };

            /**
             * Latin1 encoding strategy.
             */
            var Latin1 = {
                /**
                 * Converts a word array to a Latin1 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The Latin1 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var latin1String = Latin1.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var latin1Chars = [];
                    for (var i = 0; i < sigBytes; i++) {
                        var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        latin1Chars.push(String.fromCharCode(bite));
                    }

                    return latin1Chars.join('');
                },

                /**
                 * Converts a Latin1 string to a word array.
                 *
                 * @param {string} latin1Str The Latin1 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = Latin1.parse(latin1String);
                 */
                parse: function (latin1Str) {
                    // Shortcut
                    var latin1StrLength = latin1Str.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < latin1StrLength; i++) {
                        words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                    }

                    return new WordArray.init(words, latin1StrLength);
                }
            };

            /**
             * UTF-8 encoding strategy.
             */
            var Utf8 = {
                /**
                 * Converts a word array to a UTF-8 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The UTF-8 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var utf8String = Utf8.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    try {
                        return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                    } catch (e) {
                        throw new Error('Malformed UTF-8 data');
                    }
                },

                /**
                 * Converts a UTF-8 string to a word array.
                 *
                 * @param {string} utf8Str The UTF-8 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = Utf8.parse(utf8String);
                 */
                parse: function (utf8Str) {
                    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                }
            };

            /**
             * Abstract buffered block algorithm template.
             *
             * The property blockSize must be implemented in a concrete subtype.
             *
             * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
             */
            var BufferedBlockAlgorithm = Base.extend({
                /**
                                                          * Resets this block algorithm's data buffer to its initial state.
                                                          *
                                                          * @example
                                                          *
                                                          *     bufferedBlockAlgorithm.reset();
                                                          */
                reset: function () {
                    // Initial values
                    this._data = new WordArray.init();
                    this._nDataBytes = 0;
                },

                /**
                                                          * Adds new data to this block algorithm's buffer.
                                                          *
                                                          * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
                                                          *
                                                          * @example
                                                          *
                                                          *     bufferedBlockAlgorithm._append('data');
                                                          *     bufferedBlockAlgorithm._append(wordArray);
                                                          */
                _append: function (data) {
                    // Convert string to WordArray, else assume WordArray already
                    if (typeof data === 'string') {
                        data = Utf8.parse(data);
                    }

                    // Append
                    this._data.concat(data);
                    this._nDataBytes += data.sigBytes;
                },

                /**
                                                          * Processes available data blocks.
                                                          *
                                                          * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
                                                          *
                                                          * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
                                                          *
                                                          * @return {WordArray} The processed data.
                                                          *
                                                          * @example
                                                          *
                                                          *     var processedData = bufferedBlockAlgorithm._process();
                                                          *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
                                                          */
                _process: function (doFlush) {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;
                    var dataSigBytes = data.sigBytes;
                    var blockSize = this.blockSize;
                    var blockSizeBytes = blockSize * 4;

                    // Count blocks ready
                    var nBlocksReady = dataSigBytes / blockSizeBytes;
                    if (doFlush) {
                        // Round up to include partial blocks
                        nBlocksReady = Math.ceil(nBlocksReady);
                    } else {
                        // Round down to include only full blocks,
                        // less the number of blocks that must remain in the buffer
                        nBlocksReady =
                                                                     Math.max((nBlocksReady | 0) - this._minBufferSize,
                                                                         0);
                    }

                    // Count words ready
                    var nWordsReady = nBlocksReady * blockSize;

                    // Count bytes ready
                    var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                    // Process blocks
                    var processedWords;
                    if (nWordsReady) {
                        for (var offset = 0; offset < nWordsReady;
                            offset += blockSize) {
                            // Perform concrete-algorithm logic
                            this._doProcessBlock(dataWords, offset);
                        }

                        // Remove processed words
                        processedWords = dataWords.splice(0, nWordsReady);
                        data.sigBytes -= nBytesReady;
                    }

                    // Return processed words
                    return new WordArray.init(processedWords, nBytesReady);
                },

                /**
                                                          * Creates a copy of this object.
                                                          *
                                                          * @return {Object} The clone.
                                                          *
                                                          * @example
                                                          *
                                                          *     var clone = bufferedBlockAlgorithm.clone();
                                                          */
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone._data = this._data.clone();

                    return clone;
                },

                _minBufferSize: 0
            });

            /**
             * Abstract hasher template.
             *
             * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
             */
            var Hasher = BufferedBlockAlgorithm.extend({
                /**
                                                            * Configuration options.
                                                            */
                cfg: Base.extend(),

                /**
                                                            * Initializes a newly created hasher.
                                                            *
                                                            * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
                                                            *
                                                            * @example
                                                            *
                                                            *     var hasher = CryptoJS.algo.SHA256.create();
                                                            */
                init: function (cfg) {
                    // Apply config defaults
                    this.cfg = this.cfg.extend(cfg);

                    // Set initial values
                    this.reset();
                },

                /**
                                                            * Resets this hasher to its initial state.
                                                            *
                                                            * @example
                                                            *
                                                            *     hasher.reset();
                                                            */
                reset: function () {
                    // Reset data buffer
                    BufferedBlockAlgorithm.reset.call(this);

                    // Perform concrete-hasher logic
                    this._doReset();
                },

                /**
                                                            * Updates this hasher with a message.
                                                            *
                                                            * @param {WordArray|string} messageUpdate The message to append.
                                                            *
                                                            * @return {Hasher} This hasher.
                                                            *
                                                            * @example
                                                            *
                                                            *     hasher.update('message');
                                                            *     hasher.update(wordArray);
                                                            */
                update: function (messageUpdate) {
                    // Append
                    this._append(messageUpdate);

                    // Update the hash
                    this._process();

                    // Chainable
                    return this;
                },

                /**
                                                            * Finalizes the hash computation.
                                                            * Note that the finalize operation is effectively a destructive, read-once operation.
                                                            *
                                                            * @param {WordArray|string} messageUpdate (Optional) A final message update.
                                                            *
                                                            * @return {WordArray} The hash.
                                                            *
                                                            * @example
                                                            *
                                                            *     var hash = hasher.finalize();
                                                            *     var hash = hasher.finalize('message');
                                                            *     var hash = hasher.finalize(wordArray);
                                                            */
                finalize: function (messageUpdate) {
                    // Final message update
                    if (messageUpdate) {
                        this._append(messageUpdate);
                    }

                    // Perform concrete-hasher logic
                    var hash = this._doFinalize();

                    return hash;
                },

                blockSize: 512 / 32,

                /**
                                                            * Creates a shortcut function to a hasher's object interface.
                                                            *
                                                            * @param {Hasher} hasher The hasher to create a helper for.
                                                            *
                                                            * @return {Function} The shortcut function.
                                                            *
                                                            * @static
                                                            *
                                                            * @example
                                                            *
                                                            *     var md5 = Hasher._createFunction(MD5);
                                                            */
                _createFunction: function (hasher) {
                    return function (message, cfg) {
                        return new hasher.init(cfg).finalize(message);
                    };
                },

            });

            /**
             * END OF CORE IMPLEMENTATION - START OF MD5 ALGORITHM
             */

            // Compute constants
            var T = [];
            (function () {
                for (var i = 0; i < 64; i++) {
                    T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
                }
            }());

            /**
             * MD5 hash algorithm.
             */
            var MD5 = Hasher.extend({
                _doReset: function () {
                    this._hash = new WordArray.init([
                        0x67452301, 0xefcdab89,
                        0x98badcfe, 0x10325476
                    ]);
                },

                _doProcessBlock: function (M, offset) {
                    // Swap endian
                    for (var i = 0; i < 16; i++) {
                        var offset_i = offset + i;
                        var M_offset_i = M[offset_i];

                        M[offset_i] = (
                            (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                                                    (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
                        );
                    }

                    var H = this._hash.words;

                    var M_offset_0 = M[offset + 0];
                    var M_offset_1 = M[offset + 1];
                    var M_offset_2 = M[offset + 2];
                    var M_offset_3 = M[offset + 3];
                    var M_offset_4 = M[offset + 4];
                    var M_offset_5 = M[offset + 5];
                    var M_offset_6 = M[offset + 6];
                    var M_offset_7 = M[offset + 7];
                    var M_offset_8 = M[offset + 8];
                    var M_offset_9 = M[offset + 9];
                    var M_offset_10 = M[offset + 10];
                    var M_offset_11 = M[offset + 11];
                    var M_offset_12 = M[offset + 12];
                    var M_offset_13 = M[offset + 13];
                    var M_offset_14 = M[offset + 14];
                    var M_offset_15 = M[offset + 15];

                    var a = H[0];
                    var b = H[1];
                    var c = H[2];
                    var d = H[3];

                    a = FF(a, b, c, d, M_offset_0, 7, T[0]);
                    d = FF(d, a, b, c, M_offset_1, 12, T[1]);
                    c = FF(c, d, a, b, M_offset_2, 17, T[2]);
                    b = FF(b, c, d, a, M_offset_3, 22, T[3]);
                    a = FF(a, b, c, d, M_offset_4, 7, T[4]);
                    d = FF(d, a, b, c, M_offset_5, 12, T[5]);
                    c = FF(c, d, a, b, M_offset_6, 17, T[6]);
                    b = FF(b, c, d, a, M_offset_7, 22, T[7]);
                    a = FF(a, b, c, d, M_offset_8, 7, T[8]);
                    d = FF(d, a, b, c, M_offset_9, 12, T[9]);
                    c = FF(c, d, a, b, M_offset_10, 17, T[10]);
                    b = FF(b, c, d, a, M_offset_11, 22, T[11]);
                    a = FF(a, b, c, d, M_offset_12, 7, T[12]);
                    d = FF(d, a, b, c, M_offset_13, 12, T[13]);
                    c = FF(c, d, a, b, M_offset_14, 17, T[14]);
                    b = FF(b, c, d, a, M_offset_15, 22, T[15]);

                    a = GG(a, b, c, d, M_offset_1, 5, T[16]);
                    d = GG(d, a, b, c, M_offset_6, 9, T[17]);
                    c = GG(c, d, a, b, M_offset_11, 14, T[18]);
                    b = GG(b, c, d, a, M_offset_0, 20, T[19]);
                    a = GG(a, b, c, d, M_offset_5, 5, T[20]);
                    d = GG(d, a, b, c, M_offset_10, 9, T[21]);
                    c = GG(c, d, a, b, M_offset_15, 14, T[22]);
                    b = GG(b, c, d, a, M_offset_4, 20, T[23]);
                    a = GG(a, b, c, d, M_offset_9, 5, T[24]);
                    d = GG(d, a, b, c, M_offset_14, 9, T[25]);
                    c = GG(c, d, a, b, M_offset_3, 14, T[26]);
                    b = GG(b, c, d, a, M_offset_8, 20, T[27]);
                    a = GG(a, b, c, d, M_offset_13, 5, T[28]);
                    d = GG(d, a, b, c, M_offset_2, 9, T[29]);
                    c = GG(c, d, a, b, M_offset_7, 14, T[30]);
                    b = GG(b, c, d, a, M_offset_12, 20, T[31]);

                    a = HH(a, b, c, d, M_offset_5, 4, T[32]);
                    d = HH(d, a, b, c, M_offset_8, 11, T[33]);
                    c = HH(c, d, a, b, M_offset_11, 16, T[34]);
                    b = HH(b, c, d, a, M_offset_14, 23, T[35]);
                    a = HH(a, b, c, d, M_offset_1, 4, T[36]);
                    d = HH(d, a, b, c, M_offset_4, 11, T[37]);
                    c = HH(c, d, a, b, M_offset_7, 16, T[38]);
                    b = HH(b, c, d, a, M_offset_10, 23, T[39]);
                    a = HH(a, b, c, d, M_offset_13, 4, T[40]);
                    d = HH(d, a, b, c, M_offset_0, 11, T[41]);
                    c = HH(c, d, a, b, M_offset_3, 16, T[42]);
                    b = HH(b, c, d, a, M_offset_6, 23, T[43]);
                    a = HH(a, b, c, d, M_offset_9, 4, T[44]);
                    d = HH(d, a, b, c, M_offset_12, 11, T[45]);
                    c = HH(c, d, a, b, M_offset_15, 16, T[46]);
                    b = HH(b, c, d, a, M_offset_2, 23, T[47]);

                    a = II(a, b, c, d, M_offset_0, 6, T[48]);
                    d = II(d, a, b, c, M_offset_7, 10, T[49]);
                    c = II(c, d, a, b, M_offset_14, 15, T[50]);
                    b = II(b, c, d, a, M_offset_5, 21, T[51]);
                    a = II(a, b, c, d, M_offset_12, 6, T[52]);
                    d = II(d, a, b, c, M_offset_3, 10, T[53]);
                    c = II(c, d, a, b, M_offset_10, 15, T[54]);
                    b = II(b, c, d, a, M_offset_1, 21, T[55]);
                    a = II(a, b, c, d, M_offset_8, 6, T[56]);
                    d = II(d, a, b, c, M_offset_15, 10, T[57]);
                    c = II(c, d, a, b, M_offset_6, 15, T[58]);
                    b = II(b, c, d, a, M_offset_13, 21, T[59]);
                    a = II(a, b, c, d, M_offset_4, 6, T[60]);
                    d = II(d, a, b, c, M_offset_11, 10, T[61]);
                    c = II(c, d, a, b, M_offset_2, 15, T[62]);
                    b = II(b, c, d, a, M_offset_9, 21, T[63]);

                    H[0] = (H[0] + a) | 0;
                    H[1] = (H[1] + b) | 0;
                    H[2] = (H[2] + c) | 0;
                    H[3] = (H[3] + d) | 0;
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

                    var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
                    var nBitsTotalL = nBitsTotal;
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                        (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                                                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
                    );
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                        (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                                                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
                    );

                    data.sigBytes = (dataWords.length + 1) * 4;

                    // Hash final blocks
                    this._process();

                    // Shortcuts
                    var hash = this._hash;
                    var H = hash.words;

                    // Swap endian
                    for (var i = 0; i < 4; i++) {
                        // Shortcut
                        var H_i = H[i];

                        H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                                                       (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
                    }
                    return hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });

            function FF(a, b, c, d, x, s, t) {
                var n = a + ((b & c) | (~b & d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function GG(a, b, c, d, x, s, t) {
                var n = a + ((b & d) | (c & ~d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function HH(a, b, c, d, x, s, t) {
                var n = a + (b ^ c ^ d) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function II(a, b, c, d, x, s, t) {
                var n = a + (c ^ (b | ~d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = MD5('message');
             *     var hash = MD5(wordArray);
             */
            return Hasher._createFunction(MD5);
        };

        this.md5 = hasherBuilder(Math);
    }

}

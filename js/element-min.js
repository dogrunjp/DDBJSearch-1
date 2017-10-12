/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.1
*/
YAHOO.util.Attribute = function(B, A) {
    if (A) {
        this.owner = A;
        this.configure(B, true);
    }
};
YAHOO.util.Attribute.prototype = {
    name: undefined,
    value: null,
    owner: null,
    readOnly: false,
    writeOnce: false,
    _initialConfig: null,
    _written: false,
    method: null,
    setter: null,
    getter: null,
    validator: null,
    getValue: function() {
        var A = this.value;
        if (this.getter) {
            A = this.getter.call(this.owner, this.name, A);
        }
        return A;
    },
    setValue: function(F, B) {
        var E, A = this.owner, C = this.name;
        var D = {
            type: C,
            prevValue: this.getValue(),
            newValue: F
        };
        if (this.readOnly || (this.writeOnce && this._written)) {
            return false;
        }
        if (this.validator&&!this.validator.call(A, F)) {
            return false;
        }
        if (!B) {
            E = A.fireBeforeChangeEvent(D);
            if (E === false) {
                return false;
            }
        }
        if (this.setter) {
            F = this.setter.call(A, F, this.name);
            if (F === undefined) {}
        }
        if (this.method) {
            this.method.call(A, F, this.name);
        }
        this.value = F;
        this._written = true;
        D.type = C;
        if (!B) {
            this.owner.fireChangeEvent(D);
        }
        return true;
    },
    configure: function(B, C) {
        B = B || {};
        if (C) {
            this._written = false;
        }
        this._initialConfig = this._initialConfig || {};
        for (var A in B) {
            if (B.hasOwnProperty(A)) {
                this[A] = B[A];
                if (C) {
                    this._initialConfig[A] = B[A];
                }
            }
        }
    },
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    resetConfig: function() {
        this.configure(this._initialConfig, true);
    },
    refresh: function(A) {
        this.setValue(this.value, A);
    }
};
(function() {
    var A = YAHOO.util.Lang;
    YAHOO.util.AttributeProvider = function() {};
    YAHOO.util.AttributeProvider.prototype = {
        _configs: null,
        get: function(C) {
            this._configs = this._configs || {};
            var B = this._configs[C];
            if (!B ||!this._configs.hasOwnProperty(C)) {
                return null;
            }
            return B.getValue();
        },
        set: function(D, E, B) {
            this._configs = this._configs || {};
            var C = this._configs[D];
            if (!C) {
                return false;
            }
            return C.setValue(E, B);
        },
        getAttributeKeys: function() {
            this._configs = this._configs;
            var C = [], B;
            for (B in this._configs) {
                if (A.hasOwnProperty(this._configs, B)&&!A.isUndefined(this._configs[B])) {
                    C[C.length] = B;
                }
            }
            return C;
        },
        setAttributes: function(D, B) {
            for (var C in D) {
                if (A.hasOwnProperty(D, C)) {
                    this.set(C, D[C], B);
                }
            }
        },
        resetValue: function(C, B) {
            this._configs = this._configs || {};
            if (this._configs[C]) {
                this.set(C, this._configs[C]._initialConfig.value, B);
                return true;
            }
            return false;
        },
        refresh: function(E, C) {
            this._configs = this._configs || {};
            var F = this._configs;
            E = ((A.isString(E)) ? [E] : E) || this.getAttributeKeys();
            for (var D = 0, B = E.length; D < B; ++D) {
                if (F.hasOwnProperty(E[D])) {
                    this._configs[E[D]].refresh(C);
                }
            }
        },
        register: function(B, C) {
            this.setAttributeConfig(B, C);
        },
        getAttributeConfig: function(C) {
            this._configs = this._configs || {};
            var B = this._configs[C] || {};
            var D = {};
            for (C in B) {
                if (A.hasOwnProperty(B, C)) {
                    D[C] = B[C];
                }
            }
            return D;
        },
        setAttributeConfig: function(B, C, D) {
            this._configs = this._configs || {};
            C = C || {};
            if (!this._configs[B]) {
                C.name = B;
                this._configs[B] = this.createAttribute(C);
            } else {
                this._configs[B].configure(C, D);
            }
        },
        configureAttribute: function(B, C, D) {
            this.setAttributeConfig(B, C, D);
        },
        resetAttributeConfig: function(B) {
            this._configs = this._configs || {};
            this._configs[B].resetConfig();
        },
        subscribe: function(B, C) {
            this._events = this._events || {};
            if (!(B in this._events)) {
                this._events[B] = this.createEvent(B);
            }
            YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments);
        },
        on: function() {
            this.subscribe.apply(this, arguments);
        },
        addListener: function() {
            this.subscribe.apply(this, arguments);
        },
        fireBeforeChangeEvent: function(C) {
            var B = "before";
            B += C.type.charAt(0).toUpperCase() + C.type.substr(1) + "Change";
            C.type = B;
            return this.fireEvent(C.type, C);
        },
        fireChangeEvent: function(B) {
            B.type += "Change";
            return this.fireEvent(B.type, B);
        },
        createAttribute: function(B) {
            return new YAHOO.util.Attribute(B, this);
        }
    };
    YAHOO.augment(YAHOO.util.AttributeProvider, YAHOO.util.EventProvider);
})();
(function() {
    var B = YAHOO.util.Dom, D = YAHOO.util.AttributeProvider, C = {
        mouseenter: true,
        mouseleave: true
    };
    var A = function(E, F) {
        this.init.apply(this, arguments);
    };
    A.DOM_EVENTS = {
        "click": true,
        "dblclick": true,
        "keydown": true,
        "keypress": true,
        "keyup": true,
        "mousedown": true,
        "mousemove": true,
        "mouseout": true,
        "mouseover": true,
        "mouseup": true,
        "mouseenter": true,
        "mouseleave": true,
        "focus": true,
        "blur": true,
        "submit": true,
        "change": true
    };
    A.prototype = {
        DOM_EVENTS: null,
        DEFAULT_HTML_SETTER: function(G, E) {
            var F = this.get("element");
            if (F) {
                F[E] = G;
            }
            return G;
        },
        DEFAULT_HTML_GETTER: function(E) {
            var F = this.get("element"), G;
            if (F) {
                G = F[E];
            }
            return G;
        },
        appendChild: function(E) {
            E = E.get ? E.get("element") : E;
            return this.get("element").appendChild(E);
        },
        getElementsByTagName: function(E) {
            return this.get("element").getElementsByTagName(E);
        },
        hasChildNodes: function() {
            return this.get("element").hasChildNodes();
        },
        insertBefore: function(E, F) {
            E = E.get ? E.get("element") : E;
            F = (F && F.get) ? F.get("element") : F;
            return this.get("element").insertBefore(E, F);
        },
        removeChild: function(E) {
            E = E.get ? E.get("element") : E;
            return this.get("element").removeChild(E);
        },
        replaceChild: function(E, F) {
            E = E.get ? E.get("element") : E;
            F = F.get ? F.get("element") : F;
            return this.get("element").replaceChild(E, F);
        },
        initAttributes: function(E) {},
        addListener: function(J, I, K, H) {
            H = H || this;
            var E = YAHOO.util.Event, G = this.get("element") || this.get("id"), F = this;
            if (C[J]&&!E._createMouseDelegate) {
                return false;
            }
            if (!this._events[J]) {
                if (G && this.DOM_EVENTS[J]) {
                    E.on(G, J, function(M, L) {
                        if (M.srcElement&&!M.target) {
                            M.target = M.srcElement;
                        }
                        if ((M.toElement&&!M.relatedTarget) || (M.fromElement&&!M.relatedTarget)) {
                            M.relatedTarget = E.getRelatedTarget(M);
                        }
                        if (!M.currentTarget) {
                            M.currentTarget = G;
                        }
                        F.fireEvent(J, M, L);
                    }, K, H);
                }
                this.createEvent(J, {
                    scope: this
                });
            }
            return YAHOO.util.EventProvider.prototype.subscribe.apply(this, arguments);
        },
        on: function() {
            return this.addListener.apply(this, arguments);
        },
        subscribe: function() {
            return this.addListener.apply(this, arguments);
        },
        removeListener: function(F, E) {
            return this.unsubscribe.apply(this, arguments);
        },
        addClass: function(E) {
            B.addClass(this.get("element"), E);
        },
        getElementsByClassName: function(F, E) {
            return B.getElementsByClassName(F, E, this.get("element"));
        },
        hasClass: function(E) {
            return B.hasClass(this.get("element"), E);
        },
        removeClass: function(E) {
            return B.removeClass(this.get("element"), E);
        },
        replaceClass: function(F, E) {
            return B.replaceClass(this.get("element"), F, E);
        },
        setStyle: function(F, E) {
            return B.setStyle(this.get("element"), F, E);
        },
        getStyle: function(E) {
            return B.getStyle(this.get("element"), E);
        },
        fireQueue: function() {
            var F = this._queue;
            for (var G = 0, E = F.length; G < E; ++G) {
                this[F[G][0]].apply(this, F[G][1]);
            }
        },
        appendTo: function(F, G) {
            F = (F.get) ? F.get("element") : B.get(F);
            this.fireEvent("beforeAppendTo", {
                type: "beforeAppendTo",
                target: F
            });
            G = (G && G.get) ? G.get("element") : B.get(G);
            var E = this.get("element");
            if (!E) {
                return false;
            }
            if (!F) {
                return false;
            }
            if (E.parent != F) {
                if (G) {
                    F.insertBefore(E, G);
                } else {
                    F.appendChild(E);
                }
            }
            this.fireEvent("appendTo", {
                type: "appendTo",
                target: F
            });
            return E;
        },
        get: function(E) {
            var G = this._configs || {}, F = G.element;
            if (F&&!G[E]&&!YAHOO.lang.isUndefined(F.value[E])) {
                this._setHTMLAttrConfig(E);
            }
            return D.prototype.get.call(this, E);
        },
        setAttributes: function(K, H) {
            var F = {}, I = this._configOrder;
            for (var J = 0, E = I.length; J < E; ++J) {
                if (K[I[J]] !== undefined) {
                    F[I[J]] = true;
                    this.set(I[J], K[I[J]], H);
                }
            }
            for (var G in K) {
                if (K.hasOwnProperty(G)&&!F[G]) {
                    this.set(G, K[G], H);
                }
            }
        },
        set: function(F, H, E) {
            var G = this.get("element");
            if (!G) {
                this._queue[this._queue.length] = ["set", arguments];
                if (this._configs[F]) {
                    this._configs[F].value = H;
                }
                return;
            }
            if (!this._configs[F]&&!YAHOO.lang.isUndefined(G[F])) {
                this._setHTMLAttrConfig(F);
            }
            return D.prototype.set.apply(this, arguments);
        },
        setAttributeConfig: function(E, F, G) {
            this._configOrder.push(E);
            D.prototype.setAttributeConfig.apply(this, arguments);
        },
        createEvent: function(F, E) {
            this._events[F] = true;
            return D.prototype.createEvent.apply(this, arguments);
        },
        init: function(F, E) {
            this._initElement(F, E);
        },
        destroy: function() {
            var E = this.get("element");
            YAHOO.util.Event.purgeElement(E, true);
            this.unsubscribeAll();
            if (E && E.parentNode) {
                E.parentNode.removeChild(E);
            }
            this._queue = [];
            this._events = {};
            this._configs = {};
            this._configOrder = [];
        },
        _initElement: function(G, F) {
            this._queue = this._queue || [];
            this._events = this._events || {};
            this._configs = this._configs || {};
            this._configOrder = [];
            F = F || {};
            F.element = F.element || G || null;
            var I = false;
            var E = A.DOM_EVENTS;
            this.DOM_EVENTS = this.DOM_EVENTS || {};
            for (var H in E) {
                if (E.hasOwnProperty(H)) {
                    this.DOM_EVENTS[H] = E[H];
                }
            }
            if (typeof F.element === "string") {
                this._setHTMLAttrConfig("id", {
                    value: F.element
                });
            }
            if (B.get(F.element)) {
                I = true;
                this._initHTMLElement(F);
                this._initContent(F);
            }
            YAHOO.util.Event.onAvailable(F.element, function() {
                if (!I) {
                    this._initHTMLElement(F);
                }
                this.fireEvent("available", {
                    type: "available",
                    target: B.get(F.element)
                });
            }, this, true);
            YAHOO.util.Event.onContentReady(F.element, function() {
                if (!I) {
                    this._initContent(F);
                }
                this.fireEvent("contentReady", {
                    type: "contentReady",
                    target: B.get(F.element)
                });
            }, this, true);
        },
        _initHTMLElement: function(E) {
            this.setAttributeConfig("element", {
                value: B.get(E.element),
                readOnly: true
            });
        },
        _initContent: function(E) {
            this.initAttributes(E);
            this.setAttributes(E, true);
            this.fireQueue();
        },
        _setHTMLAttrConfig: function(E, G) {
            var F = this.get("element");
            G = G || {};
            G.name = E;
            G.setter = G.setter || this.DEFAULT_HTML_SETTER;
            G.getter = G.getter || this.DEFAULT_HTML_GETTER;
            G.value = G.value || F[E];
            this._configs[E] = new YAHOO.util.Attribute(G, this);
        }
    };
    YAHOO.augment(A, D);
    YAHOO.util.Element = A;
})();
YAHOO.register("element", YAHOO.util.Element, {
    version: "2.8.1",
    build: "19"
});

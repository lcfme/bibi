



/*!
 *
 * # BiB/i (core)
 *
 * - "EPUB Reader on Your Web Site."
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 * - Fri June 5 15:48:00 2015 +0900
 */

Bibi = { "version": "0.999.0", "build": 20150605.0 };




B = {}; // Bibi.Book

C = {}; // Bibi.Controls

E = {}; // Bibi.Events

L = {}; // Bibi.Loader

M = {}; // Bibi.Messages

N = {}; // Bibi.Notifier

O = {}; // Bibi.Operator

P = {}; // Bibi.Preset

R = {}; // Bibi.Reader

S = {}; // Bibi.Settings

U = {}; // Bibi.SettingsInURI

X = {}; // Bibi.Extentions




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------


Bibi.welcome = function() {

	O.log(1, 'Welcome to BiB/i v' + Bibi.Version + ' - http://bibi.epub.link/');

	O.HTML  = document.getElementsByTagName("html" )[0]; O.HTML.className = "preparing " + sML.Environments.join(" ");
	O.Head  = document.getElementsByTagName("head" )[0];
	O.Body  = document.getElementsByTagName("body" )[0];
	O.Title = document.getElementsByTagName("title")[0];

	if(sML.OS.iOS || sML.OS.Android) {
		O.SmartPhone = true;
		O.HTML.className = O.HTML.className + " Touch";
		O.setOrientation = function() {
			sML.removeClass(O.HTML, "orientation-" + (window.orientation == 0 ? "landscape" : "portrait" ));
			sML.addClass(   O.HTML, "orientation-" + (window.orientation == 0 ? "portrait"  : "landscape"));
		}
		window.addEventListener("orientationchange", O.setOrientation);
		O.setOrientation();
		if(sML.OS.iOS) {
			O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-capable",          content: "yes"   }));
			O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-status-bar-style", content: "white" }));
		}
	}

	if(parent == window) {
		O.WindowEmbedded = false;
		O.HTML.className = O.HTML.className + " window-not-embedded";
	} else {
		O.WindowEmbedded = 1; // true
		O.HTML.className = O.HTML.className + " window-embedded";
		try {
			if(location.host == parent.location.host) {
				O.HTML.className = O.HTML.className + " window-embedded-sameorigin";
			}
		} catch(Err) {
			O.WindowEmbedded = -1; // true
			O.HTML.className = O.HTML.className + " window-embedded-crossorigin";
		}
	}

	if((function() {
		if(document.body.requestFullscreen       || document.body.requestFullScreen)       return true;
		if(document.body.webkitRequestFullscreen || document.body.webkitRequestFullScreen) return true;
		if(document.body.mozRequestFullscreen    || document.body.mozRequestFullScreen)    return true;
		if(document.body.msRequestFullscreen)                                              return true;
		return false;
	})()) {
		O.FullscreenEnabled = true;
		O.HTML.className = O.HTML.className + " fullscreen-enabled";
	} else {
		O.FullscreenEnabled = false;
		O.HTML.className = O.HTML.className + " fullscreen-not-enabled";
	}

	var Checker = document.body.appendChild(sML.create("div", { id: "checker" }));
	Checker.Child = Checker.appendChild(sML.create("p", { innerHTML: "aAあ亜" }));
	if(Checker.Child.offsetWidth < Checker.Child.offsetHeight) {
		O.HTML.className = O.HTML.className + " vertical-text-enabled";
		O.VerticalTextEnabled = true;
	} else {
		O.HTML.className = O.HTML.className + " vertical-text-not-enabled";
		O.VerticalTextEnabled = false;
	};
	O.DefaultFontSize = Math.min(Checker.Child.offsetWidth, Checker.Child.offsetHeight);
	document.body.removeChild(Checker);
	delete Checker;

	if(typeof window.CustomEvent === "undefined") {
		window.CustomEvent = function(EventName, Option) {
			Option = Option || { bubbles: false, cancelable: false, detail: undefined };
			var Eve = document.createEvent("CustomEvent");
			Eve.initCustomEvent(EventName, Option.bubbles, Option.cancelable, Option.detail);
			return Eve;
		};
		window.CustomEvent.prototype = window.Event.prototype;
	}

	R.Content = O.Body.insertBefore(sML.create("div", { id: "epub-content" }), C.Veil);
	R.Content.Main = R.Content.appendChild(sML.create("div", { id: "epub-content-main" }));
	R.Content.Complementary = R.Content.appendChild(sML.create("div", { id: "epub-content-complementary" }));
	R.Frame = (sML.OS.iOS || sML.OS.Android) ? R.Content : window;

	U.initialize();
	S.initialize();

	if(S["poster"]) {
		sML.addClass(O.HTML, "with-poster");
		O.Body.style.backgroundImage = "url(" + S["poster"] + ")";
	}

	var ExtentionNames = [];
	for(var Property in X) if(X[Property] && typeof X[Property] == "object" && X[Property]["name"]) ExtentionNames.push(X[Property]["name"]);
	if(ExtentionNames.length) O.log(2, "Extention" + (ExtentionNames.length >= 2 ? "s" : "") + ": " + ExtentionNames.join(", "));

	C.createVeil();
	C.createCartain();

	E.dispatch("bibi:welcome");
	window.addEventListener("message", M.gate, false);
	M.post("bibi:welcome");

	setTimeout(function() {
		if(U["book"]) {
			B.initialize({ Name: U["book"] });
			if(S["autostart"] || !B.Zipped) {
				B.load();
			} else {
				E.dispatch("bibi:wait");
				C.Veil.Message.note('');
			}
		} else {
			if(O.WindowEmbedded) {
				if(window.File && !O.StartPhone) {
					C.Veil.Catcher.style.display = "block";
					C.Veil.Message.note('Drop an EPUB file into this window. Or click and select EPUB file.');
				} else {
					C.Veil.Message.note('Tell me EPUB name via embedding tag.');
				}
			} else {
				if(window.File && !O.StartPhone) {
					C.Veil.Catcher.style.display = "block";
					C.Veil.Message.note('Drop an EPUB file into this window. Or click and select EPUB file.');
				} else {
					C.Veil.Message.note('Tell me EPUB name via URI.');
				}
			}
		}
	}, (sML.OS.iOS || sML.OS.Android ? 1000 : 1));

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Book

//----------------------------------------------------------------------------------------------------------------------------------------------

B.initialize = function(Book) {
	delete B["name"];
	delete B.Path;
	delete B.PathDelimiter;
	delete B.Zipped;
	delete B.Local;
	delete B.File;
	delete B.Files;
	O.apply({
		Title: "",
		Creator: "",
		Publisher: "",
		Language: "",
		WritingMode: "",
		Container: { Path: "META-INF/container.xml" },
		Package:   { Path: "", Dir: "",
			Metadata: { "titles": [], "creators": [], "publishers": [], "languages": [] },
			Manifest: { "items": {}, "nav": {}, "toc-ncx": {}, "cover-image": {} },
			Spine:    { "itemrefs": [] }
		},
		FileDigit: 3
	}, B);
	if(typeof Book.Name == "string") {
		B["name"] = Book.Name;
		B.Path = P["bookshelf"] + B["name"];
		if(/\.epub$/i.test(Book.Name)) B.Zipped = true;
	} else if(typeof Book.File == "object" && Book.File) {
		if(!Book.File.size || typeof Book.File.name != "string" || !/\.epub$/i.test(Book.File.name)) {
			C.Veil.Message.note('Give me <span style="color:rgb(128,128,128);">EPUB</span>.');
			return false;
		}
		B["name"] = B.Path = Book.File.name;
		B.Zipped = true;
		B.Local = true;
		B.File = Book.File;
	} else {
		return false;
	}
	B.PathDelimiter = !B.Zipped ? "/" : " > ";
};


B.load = function() {
	O.startLoading();
	R.initialize();
	if(!B.Zipped) {
		// EPUB Folder (Online)
		O.log(2, 'EPUB: ' + B.Path + " (Online Folder)", "Show");
		B.open();
	} else {
		// EPUB Zip
		O.log(2, 'Loading EPUB...', "Show");
		var onload = function(Loaded) {
			B.File = Loaded;
			B.unzip();
			O.log(2, 'EPUB Loaded.', "Show");
			B.open();
		};
		if(!B.Local) {
			// EPUB Zip (Online)
			O.log(3, B.Path);
			O.download(B.Path, "text/plain;charset=x-user-defined").then(function(XHR) { onload(XHR); });
		} else {
			// EPUB Zip (Local)
			O.log(2, 'Loading EPUB...', "Show");
			O.log(3, "[Local] " + B.Path);
			sML.edit(new FileReader(), {
				onerror : function() { O.Body.style.opacity = 1; C.Veil.Message.note('Error. Something trouble...'); },
				onload  : function() { onload(this.result); }
			}).readAsArrayBuffer(B.File);
			C.Veil.Catcher.style.opacity = 0;
		}
	}
};


B.open = function() {
	E.dispatch("bibi:open");
	O.openDocument(B.Container.Path, { then: L.readContainer });
};


B.unzip = function() {

	B.Files = {};
	var FileCount = { All: 0, HTML: 0, CSS: 0, SVG: 0, Bitmap: 0, Font: 0, Audio: 0, Video: 0, PDF: 0, Etcetra: 0 };

	B.File = (new JSZip()).load(B.File);
	for(var FileName in B.File.files) {
		if(B.File.files[FileName]._data) {
			FileCount.All++;
			     if(         /\.(x?html?)$/i.test(FileName)) FileCount.HTML++;
			else if(             /\.(css)$/i.test(FileName)) FileCount.CSS++;
			else if(             /\.(svg)$/i.test(FileName)) FileCount.SVG++;
			else if(   /\.(gif|jpe?g|png)$/i.test(FileName)) FileCount.Bitmap++;
			else if(    /\.(woff|otf|ttf)$/i.test(FileName)) FileCount.Font++;
			else if( /\.(m4a|aac|mp3|ogg)$/i.test(FileName)) FileCount.Audio++;
			else if(/\.(mp4|m4v|ogv|webm)$/i.test(FileName)) FileCount.Video++;
			else if(             /\.(pdf)$/i.test(FileName)) FileCount.PDF++;
			else                                             FileCount.Etcetra++;
			B.Files[FileName] = O.isBin(FileName) ? B.File.file(FileName).asBinary() : Base64.btou(B.File.file(FileName).asText());
		}
	}
	delete B.File;

	B.FileDigit = (FileCount.All + "").length;

	if(FileCount.All)     O.log(3, sML.String.padZero(FileCount.All,     B.FileDigit) + ' File'   + (FileCount.All    >= 2 ? "s" : ""));
	if(FileCount.HTML)    O.log(4, sML.String.padZero(FileCount.HTML,    B.FileDigit) + ' HTML'   + (FileCount.HTML   >= 2 ? "s" : ""));
	if(FileCount.CSS)     O.log(4, sML.String.padZero(FileCount.CSS,     B.FileDigit) + ' CSS'    + (FileCount.CSS    >= 2 ? "s" : ""));
	if(FileCount.SVG)     O.log(4, sML.String.padZero(FileCount.SVG,     B.FileDigit) + ' SVG'    + (FileCount.SVG    >= 2 ? "s" : ""));
	if(FileCount.Bitmap)  O.log(4, sML.String.padZero(FileCount.Bitmap,  B.FileDigit) + ' Bitmap' + (FileCount.Bitmap >= 2 ? "s" : ""));
	if(FileCount.Font)    O.log(4, sML.String.padZero(FileCount.Font,    B.FileDigit) + ' Font'   + (FileCount.Font   >= 2 ? "s" : ""));
	if(FileCount.Audio)   O.log(4, sML.String.padZero(FileCount.Audio,   B.FileDigit) + ' Audio'  + (FileCount.Audio  >= 2 ? "s" : ""));
	if(FileCount.Video)   O.log(4, sML.String.padZero(FileCount.Video,   B.FileDigit) + ' Video'  + (FileCount.Video  >= 2 ? "s" : ""));
	if(FileCount.PDF)     O.log(4, sML.String.padZero(FileCount.PDF,     B.FileDigit) + ' PDF'    + (FileCount.PDF    >= 2 ? "s" : ""));
	if(FileCount.Etcetra) O.log(4, sML.String.padZero(FileCount.Etcetra, B.FileDigit) + ' etc.');

	var Preprocessed = { CSS: 0, SVG: 0, HTML: 0 };

	// CSS
	for(var FilePath in B.Files) {
		if(!/\.css$/.test(FilePath)) continue;
		B.Files[FilePath] = (function(FilePath) { var getImportedCSS = arguments.callee;
			if(!B.Files[FilePath]) return "";
			var RE = /@import[ \t]*(?:url\()?["']?(?!(?:https?|data):)(.+?)['"]?(?:\))?[ \t]*;/g;
			var Imports = B.Files[FilePath].match(RE);
			if(Imports) {
				sML.each(Imports, function() {
					var ImportPath = O.getPath(FilePath.replace(/[^\/]+$/, ""), this.replace(RE, "$1"));
					if(B.Files[ImportPath]) B.Files[FilePath] = B.Files[FilePath].replace(this, getImportedCSS(ImportPath));
				});
			}
			B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
				"url" : "gif|png|jpe?g|svg|ttf|otf|woff"
			}, function() {
				return /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g;
			});
			return B.Files[FilePath];
		})(FilePath);
		Preprocessed.CSS++;
	}
	if(Preprocessed.CSS) O.log(3, sML.String.padZero(Preprocessed.CSS, B.FileDigit) + ' CSS' + (Preprocessed.CSS >= 2 ? "s" : "") + " Preprocessed.");

	// SVG
	for(var FilePath in B.Files) {
		if(!/\.svg$/.test(FilePath)) continue;
		B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
			"href"       : "css",
			"src"        : "gif|png|jpe?g|svg|js",
			"xlink:href" : "gif|png|jpe?g"
		});
		Preprocessed.SVG++;
	}
	if(Preprocessed.SVG) O.log(3, sML.String.padZero(Preprocessed.SVG, B.FileDigit) + ' SVG' + (Preprocessed.SVG >= 2 ? "s" : "") + " Preprocessed.");

	// HTML
	for(var FilePath in B.Files) {
		if(!/\.x?html?$/.test(FilePath)) continue;
		B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
			"href"       : "css",
			"src"        : "gif|png|jpe?g|svg|js|mp[34]|m4[av]|webm",
			"xlink:href" : "gif|png|jpe?g"
		});
	}
	for(var FilePath in B.Files) {
		if(!/\.x?html?$/.test(FilePath)) continue;
		B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
			"src" : "x?html?"
		});
		Preprocessed.HTML++;
	}
	if(Preprocessed.HTML) O.log(3, sML.String.padZero(Preprocessed.HTML, B.FileDigit) + ' HTML' + (Preprocessed.HTML >= 2 ? "s" : "") + " Preprocessed.");

};


B.getDataURI = function(FilePath) {
	for(var ContentType in O.ContentTypeList) {
		if(O.ContentTypeList[ContentType].test(FilePath)) {
			return "data:" + ContentType + ";base64," + (O.isBin(FilePath) ? btoa(B.Files[FilePath]) : Base64.encode(B.Files[FilePath]));
		}
	}
	return "";
};


B.replaceResourceRefferences = function(FilePath, ExtLists, getMatchRE) {
	if(typeof getMatchRE != "function") getMatchRE = function(At) { return (new RegExp('<\\??[a-zA-Z1-6:\-]+[^>]*? ' + At + '[ \t]*=[ \t]*[\'"](?!(?:https?|data):)([^"]+?)[\'"]', "g")); };
	var Source = B.Files[FilePath].replace(/[\r\n]/g, "\n").replace(/\r/g, "\n");
	var FileDir = FilePath.replace(/\/?[^\/]+$/, "");
	for(var Attribute in ExtLists) {
		var MatchRE = getMatchRE(Attribute);
		var Matches = Source.match(MatchRE);
		if(Matches) {
			var ExtRE = new RegExp('\.' + ExtLists[Attribute] + '$', "i");
			sML.each(Matches, function() {
				var ResPathInSource = this.replace(MatchRE, "$1");
				var ResPath = O.getPath(FileDir, (!/^(\.*\/+|#)/.test(ResPathInSource) ? "./" : "") + ResPathInSource);
				var ResFnH = ResPath.split("#"), ResFile = ResFnH[0] ? ResFnH[0] : FilePath, ResHash = ResFnH[1] ? ResFnH[1] : "";
				if(ExtRE.test(ResFile) && typeof B.Files[ResFile] == "string") Source = Source.replace(this, this.replace(ResPathInSource, B.getDataURI(ResFile) + (ResHash ? "#" + ResHash : "")));
			});
		}
	}
	/*
	if(Shelter.length) for(var i = 0, L = Shelter.length; i < L; i++) Source = Source.replace('<bibi:ignored number="' + i + '" />', Shelter[i]);
	Source = Source.replace(/<bibi:lf \/>/g, "\n");
	*/
	return Source;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loader

//----------------------------------------------------------------------------------------------------------------------------------------------


L.readContainer = function(Doc) {

	O.log(2, 'Reading Container XML...', "Show");

	O.log(3, B.Path + B.PathDelimiter + B.Container.Path);

	B.Package.Path = Doc.getElementsByTagName("rootfile")[0].getAttribute("full-path");
	B.Package.Dir  = B.Package.Path.replace(/\/?[^\/]+$/, "");

	E.dispatch("bibi:readContainer");

	O.log(2, 'Container XML Read.', "Show");

	O.openDocument(B.Package.Path, { then: L.readPackageDocument });

};


L.readPackageDocument = function(Doc) {

	O.log(2, 'Reading Package Document...', "Show");

	O.log(3, B.Path + B.PathDelimiter + B.Package.Path);

	// Package
	var Metadata = Doc.getElementsByTagName("metadata")[0];
	var Manifest = Doc.getElementsByTagName("manifest")[0];
	var Spine    = Doc.getElementsByTagName("spine")[0];
	var ManifestItems = Manifest.getElementsByTagName("item");
	var SpineItemrefs = Spine.getElementsByTagName("itemref");
	if(ManifestItems.length <= 0) return O.log(0, '"' + B.Package.Path + '" has no <item> in <manifest>.');
	if(SpineItemrefs.length <= 0) return O.log(0, '"' + B.Package.Path + '" has no <itemref> in <spine>.');

	// METADATA
	sML.each(Metadata.getElementsByTagName("meta"), function() {
		if(this.getAttribute("refines")) return;
		if(this.getAttribute("property")) {
			var Property = this.getAttribute("property").replace(/^dcterms:/, "");
			if(/^(title|creator|publisher|language)$/.test(Property)) B.Package.Metadata[Property + "s"].push(this.textContent);
			else if(!B.Package.Metadata[Property]) B.Package.Metadata[Property] = this.textContent;
		}
		if(this.getAttribute("name") && this.getAttribute("content")) {
			B.Package.Metadata[this.getAttribute("name")] = this.getAttribute("content");
		}
	});
	if(!B.Package.Metadata["titles"    ].length) sML.each(Doc.getElementsByTagName("dc:title"),     function() { B.Package.Metadata["titles"    ].push(this.textContent); return false; });
	if(!B.Package.Metadata["creators"  ].length) sML.each(Doc.getElementsByTagName("dc:creator"),   function() { B.Package.Metadata["creators"  ].push(this.textContent); });
	if(!B.Package.Metadata["publishers"].length) sML.each(Doc.getElementsByTagName("dc:publisher"), function() { B.Package.Metadata["publishers"].push(this.textContent); });
	if(!B.Package.Metadata["languages" ].length) sML.each(Doc.getElementsByTagName("dc:language"),  function() { B.Package.Metadata["languages" ].push(this.textContent); });
	if(!B.Package.Metadata["languages" ].length) B.Package.Metadata["languages"][0] = "en";
	if(!B.Package.Metadata["rendition:layout"])      B.Package.Metadata["rendition:layout"]      = "reflowable";
	if(!B.Package.Metadata["rendition:orientation"]) B.Package.Metadata["rendition:orientation"] = "auto";
	if(!B.Package.Metadata["rendition:spread"])      B.Package.Metadata["rendition:spread"]      = "auto";
	if(!B.Package.Metadata["cover"])                 B.Package.Metadata["cover"]                 = "";

	delete Doc;

	// MANIFEST
	var TOCID = Spine.getAttribute("toc");
	sML.each(ManifestItems, function() {
		var ManifestItem = {
			"id"         : this.getAttribute("id")         || "",
			"href"       : this.getAttribute("href")       || "",
			"media-type" : this.getAttribute("media-type") || "",
			"properties" : this.getAttribute("properties") || "",
			"fallback"   : this.getAttribute("fallback")   || ""
		};
		if(ManifestItem["id"] && ManifestItem["href"]) {
			B.Package.Manifest["items"][ManifestItem["id"]] = ManifestItem;
			(function(ManifestItemProperties) {
				if(        / nav /.test(ManifestItemProperties)) B.Package.Manifest["nav"        ].Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
				if(/ cover-image /.test(ManifestItemProperties)) B.Package.Manifest["cover-image"].Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
			})(" " + ManifestItem.properties + " ");
			if(TOCID && ManifestItem["id"] == TOCID) B.Package.Manifest["toc-ncx"].Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
		}
	});

	// SPINE
	B.Package.Spine["page-progression-direction"] = Spine.getAttribute("page-progression-direction");
	if(!B.Package.Spine["page-progression-direction"] || !/^(ltr|rtl)$/.test(B.Package.Spine["page-progression-direction"])) B.Package.Spine["page-progression-direction"] = "default";
	var PropertyREs = [
		/(rendition:layout)-(.+)/,
		/(rendition:orientation)-(.+)/,
		/(rendition:spread)-(.+)/,
		/(rendition:page-spread)-(.+)/,
		/(page-spread)-(.+)/
	];
	sML.each(SpineItemrefs, function(i) {
		var SpineItemref = {
			"idref"                 : this.getAttribute("idref")      || "",
			"linear"                : this.getAttribute("linear")     || "",
			"properties"            : this.getAttribute("properties") || "",
			"page-spread"           : "",
			"rendition:layout"      : B.Package.Metadata["rendition:layout"],
			"rendition:orientation" : B.Package.Metadata["rendition:orientation"],
			"rendition:spread"      : B.Package.Metadata["rendition:spread"]
		};
		SpineItemref["properties"] = SpineItemref["properties"].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ").split(" ");
		PropertyREs.forEach(function(RE) {
			SpineItemref["properties"].forEach(function(Property) {
				if(RE.test(Property)) {
					SpineItemref[Property.replace(RE, "$1")] = Property.replace(RE, "$2").replace("rendition:", "");
					return false;
				}
			});
		});
		if(SpineItemref["rendition:page-spread"]) SpineItemref["page-spread"] = SpineItemref["rendition:page-spread"];
		SpineItemref["rendition:page-spread"] = SpineItemref["page-spread"];
		SpineItemref["viewport"] = { content: null, width: null, height: null };
		SpineItemref["viewBox"]  = { content: null, width: null, height: null };
		B.Package.Spine["itemrefs"].push(SpineItemref);
	});

	B.Title     = B.Package.Metadata["titles"].join(    ", ");
	B.Creator   = B.Package.Metadata["creators"].join(  ", ");
	B.Publisher = B.Package.Metadata["publishers"].join(", ");
	B.Language  = B.Package.Metadata["languages"][0].split("-")[0];
	if(/^(zho?|chi|kor?|ja|jpn)$/.test(B.Language)) {
		B.WritingMode = (B.Package.Spine["page-progression-direction"] == "rtl") ? "tb-rl" : "lr-tb";
	} else if(/^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language)) {
		B.WritingMode = "rl-tb";
	} else if(/^(mo?n)$/.test(B.Language)) {
		B.WritingMode = "tb-lr";
	} else {
		B.WritingMode = "lr-tb";
	}

	var IDFragments = [];
	if(B.Title)     { IDFragments.push(B.Title);     O.log(3, "title: "     + B.Title);     }
	if(B.Creator)   { IDFragments.push(B.Creator);   O.log(3, "creator: "   + B.Creator);   }
	if(B.Publisher) { IDFragments.push(B.Publisher); O.log(3, "publisher: " + B.Publisher); }
	if(IDFragments.length) {
		O.Title.innerHTML = "";
		O.Title.appendChild(document.createTextNode("BiB/i | " + IDFragments.join(" - ").replace(/&amp;?/gi, "&").replace(/&lt;?/gi, "<").replace(/&gt;?/gi, ">")));
	}

	S.update();

	E.dispatch("bibi:readPackageDocument");

	O.log(2, 'Package Document Read.', "Show");

	L.prepareSpine();

};


L.prepareSpine = function() {

	O.log(2, 'Preparing Spine...', "Show");

	// For Paring of Pre-Pagenated
	if(S.PPD == "rtl") var PairBefore = "right", PairAfter = "left";
	else               var PairBefore = "left",  PairAfter = "right";

	// Spreads, Boxes, and Items
	sML.each(B.Package.Spine["itemrefs"], function(i) {
		var ItemRef = this;
		// Item: A
		var Item = sML.create("iframe", {
			className: "item",
			id: "item-" + sML.String.padZero(i, B.FileDigit),
			scrolling: "no",
			allowtransparency: "true"
		});
		Item.ItemRef = ItemRef;
		Item.Path = O.getPath(B.Package.Dir, B.Package.Manifest["items"][ItemRef["idref"]].href);
		Item.Dir = Item.Path.replace(/\/?[^\/]+$/, "");
		Item.IsPrePaginated = (ItemRef["rendition:layout"] == "pre-paginated");
		// SpreadBox & Spread
		if(ItemRef["rendition:layout"] == "pre-paginated" && i) {
			var PrevItem = R.Items[i - 1];
			if(PrevItem.ItemRef["rendition:layout"] == "pre-paginated" && PrevItem.ItemRef["page-spread"] == PairBefore && ItemRef["page-spread"] == PairAfter) {
				Item.Pair = PrevItem;
				PrevItem.Pair = Item;
			}
		}
		if(Item.Pair) {
			var Spread = Item.Pair.Spread;
		} else {
			var SpreadBox = R.Content.Main.appendChild(sML.create("div", { className: "spread-box" }));
			var Spread = SpreadBox.appendChild(sML.create("div", { className: "spread" }));
			if(ItemRef["rendition:layout"] == "pre-paginated") sML.addClass(SpreadBox, "pre-paginated");
			Spread.SpreadBox = SpreadBox;
			Spread.Items = [];
			Spread.Pages = [];
			Spread.SpreadIndex = R.Spreads.length;
			R.Spreads.push(Spread);
			/*
			sML.addTouchEventObserver(Spread).addTouchEventListener("tap", function(Eve, HEve) {
				R.observeTap(Spread, HEve);
			});
			*/
		}
		// ItemBox
		var ItemBox = Spread.appendChild(sML.create("div", { className: "item-box" }));
		if(ItemRef["page-spread"]) sML.addClass(ItemBox, "page-spread-" + ItemRef["page-spread"]);
		// Item: B
		Item.Spread = Spread;
		Item.ItemBox = ItemBox;
		Item.Pages = [];
		Item.ItemIndexInSpread = Spread.Items.length; Spread.Items.push(Item);
		Item.ItemIndex         =      R.Items.length;      R.Items.push(Item);
	});

	O.log(3, sML.String.padZero(R.Items.length, B.FileDigit) + ' Items');

	E.dispatch("bibi:prepareSpine");

	O.log(2, 'Spine Prepared.', "Show");

	L.createCover();

};


L.createCover = function() {

	O.log(2, 'Creating Cover...', "Show");

	if(B.Package.Manifest["cover-image"].Path) {
		R.CoverImage.Path = B.Package.Manifest["cover-image"].Path;
	}

	C.Veil.Cover.Info = C.Veil.Cover.appendChild(
		sML.create("p", { id: "bibi-veil-cover-info",
			innerHTML: (function() {
				var BookID = [];
				if(B.Title)     BookID.push('<strong>' + B.Title + '</strong>');
				if(B.Creator)   BookID.push('<em>' + B.Creator + '</em>');
				if(B.Publisher) BookID.push('<span>' + B.Publisher + '</span>');
				return BookID.join(" ");
			})()
		})
	);

	if(R.CoverImage.Path) {
		O.log(3, B.Path + B.PathDelimiter + R.CoverImage.Path);
		C.Veil.Cover.className = [C.Veil.Cover.className, "with-cover-image"].join(" ");
		sML.create("img", {
			onload: function() {
				sML.style(C.Veil.Cover, {
					backgroundImage: "url(" + this.src + ")",
					opacity: 1
				});
				E.dispatch("bibi:createCover", R.CoverImage.Path);
				O.log(2, 'Cover Created.', "Show");
				L.createNavigation();
			}
		}).src = (function() {
			if(!B.Zipped) return B.Path + "/" + R.CoverImage.Path;
			else          return B.getDataURI(R.CoverImage.Path);
		})();
	} else {
		O.log(3, 'No Cover Image.');
		C.Veil.Cover.className = [C.Veil.Cover.className, "without-cover-image"].join(" ");
		E.dispatch("bibi:createCover", "");
		O.log(2, 'Cover Created.', "Show");
		L.createNavigation();
	}

};


L.createNavigation = function(Doc) {

	if(!Doc) {
		O.log(2, 'Creating Navigation...', "Show");
		if(B.Package.Manifest["nav"].Path) {
			C.Cartain.Navigation.Item.Path = B.Package.Manifest["nav"].Path;
			C.Cartain.Navigation.Item.Type = "NavigationDocument";
		} else {
			O.log(2, 'No Navigation Document.');
			if(B.Package.Manifest["toc-ncx"].Path) {
				C.Cartain.Navigation.Item.Path = B.Package.Manifest["toc-ncx"].Path;
				C.Cartain.Navigation.Item.Type = "TOC-NCX";
			} else {
				O.log(2, 'No TOC-NCX.');
				E.dispatch("bibi:createNavigation", "");
				O.log(2, 'Navigation Made Nothing.', "Show");
				return L.loadSpreads();
			}
		}
		O.log(3, B.Path + B.PathDelimiter + C.Cartain.Navigation.Item.Path);
		return O.openDocument(C.Cartain.Navigation.Item.Path, { then: L.createNavigation });
	}

	C.Cartain.Navigation.Item.innerHTML = "";
	var NavContent = document.createDocumentFragment();
	if(C.Cartain.Navigation.Item.Type == "NavigationDocument") {
		sML.each(Doc.querySelectorAll("nav"), function() {
			switch(this.getAttribute("epub:type")) {
				case "toc":       sML.addClass(this, "bibi-nav-toc"); break;
				case "landmarks": sML.addClass(this, "bibi-nav-landmarks"); break;
				case "page-list": sML.addClass(this, "bibi-nav-page-list"); break;
			}
			sML.each(this.querySelectorAll("*"), function() { this.removeAttribute("style"); });
			NavContent.appendChild(this);
		});
	} else {
		var TempTOCNCX = Doc.getElementsByTagName("navMap")[0];
		sML.each(TempTOCNCX.getElementsByTagName("navPoint"), function() {
			sML.insertBefore(
				sML.create("a", { href: this.getElementsByTagName("content")[0].getAttribute("src"), innerHTML: this.getElementsByTagName("text")[0].innerHTML }),
				this.getElementsByTagName("navLabel")[0]
			);
			sML.removeElement(this.getElementsByTagName("navLabel")[0]);
			sML.removeElement(this.getElementsByTagName("content")[0]);
			var LI = sML.create("li");
			LI.setAttribute("id", this.getAttribute("id"));
			LI.setAttribute("playorder", this.getAttribute("playorder"));
			sML.insertBefore(LI, this).appendChild(this);
			if(!LI.previousSibling || !LI.previousSibling.tagName || /^a$/i.test(LI.previousSibling.tagName)) {
				sML.insertBefore(sML.create("ul"), LI).appendChild(LI);
			} else {
				LI.previousSibling.appendChild(LI);
			}
		});
		NavContent.appendChild(document.createElement("nav")).innerHTML = TempTOCNCX.innerHTML.replace(/<(bibi_)?navPoint( [^>]+)?>/ig, "").replace(/<\/(bibi_)?navPoint>/ig, "");
	}
	C.Cartain.Navigation.Item.appendChild(NavContent);
	C.Cartain.Navigation.Item.Body = C.Cartain.Navigation.Item;
	delete NavContent;

	delete Doc;

	L.postprocessItem.coordinateLinkages(C.Cartain.Navigation.Item, "InNav");
	R.resetNavigation();

	E.dispatch("bibi:createNavigation", C.Cartain.Navigation.Item.Path);

	O.log(2, 'Navigation Created.', "Show");

	if(S["autostart"] || B.Local || B.Zipped) {
		L.loadSpreads();
	} else {
		O.stopLoading();
		E.dispatch("bibi:wait");
		C.Veil.Message.note('');
	}

};


L.play = function() {
	O.startLoading();
	if(B["name"]) L.loadSpreads();
	else          B.load({ Name: U["book"] });
	E.dispatch("bibi:play");
};


L.loadSpreads = function() {

	O.log(2, 'Loading ' + R.Items.length + ' Items in ' + R.Spreads.length + ' Spreads...', "Show");

	O.Body.style.backgroundImage = "none";
	sML.removeClass(O.HTML, "with-poster");

	R.resetStage();

	R.LoadedItems = 0;
	R.LoadedSpreads = 0;

	R.ToRelayout = false;
	L.listenResizingWhileLoading = function() { R.ToRelayout = true; };
	window.addEventListener("resize", L.listenResizingWhileLoading);

	E.remove("bibi:postprocessItem", L.onloadItem);
	E.add(   "bibi:postprocessItem", L.onloadItem);

	R.Spreads.forEach(function(Spread) {
		Spread.Loaded = false;
		Spread.LoadedItems = 0;
		Spread.Items.forEach(function(Item) {
			Item.Loaded = false;
			O.log(3, "Item: " + sML.String.padZero(Item.ItemIndex + 1, B.FileDigit) + '/' + sML.String.padZero(B.Package.Spine["itemrefs"].length, B.FileDigit) + ' - ' + (Item.Path ? B.Path + B.PathDelimiter + Item.Path : '... Not Found.'));
			L.loadItem(Item);
		});
	});

};


L.onloadItem = function(Item) {
	Item.Loaded = true;
	R.LoadedItems++;
	E.dispatch("bibi:loadItem", Item);
	var Spread = Item.Spread;
	Spread.LoadedItems++;
	if(Spread.LoadedItems == Spread.Items.length) {
		R.LoadedSpreads++;
		E.dispatch("bibi:loadSpread", Spread);
		if(!R.ToRelayout) R.resetSpread(Spread);
		if(R.LoadedSpreads == R.Spreads.length) {
			delete B.Files;
			document.body.style.display = "";
			R.resetPages();
			E.dispatch("bibi:loadSpreads");
			O.log(2, 'Spreads Loaded.', "Show");
			L.start();
			E.remove("bibi:postprocessItem", L.onloadItem);
		}
	}
	O.updateStatus("Loading... (" + (R.LoadedItems) + "/" + R.Items.length + " Items Loaded.)");
};


L.loadItem = function(Item) { 
	var Path = Item.Path;
	if(/\.(x?html?)$/i.test(Path)) {
		// If HTML or Others
		if(B.Zipped) {
			L.writeItemHTML(Item, B.Files[Path]);
			setTimeout(L.postprocessItem, 10, Item);
		} else {
			Item.src = B.Path + "/" + Path;
			Item.onload = function() { setTimeout(L.postprocessItem, 10, Item); };
			Item.ItemBox.appendChild(Item);
		}
	} else if(/\.(svg)$/i.test(Path)) {
		// If SVG-in-Spine
		Item.IsSVG = true;
		if(B.Zipped) {
			L.writeItemHTML(Item, false, '', B.Files[Path].replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
		} else {
			var URI = B.Path + "/" + Path;
			O.download(URI).then(function(XHR) {
				L.writeItemHTML(Item, false, '<base href="' + URI + '" />', XHR.responseText.replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
			});
		}
	} else if(/\.(gif|jpe?g|png)$/i.test(Path)) {
		// If Bitmap-in-Spine
		Item.IsBitmap = true;
		L.writeItemHTML(Item, false, '', '<img alt="" src="' + (B.Zipped ? B.getDataURI(Path) : B.Path + "/" + Path) + '" />');
	} else if(/\.(pdf)$/i.test(Path)) {
		// If PDF-in-Spine
		Item.IsPDF = true;
		L.writeItemHTML(Item, false, '', '<iframe     src="' + (B.Zipped ? B.getDataURI(Path) : B.Path + "/" + Path) + '" />');
	}
};


L.writeItemHTML = function(Item, HTML, Head, Body) {
	Item.ItemBox.appendChild(Item);
	Item.contentDocument.open();
	Item.contentDocument.write(HTML ? HTML : [
		'<html>',
			'<head>' + Head + '</head>',
			'<body onload="parent.L.postprocessItem(parent.R.Items[' + Item.ItemIndex + ']); document.body.removeAttribute(\'onload\'); return false;">' + Body + '</body>',
		'</html>'
	].join(""));
	Item.contentDocument.close();
};


L.postprocessItem = function(Item) {

	Item.HTML = sML.edit(Item.contentDocument.getElementsByTagName("html")[0], { Item: Item });
	Item.Head = sML.edit(Item.contentDocument.getElementsByTagName("head")[0], { Item: Item });
	Item.Body = sML.edit(Item.contentDocument.getElementsByTagName("body")[0], { Item: Item });

	sML.each(Item.Body.querySelectorAll("link"), function() { Item.Head.appendChild(this); });

	if(S["epub-additional-stylesheet"]) Item.Head.appendChild(sML.create("link",   { rel: "stylesheet", href: S["epub-additional-stylesheet"] }));
	if(S["epub-additional-script"])     Item.Head.appendChild(sML.create("script", { src: S["epub-additional-script"] }));

	Item.StyleSheets = [];
	sML.CSS.add({ "html" : "-webkit-text-size-adjust: 100%;" }, Item.contentDocument);
	sML.each(Item.HTML.querySelectorAll("link, style"), function() {
		if(/^link$/i.test(this.tagName)) {
			if(!/^(alternate )?stylesheet$/.test(this.rel)) return;
			if((sML.UA.Safari || sML.OS.iOS) && this.rel == "alternate stylesheet") return; //// Safari does not count "alternate stylesheet" in document.styleSheets.
		}
		Item.StyleSheets.push(this);
	});

	var ItemBodyChildren = Item.contentDocument.querySelectorAll("body>*");
	if(ItemBodyChildren.length == 1) {
			 if(/^svg$/i.test(Item.Body.firstElementChild.tagName)) Item.SingleSVG = true;
		else if(/^img$/i.test(Item.Body.firstElementChild.tagName)) Item.SingleIMG = true;
	}

	L.postprocessItem.processImages(Item);
	L.postprocessItem.defineViewport(Item);
	L.postprocessItem.coordinateLinkages(Item);

	setTimeout(function() {
		if(Item.contentDocument.styleSheets.length < Item.StyleSheets.length) return setTimeout(arguments.callee, 100);
		L.postprocessItem.patchWritingModeStyle(Item);
		L.postprocessItem.applyBackgroundStyle(Item);
		E.dispatch("bibi:postprocessItem", Item);
	}, 100);

	// Tap Scroller
	// sML.addTouchEventObserver(Item.HTML).addTouchEventListener("tap", function(Eve, HEve) { R.observeTap(Item, HEve); });

};


L.postprocessItem.processImages = function(Item) {
	sML.each(Item.Body.getElementsByTagName("img"), function() {
		this.Bibi = {
			DefaultStyle: {
				"margin":            (this.style.margin          ? this.style.margin          : ""),
				"width":             (this.style.width           ? this.style.width           : ""),
				"height":            (this.style.height          ? this.style.height          : ""),
				"vertical-align":    (this.style.verticalAlign   ? this.style.verticalAlign   : ""),
				"page-break-before": (this.style.pageBreakBefore ? this.style.pageBreakBefore : ""),
				"page-break-after":  (this.style.pageBreakAfter  ? this.style.pageBreakAfter  : "")
			}
		}
	});
	if(sML.UA.InternetExplorer) {
		sML.each(Item.Body.getElementsByTagName("svg"), function() {
			var ChildImages = this.getElementsByTagName("image");
			if(ChildImages.length == 1) {
				var ChildImage = ChildImages[0];
				if(ChildImage.getAttribute("width") && ChildImage.getAttribute("height")) {
					this.setAttribute("width",  ChildImage.getAttribute("width"));
					this.setAttribute("height", ChildImage.getAttribute("height"));
				}
			}
		});
	}
};


L.postprocessItem.defineViewport = function(Item) {
	var ItemRef = Item.ItemRef;
	sML.each(Item.Head.getElementsByTagName("meta"), function() { // META Viewport
		if(this.name == "viewport") {
			ItemRef["viewport"].content = this.getAttribute("content");
			if(ItemRef["viewport"].content) {
				var ViewportWidth  = ItemRef["viewport"].content.replace( /^.*?width=([^\, ]+).*$/, "$1") * 1;
				var ViewportHeight = ItemRef["viewport"].content.replace(/^.*?height=([^\, ]+).*$/, "$1") * 1;
				if(!isNaN(ViewportWidth) && !isNaN(ViewportHeight)) {
					ItemRef["viewport"].width  = ViewportWidth;
					ItemRef["viewport"].height = ViewportHeight;
				}
			}
		}
	});
	if(ItemRef["rendition:layout"] == "pre-paginated" && !(ItemRef["viewport"].width * ItemRef["viewport"].height)) { // If Fixed-Layout Item without Viewport
		var ItemImage = Item.Body.firstElementChild;
		if(Item.SingleSVG) { // If Single-SVG-HTML or SVG-in-Spine, Use ViewBox for Viewport.
			if(ItemImage.getAttribute("viewBox")) {
				ItemRef["viewBox"].content = ItemImage.getAttribute("viewBox");
				var ViewBoxCoords  = ItemRef["viewBox"].content.split(" ");
				if(ViewBoxCoords.length == 4) {
					var ViewBoxWidth  = ViewBoxCoords[2] * 1 - ViewBoxCoords[0] * 1;
					var ViewBoxHeight = ViewBoxCoords[3] * 1 - ViewBoxCoords[1] * 1;
					if(ViewBoxWidth && ViewBoxHeight) {
						if(ItemImage.getAttribute("width")  != "100%") ItemImage.setAttribute("width",  "100%");
						if(ItemImage.getAttribute("height") != "100%") ItemImage.setAttribute("height", "100%");
						ItemRef["viewport"].width  = ItemRef["viewBox"].width  = ViewBoxWidth;
						ItemRef["viewport"].height = ItemRef["viewBox"].height = ViewBoxHeight;
					}
				}
			}
		} else if(Item.SingleIMG) { // If Single-IMG-HTML or Bitmap-in-Spine, Use IMG "width" / "height" for Viewport.
			ItemRef["viewport"].width  = parseInt(getComputedStyle(ItemImage).width);
			ItemRef["viewport"].height = parseInt(getComputedStyle(ItemImage).height);
		}
	}
};


L.postprocessItem.coordinateLinkages = function(Item, InNav) {
	var Path = Item.Path;
	var RootElement = Item.Body;
	sML.each(RootElement.getElementsByTagName("a"), function(i) {
		var A = this;
		A.NavAIndex = i;
		var HrefPathInSource = A.getAttribute("href");
		if(!HrefPathInSource) {
			if(InNav) {
				A.addEventListener("click", function(Eve) { Eve.preventDefault(); Eve.stopPropagation(); return false; });
				sML.addClass(A, "bibi-navigation-inactive-link");
			}
			return;
		}
		if(/^[a-zA-Z]+:/.test(HrefPathInSource)) return A.setAttribute("target", "_blank");
		var HrefPath = O.getPath(Path.replace(/\/?([^\/]+)$/, ""), (!/^\.*\/+/.test(HrefPathInSource) ? "./" : "") + (/^#/.test(HrefPathInSource) ? Path.replace(/^.+?([^\/]+)$/, "$1") : "") + HrefPathInSource);
		var HrefFnH = HrefPath.split("#");
		var HrefFile = HrefFnH[0] ? HrefFnH[0] : Path;
		var HrefHash = HrefFnH[1] ? HrefFnH[1] : "";
		var Jump = function(Eve) {
			Eve.preventDefault(); 
			Eve.stopPropagation();
			if(this.Target) {
				var This = this;
				var Go = R.Started ? function() {
					R.focus(This.Target);
				} : function() {
					if(O.SmartPhone) {
						var URI = location.href;
						if(typeof This.NavAIndex == "number") URI += (/#/.test(URI) ? "," : "#") + 'pipi(nav:' + This.NavAIndex + ')';
						return window.open(URI);
					}
					S["to"] = This.Target;
					L.play();
				};
				This.InNav ? C.Cartain.toggle(Go) : Go();
			}
			return false;
		};
		R.Items.forEach(function(rItem) {
			if(HrefFile == rItem.Path) {
				A.setAttribute("data-bibi-original-href", HrefPathInSource);
				A.setAttribute("href", "bibi://" + B.Path.replace(/^\w+:\/\//, "") + "/" + HrefPathInSource);
				A.InNav = InNav;
				A.Target = { Item: rItem, Element: (HrefHash ? "#" + HrefHash : null) };
				A.addEventListener("click", Jump);
				return;
			}
		});
		if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
			A.setAttribute("data-bibi-original-href", HrefPathInSource);
			A.setAttribute("href", "bibi://" + B.Path.replace(/^\w+:\/\//, "") + "/#" + HrefHash);
			A.InNav = InNav;
			A.Target = U.getEPUBCFITarget(HrefHash);
			A.addEventListener("click", Jump);
		}
		if(InNav && typeof S["nav"] == "number" && i == S["nav"] && A.Target) S["to"] = A.Target;
	});
};


L.postprocessItem.patchWritingModeStyle = function(Item) {
	if(sML.UA.Gecko || sML.UA.InternetExplorer < 12) {
		Item.AdditionalStyles = [];
		var translateWritingMode = sML.UA.Gecko ? function(CSSRule) {
			/**/ if(/ (-(webkit|epub)-)?writing-mode: vertical-rl; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "vertical-rl";
			else if(/ (-(webkit|epub)-)?writing-mode: vertical-lr; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "vertical-lr";
			else if(/ (-(webkit|epub)-)?writing-mode: horizontal-tb; /.test(CSSRule.cssText)) CSSRule.style.writingMode = "horizontal-tb";
		} : function(CSSRule) {
			/**/ if(/ (-(webkit|epub)-)?writing-mode: vertical-rl; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "bt-rl" : "tb-rl";
			else if(/ (-(webkit|epub)-)?writing-mode: vertical-lr; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "bt-lr" : "tb-lr";
			else if(/ (-(webkit|epub)-)?writing-mode: horizontal-tb; /.test(CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "rl-tb" : "lr-tb";
		};
		sML.each(Item.contentDocument.styleSheets, function () {
			var StyleSheet = this;
			for(var L = StyleSheet.cssRules.length, i = 0; i < L; i++) {
				var CSSRule = this.cssRules[i];
				/**/ if(CSSRule.cssRules)   arguments.callee.call(CSSRule);
				else if(CSSRule.styleSheet) arguments.callee.call(CSSRule.styleSheet);
				else                        translateWritingMode(CSSRule);
			}
		});
	}
	(function() {
		var HTMLCS = getComputedStyle(Item.HTML);
		var Property = (function() {
			if(/^(vertical|horizontal)-/.test(HTMLCS["-webkit-writing-mode"])) return "-webkit-writing-mode";
			if(/^(vertical|horizontal)-/.test(HTMLCS["writing-mode"]) || sML.UA.InternetExplorer >= 11) return "writing-mode";
			else return undefined;
		})();
		sML.style(Item.HTML, {
			"writing-mode": getComputedStyle(Item.Body)[Property]
		});
		Item.HTML.WritingMode = (function() {
				 if(!Property)                                return (HTMLCS["direction"] == "rtl" ? "rl-tb" : "lr-tb");
			else if(     /^vertical-/.test(HTMLCS[Property])) return (HTMLCS["direction"] == "rtl" ? "bt" : "tb") + "-" + (/-lr$/.test(HTMLCS[Property]) ? "lr" : "rl");
			else if(   /^horizontal-/.test(HTMLCS[Property])) return (HTMLCS["direction"] == "rtl" ? "rl" : "lr") + "-" + (/-bt$/.test(HTMLCS[Property]) ? "bt" : "tb");
			else if(/^(lr|rl|tb|bt)-/.test(HTMLCS[Property])) return  HTMLCS[Property];
		})();
	})();
	Item.Body.style["margin" + (function() {
		if(/-rl$/.test(Item.HTML.WritingMode)) return "Left";
		if(/-lr$/.test(Item.HTML.WritingMode)) return "Right";
		return "Bottom";
	})()] = 0;
};


L.postprocessItem.applyBackgroundStyle = function(Item) {
	if(Item.HTML.style) { Item.ItemBox.style.background = Item.contentDocument.defaultView.getComputedStyle(Item.HTML).background; Item.HTML.style.background = ""; }
	if(Item.Body.style) { Item.style.background         = Item.contentDocument.defaultView.getComputedStyle(Item.Body).background; Item.Body.style.background = ""; }
};


L.start = function() {

	O.stopLoading();

	R.layout({
		Target: (S["to"] ? S["to"] : "head")
	});
	window.removeEventListener("resize", L.listenResizingWhileLoading);
	delete L.listenResizingWhileLoading;

	sML.style(R.Content.Main, {
		transition: "opacity 0.5s ease-in-out",
		opacity: 1
	});

	setTimeout(function() {
		C.Veil.close(function() {
			sML.removeClass(O.HTML, "preparing");
			setTimeout(function() {
				document.body.click(); // Making iOS browsers to responce for user scrolling immediately after loading.
			}, 500);
		});
		window.addEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
		window.addEventListener("scroll", R.onscroll);
		E.add("bibi:command:move", function(Distance) { R.move(Distance); });
		R.Started = true;
		E.dispatch("bibi:start");
		M.post("bibi:start");
		O.log(1, 'Enjoy!');
	}, 1);

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Reader

//----------------------------------------------------------------------------------------------------------------------------------------------


R.initialize = function() {

	R.Content.Main.style.opacity = 0;
	R.Content.Main.innerHTML = R.Content.Complementary.innerHTML = "";

	R.Spreads = [], R.Items = [], R.Pages = [];

	R.CoverImage = { Path: "" };

};


R.resetStage = function() {
	//if(sML.OS.iOS && sML.UA.Sa) O.Body.style.height = S.SLA == "vertical" ? "100%" : window.innerHeight + "px";
	R.StageSize = {};
	R.StageSize.Width   = O.HTML.clientWidth;
	R.StageSize.Height  = O.HTML.clientHeight;// - 35 * 2;
	R.StageSize.Breadth = R.StageSize[S.SIZE.B] - S["spread-margin-start"] - S["spread-margin-end"];
	R.StageSize.Length  = R.StageSize[S.SIZE.L] - S["spread-gap"] * 2;
	//R.Content.Main.style["padding" + S.BASE.B] = R.Content.Main.style["padding" + S.BASE.A] = S["spread-gap"] + "px";
	R.Content.Main.style.padding = R.Content.Main.style.width = R.Content.Main.style.height = "";
	R.Content.Main.style["padding" + S.BASE.S] = R.Content.Main.style["padding" + S.BASE.E] = S["spread-margin-start"]/* + 35*/ + "px";
	R.Content.Main.style["background"] = S["book-background"];
	R.Columned = false;
	/*
	if(!R.Bar) R.Bar = document.body.appendChild(
		sML.create("div", {}, {
			position: "fixed",
			zIndex: 1000,
			left: 0,
			top: 0,
			width: "100%",
			height: "35px",
			background: "rgb(248,248,248)",
			background: "rgb(64,64,64)"
		})
	);
	*/
};

R.getItemInnerText = function(Item) {
	var InnerText = "InnerText";
	/**/ if(typeof Item.Body.innerText   != "undefined") InnerText = Item.Body.innerText;
	else if(typeof Item.Body.textContent != "undefined") InnerText = Item.Body.textContent;
	return InnerText.replace(/[\r\n\s\t ]/g, "");
};

R.resetItem = function(Item) {
	Item.Reset = false;
	Item.Reflowable = (Item.ItemRef["rendition:layout"] != "pre-paginated" || !Item.ItemRef["viewport"][S.SIZE.b] || !Item.ItemRef["viewport"][S.SIZE.l]);
	Item.Reflowable ? R.resetItem.asReflowableItem(Item) : R.resetItem.asPrePagenatedItem(Item);
	Item.Reset = true;
};

R.resetItem.asReflowableItem = function(Item) {
	var ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
	Item.Pages = [];
	Item.scrolling = "no";
	var ItemInnerText = R.getItemInnerText(Item);
	Item.IsSingleImageItem = (!ItemInnerText && Item.Body.querySelectorAll("img, svg").length - Item.Body.querySelectorAll("svg img").length == 1); // textContent... mmm...
	var StageB = R.StageSize.Breadth - (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e]);
	var StageL = R.StageSize.Length  - (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]);
	var PageB  = StageB;
	var PageL  = StageL;
	var PageGap = S["item-padding-" + S.BASE.a] + S["spread-gap"] + S["item-padding-" + S.BASE.b];
	var Ratio = 0.96 / 1.414; if(S.AXIS.L == "Y") Ratio = 1 / Ratio;
	PageL = Math.min(StageL, Math.floor(PageB * Ratio));
	if(!Item.IsSingleImageItem) {
		var Half = Math.floor((StageL - PageGap) / 2);
		PageL = (PageL < Half) ? Half : StageL;
	}
	ItemBox.style[S.SIZE.b] = PageB + ( S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e] ) + "px";
	Item.style["padding-" + S.BASE.b] = S["item-padding-" + S.BASE.b] + "px";
	Item.style["padding-" + S.BASE.a] = S["item-padding-" + S.BASE.a] + "px";
	Item.style["padding-" + S.BASE.s] = S["item-padding-" + S.BASE.s] + "px";
	Item.style["padding-" + S.BASE.e] = S["item-padding-" + S.BASE.e] + "px";
	Item.style[S.SIZE.b] = PageB + "px";
	Item.style[S.SIZE.l] = PageL + "px";
	Item.HTML.style[S.SIZE.b] = "";
	Item.HTML.style[S.SIZE.l] = "";
	sML.style(Item.HTML, { "column-width": "", "column-gap": "", "column-rule": "" });
	Item.Columned = false, Item.ColumnBreadth = 0, Item.ColumnLength = 0, Item.ColumnGap = 0;
	var WordWrappingStyleSheetIndex = sML.CSS.addRule("*", "word-wrap: break-word;", Item.contentDocument);
	if(!ItemInnerText && Item.Body.getElementsByTagName("iframe").length == 1) { // textContent... mmm...
		var IFrame = Item.Body.getElementsByTagName("iframe")[0];
		IFrame.style[S.SIZE.b] = IFrame.style[S.SIZE.l] = "100%";
	}
	if(Item.IsSingleImageItem) {
		// Fitting Images
		if(S["fit-images"]) {
			sML.style(Item.HTML, { "transform-origin": "", "transformOrigin": "", "transform": "" });
			if(Item.Body["scroll" + S.SIZE.B] > PageB || Item.Body["scroll" + S.SIZE.L] > PageL) {
				var Scale = Math.floor(Math.min(PageB / Item.Body["scroll" + S.SIZE.B], PageL / Item.Body["scroll" + S.SIZE.L]) * 100) / 100;
				var TransformOrigin = { "lr-tb": "0 0", "rl-tb": "100% 0", "tb-rl": "100% 0", "bt-rl": "100% 100%", "tb-lr": "0 0", "bt-lr": "0 100%" }[Item.HTML.WritingMode];
				sML.style(Item.HTML, {
					"transform-origin": TransformOrigin,
					"transform": "scale(" + Scale + ")"
				});
			}
		}
	} else {
		// Fitting Images
		if(S["fit-images"] && S["fit-images"] != "in-single-image-only-item") {
			sML.each(Item.Body.getElementsByTagName("img"), function() {
				this.style.display       = this.Bibi.DefaultStyle["display"];
				this.style.verticalAlign = this.Bibi.DefaultStyle["vertical-align"];
				this.style.width         = this.Bibi.DefaultStyle["width"];
				this.style.height        = this.Bibi.DefaultStyle["height"];
				var MaxB = Math.floor(Math.min(parseInt(getComputedStyle(Item.Body)[S.SIZE.b]), PageB));
				var MaxL = Math.floor(Math.min(parseInt(getComputedStyle(Item.Body)[S.SIZE.l]), PageL));
				if(parseInt(getComputedStyle(this)[S.SIZE.b]) >= MaxB || parseInt(getComputedStyle(this)[S.SIZE.l]) >= MaxL) {
					if(getComputedStyle(this).display == "inline") this.style.display = "inline-block";
					this.style.verticalAlign = "top";
					if(parseInt(getComputedStyle(this)[S.SIZE.b]) >= MaxB) {
						this.style[S.SIZE.b] = MaxB + "px";
						this.style[S.SIZE.l] = "auto";
					}
					if(parseInt(getComputedStyle(this)[S.SIZE.l]) >= MaxL) {
						this.style[S.SIZE.l] = MaxL + "px";
						this.style[S.SIZE.b] = "auto";
					}
				}
			});
		}
		// Making Columns
		if(S.RVM == "paged" || Item.Body["scroll"+ S.SIZE.B] > PageB) {
			R.Columned = Item.Columned = true, Item.ColumnBreadth = PageB, Item.ColumnLength = PageL, Item.ColumnGap = PageGap;
			Item.HTML.style[S.SIZE.b] = PageB + "px";
			Item.HTML.style[S.SIZE.l] = PageL + "px";
			sML.style(Item.HTML, {
				"column-width": Item.ColumnLength + "px",
				"column-gap": Item.ColumnGap + "px",
				"column-rule": ""
			});
		}
		// Breaking Pages
		if(S["page-breaking"]) {
			var PBR; // PageBreakerRulers
			if(Item.Body["offset" + S.SIZE.B] <= PageB) PBR = [(S.SLA == "vertical" ? "Top" : "Left"), window["inner" + S.SIZE.L]/*PageL*/, S.SIZE.L, S.SIZE.l, S.BASE.a];
			else                                        PBR = [(S.SLA == "vertical" ? "Left" : "Top"), /*window["inner" + S.SIZE.B]*/PageB, S.SIZE.B, S.SIZE.b, S.BASE.e];
			sML.each(Item.contentDocument.querySelectorAll("html>body *"), function() {
				var ComputedStyle = getComputedStyle(this);
				if(ComputedStyle.pageBreakBefore != "always" && ComputedStyle.pageBreakAfter != "always") return;
				if(this.BibiPageBreakerBefore) this.BibiPageBreakerBefore.style[PBR[3]] = "";
				if(this.BibiPageBreakerAfter)  this.BibiPageBreakerAfter.style[PBR[3]] = "";
				var El = this,                               BreakPoint  = El["offset" + PBR[0]], Add = 0;
				while(El.offsetParent) El = El.offsetParent, BreakPoint += El["offset" + PBR[0]];
				if(S.SLD == "rtl") BreakPoint = window["innerWidth"] + BreakPoint * -1 - this["offset" + PBR[2]];
				//sML.log(PBR);
				//sML.log(Item.ItemIndex + ": " + BreakPoint);
				if(ComputedStyle.pageBreakBefore == "always") {
					if(!this.BibiPageBreakerBefore) this.BibiPageBreakerBefore = sML.insertBefore(sML.create("span", { className: "bibi-page-breaker-before" }, { display: "block" }), this);
					Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
					this.BibiPageBreakerBefore.style[PBR[3]] = Add + "px";
				}
				if(ComputedStyle.pageBreakAfter == "always") {
					BreakPoint += Add + this["offset" + PBR[2]];
					//sML.log(Item.ItemIndex + ": " + BreakPoint);
					this.style["margin-" + PBR[4]] = 0;
					if(!this.BibiPageBreakerAfter) this.BibiPageBreakerAfter = sML.insertAfter(sML.create("span", { className: "bibi-page-breaker-after" }, { display: "block" }), this);
					Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
					this.BibiPageBreakerAfter.style[PBR[3]] = Add + "px";
				}
			});
		}
	}
	sML.CSS.removeRule(WordWrappingStyleSheetIndex, Item.contentDocument);
	/**/ if(Item.IsSingleImageItem)        var ItemL = PageL;
	else if(sML.UA.InternetExplorer >= 10) var ItemL = Item.Body["client" + S.SIZE.L];
	else                                   var ItemL = Item.HTML["scroll" + S.SIZE.L];
	var Pages = Math.ceil((ItemL + PageGap) / (PageL + PageGap));
	ItemL = (PageL + PageGap) * Pages - PageGap;
	ItemBox.style[S.SIZE.l] = ItemL + (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]) + "px";
	Item.style[S.SIZE.l] = ItemL + "px";
	for(var i = 0; i < Pages; i++) {
		var Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
		Page.style["padding" + S.BASE.B] = S["item-padding-" + S.BASE.b] + "px";//S["spread-gap"] / 2 + "px";
		Page.style["padding" + S.BASE.A] = S["item-padding-" + S.BASE.a] + "px";//S["spread-gap"] / 2 + "px";
		Page.style["padding" + S.BASE.S] = S["item-padding-" + S.BASE.s] + "px";
		Page.style["padding" + S.BASE.E] = S["item-padding-" + S.BASE.e] + "px";
		Page.style[            S.SIZE.b] = PageB + "px";
		Page.style[            S.SIZE.l] = PageL + "px";
		Page.style[            S.BASE.b] = (PageL + PageGap) * i/* - S["spread-gap"]*/ + "px";
		Page.Item = Item, Page.Spread = Spread;
		Page.PageIndexInItem = Item.Pages.length;
		Item.Pages.push(Page);
	}
	return Item;
};

R.resetItem.asPrePagenatedItem = function(Item) {
	var ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
	Item.Pages = [];
	Item.HTML.style.margin = Item.HTML.style.padding = Item.Body.style.margin = Item.Body.style.padding = 0;
	var PageB = R.StageSize.Breadth;
	var PageL = R.StageSize.Length;
	Item.style["padding"] = 0;
	if(Item.Scale) {
		var Scale = Item.Scale;
		delete Item.Scale;
	} else {
		var SpreadViewPort = { width: ItemRef["viewport"].width, height: ItemRef["viewport"].height };
		if(Item.Pair) SpreadViewPort.width += Item.Pair.ItemRef["viewport"].width;
		else if(ItemRef["page-spread"] == "right" || ItemRef["page-spread"] == "left") SpreadViewPort.width += SpreadViewPort.width;
		var Scale = Math.min(
			PageB / SpreadViewPort[S.SIZE.b],
			PageL / SpreadViewPort[S.SIZE.l]
		);
		if(Item.Pair) Item.Pair.Scale = Scale;
	}
	PageL = Math.floor(ItemRef["viewport"][S.SIZE.l] * Scale);
	PageB = Math.floor(ItemRef["viewport"][S.SIZE.b] * (PageL / ItemRef["viewport"][S.SIZE.l]));
	Item.style[S.SIZE.l] = ItemBox.style[S.SIZE.l] = PageL + "px";
	Item.style[S.SIZE.b] = ItemBox.style[S.SIZE.b] = PageB + "px";
	sML.style(Item.HTML, {
		"width": ItemRef["viewport"].width + "px",
		"height": ItemRef["viewport"].height + "px",
		"transform-origin": "0 0",
		"transformOrigin": "0 0",
		"transform": "scale(" + Scale + ")"
	});
	var Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
	if(ItemRef["page-spread"] == "right") Page.style.right = 0;
	else                                  Page.style.left  = 0;
	Page.style[S.SIZE.b] = PageB + "px";
	Page.style[S.SIZE.l] = PageL + "px";
	if(Spread.Items.length == 1 && (ItemRef["page-spread"] == "left" || ItemRef["page-spread"] == "right")) Page.style.width = parseFloat(Page.style.width) * 2 + "px";
	Page.Item = Item, Page.Spread = Spread;
	Page.PageIndexInItem = Item.Pages.length;
	Item.Pages.push(Page);
	return Item;
};

R.resetSpread = function(Spread) {
	Spread.Items.forEach(function(Item) {
		R.resetItem(Item);
	});
	var SpreadBox = Spread.SpreadBox;
	SpreadBox.style["margin" + S.BASE.B] = SpreadBox.style["margin" + S.BASE.A] = "";
	SpreadBox.style["margin" + S.BASE.E] = SpreadBox.style["margin" + S.BASE.S] = "auto";
	SpreadBox.style.padding = "";
	if(S["book-rendition-layout"] == "reflowable") {
		SpreadBox.style.width  = Spread.Items[0].ItemBox.style.width;
		SpreadBox.style.height = Spread.Items[0].ItemBox.style.height;
	} else {
		if(Spread.Items.length == 2) {
			SpreadBox.style.width  = Math.ceil(         Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth        ) + "px";
			SpreadBox.style.height = Math.ceil(Math.max(Spread.Items[0].ItemBox.offsetHeight, Spread.Items[1].ItemBox.style.offsetHeight)) + "px";
		} else {
			SpreadBox.style.width  = Math.ceil(parseFloat(Spread.Items[0].ItemBox.style.width) * (Spread.Items[0].ItemRef["page-spread"] == "left" || Spread.Items[0].ItemRef["page-spread"] == "right" ? 2 : 1)) + "px";
			SpreadBox.style.height = Spread.Items[0].ItemBox.style.height;
		}
	}
	Spread.style["border-radius"] = S["spread-border-radius"];
	Spread.style["box-shadow"]    = S["spread-box-shadow"];
};

R.resetPages = function() {
	R.Pages.forEach(function(Page) {
		Page.parentNode.removeChild(Page);
		delete Page;
	});
	R.Pages = [];
	R.Spreads.forEach(function(Spread) {
		Spread.Pages = [];
		Spread.Items.forEach(function(Item) {
			Item.Pages.forEach(function(Page) {
				Page.PageIndexInSpread = Spread.Pages.length; Spread.Pages.push(Page);
				Page.PageIndex         =      R.Pages.length;      R.Pages.push(Page);
			});
		});
	});
	return R.Pages;
};

R.resetNavigation = function() {
	sML.style(C.Cartain.Navigation.Item, { float: "" });
	if(S.PPD == "rtl") {
		var theWidth = C.Cartain.Navigation.Item.scrollWidth - window.innerWidth;
		if(C.Cartain.Navigation.Item.scrollWidth < window.innerWidth) sML.style(C.Cartain.Navigation.Item, { float: "right" });
		C.Cartain.Navigation.ItemBox.scrollLeft = C.Cartain.Navigation.ItemBox.scrollWidth - window.innerWidth;
	}
};


R.layoutSpread = function(Spread) {
	var SpreadBox = Spread.SpreadBox;
	SpreadBox.style.padding = "";
	var SpreadBoxPaddingBefore = 0, SpreadBoxPaddingAfter = 0;
	if(S.SLA == "horizontal") {
		// Set padding-start + padding-end of SpreadBox
		if(SpreadBox.offsetHeight < R.StageSize.Breadth) {
			SpreadBoxPaddingTop    = Math.floor((R.StageSize.Breadth - SpreadBox.offsetHeight) / 2);
			SpreadBoxPaddingBottom = R.StageSize.Breadth - (SpreadBoxPaddingTop + SpreadBox.offsetHeight);
			SpreadBox.style.paddingTop    = SpreadBoxPaddingTop + "px";
			SpreadBox.style.paddingBottom = SpreadBoxPaddingBottom + "px";
		}
		// Set padding-left + padding-right of pre-pagenated-single
		/*
		if(Spread.Items.length == 1) {
			if(Spread.Items[0].ItemRef["page-spread"] == "right") {
				if(S.SLD == "ltr") SpreadBoxPaddingBefore += Spread.offsetWidth;
				else               SpreadBoxPaddingAfter  += Spread.offsetWidth;
			} else if(Spread.Items[0].ItemRef["page-spread"] == "left") {
				if(S.SLD == "ltr") SpreadBoxPaddingAfter  += Spread.offsetWidth;
				else               SpreadBoxPaddingBefore += Spread.offsetWidth;
			}
		}*/
	}
	if(Spread.SpreadIndex == 0) {
		SpreadBoxPaddingBefore = Math.floor((R.StageSize.Length - SpreadBox["offset" + S.SIZE.L]) / 2);
		if(SpreadBoxPaddingBefore < S["spread-gap"]) SpreadBoxPaddingBefore = S["spread-gap"];
	} else if(S.BRL == "reflowable") {
		SpreadBoxPaddingBefore = S["spread-gap"];
	} else {
		SpreadBoxPaddingBefore = Math.floor(R.StageSize.Length / 2/* - S["spread-gap"]*/);
	}
	if(Spread.SpreadIndex == R.Spreads.length - 1) {
		SpreadBoxPaddingAfter  += Math.ceil( (R.StageSize.Length - SpreadBox["offset" + S.SIZE.L]) / 2);
		if(SpreadBoxPaddingAfter  < S["spread-gap"]) SpreadBoxPaddingAfter  = S["spread-gap"];
	}
	if(SpreadBoxPaddingBefore) SpreadBox.style["padding" + S.BASE.B] = SpreadBoxPaddingBefore + "px";
	if(SpreadBoxPaddingAfter)  SpreadBox.style["padding" + S.BASE.A] = SpreadBoxPaddingAfter  + "px";
	// Adjust R.Content.Main (div#epub-content-main)
	var MainContentLength = 0;
	R.Spreads.forEach(function(Spread) {
		MainContentLength += Spread.SpreadBox["offset" + S.SIZE.L];
	});
	R.Content.Main.style[S.SIZE.b] = "";
	R.Content.Main.style[S.SIZE.l] = MainContentLength + "px";
};


/*
R.layoutStage = function() {
	for(var L = R.Spreads.length, i = 0, StageLength = 0; i < L; i++) StageLength += R.Spreads[i].SpreadBox["offset" + S.SIZE.L];
	R.Content.Main.style[S.SIZE.l] = StageLength + "px";
};
*/


R.layout = function(Option) {

	/*
		Option: {
			Target: BibiTarget (Required),
			Reset: Boolean (Required),
			Setting: BibiSetting (Optional)
		}
	*/

	if(!R.Layouted || !R.ToRelayout) O.log(2, 'Laying Out...');

	R.Layouted = true;

	window.removeEventListener("scroll", R.onscroll);
	window.removeEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);

	if(!Option) Option = {};

	if(!Option.Target) {
		var CurrentPage = R.getCurrentPages().Start;
		Option.Target = {
			ItemIndex: CurrentPage.Item.ItemIndex,
			PageProgressInItem: CurrentPage.PageIndexInItem / CurrentPage.Item.Pages.length
		}
	}

	if(Option.Setting) S.update(Option.Setting);

	if(Option.Reset || R.ToRelayout) {
		R.ToRelayout = false;
		R.resetStage();
		R.Spreads.forEach(function(Spread, i) {
			O.updateStatus("Rendering... ( " + (i + 1) + "/" + R.Spreads.length + " Spreads )");
			R.resetSpread(Spread);
		});
		R.resetPages();
		R.resetNavigation();
	}

	R.Columned = false;
	for(var i = 0, L = R.Items.length; i < L; i++) {
		var Style = R.Items[i].HTML.style;
		if(Style["-webkit-column-width"] || Style["-moz-column-width"] || Style["-ms-column-width"] || Style["column-width"]) {
			R.Columned = true;
			break;
		}
	}

	Option.Target = R.getTarget(Option.Target);

	R.Spreads.forEach(function(Spread) {
		R.layoutSpread(Spread);
		//if(S.RVM == "paged" && Spread != Option.Target.Page.Spread) Spread.style.opacity = 0;
	});

	//R.layoutStage();

	R.focus(Option.Target, { Duration: 0, Easing: 0 });

	O.log(3, "rendition:layout: " + S.BRL);
	O.log(3, "page-progression-direction: " + S.PPD);
	O.log(3, "reader-view-mode: " + S.RVM);

	if(typeof doAfter == "function") doAfter();

	window.addEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
	window.addEventListener("scroll", R.onscroll);

	E.dispatch("bibi:layout");

	O.log(2, 'Laid Out.');

	return S;

};


R.Relayouting = 0;

R.relayout = function(Option) {
	if(R.Relayouting) return;
	R.Relayouting++;
	var CurrentPages = R.getCurrentPages();
	var Target = CurrentPages.Start ? {
		ItemIndex: CurrentPages.Start.Item.ItemIndex,
		PageProgressInItem: CurrentPages.Start.PageIndexInItem / CurrentPages.Start.Item.Pages.length
	} : {
		ItemIndex: 0,
		PageProgressInItem: 0
	};
	setTimeout(function() {
		sML.style(R.Content.Main, {
			transition: "opacity 0.4s ease",
			opacity: 0
		});
		window.removeEventListener("scroll", R.onscroll);
		window.removeEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
		sML.addClass(O.HTML, "preparing");
		setTimeout(function() {
			R.layout({
				Target: Target,
				Reset: true,
				Setting: Option && Option.Setting ? Option.Setting : undefined
			});
			R.Relayouting--;
			if(!R.Relayouting) setTimeout(function() {
				sML.removeClass(O.HTML, "preparing");
				window.addEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
				window.addEventListener("scroll", R.onscroll);
				sML.style(R.Content.Main, {
					transition: "opacity 0.4s ease",
					opacity: 1
				});
				if(Option && typeof Option.callback == "function") Option.callback();
			}, 100);
		}, 100);
	}, 222);
};

R.onscroll = function() {
};

R.onresize = function() {
	if(R.Timer_onresize) clearTimeout(R.Timer_onresize);
	R.Timer_onresize = setTimeout(function() {
		R.relayout();
	}, 888);
};


R.changeView = function(BDM) {
	if(typeof BDM != "string" || S.RVM == BDM) return false;
	if(BDM != "paged") {
		R.Spreads.forEach(function(Spread) {
			Spread.style.opacity = 1;
		});
	}
	if(R.Started) {
		R.relayout({
			Setting: { "reader-view-mode": BDM },
			callback: function() {
				//Option["page-progression-direction"] = S.PPD;
				E.dispatch("bibi:changeView", BDM);
			}
		});
	} else {
		S.update({ "reader-view-mode": BDM });
		return L.play();
	}
};


R.getTarget = function(Target) {
	     if(typeof Target == "string") Target = { Edge: Target };
	else if(typeof Target == "number") Target = { Item: R.Items[Target] };
	if(typeof Target != "object" || !Target) return null;
	if(Target.tagName) {
		TargetElement = Target, Target = {};
		     if(typeof TargetElement.SpreadIndex == "number") Target.Item    = TargetElement.Items[0];
		else if(typeof TargetElement.ItemIndex   == "number") Target.Item    = TargetElement;
		else if(typeof TargetElement.PageIndex   == "number") Target.Page    = TargetElement;
		else                                                  Target.Element = TargetElement;
	}
	if(typeof Target.Edge == "string") {
		if(Target.Edge == "head") return { Edge: "head", EdgeTRBL: (S.SLD == "ttb" ? "T" : (S.SLD == "rtl" ? "R" : "L")), Item: R.Items[0],                  Page: R.Pages[0] };
		if(Target.Edge == "foot") return { Edge: "foot", EdgeTRBL: (S.SLD == "ttb" ? "B" : (S.SLD == "rtl" ? "L" : "R")), Item: R.Items[R.Items.length - 1], Page: R.Pages[R.Pages.length - 1] };
	}
	if(!Target.Item && typeof Target.ItemIndex == "number") Target.Item = R.Items[Target.ItemIndex];
	if(Target.Page && !Target.Page.parentElement) delete Target.Page;
	if(Target.Element) {
		if(Target.Element.tagName) { // In-Frame Content
			Target.Item = Target.Element.ownerDocument.body.Item ? Target.Element.ownerDocument.body.Item : null;
		} else if(typeof Target.Element == "string" && Target.Item) { // Selector
			Target.Element = Target.Item.contentDocument.querySelector(Target.Element);
			if(!Target.Element) delete Target.Element;
		}
		Target.Page = Target.Item.Pages[0];
	} else if(Target.Page) {
		Target.Item = Target.Page.Item;
	} else if(typeof Target.PageIndexInItem == "number" && Target.Item) {
		Target.Page = Target.Item.Pages[Target.PageIndexInItem];
	} else if(typeof Target.PageProgressInItem == "number" && Target.Item) {
		Target.Page = Target.Item.Pages[Math.floor(Target.Item.Pages.length * Target.PageProgressInItem)];
	} else if(typeof Target.PageIndex == "number") {
		Target.Page = R.Pages[Target.PageIndex];
		Target.Item = Target.Page.Item;
	}
	if(!Target.Item) return null;
	if(!Target.Page) Target.Page = Target.Item.Pages[0];
	return Target;
};


R.getCurrentPages = function() {
	var FrameScrollCoord = sML.Coord.getScrollCoord(R.Frame);
	var FrameClientSize  = sML.Coord.getClientSize(R.Frame);
	FrameScrollCoord = {
		Left:   FrameScrollCoord.X,
		Right:  FrameScrollCoord.X + FrameClientSize.Width,
		Top:    FrameScrollCoord.Y,
		Bottom: FrameScrollCoord.Y + FrameClientSize.Height,
	};
	var CurrentPages = [], CenterPage = null, Longest = 0, Nearest = FrameClientSize[S.SIZE.L] / 2;
	for(var L = R.Pages.length, i = 0; i < L; i++) {
		if(R.Pages[i].style.display == "none") continue;
		var PageCoord = sML.getCoord(R.Pages[i]);
		var Length   = Math.min(
			FrameScrollCoord[S.BASE.A] / R.Scale * S.AXIS.PM,
			PageCoord[S.BASE.A] * S.AXIS.PM
		) - Math.max(
			FrameScrollCoord[S.BASE.B] / R.Scale * S.AXIS.PM,
			PageCoord[S.BASE.B] * S.AXIS.PM
		);
		var Distance = Math.abs((FrameScrollCoord[S.BASE.B] / R.Scale + FrameScrollCoord[S.BASE.A] / R.Scale) - (PageCoord[S.BASE.B] + PageCoord[S.BASE.a]));
		Length = (Length <= 0 || !PageCoord[S.SIZE.L] || isNaN(Length)) ? -1 : Math.round(Length / PageCoord[S.SIZE.L] * 100);
		     if(Length <  Longest) { if(!CurrentPages.length) continue; else break; }
		else if(Length == Longest) CurrentPages.push(R.Pages[i]);
		else if(Length  > Longest) CurrentPages[0] = R.Pages[i], Longest = Length;
		if(Distance < Nearest) CenterPage = R.Pages[i], Nearest = Distance;
	}
	return {
		All:    CurrentPages,
		Start:  CurrentPages[0],
		Center: CenterPage,
		End:    CurrentPages[CurrentPages.length - 1]
	};
};


R.getPageGroup = function(Target) {
	Target = R.getTarget(Target);
	var Next = (Target.Side == "a") ? -1 : +1;
	var Pages = [], Length = 0, Space = document.documentElement["client" + S.SIZE.L];
	for(var i = Target.Page.PageIndex; 0 <= i && i < R.Pages.length; i += Next) {
		if((Target.Item.IsPrePaginated && R.Pages[i].Spread != Target.Page.Spread)) break;
		if(Space - R.Pages[i]["offset" + S.SIZE.L] < 0) break;
		Pages.push(R.Pages[i]);
		if(S.SLA == "vertical" && R.Pages[i].Item.Pair && R.Pages[i].Item.Pair == Target.Page.Item) continue;
		var PageGap = (i < 0 ? S["spread-gap"] : 0);
		Space  -= R.Pages[i]["offset" + S.SIZE.L] + PageGap;
		Length += R.Pages[i]["offset" + S.SIZE.L] + PageGap;
	}
	var MarginBeforeGroup = Math.floor(Space / 2), MarginBeforePage = MarginBeforeGroup;
	if(Target.Side == "a") {
		Pages.reverse();
		MarginBeforePage += (Length - Target.Page["offset" + S.SIZE.L]);
	}
	return {
		Page:              Target.Page,
		Pages:             Pages,
		Length:            Length,
		MarginBeforeGroup: MarginBeforeGroup,
		MarginBeforePage:  MarginBeforePage
	};
};


R.focus = function(Target, ScrollOption) {
	var FocusTarget = R.getTarget(Target); if(typeof FocusTarget != "object" || !FocusTarget) return false;
	if(FocusTarget.Edge) {
		var FocusPoint = /^[TL]$/.test(FocusTarget.EdgeTRBL) ? 0 : R.Content.Main["offset" + [S.SIZE.L]] - sML.Coord.getClientSize(R.Frame)[S.SIZE.L];
		sML.scrollTo(R.Frame, (S.SLA == "vertical" ? { Y: FocusPoint * R.Scale } : { X: FocusPoint * R.Scale }), ScrollOption);
		return false;
	}
	var Top_or_Left = (S.SLA == "vertical") ? ["Top", "Left"] : ["Left", "Top"];
	var TextLocationTarget = { Element: FocusTarget.Element, TextNodeIndex: FocusTarget.TextNodeIndex, TermStep: FocusTarget.TermStep };
	if(FocusTarget.Element) {
		var ElementOffsetInItem = R.focus.getOffset(FocusTarget.Element);
		if(FocusTarget.Item.Columned) {
			if(S.PPD == "rtl" && S.SLA == "vertical") {
				var NoColumnedItemBreadth = FocusTarget.Item.Body["offset" + S.SIZE.B];
				if(FocusTarget.Item.Body.offsetParent) {
					var ItemHTMLComputedStyle = getComputedStyle(FocusTarget.Item.HTML);
					var ItemHTMLPaddingBreadth = Math.ceil(parseFloat(ItemHTMLComputedStyle["padding" + S.BASE.B]) + parseFloat(ItemHTMLComputedStyle["padding" + S.BASE.A]))
					NoColumnedItemBreadth += ItemHTMLPaddingBreadth;
				}
				ElementOffsetInItem[S.AXIS.B] = NoColumnedItemBreadth - ElementOffsetInItem[S.AXIS.B] + FocusTarget.Element["offset" + S.SIZE.B];
			}
			var TargetPage = FocusTarget.Item.Pages[Math.floor(ElementOffsetInItem[S.AXIS.B] / FocusTarget.Item.ColumnBreadth)];
		} else {
			ElementOffsetInItem = ElementOffsetInItem[S.AXIS.L];
			if(S.SLD == "rtl" && S.SLA == "horizontal") {
				ElementOffsetInItem = FocusTarget.Item.HTML.offsetWidth - ElementOffsetInItem - FocusTarget.Element.offsetWidth;
			}
			var TargetPage = FocusTarget.Item.Pages[0];
			for(var i = 0, L = FocusTarget.Item.Pages.length; i < L; i++) {
				ElementOffsetInItem -= FocusTarget.Item.Pages[i]["offset" + S.SIZE.L];
				if(ElementOffsetInItem <= 0) {
					TargetPage = FocusTarget.Item.Pages[i];
					break;
				}
			}
		}
		var TargetPageGroup = R.getPageGroup(TargetPage);
		if(typeof TextLocationTarget.TextNodeIndex == "number") R.selectTextLocation(TextLocationTarget); // Colorize Target with Selection
	} else {
		var TargetPageGroup = R.getPageGroup(FocusTarget);
		var TargetPage = TargetPageGroup.Pages[0];
	}
	var FocusPoint = R.focus.getOffset(TargetPage)[S.AXIS.L];
	if(S.SLD == "rtl") FocusPoint += TargetPage.offsetWidth - window.innerWidth;
	if(S["book-rendition-layout"] == "pre-paginated") {
		sML.log(TargetPageGroup);
		if(window["inner" + S.SIZE.L] > TargetPageGroup.Length) FocusPoint -= TargetPageGroup.MarginBeforeGroup * S.AXIS.PM;
	} else {
		FocusPoint -= S["spread-gap"] / 2 * S.AXIS.PM;
	}
	var ScrollTo = {}; ScrollTo[S.AXIS.L] = FocusPoint * R.Scale;
	if(S.RVM == "paged") {
		sML.style(R.Content, {
			transition: "ease-out 0.05s"
		});
		var CurrentScrollLength = (R.Frame == window) ? window["scroll" + S.AXIS.L] : R.Frame["scroll" + (S.SLA == "horizontal" ? "Left" : "Top")];
		sML.addClass(O.HTML, "flipping-" + (FocusPoint > CurrentScrollLength ? "ahead" : "astern"));
		setTimeout(function() {
			sML.style(R.Content, {
				transition: "none"
			});
			sML.scrollTo(R.Frame, ScrollTo, { Duration: 1 }, {
				end: function() {
					if(S.RVM == "paged") {
						R.Spreads.forEach(function(Spread) {
							if(Spread == FocusTarget.Item.Spread) Spread.style.opacity = 1;
							//else                      Spread.style.opacity = 0;
						});
						sML.removeClass(O.HTML, "flipping-ahead");
						sML.removeClass(O.HTML, "flipping-astern");
					}
					E.dispatch("bibi:focus", FocusTarget);
				}
			});
		}, 50);
	} else {
		sML.scrollTo(R.Frame, ScrollTo, ScrollOption);
	}
	return false;
};

R.focus.getOffset = function(El) {
	var Offset = { X: El["offsetLeft"], Y: El["offsetTop"] };
	while(El.offsetParent) El = El.offsetParent, Offset.X += El["offsetLeft"], Offset.Y += El["offsetTop"];
	return Offset;
};


R.selectTextLocation = function(Target) {
	if(typeof Target.TextNodeIndex != "number") return;
	var TargetNode = Target.Element.childNodes[Target.TextNodeIndex];
	if(!TargetNode || !TargetNode.textContent) return;
	var Sides = { Start: { Node: TargetNode, Index: 0 }, End: { Node: TargetNode, Index: TargetNode.textContent.length } };
	if(Target.TermStep) {
		if(Target.TermStep.Preceding || Target.TermStep.Following) {
			Sides.Start.Index = Target.TermStep.Index, Sides.End.Index = Target.TermStep.Index;
			if(Target.TermStep.Preceding) Sides.Start.Index -= Target.TermStep.Preceding.length;
			if(Target.TermStep.Following)   Sides.End.Index += Target.TermStep.Following.length;
			if(Sides.Start.Index < 0 || TargetNode.textContent.length < Sides.End.Index) return;
			if(TargetNode.textContent.substr(Sides.Start.Index, Sides.End.Index - Sides.Start.Index) != Target.TermStep.Preceding + Target.TermStep.Following) return;
		} else if(Target.TermStep.Side && Target.TermStep.Side == "a") {
			Sides.Start.Node = TargetNode.parentNode.firstChild; while(Sides.Start.Node.childNodes.length) Sides.Start.Node = Sides.Start.Node.firstChild;
			Sides.End.Index = Target.TermStep.Index - 1;
		} else {
			Sides.Start.Index = Target.TermStep.Index;
			Sides.End.Node = TargetNode.parentNode.lastChild; while(Sides.End.Node.childNodes.length) Sides.End.Node = Sides.End.Node.lastChild;
			Sides.End.Index = Sides.End.Node.textContent.length;
		}
	}
	return sML.select(Sides);
};


R.page = function(Distance) {
	if(Distance != -1) Distance = +1;
	var CurrentPages = R.getCurrentPages(), CurrentPage = Distance < 0 ? CurrentPages.Start : CurrentPages.End;
	var TargetPageIndex = CurrentPage.PageIndex + Distance;
	if(TargetPageIndex <                  0) return R.focus({ Edge: "head" });
	if(TargetPageIndex > R.Pages.length - 1) return R.focus({ Edge: "foot" });
	var TargetPage = R.Pages[TargetPageIndex];
	if(S.SLA == "vertical" && TargetPage.Item.Pair) {
		if(CurrentPage.Item.Pair == TargetPage.Item) TargetPageIndex += (Distance > 0 ? +1 : -1);
	}
	if(S.SLA == "horizontal" && TargetPage.Item.Pair && window["inner" + S.SIZE.L] > TargetPage.Item[S.SIZE.L] * 2) {
		if(Distance < 0 && TargetPage.PageIndexInSpread == 0) TargetPage = TargetPage.Spread.Pages[1];
		if(Distance > 0 && TargetPage.PageIndexInSpread == 1) TargetPage = TargetPage.Spread.Pages[0];
	}
	/*
	if(S.RVM == "paged" && TargetPage.Spread != CurrentPage.Spread) {
		return R.focus(TargetPage, { p:1, t:1 });
	}
	*/
	R.focus({ Page: TargetPage, Side: (Distance > 0 ? "b" : "a") });
};


R.scroll = function(Distance) {
	if(Distance != -1) Distance = +1;
	return sML.scrollTo(
		R.Frame,
		(function(ScrollCoord) {
			switch(S.SLD) {
				case "ttb": return { Y: ScrollCoord.Y + (R.StageSize.Length + S["spread-gap"]) * Distance      };
				case "ltr": return { X: ScrollCoord.X + (R.StageSize.Length + S["spread-gap"]) * Distance      };
				case "rtl": return { X: ScrollCoord.X + (R.StageSize.Length + S["spread-gap"]) * Distance * -1 };
			}
		})(sML.Coord.getScrollCoord(R.Frame))
	);
};


R.move = function(Distance) {
	((R.Columned || S.BRL == "pre-paginated") ? R.page : R.scroll)(Distance);
	E.dispatch("bibi:move", Distance);
};


R.to = function(BibitoString) {
	return R.focus(U.getBibitoTarget(BibitoString));
};


R.Scale = 1;

R.zoom = function(Scale) {
	if(typeof Scale != "number" || Scale <= 0) Scale = 1;
	var CurrentStartPage = R.getCurrentPages().Start;
	sML.style(R.Content.Main, { "transform-origin": S.SLD == "rtl" ? "100% 0" : "0 0" });
	if(Scale == 1) {
		O.HTML.style.overflow = "";
		sML.style(R.Content.Main, { transform: "" });
	} else {
		sML.style(R.Content.Main, { transform: "scale(" + Scale + ")" });
		O.HTML.style.overflow = "auto";
	}
	setTimeout(function() {
		R.focus(CurrentStartPage, { Duration: 1 });
	}, 0);
	R.Scale = Scale;
};

/*
R.observeTap = function(Layer, HEve) {
	var L = "", Point = { X: HEve.center.x, Y: HEve.center.y };
	if(typeof Layer.SpreadIndex != "undefined") {
		L = "Spread";
	} else {
		L = "Item";
		var FrameScrollCoord = sML.Coord.getScrollCoord(R.Frame);
		var ElementCoord = sML.Coord.getElementCoord(Layer);
		Point.X = ElementCoord.X + parseInt(R.Items[0].style.paddingLeft) + Point.X - FrameScrollCoord.X;
		Point.Y = ElementCoord.Y + parseInt(R.Items[0].style.paddingTop)  + Point.Y - FrameScrollCoord.Y;
	}
	sML.log(HEve);
	sML.log(L + ": { X: " + Point.X + ", Y: " + Point.Y + " }");
};
*/




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Notifier

//----------------------------------------------------------------------------------------------------------------------------------------------

N.found = {};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Controls

//----------------------------------------------------------------------------------------------------------------------------------------------


C.createVeil = function() {

	C.Veil = document.getElementById("bibi-veil");

	sML.edit(C.Veil, {
		State: 1, // Translate: 240, /* % */ // Rotate: -48, /* deg */ // Perspective: 240, /* px */
		open: function(Cb) {
			if(this.State == 1) return (typeof Cb == "function" ? Cb() : this.State);
			this.State = 1;
			this.style.display = "block";
			this.style.zIndex = 100;
			sML.style(this, {
				transition: "0.5s ease-out",
				transform: "translate" + S.AXIS.L + "(0)",
				opacity: 0.75
			}, function() {
				if(typeof Cb == "function") Cb();
			});
			return this.State;
		},
		close: function(Cb) {
			if(this.State == 0) return (typeof Cb == "function" ? Cb() : this.State);
			this.State = 0;
			this.Message.style.opacity = 0;
			sML.style(this, {
				transition: "0.5s ease-in",
				transform: "translate" + S.AXIS.L + "(" + (S.AXIS.PM * -1 * 240) + "%)",
				opacity: 0
			}, function() {
				sML.style(this, {
					transition: "none",
					transform: "translate" + S.AXIS.L + "(" + (S.AXIS.PM * 240) + "%)"
				});
				this.style.zIndex = 1;
				this.style.display = "none";
				if(typeof Cb == "function") Cb();
			});
			return this.State;
		},
		toggle: function(Cb) {
			return (this.State == 0 ? this.open(Cb) : this.close(Cb));
		}
	});

	C.Veil.Cover   = C.Veil.appendChild(sML.create("div", {                       id: "bibi-veil-cover"   }));
	C.Veil.Mark    = C.Veil.appendChild(sML.create("div", { className: "animate", id: "bibi-veil-mark"    }));
	C.Veil.Message = C.Veil.appendChild(sML.create("p",   { className: "animate", id: "bibi-veil-message", note: function(Note) { C.Veil.Message.innerHTML = Note; return Note; } }));
	C.Veil.Powered = C.Veil.appendChild(sML.create("p",   {                       id: "bibi-veil-powered", innerHTML: O.getLogo({ Color: "white", Linkify: true }) }));

	// Wait Drop or Input
	if(window.File) {
		C.Veil.Catcher = C.Veil.appendChild(
			sML.create("p", { id: "bibi-veil-catcher", title: 'Drop me an EPUB! or Click me!' }, { display: "none" })
		);
		C.Veil.Catcher.addEventListener("click", function() {
			if(!this.Input) this.Input = this.appendChild(
				sML.create("input", { type: "file",
					onchange: function(Eve) {
						B.initialize({ File: Eve.target.files[0] });
						B.load();
					}
				})
			);
			this.Input.click();
		});
		if(!sML.OS.iOS && !sML.OS.Android) {
			document.body.addEventListener("dragenter", function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 0.9; sML.addClass(O.HTML, "dragenter"); }, 1);
			document.body.addEventListener("dragover",  function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 0.9; }, 1);
			document.body.addEventListener("dragleave", function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 1.0; sML.removeClass(O.HTML, "dragenter"); }, 1);
			document.body.addEventListener("drop",      function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 1.0;
				B.initialize({ File: Eve.dataTransfer.files[0] });
				B.load();
			}, 1);
		}
	}

	for(var i = 1; i <= 8; i++) C.Veil.Mark.appendChild(sML.create("span", { className: "dot dot-" + (i % 2 ? "odd" : "even") + " dot-" + i }));

	E.add("bibi:startLoading", function() {
		sML.addClass(C.Veil, "animate");
		C.Veil.Message.note('Loading...');
	});
	E.add("bibi:stopLoading", function() {
		sML.removeClass(C.Veil, "animate");
		C.Veil.Message.note('');
	});
	E.add("bibi:updateStatus", function(Message) {
		if(typeof Message == "string") C.Veil.Message.note(Message);
	});
	E.add("bibi:wait", function() {
		var Title = (sML.OS.iOS || sML.OS.Android ? 'Tap' : 'Click') + ' to Open';
		C.Veil.PlayButton = C.Veil.appendChild(
			sML.create("p", { id: "bibi-veil-playbutton", title: Title,
				innerHTML: '<span class="non-visual">' + Title + '</span>',
				hide: function() {
					//C.Veil.PlayButton.removeTouchEventListener("tap");
					this.removeEventListener("click");
					sML.style(this, {
						opacity: 0,
						cursor: "default"
					});
				}
			})
		);
		C.Veil.PlayButton.addEventListener("click", function(Eve) {
			Eve.stopPropagation();
			L.play();
		});
		E.add("bibi:play", function() {
			C.Veil.PlayButton.hide()
		});
	});

	E.dispatch("bibi:createVeil");

};


C.createCartain = function() {

	C.Cartain = O.Body.appendChild(
		sML.create("div", { id: "bibi-cartain",
			State: 0,
			open: function(Cb) {
				if(this.State == 1) return (typeof Cb == "function" ? Cb() : this.State);
				this.State = 1;
				sML.addClass(O.HTML, "cartain-opened");
				setTimeout(Cb, 250);
				return this.State;
			},
			close: function(Cb) {
				if(this.State == 0) return (typeof Cb == "function" ? Cb() : this.State);
				this.State = 0;
				sML.removeClass(O.HTML, "cartain-opened");
				setTimeout(Cb, 250);
				return this.State;
			},
			toggle: function(Cb) {
				var State = (this.State == 0 ? this.open(Cb) : this.close(Cb));
				E.dispatch("bibi:toggleCartain", State);
				return State;
			}
		})
	);

	C.Cartain.Misc = C.Cartain.appendChild(sML.create("div", { id: "bibi-cartain-misc", innerHTML: O.getLogo({ Color: "black", Linkify: true }) }));

	C.Cartain.Navigation = C.Cartain.appendChild(
		sML.create("div", { id: "bibi-cartain-navigation" })
	);
	C.Cartain.Navigation.ItemBox = C.Cartain.Navigation.appendChild(
		sML.create("div", { id: "bibi-cartain-navigation-item-box" })
	);
	C.Cartain.Navigation.Item = C.Cartain.Navigation.ItemBox.appendChild(
		sML.create("div", { id: "bibi-cartain-navigation-item", ItemBox: C.Cartain.Navigation.ItemBox })
	);
	C.Cartain.Navigation.ItemBox.addEventListener("click", function() {
		C.Cartain.toggle();
	});

	C["menu"] = C.Cartain.appendChild(
		sML.create("div", { id: "bibi-menus" })
	);

	C["switch"] = O.Body.appendChild(
		sML.create("div", { id: "bibi-switches" }, { "transition": "opacity 0.75s linear" })
	);
	C["switch"].Cartain = C.addButton({
		id: "bibi-switch-cartain",
		Category: "switch",
		Group: "cartain",
		Labels: [
			{ ja: 'メニューを開く',   en: 'Open Menu'  },
			{ ja: 'メニューを閉じる', en: 'Close Menu' }
		],
		IconHTML: '<span class="bibi-icon bibi-switch bibi-switch-cartain"></span>'
	}, function() {
		C.Cartain.toggle();
		C.setLabel(C["switch"].Cartain, C.Cartain.State);
	});
	E.add("bibi:start", function() {
		sML.style(C["switch"].Cartain, { display: "block" });
	});

	E.dispatch("bibi:createCartain");

};


C.setLabel = function(Button, State) {
	if(typeof State != "number") State = 0;
	var Japanese = (B.Package.Metadata["languages"][0].split("-")[0] == "ja");
	var Label = Button.Labels[(Button.Labels.length > 1) ? State : 0];
	Button.title = Button.Label.innerHTML = (Japanese ? Label["ja"] + " / " : "") + Label["en"];
	return State;
};

C.addButton = function(Param, Fn) {
	if(typeof Param.Category != "string" || typeof Param.Group != "string") return false;
	if(!C[Param.Category][Param.Group]) C[Param.Category][Param.Group] = C[Param.Category].appendChild(sML.create("ul"));
	var Button = C[Param.Category][Param.Group].appendChild(
		sML.create("li", { className: "bibi-button",
			innerHTML: (typeof Param.IconHTML == "string" ? Param.IconHTML : '<span class="bibi-icon"></span>') + '<span class="bibi-button-label non-visual"></span>',
			Category: Param.Category,
			Group: Param.Group,
			Labels: Param.Labels
		})
	);
	if(typeof Param.id == "string" || /^[a-zA-Z_][a-zA-Z0-9_\-]*$/.test(Param.id)) Button.id = Param.id;
	Button.Label = Button.querySelector(".bibi-icon").appendChild(sML.create("span", { className: "non-visual" }));
	sML.addTouchEventObserver(Button).addTouchEventListener("tap", function(){ Fn(); });
	C[Param.Category][Param.Group].style.display = "block";
	try { C.setLabel(Button, 0); } catch(Err) { E.add("bibi:readPackageDocument", function() { C.setLabel(Button, 0); }); }
	return Button;
};

C.removeButton = function(Button) {
	if(typeof Button == "string") Button = document.getElementById(Button);
	if(!Button) return false;
	var Group = Button.parentNode;
	Group.removeChild(Button);
	if(!Group.getElementsByTagName("li").length) Group.style.display = "none";
	return true;
};







//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------

P.initialize = function(Preset) {
	O.apply(Preset, P);
	if(!/^(horizontal|vertical|paged)$/.test(P["reader-view-mode"])) P["reader-view-mode"] = "horizontal";
	["spread-gap", "spread-margin-start", "spread-margin-end", "item-padding-left", "item-padding-right",  "item-padding-top",  "item-padding-bottom"].forEach(function(Property) {
		P[Property] = (typeof P[Property] != "number" || P[Property] < 0) ? 0 : Math.round(P[Property]);
	});
	if(P["spread-gap"] % 2) P["spread-gap"]++;
	if(!/^(https?:)?\/\//.test(P["bookshelf"])) P["bookshelf"] = O.getPath(location.href.split("?")[0].replace(/[^\/]*$/, "") + P["bookshelf"]);
	if(!(P["trustworthy-origins"] instanceof Array)) P["trustworthy-origins"] = [];
	if(P["trustworthy-origins"][0] != location.origin) P["trustworthy-origins"].unshift(location.origin);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- URI-Defined Settings (FileName, Queries, Hash, and EPUBCFI)

//----------------------------------------------------------------------------------------------------------------------------------------------


U.initialize = function() { // formerly O.readExtras

	var Q = U.parseQuery(location.search);
	var F = U.parseFileName(location.pathname);
	var H = U.parseHash(location.hash);

	     if( Q["book"]) U["book"] = Q["book"];
	else if( F["book"]) U["book"] = F["book"];
	else                U["book"] = "";

	if(H["epubcfi"]) {
		U["epubcfi"] = H["epubcfi"];
		U["to"] = U.getEPUBCFITarget(H["epubcfi"]);
	}

	var applyToU = function(DataString) {
		if(typeof DataString != "string") return {};
		DataString.replace(" ", "").split(",").forEach(function(PnV) {
			PnV = PnV.split(":"); if(!PnV[0]) return;
			if(!PnV[1]) {
				switch(PnV[0]) {
					case "horizontal": case "vertical": case "paged": PnV[1] = PnV[0], PnV[0] = "reader-view-mode"; break;
					case "autostart":                                 PnV[1] = true; break;
					default: PnV[0] = undefined;
				}
			} else {
				switch(PnV[0]) {
					case "reader-view-mode":  PnV[1] = /^(horizontal|vertical|paged)$/.test(PnV[1]) ? PnV[1] : undefined; break;
					case "autostart":          PnV[1] = /^(undefined|autostart|yes|true)?$/.test(PnV[1]); break;
					case "poster":             PnV[1] = U.decode(PnV[1]); break;
					case "parent-origin":      PnV[1] = U.decode(PnV[1]); break;
					case "to":                 PnV[1] = U.getBibitoTarget(PnV[1]); break;
					case "nav":                PnV[1] = PnV[1] * 1; break;
					case "view":               PnV[1] = /^fixed$/.test(PnV[1]) ? PnV[1] : undefined; break;
					case "arrows":             PnV[1] = /^hidden$/.test(PnV[1]) ? PnV[1] : undefined; break;
					case "preset":             break;
					default: PnV[0] = undefined;
				}
			}
			if(PnV[0] && typeof PnV[1] != "undefined") U[PnV[0]] = PnV[1];
		});
	};

	if(H["bibi"]) {
		applyToU(H["bibi"]);
	}

	if(H["pipi"]) {
		applyToU(H["pipi"]);
		if(U["parent-origin"]) P["trustworthy-origins"].push(U["parent-origin"]);
		if(history.replaceState) history.replaceState(null, null, location.href.replace(/[\,#]pipi\([^\)]*\)$/g, ""));　
	}

};


U.decode = function(Str) {
	return decodeURIComponent(Str.replace("_BibiKakkoClose_", ")").replace("_BibiKakkoOpen_", "("));
};


U.distillBookName = function(BookName) {
	if(typeof BookName != "string" || !BookName) return "";
	if(/^([\w\d]+:)?\/\//.test(BookName)) return "";
	return BookName;
};


U.parseQuery = function(Q) {
	if(typeof Q != "string") return {};
	Q = Q.replace(/^\?/, "");
	var Params = {};
	Q.split("&").forEach(function(PnV) {
		PnV = PnV.split("=");
		if(/^[a-z]+$/.test(PnV[0])) {
			if(PnV[0] == "book") {
				PnV[1] = U.distillBookName(PnV[1]);
				if(!PnV[1]) return;
			}
			Params[PnV[0]] = PnV[1];
		}
	});
	return Params;
};


U.parseFileName = function(Path) {
	if(typeof Path != "string") return {};
	var BookName = U.distillBookName(Path.replace(/^.*([^\/]*)$/, "$1").replace(/\.(x?html?|php|cgi|aspx?)$/, "").replace(/^index$/, ""));
	return BookName ? { "book": BookName } : {};
};


U.parseHash = function(H) {
	if(typeof H != "string") return {};
	H = H.replace(/^#/, "");
	var Params = {}, CurrentPosition = 0;
	var parseFragment = function() {
		var Foothold = CurrentPosition, Label = "";
		while(/[a-z_]/.test(H.charAt(CurrentPosition))) CurrentPosition++;
		if(H.charAt(CurrentPosition) == "(") Label = H.substr(Foothold, CurrentPosition - 1 - Foothold + 1), CurrentPosition++; else return {};
		while(H.charAt(CurrentPosition) != ")") CurrentPosition++;
		if(Label) Params[Label] = H.substr(Foothold, CurrentPosition - Foothold + 1).replace(/^[a-z_]+\(/, "").replace(/\)$/, "");
		CurrentPosition++;
	};
	parseFragment();
	while(H.charAt(CurrentPosition) == ",") {
		CurrentPosition++;
		parseFragment();
	}
	return Params;
};


U.getBibitoTarget = function(BibitoString) {
	if(typeof BibitoString == "number") BibitoString = "" + BibitoString;
	if(typeof BibitoString != "string" || !/^[1-9][0-9]*(-[1-9][0-9]*(\.[1-9][0-9]*)*)?$/.test(BibitoString)) return null;
	var ElementSelector = "", InE = BibitoString.split("-"), ItemIndex = parseInt(InE[0]), ElementIndex = InE[1] ? InE[1] : null;
	if(ElementIndex) ElementIndex.split(".").forEach(function(Index) { ElementSelector += ">*:nth-child(" + Index + ")"; });
	return {
		BibitoString: BibitoString,
		ItemIndex: ItemIndex - 1,
		Element: (ElementSelector ? "body" + ElementSelector : null)
	};
};


U.getEPUBCFITarget = function(CFIString) {
	if(!X["EPUBCFI"]) return null;
	var CFI = X["EPUBCFI"].parse(CFIString);
	if(!CFI || CFI.Path.Steps.length < 2 || !CFI.Path.Steps[1].Index || CFI.Path.Steps[1].Index % 2 == 1) return null;
	var ItemIndex = CFI.Path.Steps[1].Index / 2 - 1, ElementSelector = null, TextNodeIndex = null, TermStep = null, IndirectPath = null;
	if(CFI.Path.Steps[2] && CFI.Path.Steps[2].Steps) {
		ElementSelector = "";
		CFI.Path.Steps[2].Steps.forEach(function(Step, i) {
			if(Step.Type == "IndirectPath") { IndirectPath = Step; return false; }
			if(Step.Type == "TermStep")     { TermStep     = Step; return false; }
			if(Step.Index % 2 == 1) {
				TextNodeIndex = Step.Index - 1;
				if(i != CFI.Path.Steps[2].Steps.length - 2) return false;
			}
			if(TextNodeIndex === null) ElementSelector = Step.ID ? "#" + Step.ID : ElementSelector + ">*:nth-child(" + (Step.Index / 2) + ")";
		});
		if(ElementSelector && /^>/.test(ElementSelector)) ElementSelector = "html" + ElementSelector;
		if(!ElementSelector) ElementSelector = null;
	}
	return {
		CFI: CFI,
		CFIString: CFIString,
		ItemIndex: ItemIndex,
		Element: ElementSelector,
		TextNodeIndex: TextNodeIndex,
		TermStep: TermStep,
		IndirectPath: IndirectPath
	};
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Settings

//----------------------------------------------------------------------------------------------------------------------------------------------


S.initialize = function() {
	S.reset();
	if(typeof S["autostart"] == "undefined") S["autostart"] = !O.WindowEmbedded;
};


S.reset = function() {
	for(var Property in S) if(typeof S[Property] != "function") delete S[Property];
	O.apply(P, S);
	O.apply(U, S);
	delete S["book"];
	delete S["bookshelf"];
};


S.update = function(Settings) { // formerly O.updateSetting

	var PrevRVM = S.RVM, PrevPPD = S.PPD, PrevSLA = S.SLA, PrevSLD = S.SLD;

	if(typeof Settings == "object") {
		if(Settings.Reset) {
			alert("[dev] S.update(Settings) receives Settings.Reset!!");
			S.reset();
			delete Settings.Reset;
		}
		for(var Property in Settings) if(typeof S[Property] != "function") S[Property] = Settings[Property];
	}

	S.BRL = S["book-rendition-layout"] = B.Package.Metadata["rendition:layout"];
	S.BWM = S["book-writing-mode"] = (/^tb/.test(S["book-writing-mode"]) && !O.VerticalTextEnabled) ? "lr-tb" : B.WritingMode;

	// Layout Settings
	S.RVM = S["reader-view-mode"];
	if(S.BRL == "reflowable") {
		if(S.BWM == "tb-rl") {
			S.PPD = S["page-progression-direction"] = "rtl";
			S.SLA = S["spread-layout-axis"] = (S["reader-view-mode"] == "paged") ? "vertical"   : S["reader-view-mode"];
		} else if(S.BWM == "tb-lr") {
			S.PPD = S["page-progression-direction"] = "ltr";
			S.SLA = S["spread-layout-axis"] = (S["reader-view-mode"] == "paged") ? "vertical"   : S["reader-view-mode"];
		} else if(S.BWM == "rl-tb") {
			S.PPD = S["page-progression-direction"] = "rtl";
			S.SLA = S["spread-layout-axis"] = (S["reader-view-mode"] == "paged") ? "horizontal" : S["reader-view-mode"];
		} else {
			S.PPD = S["page-progression-direction"] = "ltr";
			S.SLA = S["spread-layout-axis"] = (S["reader-view-mode"] == "paged") ? "horizontal" : S["reader-view-mode"];
		}
	} else {
		S.PPD = S["page-progression-direction"] = (B.Package.Spine["page-progression-direction"] == "rtl") ? "rtl" : "ltr";
		S.SLA = S["spread-layout-axis"] = (S["reader-view-mode"] == "paged") ? "horizontal" : S["reader-view-mode"];
	}
	S.SLD = S["spread-layout-direction"] = (S["spread-layout-axis"] == "vertical") ? "ttb" : S["page-progression-direction"];

	// Dictionary
	if(S.SLA == "horizontal") {
		/**/S.SIZE = { b: "height", B: "Height", l: "width",  L: "Width",  w: "length",  W: "Length",  h: "breadth", H: "Breadth" };
		if(S.PPD == "ltr") {
			S.AXIS = { B: "Y",      L: "X",      PM: +1 };
			S.BASE = { b: "left",   B: "Left",   a: "right",  A: "Right",  s: "top",     S: "Top",     e: "bottom",  E: "Bottom", c: "middle", m: "center" };
		} else {
			S.AXIS = { B: "Y",      L: "X",      PM: -1 };
			S.BASE = { b: "right",  B: "Right",  a: "left",   A: "Left",   s: "top",     S: "Top",     e: "bottom",  E: "Bottom", c: "middle", m: "center" };
		}
	} else {
		/**/S.SIZE = { b: "width",  B: "Width",  l: "height", L: "Height", w: "breadth", W: "Breadth", h: "length",  H: "Length" };
		/**/S.AXIS = { B: "X",      L: "Y",      PM: +1 };
		if(S.PPD == "ltr") {
			S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "left",    S: "Left",    e: "right",   E: "Right",  c: "center", m: "middle" };
		} else {
			S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "right",   S: "Right",   e: "left",    E: "Left",   c: "center", m: "middle" };
		}
	}

	// Root Class
	if(PrevRVM != S.RVM) { sML.replaceClass(O.HTML, "view-"   + PrevRVM, "view-"   + S.RVM ); }
	if(PrevPPD != S.PPD) { sML.replaceClass(O.HTML, "page-"   + PrevPPD, "page-"   + S.PPD ); }
	if(PrevSLA != S.SLA) { sML.replaceClass(O.HTML, "spread-" + PrevSLA, "spread-" + S.SLA ); }
	if(PrevSLD != S.SLD) { sML.replaceClass(O.HTML, "spread-" + PrevSLD, "spread-" + S.SLD ); }

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Operation Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------


O.Log = ((!parent || parent == window) && console && console.log);


O.log = function(Lv, Message, ShowStatus) {
	if(!O.Log || !Message || typeof Message != "string") return;
	if(ShowStatus) O.updateStatus(Message);
	if(O.SmartPhone) return;
	switch(Lv) {
		case 0: Message = "[ERROR] " + Message; break;
		case 1: Message = "-------- " + Message + " --------"; break;
		case 2: Message = Message; break;
		case 3: Message = " - " + Message; break;
		case 4: Message = "   . " + Message; break;
	}
	console.log('BiB/i: ' + Message);
};


O.updateStatus = function(Message) {
	if(!O.SmartPhone) {
		if(O.statusClearer) clearTimeout(O.statusClearer);
		window.status = 'BiB/i: ' + Message;
		O.statusClearer = setTimeout(function() { window.status = ""; }, 3210);
	}
	E.dispatch("bibi:updateStatus", Message);
};


O.startLoading = function() {
	sML.addClass(O.HTML, "wait-please");
	E.dispatch("bibi:startLoading");
};


O.stopLoading = function() {
	sML.removeClass(O.HTML, "wait-please");
	E.dispatch("bibi:stopLoading");
};


O.error = function(Message) {
	O.stopLoading();
	O.log(0, Message);
	E.dispatch("bibi:error", Message);
};


O.apply = function(From, To) {
	for(var Property in From) if(typeof To[Property] != "function" && typeof From[Property] != "function") To[Property] = From[Property];
};


O.download = function(URI, MimeType) {
	return new Promise(function(resolve, reject) {
		var XHR = new XMLHttpRequest();
		if(MimeType) XHR.overrideMimeType(MimeType);
		XHR.open('GET', URI, true);
		XHR.onloadend = function() {
			if(XHR.status !== 200) {
				var ErrorMessage = 'XHR HTTP status: ' + XHR.status + ' "' + URI + '"';
				O.error(ErrorMessage);
				reject(new Error(ErrorMessage));
				return;
			}
			resolve(XHR);
		};
		XHR.send(null);
	});
};


O.requestDocument = function(Path) {
	var IsXML = /\.(xml|opf|ncx)$/i.test(Path);
	var XHR, Doc;
	return (
		!B.Zipped
		? O.download(B.Path + "/" +  Path).then(function(ResolvedXHR) {
			XHR = ResolvedXHR;
			if(!IsXML) Doc = XHR.responseXML;
			return Doc;
		})
		: Promise.resolve(Doc)
	).then(function(Doc) {
		if(Doc) return Doc;
		var DocText = !B.Zipped ? XHR.responseText : B.Files[Path];
		Doc = sML.create("object", { innerHTML: IsXML ? O.toBibiXML(DocText) : DocText });
		if(IsXML) sML.each([Doc].concat(sML.toArray(Doc.getElementsByTagName("*"))), function() {
			this.getElementsByTagName = function(TagName) {
				return this.querySelectorAll("bibi_" + TagName.replace(/:/g, "_"));
			}
		});
		if(!Doc || !Doc.childNodes || !Doc.childNodes.length) return O.error('Invalid Content. - "' + Path + '"');
		return Doc;
	});
};


O.openDocument = function(Path, Option) {
	if(!Option || typeof Option != "object" || typeof Option.then != "function") Option = { then: function() { return false; } };
	O.requestDocument(Path).then(Option.then);
};


O.getLogo = function(Setting) {
	var Logo = sML.UA.InternetExplorer < 9 ? [
		'<span class="bibi-type-B">B</span>',
		'<span class="bibi-type-i">i</span>',
		'<span class="bibi-type-B">B</span>',
		'<span class="bibi-type-slash">/</span>',
		'<span class="bibi-type-i">i</span>'
	].join("") : '<img alt="BiB/i" src="../../bib/i/res/images/bibi-logo_' + Setting.Color + '.png" />';
	return [
		'<', (Setting.Linkify ? 'a' : 'span'), ' class="bibi-logo"', (Setting.Linkify ? ' href="http://bibi.epub.link/" target="_blank" title="BiB/i | Web Site"' : ''), '>',
		Logo,
		'</', (Setting.Linkify ? 'a' : 'span') , '>'
	].join("");
};

O.getPath = function(Path) {
	for(var i = 1; i < arguments.length; i++) arguments[0] += "/" + arguments[i];
	arguments[0].replace(/^([a-zA-Z]+:\/\/[^\/]+)?\/*(.*)$/, function() { Path = [arguments[1], arguments[2]] });
	while(/([^:\/])\/{2,}/.test(Path[1])) Path[1] = Path[1].replace(/([^:\/])\/{2,}/g, "$1/");
	while(        /\/\.\//.test(Path[1])) Path[1] = Path[1].replace(        /\/\.\//g, "/");
	while(/[^\/]+\/\.\.\//.test(Path[1])) Path[1] = Path[1].replace(/[^\/]+\/\.\.\//g, "");
	                                      Path[1] = Path[1].replace(     /^(\.*\/)+/g, "");
	return Path[0] ? Path.join("/") : Path[1];
};


O.toBibiXML = function(XML) {
	return XML.replace(
		/<\?[^>]*?\?>/g, ""
	).replace(
		/<(\/?)([\w\d]+):/g, "<$1$2_"
	).replace(
		/<(\/?)(opf_)?([^!\?\/ >]+)/g, "<$1bibi_$3"
	).replace(
		/<([\w\d_]+) ([^>]+?)\/>/g, "<$1 $2></$1>"
	);
};


O.isBin = function(T) {
	return /\.(gif|jpe?g|png|ttf|otf|woff|mp[g34]|m4[av]|ogg|webm|pdf)$/i.test(T);
};


O.ContentTypeList = {
	"image/gif"             :   /\.gif$/i,
	"image/png"             :   /\.png$/i,
	"image/jpeg"            : /\.jpe?g$/i,
	"image/svg+xml"         :   /\.svg$/i,
	"video/mp4"             :   /\.mp4$/i,
	"video/webm"            :  /\.webm$/i,
	"audio/mpeg"            :   /\.mp3$/i,
	"audio/mp4"             :   /\.mp4$/i,
	"font/truetype"         :   /\.ttf$/i,
	"font/opentype"         :   /\.otf$/i,
	"font/woff"             :  /\.woff$/i,
	"text/css"              :   /\.css$/i,
	"text/javascript"       :    /\.js$/i,
	"text/html"             : /\.html?$/i,
	"application/xhtml+xml" : /\.xhtml$/i,
	"application/xml"       :   /\.xml$/i,
	"application/pdf"       :   /\.pdf$/i
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events - Special Thanks: @KitaitiMakoto & @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------

E.Binded = {};

E.add = function(Name, Listener, UseCapture) {
	if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function") return false;
	if(!Listener.bibiEventListener) Listener.bibiEventListener = function(Eve) { return Listener.call(document, Eve.detail); };
	document.addEventListener(Name, Listener.bibiEventListener, UseCapture);
	return Listener;
};

E.remove = function(Name, Listener) {
	if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function" || typeof Listener.bibiEventListener != "function") return false;
	document.removeEventListener(Name, Listener.bibiEventListener);
	return true;
};

E.bind = function(Name, Fn) {
	if(typeof Name != "string" || typeof Fn != "function") return false;
	if(!(E.Binded[Name] instanceof Array)) E.Binded[Name] = [];
	E.Binded[Name].push(Fn);
	return {
		Name: Name,
		Index: E.Binded[Name].length - 1,
		Function: Fn
	};
};

E.unbind = function(Param) { // or E.unbined(Name, Fn);
	if(!Param) return false;
	if(typeof arguments[0] == "string" && typeof arguments[1] == "function") Param = { Name: arguments[0], Function: arguments[1] };
	if(typeof Param != "object" || typeof Param.Name != "string" || !(E.Binded[Param.Name] instanceof Array)) return false;
	if(typeof Param.Index == "number") {
		if(typeof E.Binded[Param.Name][Param.Index] != "function") return false;
		E.Binded[Param.Name][Param.Index] = undefined;
		return true;
	}
	if(typeof Param.Function == "function") {
		var Deleted = false;
		for(var i = 0, L = E.Binded[Param.Name].length; i < L; i++) {
			if(E.Binded[Param.Name][i] == Param.Function) {
				E.Binded[Param.Name][i] = undefined;
				Deleted = true;
			}
		}
		return Deleted;
	}
	return (delete E.Binded[Param.Name]);
};

E.dispatch = function(Name, Detail) {
	if(E.Binded[Name] instanceof Array) {
		for(var i = 0, L = E.Binded[Name].length; i < L; i++) {
			if(typeof E.Binded[Name][i] == "function") E.Binded[Name][i].call(bibi, Detail);
		}
	}
	return document.dispatchEvent(new CustomEvent(Name, { detail: Detail }));
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Messages - Special Thanks @KitaitiMakoto

//----------------------------------------------------------------------------------------------------------------------------------------------

M.post = function(Message, TargetOrigin) {
	if(!O.WindowEmbedded) return false;
	if(typeof Message != "string" || !Message) return false;
	if(typeof TargetOrigin != "string" || !TargetOrigin) TargetOrigin = "*";
	return window.parent.postMessage(Message, TargetOrigin);
};

M.receive = function(Data) {
	Data = JSON.parse(Data);
	if(typeof Data != "object" || !Data) return false;
	for(var EventName in Data) E.dispatch((!/^bibi:command:[\w\d]+$/.test(EventName) ? "bibi:command:" : "") + EventName, Data[EventName]);
	return true;
};

M.gate = function(Eve) {
	for(var i = 0, L = S["trustworthy-origins"].length; i < L; i++) if(S["trustworthy-origins"][i] == Eve.origin) return M.receive(Eve.data);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Extentions - Special Thanks @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------

X.add = function(Extention) {
	if(!Extention || typeof Extention != "object") return function() { return false; };
	if(typeof Extention["name"] != "string")       return function() { E.bind("bibi:welcome", function() { O.error('Extention name is invalid.'); }); };
	if(X[Extention["name"]])                       return function() { E.bind("bibi:welcome", function() { O.error('Extention name "' + Extention["name"] + '" is reserved or already taken.'); }); };
	if(typeof Extention["description"] != "string") Extention["decription"] = "";
	if(typeof Extention["author"] != "string") Extention["author"] = "";
	if(typeof Extention["version"] != "string") Extention["version"] = "";
	if(typeof Extention["build"] != "string") Extention["build"] = "";
	X[Extention["name"]] = Extention;
	return function(init) { E.bind("bibi:welcome", function() { init.call(Extention); }); };
};

Bibi.x = X.add;



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Ready?

//----------------------------------------------------------------------------------------------------------------------------------------------




sML.ready(Bibi.welcome);




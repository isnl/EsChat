!function(global){"use strict";var util=newUtil(),inliner=newInliner(),fontFaces=newFontFaces(),images=newImages(),defaultOptions={imagePlaceholder:void 0,cacheBust:!1},domtoimage={toSvg:toSvg,toPng:toPng,toJpeg:toJpeg,toBlob:toBlob,toPixelData:toPixelData,impl:{fontFaces:fontFaces,images:images,util:util,inliner:inliner,options:{}}};function toSvg(node,options){return copyOptions(options=options||{}),Promise.resolve(node).then((function(node){return cloneNode(node,options.filter,!0)})).then(embedFonts).then(inlineImages).then(applyOptions).then((function(clone){return makeSvgDataUri(clone,options.width||util.width(node),options.height||util.height(node))}));function applyOptions(clone){return options.bgcolor&&(clone.style.backgroundColor=options.bgcolor),options.width&&(clone.style.width=options.width+"px"),options.height&&(clone.style.height=options.height+"px"),options.style&&Object.keys(options.style).forEach((function(property){clone.style[property]=options.style[property]})),clone}}function toPixelData(node,options){return draw(node,options||{}).then((function(canvas){return canvas.getContext("2d").getImageData(0,0,util.width(node),util.height(node)).data}))}function toPng(node,options){return draw(node,options||{}).then((function(canvas){return canvas.toDataURL()}))}function toJpeg(node,options){return draw(node,options=options||{}).then((function(canvas){return canvas.toDataURL("image/jpeg",options.quality||1)}))}function toBlob(node,options){return draw(node,options||{}).then(util.canvasToBlob)}function copyOptions(options){void 0===options.imagePlaceholder?domtoimage.impl.options.imagePlaceholder=defaultOptions.imagePlaceholder:domtoimage.impl.options.imagePlaceholder=options.imagePlaceholder,void 0===options.cacheBust?domtoimage.impl.options.cacheBust=defaultOptions.cacheBust:domtoimage.impl.options.cacheBust=options.cacheBust}function draw(domNode,options){return toSvg(domNode,options).then(util.makeImage).then(util.delay(100)).then((function(image){var canvas=newCanvas(domNode);return canvas.getContext("2d").drawImage(image,0,0),canvas}));function newCanvas(domNode){var canvas=document.createElement("canvas"),ctx;(ctx=canvas.getContext("2d")).mozImageSmoothingEnabled=!1,ctx.webkitImageSmoothingEnabled=!1,ctx.msImageSmoothingEnabled=!1,ctx.imageSmoothingEnabled=!1;var scale=options.scale||2,ctx;(canvas.width=options.width*scale||util.width(domNode),canvas.height=options.height*scale||util.height(domNode),ctx.scale(scale,scale),options.bgcolor)&&((ctx=canvas.getContext("2d")).fillStyle=options.bgcolor,ctx.fillRect(0,0,canvas.width,canvas.height));return canvas}}function cloneNode(node,filter,root){return root||!filter||filter(node)?Promise.resolve(node).then(makeNodeCopy).then((function(clone){return cloneChildren(node,clone,filter)})).then((function(clone){return processClone(node,clone)})):Promise.resolve();function makeNodeCopy(node){return node instanceof HTMLCanvasElement?util.makeImage(node.toDataURL()):node.cloneNode(!1)}function cloneChildren(original,clone,filter){var children=original.childNodes;return 0===children.length?Promise.resolve(clone):cloneChildrenInOrder(clone,util.asArray(children),filter).then((function(){return clone}));function cloneChildrenInOrder(parent,children,filter){var done=Promise.resolve();return children.forEach((function(child){done=done.then((function(){return cloneNode(child,filter)})).then((function(childClone){childClone&&parent.appendChild(childClone)}))})),done}}function processClone(original,clone){return clone instanceof Element?Promise.resolve().then(cloneStyle).then(clonePseudoElements).then(copyUserInput).then(fixSvg).then((function(){return clone})):clone;function cloneStyle(){function copyStyle(source,target){function copyProperties(source,target){util.asArray(source).forEach((function(name){target.setProperty(name,source.getPropertyValue(name),source.getPropertyPriority(name))}))}source.cssText?target.cssText=source.cssText:copyProperties(source,target)}copyStyle(window.getComputedStyle(original),clone.style)}function clonePseudoElements(){function clonePseudoElement(element){var style=window.getComputedStyle(original,element),content=style.getPropertyValue("content");if(""!==content&&"none"!==content){var className=util.uid();clone.className=clone.className+" "+className;var styleElement=document.createElement("style");styleElement.appendChild(formatPseudoElementStyle(className,element,style)),clone.appendChild(styleElement)}function formatPseudoElementStyle(className,element,style){var selector="."+className+":"+element,cssText=style.cssText?formatCssText(style):formatCssProperties(style);return document.createTextNode(selector+"{"+cssText+"}");function formatCssText(style){var content=style.getPropertyValue("content");return style.cssText+" content: "+content+";"}function formatCssProperties(style){return util.asArray(style).map(formatProperty).join("; ")+";";function formatProperty(name){return name+": "+style.getPropertyValue(name)+(style.getPropertyPriority(name)?" !important":"")}}}}[":before",":after"].forEach((function(element){clonePseudoElement(element)}))}function copyUserInput(){original instanceof HTMLTextAreaElement&&(clone.innerHTML=original.value),original instanceof HTMLInputElement&&clone.setAttribute("value",original.value)}function fixSvg(){clone instanceof SVGElement&&(clone.setAttribute("xmlns","http://www.w3.org/2000/svg"),clone instanceof SVGRectElement&&["width","height"].forEach((function(attribute){var value=clone.getAttribute(attribute);value&&clone.style.setProperty(attribute,value)})))}}}function embedFonts(node){return fontFaces.resolveAll().then((function(cssText){var styleNode=document.createElement("style");return node.appendChild(styleNode),styleNode.appendChild(document.createTextNode(cssText)),node}))}function inlineImages(node){return images.inlineAll(node).then((function(){return node}))}function makeSvgDataUri(node,width,height){return Promise.resolve(node).then((function(node){return node.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),(new XMLSerializer).serializeToString(node)})).then(util.escapeXhtml).then((function(xhtml){return'<foreignObject x="0" y="0" width="100%" height="100%">'+xhtml+"</foreignObject>"})).then((function(foreignObject){return'<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'+foreignObject+"</svg>"})).then((function(svg){return"data:image/svg+xml;charset=utf-8,"+svg}))}function newUtil(){return{escape:escape,parseExtension:parseExtension,mimeType:mimeType,dataAsUrl:dataAsUrl,isDataUrl:isDataUrl,canvasToBlob:canvasToBlob,resolveUrl:resolveUrl,getAndEncode:getAndEncode,uid:uid(),delay:delay,asArray:asArray,escapeXhtml:escapeXhtml,makeImage:makeImage,width:width,height:height};function mimes(){var WOFF="application/font-woff",JPEG="image/jpeg";return{woff:WOFF,woff2:WOFF,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:JPEG,jpeg:JPEG,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml"}}function parseExtension(url){var match=/\.([^\.\/]*?)$/g.exec(url);return match?match[1]:""}function mimeType(url){var extension=parseExtension(url).toLowerCase();return mimes()[extension]||""}function isDataUrl(url){return-1!==url.search(/^(data:)/)}function toBlob(canvas){return new Promise((function(resolve){for(var binaryString=window.atob(canvas.toDataURL().split(",")[1]),length=binaryString.length,binaryArray=new Uint8Array(length),i=0;i<length;i++)binaryArray[i]=binaryString.charCodeAt(i);resolve(new Blob([binaryArray],{type:"image/png"}))}))}function canvasToBlob(canvas){return canvas.toBlob?new Promise((function(resolve){canvas.toBlob(resolve)})):toBlob(canvas)}function resolveUrl(url,baseUrl){var doc=document.implementation.createHTMLDocument(),base=doc.createElement("base");doc.head.appendChild(base);var a=doc.createElement("a");return doc.body.appendChild(a),base.href=baseUrl,a.href=url,a.href}function uid(){var index=0;return function(){return"u"+fourRandomChars()+index++;function fourRandomChars(){return("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)}}}function makeImage(uri){return new Promise((function(resolve,reject){var image=new Image;image.onload=function(){resolve(image)},image.onerror=reject,image.src=uri}))}function getAndEncode(url){var TIMEOUT=3e4;return domtoimage.impl.options.cacheBust&&(url+=(/\?/.test(url)?"&":"?")+(new Date).getTime()),new Promise((function(resolve){var request=new XMLHttpRequest,placeholder;if(request.onreadystatechange=done,request.ontimeout=timeout,request.responseType="blob",request.timeout=3e4,request.open("GET",url,!0),request.send(),domtoimage.impl.options.imagePlaceholder){var split=domtoimage.impl.options.imagePlaceholder.split(/,/);split&&split[1]&&(placeholder=split[1])}function done(){if(4===request.readyState)if(200===request.status){var encoder=new FileReader;encoder.onloadend=function(){var content=encoder.result.split(/,/)[1];resolve(content)},encoder.readAsDataURL(request.response)}else placeholder?resolve(placeholder):fail("cannot fetch resource: "+url+", status: "+request.status)}function timeout(){placeholder?resolve(placeholder):fail("timeout of 30000ms occured while fetching resource: "+url)}function fail(message){console.error(message),resolve("")}}))}function dataAsUrl(content,type){return"data:"+type+";base64,"+content}function escape(string){return string.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1")}function delay(ms){return function(arg){return new Promise((function(resolve){setTimeout((function(){resolve(arg)}),ms)}))}}function asArray(arrayLike){for(var array=[],length=arrayLike.length,i=0;i<length;i++)array.push(arrayLike[i]);return array}function escapeXhtml(string){return string.replace(/#/g,"%23").replace(/\n/g,"%0A")}function width(node){var leftBorder=px(node,"border-left-width"),rightBorder=px(node,"border-right-width");return node.scrollWidth+leftBorder+rightBorder}function height(node){var topBorder=px(node,"border-top-width"),bottomBorder=px(node,"border-bottom-width");return node.scrollHeight+topBorder+bottomBorder}function px(node,styleProperty){var value=window.getComputedStyle(node).getPropertyValue(styleProperty);return parseFloat(value.replace("px",""))}}function newInliner(){var URL_REGEX=/url\(['"]?([^'"]+?)['"]?\)/g;return{inlineAll:inlineAll,shouldProcess:shouldProcess,impl:{readUrls:readUrls,inline:inline}};function shouldProcess(string){return-1!==string.search(URL_REGEX)}function readUrls(string){for(var result=[],match;null!==(match=URL_REGEX.exec(string));)result.push(match[1]);return result.filter((function(url){return!util.isDataUrl(url)}))}function inline(string,url,baseUrl,get){return Promise.resolve(url).then((function(url){return baseUrl?util.resolveUrl(url,baseUrl):url})).then(get||util.getAndEncode).then((function(data){return util.dataAsUrl(data,util.mimeType(url))})).then((function(dataUrl){return string.replace(urlAsRegex(url),"$1"+dataUrl+"$3")}));function urlAsRegex(url){return new RegExp("(url\\(['\"]?)("+util.escape(url)+")(['\"]?\\))","g")}}function inlineAll(string,baseUrl,get){return nothingToInline()?Promise.resolve(string):Promise.resolve(string).then(readUrls).then((function(urls){var done=Promise.resolve(string);return urls.forEach((function(url){done=done.then((function(string){return inline(string,url,baseUrl,get)}))})),done}));function nothingToInline(){return!shouldProcess(string)}}}function newFontFaces(){return{resolveAll:resolveAll,impl:{readAll:readAll}};function resolveAll(){return readAll(document).then((function(webFonts){return Promise.all(webFonts.map((function(webFont){return webFont.resolve()})))})).then((function(cssStrings){return cssStrings.join("\n")}))}function readAll(){return Promise.resolve(util.asArray(document.styleSheets)).then(getCssRules).then(selectWebFontRules).then((function(rules){return rules.map(newWebFont)}));function selectWebFontRules(cssRules){return cssRules.filter((function(rule){return rule.type===CSSRule.FONT_FACE_RULE})).filter((function(rule){return inliner.shouldProcess(rule.style.getPropertyValue("src"))}))}function getCssRules(styleSheets){var cssRules=[];return styleSheets.forEach((function(sheet){try{util.asArray(sheet.cssRules||[]).forEach(cssRules.push.bind(cssRules))}catch(e){console.log("Error while reading CSS rules from "+sheet.href,e.toString())}})),cssRules}function newWebFont(webFontRule){return{resolve:function resolve(){var baseUrl=(webFontRule.parentStyleSheet||{}).href;return inliner.inlineAll(webFontRule.cssText,baseUrl)},src:function(){return webFontRule.style.getPropertyValue("src")}}}}}function newImages(){return{inlineAll:inlineAll,impl:{newImage:newImage}};function newImage(element){return{inline:inline};function inline(get){return util.isDataUrl(element.src)?Promise.resolve():Promise.resolve(element.src).then(get||util.getAndEncode).then((function(data){return util.dataAsUrl(data,util.mimeType(element.src))})).then((function(dataUrl){return new Promise((function(resolve,reject){element.onload=resolve,element.onerror=reject,element.src=dataUrl}))}))}}function inlineAll(node){return node instanceof Element?inlineBackground(node).then((function(){return node instanceof HTMLImageElement?newImage(node).inline():Promise.all(util.asArray(node.childNodes).map((function(child){return inlineAll(child)})))})):Promise.resolve(node);function inlineBackground(node){var background=node.style.getPropertyValue("background");return background?inliner.inlineAll(background).then((function(inlined){node.style.setProperty("background",inlined,node.style.getPropertyPriority("background"))})).then((function(){return node})):Promise.resolve(node)}}}"undefined"!=typeof module?module.exports=domtoimage:global.domtoimage=domtoimage}(this);
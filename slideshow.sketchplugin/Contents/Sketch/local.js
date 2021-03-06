var sketch = require('sketch')
var document = sketch.getSelectedDocument()
var page = document.selectedPage
var docName = context.document.cloudName()
var UI = require('sketch/ui')

var artboards = page.layers.filter(function (layer) {
  return layer.type === 'Artboard'
})
var spec=[];
var slideshow={
slides : spec,
properties:{
 name:String(docName),
 height:String(artboards[0].frame.height),
 width:String(artboards[0].frame.width)
}}

artboards.forEach(function(layer){
symbolDetach(layer, layer.layers)
function symbolDetach(data,x){
 for (var i = 0; i < x.length; i++) {
    var layerType = x[i].type
    if(layerType=="SymbolInstance"){
    var temp = x[i].duplicate()
    var tempGroup = temp.detach()
    tempGroup.name="temp"
    symbolDetach(tempGroup,tempGroup.layers)
    }
 }
}

});


artboards.forEach(function(layer){
var slideSin=[]
var baseSlide = {
 background : String(layer.sketchObject.backgroundColor().immutableModelObject().hexValue()),
 type:"base"
}
slideSin.push(baseSlide)
repeat(layer, layer.layers);

function repeat(data, x) {
  for (var i = 0; i < x.length; i++) {
    var layerID = x[i].id
    var layerType = x[i].type
    var isSlicedGroup;
    if(layerType=="Group" && x[i].sketchObject.isLayerExportable()=="1")
    { isSlicedGroup = true } else { isSlicedGroup = false }
    if(layerType=="Text"){
    var element={
    "name":String(x[i].sketchObject.name()),
    "posX":String(x[i].sketchObject.absoluteRect().rulerX()),
    "posY":String(x[i].sketchObject.absoluteRect().rulerY()),
    "width":String(x[i].frame.width),
    "height":String(x[i].frame.height),
    "opacity":String(x[i].sketchObject.style().contextSettings().opacity()),
    "type":String(layerType)
    }
    var alignment;
    switch (x[i].sketchObject.textAlignment()) {
      case 0:
          alignment = "left";
          break;
      case 1:
          alignment = "right";
          break;
      case 2:
          alignment = "center";
          break;
      case 3:
          alignment = "left";
    }


    element.text = {
    "font": String(x[i].sketchObject.font().fontName()),
    "value": String(x[i].text),
    "fontsize":String(x[i].sketchObject.fontSize()),
    "leading":String(x[i].sketchObject.lineHeight()),
    "kerning":String(x[i].sketchObject.kerning()),
    "paragraph":String(x[i].sketchObject.paragraphStyle().paragraphSpacing()),
    "alignment":String(alignment),
    "transform":String(x[i].sketchObject.styleAttributes()["MSAttributedStringTextTransformAttribute"]),
"color":String(x[i].sketchObject.textColor().immutableModelObject().hexValue()),
    }
    slideSin.push(element)
    }

    if(layerType=="Image" || x[i].sketchObject.isLayerExportable()=="1" || layerType=="Shape"){
    var element={
    "name":String(x[i].sketchObject.name()),
    "posX":String(x[i].sketchObject.absoluteRect().rulerX()),
    "posY":String(x[i].sketchObject.absoluteRect().rulerY()),
    "width":String(x[i].frame.width),
    "height":String(x[i].frame.height),
    "type":String(layerType)
    }
    element.image = {
    "path":"img/"+layerID+'.png'
    }
    sketch.export(x[i], {
      formats: 'png',
     output:'folderpath/temp/img/',
     "use-id-for-name": true
    })
    slideSin.push(element)
    }


    if (x[i].layers && x[i].layers.length > 0 && isSlicedGroup=="0") {
      repeat(data, x[i].layers)
    }
  }

}
spec.push(slideSin)

})
log(JSON.stringify(slideshow))

var Handlebars = global['hbs'];
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['tk-editable-label'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<label class=\"tk-editable-label\">\n\n</label>";
  });
templates['tk-selectable-label'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<label class=\"tk-selectable-label\">\n</label>";
  });
templates['tk-spin'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div style=\"width:";
  if (stack1 = helpers.width) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.width; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ";height:";
  if (stack1 = helpers.height) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.height; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ";\n        position: absolute;left:";
  if (stack1 = helpers.left) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.left; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ";top:";
  if (stack1 = helpers.top) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.top; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>";
  return buffer;
  });
})();
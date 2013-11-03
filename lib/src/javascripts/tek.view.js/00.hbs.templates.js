var Handlebars = global['hbs'];
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['tk-confirm-dialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"tk-confirm-dialog\" id=\"tk-confirm-dialog\">\n    <div class=\"tk-confirm-dialog-inner\">\n        <h2 class=\"tk-confirm-dialog-title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n        ";
  if (stack1 = helpers.sub_title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.sub_title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        <form>\n            <a href=\"javascript:void(0)\" class=\"tk-confirm-dialog-close-btn\"\n                    >&times;</a>\n\n            <p>\n\n                <input type=\"checkbox\" id=\"tk-confirm-dialog-check\"/>\n                <label for=\"tk-confirm-dialog-check\"><b>";
  if (stack1 = helpers.check_label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.check_label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b></label>\n            </p>\n            <input type=\"submit\" class=\"tk-danger-btn tk-wide-btn\"\n                   disabled=\"disabled\" value=\"";
  if (stack1 = helpers.btn_label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.btn_label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n        </form>\n    </div>\n</div>\n";
  return buffer;
  });
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
templates['tk-selectable-text-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n        <li class=\"tk-selectable-list-item\">\n            <a href=\"javascript:void(0)\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</a>\n        </li>\n    ";
  return buffer;
  }

  buffer += "<ul class=\"tk-selectable-text-list\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.candidates, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
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
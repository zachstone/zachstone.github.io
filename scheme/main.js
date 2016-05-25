
//************************************************
// LEXER/PARSER
//************************************************
var example = "(def x (+ 12 (str \"183872\")))"

var token_type = Object.freeze({
  open_paren: "open_paren",
  close_paren: "close_paren",
  symbol: "symbol",
  number: "number",
  string: "string",
  nil: "nil",
});

// takes a string and returns lexemes
function scan(text) {
  var lex_re = /[\(\)]|[a-zA-Z+-<>!?][a-zA-Z0-9+-<>!?]*|[0-9]+|\".*\"/g;
  return text.match(lex_re);
}

// takes a lexeme and returns a token
function tokenize(lexeme) {
  var sym_re = /^[a-zA-Z+\-<>!?][a-zA-Z0-9+\-<>!?]*$/;
  var num_re = /^[0-9]+$/;
  var str_re = /^\".*\"$/;
  if(lexeme === "(") {
    return {type: token_type.open_paren, value: lexeme};
  } else if(lexeme === ")") {
    return {type: token_type.close_paren, value: lexeme};
  } else if(sym_re.test(lexeme)) {
    return {type: token_type.symbol, value: lexeme};
  } else if(num_re.test(lexeme)) {
    return {type: token_type.number, value: parseInt(lexeme)};
  } else if(str_re.test(lexeme)) {
    return {type: token_type.string, value: lexeme};
  }
}

// takes a string and returns tokens
function lex(text) {
  return scan(text).map(tokenize);
}

// takes tokens, returns an ast
function parse(tokens) {
  var root_node = null;
  var current_node = null;
  var last_node = null;
  var sexpr_stack = [];
  var token = tokens[0];

  if(token.type == token_type.open_paren) {
    root_node = {car: null, cdr: null};
    current_node = root_node;
    sexpr_stack.push(root_node);
  }

  for(var i = 1; i < tokens.length; ++i) {
    token = tokens[i];

    if(token.type == token_type.open_paren) {
      current_node.car = {car: null, cdr: null};
      sexpr_stack.push(current_node);
      last_node = current_node;
      current_node = current_node.car;
    }
    else if(token.type == token_type.close_paren) {
      last_node.cdr = "nil";
      current_node = sexpr_stack.pop();

      if(current_node === root_node) {
        return root_node;
      }
      current_node.cdr = {car: null, cdr: null};
      last_node = current_node;
      current_node = current_node.cdr;
    }
    else {
      current_node.car = token.value;
      current_node.cdr = {car: null, cdr: null};
      last_node = current_node;
      current_node = current_node.cdr;
    }
  }

  return root_node;
}

//************************************************
// INTERPRETER
//************************************************

var scheme_type = Object.freeze({
  symbol: "symbol",
  number: "number",
  string: "string",
  function: "function",
  nil: "nil",
});

var sym_table = {
  "define": lib_define,
  "set!": lib_set,
  "+": lib_add,
  "-": lib_subtract,
  "car": lib_car,
  "cdr": lib_cdr,
  "get": lib_get,
  "quote": lib_quote,
  "eval": lib_eval,
  //"pi": 3.14,
  //"let-rec": 32,
};

//************************************************
// LIBRARY
//************************************************

function lib_define(symbol, value) {
  return sym_table[symbol] = value;
  /* if(sym_table.hasOwnProperty(symbol)) {} */
}

function lib_set(symbol, value) {
  return sym_table[symbol] = value;
}

// TEMPORARY, to check values
function lib_get(symbol) {
  return sym_table[symbol];
}

function lib_car(node) {
  return node.car;
}

function lib_cdr(node) {
  return node.cdr;
}

function lib_add() {
  return Array.from(arguments).reduce(function(pv, cv, ci, ar) {return pv + cv;}, 0);
}

function lib_subtract() {
  return Array.from(arguments).reduce(function(pv, cv, ci, ar) {return pv - cv;});
}

function lib_quote() {
  return 0;
}

function lib_eval(node) {
  //return sym_table[node.car](node.cdr.car, node.cdr.cdr.car);
  list = scheme_toarray(node);
  return sym_table[list.shift()].apply(this, list);
}

function scheme_eval(str) {
  return lib_eval(parse(lex(str)));
}

function scheme_toarray(node) {
  list = [];
  cur_node = node;
  while(cur_node != "nil") {
    list.push(cur_node.car);
    cur_node = cur_node.cdr;
  }
  return list;
}

//************************************************
// DOM MANIPULATION
//************************************************

var repl_session = [];
var cursor = 0;

function append_session(input, output) {
  repl_session.push({in: input, out: output});
}

function update_console() {
  var recent_lines = repl_session.slice(-10);
  var console_string = "<br />".repeat(20 - (recent_lines.length * 2));
  console_string += recent_lines.reduce(
    function(pv, cv, ci, ar) {
      return pv + "> " + cv.in + "<br />" + cv.out + "<br />";
    }, ""
  );
  document.getElementById("output").innerHTML = console_string;
}

function debug_console() {
  var input = document.getElementById("input").value;
  var output = scheme_eval(input);
  console.log("Raw Input:", input);
  console.log("Scanner:", scan(input));
  console.log("Lexer:", JSON.stringify(lex(input)));
  console.log("Parser:", JSON.stringify(parse(lex(input))));
  console.log("Result:", output);
  append_console("> " + input);
  append_console(output);
  document.getElementById("output").innerHTML = console_window;
}


function key_handler(event) {
  switch(event.code) {
    case "Enter":
      evaluate(document.getElementById("input").value);
      document.getElementById("input").value = "";
      break;
    case "BracketLeft":
      document.getElementById("input").value = repl_session[repl_session.length - 1].in;
      break;
  }
  /*
  // ENTER
  if(event.keyCode === 13) {
    evaluate(document.getElementById("input").value);
    document.getElementById("input").value = "";
  }
  // UP
  if(event.keyCode === 27) {
    document.getElementById("input").value = repl_session[-1].in;
  }
  */
}

function evaluate(input) {
  append_session(input, scheme_eval(input));
  update_console();
}

(function main() {
  update_console();
  //document.getElementById("eval").onclick = eval_code;
  document.getElementById("input").addEventListener("keypress", key_handler);
  document.getElementById("shell").addEventListener("click", function(event) {
    document.getElementById("input").focus()
  });
})();

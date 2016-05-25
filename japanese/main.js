//ichidan("hanasu", )

//kaeru can be godan and ichidan

var verbs = {
  godan : [
    "kau",
    "matsu",
    "shiru",
    "kiku",
    "kagu",
    "shinu",
    "yobu",
    "nomu",
    "kesu",
  ],
  ichidan : [
    "miru",
    "neru",
  ],
  irregular : [
    "suru",
    "kuru",
  ],
}

var forms = {
  negative : "a",
  infinitive : "i",
  dictionary : "u",
  imperative : "e",
  volitional : "ou",
  conditional : "eba",
}

var godan_conjugations = {
  //present indicative
  present : [forms.dictionary, ""], //does nothing
  negative : [forms.negative, "nai"],
  formal : [forms.infinitive, "masu"],
  negative_formal : [forms.infinitive, "masen"],

  //past indicative

}

var ichidan_conjugations = {
  present : "ru",
  negative : "nai",
  formal : "masu",
  negative_formal : "masen",
}

function godan_form_change(suffix, form) {
  switch(suffix) {
    case "tsu":
      var temp_suffix = "tu"; //makes the suffix easier to work with.
      var temp = temp_suffix.replace(/u$/i, form);
      if(temp == "ti") return "chi";
      if(temp == "tu") return "tsu";
      return temp;
      break;

    case "su":
      var temp = suffix.replace(/u$/i, form);
      if(temp == "si") return "shi";
      return temp;
      break;

    case "u":
      var temp = suffix.replace(/u$/i, form);
      if(temp == "a") return "wa";
      return temp;
      break;

    default:
      return suffix.replace(/u$/i, form);
  }
}

function godan_split(verb) {
  return verb.match(/(.*?)(u|ku|gu|su|tsu|nu|bu|mu|ru)$/i).splice(1, 3);
}

function ichidan_split(verb) {
  return verb.match(/(.*)ru$/i)[1];
}

function godan_conjugate(verb, conjugation) {
  var parts = godan_split(verb);
  return parts[0] + godan_form_change(parts[1], conjugation[0]) + conjugation[1];
}

function ichidan_conjugate(verb, conjugation) {
  var parts = ichidan_split(verb);
  return parts + conjugation;
}

function all_conjugations(verb, conj_func, conj_dict) {
  return {
    present : conj_func(verb, conj_dict.present),
    negative : conj_func(verb, conj_dict.negative),
    formal : conj_func(verb, conj_dict.formal),
    negative_formal : conj_func(verb, conj_dict.negative_formal)
  };
}

function all_godan(verb) {
  return all_conjugations(verb, godan_conjugate, godan_conjugations);
}

function all_ichidan(verb) {
  return all_conjugations(verb, ichidan_conjugate, ichidan_conjugations);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function conjugate(conj_func) {
  var conj = conj_func(document.getElementById("verb").value);
  document.getElementById("conj").innerHTML =
    "present -> " + conj.present + "<br />" +
    "negative -> " + conj.negative + "<br />" +
    "formal -> " + conj.formal + "<br />" +
    "negative formal -> " + conj.negative_formal + "<br />";
}

(function main() {
  document.getElementById("ichidan").addEventListener("click", function() {conjugate(all_ichidan)});
  document.getElementById("godan").addEventListener("click", function() {conjugate(all_godan);});
})();
/*
exports.verbs = verbs;

exports.godan_conjugations = godan_conjugations;
exports.ichidan_conjugations = ichidan_conjugations;

exports.godan_form_change = godan_form_change;
exports.godan_conjugate = godan_conjugate;
exports.all_godan = all_godan;

exports.ichidan_conjugate = ichidan_conjugate;
exports.all_ichidan = all_ichidan;
*/

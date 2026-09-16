  // ======================================================================
  // DECK DATA — add a paradigm by adding an entry here. Nothing below
  // this block knows anything about cases, genders, persons or tenses.
  //   dims  : the parsing dimensions, in the order they are spoken
  //   rows  : one entry per slot; keys match the dim keys
  //   table : how to lay the reference chart out (rows / columns / split)
  // ======================================================================
  var CASES = ["Nominative","Genitive","Dative","Accusative"];
  var NUMS  = ["Singular","Plural"];
  var GENS  = ["Masculine","Feminine","Neuter"];

  function dimCase(){ return {k:"cs",label:"Case",values:CASES}; }
  function dimNum(){  return {k:"nu",label:"Number",values:NUMS}; }
  function dimGen(v){ return {k:"gd",label:"Gender",values:v||GENS}; }

  // compact row builder: r(case, number, gender, form, gloss, extra)
  function r(cs,nu,gd,form,gloss,extra){
    return {cs:cs,nu:nu,gd:gd,form:form,gloss:gloss,extra:extra};
  }

  // noun row: n(case, number, paradigm-value, form, gloss)
  function n(cs,nu,pd,form,gloss){ return {cs:cs,nu:nu,pd:pd,form:form,gloss:gloss}; }
  // verb row: v(person, number, form, gloss) — plus optional verb-paradigm value
  // ex/exEn are optional (2026-09-10, ninth pass) -- only the mi verbs deck uses
  // them directly here, since its three verbs sit permanently side by side
  // rather than rotating; the six rotating verb decks get ex/exEn from
  // VERBSETS via rollVerbs() instead, same as nouns get theirs from rollNouns().
  function v(pn,nu,form,gloss,pd,ex,exEn){ return {pn:pn,nu:nu,form:form,gloss:gloss,pd:pd,ex:ex,exEn:exEn}; }

  var PERSONS = ["1st","2nd","3rd"];
  function dimPers(){ return {k:"pn",label:"Person",values:PERSONS}; }
  // a dim with ask:false is shown on the card but not asked in the Form → Parse pad
  function dimPara(label,values){ return {k:"pd",label:label,values:values,ask:false}; }

  var GROUPS = [
    {id:"pron", name:"Article & pronouns"},
    {id:"noun", name:"Nouns & adjectives"},
    {id:"verb", name:"Verbs"},
    {id:"prep", name:"Function words"}
  ];

  var DECKS = [
    {
      id:"art", group:"pron", tag:"definite article", cite:"", en:"the", name:"Definite Article", lemma:"ὁ ἡ τό", lesson:"1.2 →",
      dims:[dimCase(),dimNum(),dimGen()],
      table:{row:"cs",col:"gd",split:"nu"},
      note:"Sample nouns: λόγος (m), γραφή (f), ἔργον (n). The acute drops to a grave before the noun.",
      rows:[
        r("Nominative","Singular","Masculine","ὁ","the","ὁ λόγος"),
        r("Nominative","Singular","Feminine","ἡ","the","ἡ γραφή"),
        r("Nominative","Singular","Neuter","τό","the","τὸ ἔργον"),
        r("Genitive","Singular","Masculine","τοῦ","of the","τοῦ λόγου"),
        r("Genitive","Singular","Feminine","τῆς","of the","τῆς γραφῆς"),
        r("Genitive","Singular","Neuter","τοῦ","of the","τοῦ ἔργου"),
        r("Dative","Singular","Masculine","τῷ","to/for the","τῷ λόγῳ"),
        r("Dative","Singular","Feminine","τῇ","to/for the","τῇ γραφῇ"),
        r("Dative","Singular","Neuter","τῷ","to/for the","τῷ ἔργῳ"),
        r("Accusative","Singular","Masculine","τόν","the","τὸν λόγον"),
        r("Accusative","Singular","Feminine","τήν","the","τὴν γραφήν"),
        r("Accusative","Singular","Neuter","τό","the","τὸ ἔργον"),
        r("Nominative","Plural","Masculine","οἱ","the","οἱ λόγοι"),
        r("Nominative","Plural","Feminine","αἱ","the","αἱ γραφαί"),
        r("Nominative","Plural","Neuter","τά","the","τὰ ἔργα"),
        r("Genitive","Plural","Masculine","τῶν","of the","τῶν λόγων"),
        r("Genitive","Plural","Feminine","τῶν","of the","τῶν γραφῶν"),
        r("Genitive","Plural","Neuter","τῶν","of the","τῶν ἔργων"),
        r("Dative","Plural","Masculine","τοῖς","to/for the","τοῖς λόγοις"),
        r("Dative","Plural","Feminine","ταῖς","to/for the","ταῖς γραφαῖς"),
        r("Dative","Plural","Neuter","τοῖς","to/for the","τοῖς ἔργοις"),
        r("Accusative","Plural","Masculine","τούς","the","τοὺς λόγους"),
        r("Accusative","Plural","Feminine","τάς","the","τὰς γραφάς"),
        r("Accusative","Plural","Neuter","τά","the","τὰ ἔργα")
      ]
    },
    {
      id:"p12", group:"pron", tag:"personal pronoun", cite:"", en:"", name:"1st & 2nd Person Pronouns", lemma:"ἐγώ · σύ", lesson:"2.2, 2.3, 5.2, 5.3, 6.1, 6.2, 11.2, 11.3",
      dims:[dimCase(),dimNum(),{k:"pn",label:"Person",values:["1st","2nd"]}],
      table:{row:"cs",col:"pn",split:"nu"},
      note:"με, σε, μου, σου, μοι and σοι are enclitics — they carry no accent of their own.",
      rows:[
        {cs:"Nominative",nu:"Singular",pn:"1st",form:"ἐγώ",gloss:"I"},
        {cs:"Genitive",  nu:"Singular",pn:"1st",form:"μου",gloss:"of me, my"},
        {cs:"Dative",    nu:"Singular",pn:"1st",form:"μοι",gloss:"to/for me"},
        {cs:"Accusative",nu:"Singular",pn:"1st",form:"με",gloss:"me"},
        {cs:"Nominative",nu:"Singular",pn:"2nd",form:"σύ",gloss:"you"},
        {cs:"Genitive",  nu:"Singular",pn:"2nd",form:"σου",gloss:"of you, your"},
        {cs:"Dative",    nu:"Singular",pn:"2nd",form:"σοι",gloss:"to/for you"},
        {cs:"Accusative",nu:"Singular",pn:"2nd",form:"σε",gloss:"you"},
        {cs:"Nominative",nu:"Plural",pn:"1st",form:"ἡμεῖς",gloss:"we"},
        {cs:"Genitive",  nu:"Plural",pn:"1st",form:"ἡμῶν",gloss:"of us, our"},
        {cs:"Dative",    nu:"Plural",pn:"1st",form:"ἡμῖν",gloss:"to/for us"},
        {cs:"Accusative",nu:"Plural",pn:"1st",form:"ἡμᾶς",gloss:"us"},
        {cs:"Nominative",nu:"Plural",pn:"2nd",form:"ὑμεῖς",gloss:"you (pl)"},
        {cs:"Genitive",  nu:"Plural",pn:"2nd",form:"ὑμῶν",gloss:"of you (pl), your"},
        {cs:"Dative",    nu:"Plural",pn:"2nd",form:"ὑμῖν",gloss:"to/for you (pl)"},
        {cs:"Accusative",nu:"Plural",pn:"2nd",form:"ὑμᾶς",gloss:"you (pl)"}
      ]
    },
    {
      id:"p3", group:"pron", tag:"personal pronoun · 3rd person", cite:"", en:"", name:"3rd Person Pronouns", lemma:"αὐτός", lesson:"8.1, 9.1",
      dims:[dimCase(),dimNum(),dimGen()],
      table:{row:"cs",col:"gd",split:"nu"},
      note:"αὐ- prefixed to the article — except the masc/fem nominatives, which take -ος and -η on αὐτ-.",
      rows:[
        r("Nominative","Singular","Masculine","αὐτός","he"),
        r("Nominative","Singular","Feminine","αὐτή","she"),
        r("Nominative","Singular","Neuter","αὐτό","it"),
        r("Genitive","Singular","Masculine","αὐτοῦ","of him, his"),
        r("Genitive","Singular","Feminine","αὐτῆς","of her, her"),
        r("Genitive","Singular","Neuter","αὐτοῦ","of it, its"),
        r("Dative","Singular","Masculine","αὐτῷ","to/for him"),
        r("Dative","Singular","Feminine","αὐτῇ","to/for her"),
        r("Dative","Singular","Neuter","αὐτῷ","to/for it"),
        r("Accusative","Singular","Masculine","αὐτόν","him"),
        r("Accusative","Singular","Feminine","αὐτήν","her"),
        r("Accusative","Singular","Neuter","αὐτό","it"),
        r("Nominative","Plural","Masculine","αὐτοί","they"),
        r("Nominative","Plural","Feminine","αὐταί","they"),
        r("Nominative","Plural","Neuter","αὐτά","they"),
        r("Genitive","Plural","Masculine","αὐτῶν","of them, their"),
        r("Genitive","Plural","Feminine","αὐτῶν","of them, their"),
        r("Genitive","Plural","Neuter","αὐτῶν","of them, their"),
        r("Dative","Plural","Masculine","αὐτοῖς","to/for them"),
        r("Dative","Plural","Feminine","αὐταῖς","to/for them"),
        r("Dative","Plural","Neuter","αὐτοῖς","to/for them"),
        r("Accusative","Plural","Masculine","αὐτούς","them"),
        r("Accusative","Plural","Feminine","αὐτάς","them"),
        r("Accusative","Plural","Neuter","αὐτά","them")
      ]
    },
    {
      id:"dem", group:"pron", tag:"demonstrative pronoun · near", cite:"", en:"", name:"Demonstrative Pronouns (near)", lemma:"οὗτος", lesson:"13.3, 14.2",
      dims:[dimCase(),dimNum(),dimGen()],
      table:{row:"cs",col:"gd",split:"nu"},
      note:"του- before an 'o' vowel, ταυ- before an 'a' or 'e' vowel. Starts with τ, or accents the first syllable — that is the demonstrative, not αὐτός.",
      rows:[
        r("Nominative","Singular","Masculine","οὗτος","this"),
        r("Nominative","Singular","Feminine","αὕτη","this"),
        r("Nominative","Singular","Neuter","τοῦτο","this"),
        r("Genitive","Singular","Masculine","τούτου","of this"),
        r("Genitive","Singular","Feminine","ταύτης","of this"),
        r("Genitive","Singular","Neuter","τούτου","of this"),
        r("Dative","Singular","Masculine","τούτῳ","to/for this"),
        r("Dative","Singular","Feminine","ταύτῃ","to/for this"),
        r("Dative","Singular","Neuter","τούτῳ","to/for this"),
        r("Accusative","Singular","Masculine","τοῦτον","this"),
        r("Accusative","Singular","Feminine","ταύτην","this"),
        r("Accusative","Singular","Neuter","τοῦτο","this"),
        r("Nominative","Plural","Masculine","οὗτοι","these"),
        r("Nominative","Plural","Feminine","αὗται","these"),
        r("Nominative","Plural","Neuter","ταῦτα","these"),
        r("Genitive","Plural","Masculine","τούτων","of these"),
        r("Genitive","Plural","Feminine","τούτων","of these"),
        r("Genitive","Plural","Neuter","τούτων","of these"),
        r("Dative","Plural","Masculine","τούτοις","to/for these"),
        r("Dative","Plural","Feminine","ταύταις","to/for these"),
        r("Dative","Plural","Neuter","τούτοις","to/for these"),
        r("Accusative","Plural","Masculine","τούτους","these"),
        r("Accusative","Plural","Feminine","ταύτας","these"),
        r("Accusative","Plural","Neuter","ταῦτα","these")
      ]
    },
    {
      id:"wh", group:"pron", tag:"interrogative pronoun · 3rd declension endings", cite:"", en:"", name:"Interrogative Pronouns", lemma:"τίς · τί", lesson:"11.4, 12.3",
      dims:[dimCase(),dimNum(),dimGen(["Masc/Fem","Neuter"])],
      table:{row:"cs",col:"gd",split:"nu"},
      note:"Stem τίν- plus 3rd declension endings; masculine and feminine share one set. The accent is always acute.",
      rows:[
        r("Nominative","Singular","Masc/Fem","τίς","who"),
        r("Genitive","Singular","Masc/Fem","τίνος","whose, of whom"),
        r("Dative","Singular","Masc/Fem","τίνι","to/for whom"),
        r("Accusative","Singular","Masc/Fem","τίνα","whom"),
        r("Nominative","Singular","Neuter","τί","what"),
        r("Genitive","Singular","Neuter","τίνος","of what"),
        r("Dative","Singular","Neuter","τίνι","with/to what"),
        r("Accusative","Singular","Neuter","τί","what"),
        r("Nominative","Plural","Masc/Fem","τίνες","who"),
        r("Genitive","Plural","Masc/Fem","τίνων","whose, of whom"),
        r("Dative","Plural","Masc/Fem","τίσι(ν)","to/for whom"),
        r("Accusative","Plural","Masc/Fem","τίνας","whom"),
        r("Nominative","Plural","Neuter","τίνα","what"),
        r("Genitive","Plural","Neuter","τίνων","of what"),
        r("Dative","Plural","Neuter","τίσι(ν)","with/to what"),
        r("Accusative","Plural","Neuter","τίνα","what")
      ]
    },

    // ---------------- nouns ----------------
    {
      id:"n2", group:"noun", tag:{"masculine":"masculine · 2nd declension","neuter":"neuter · 2nd declension","feminine":"feminine · 2nd declension"}, name:"2nd Declension", lemma:"ἄνθρωπος · τέκνον · ὁδός", lesson:"1.1, 1.3, 3.1, 3.2, 4.2, 4.3, 7.2, 7.3, 13.2",
      dims:[dimCase(),dimNum(),dimPara("Paradigm",["masculine","neuter","feminine"])],
      table:{row:"cs",col:"nu",split:"pd"},
      note:"The endings are the article without its initial τ. The noun changes from session to session — it is the pattern you are drilling. A feminine noun like ὁδός takes the masculine endings; only the article tells you its gender.",
      rows:[
        n("Nominative","Singular","masculine","ἄνθρωπος","the human being"),
        n("Genitive","Singular","masculine","ἀνθρώπου","of the human being"),
        n("Dative","Singular","masculine","ἀνθρώπῳ","to/for the human being"),
        n("Accusative","Singular","masculine","ἄνθρωπον","the human being"),
        n("Nominative","Plural","masculine","ἄνθρωποι","the human beings"),
        n("Genitive","Plural","masculine","ἀνθρώπων","of the human beings"),
        n("Dative","Plural","masculine","ἀνθρώποις","to/for the human beings"),
        n("Accusative","Plural","masculine","ἀνθρώπους","the human beings"),
        n("Nominative","Singular","neuter","τέκνον","the child"),
        n("Genitive","Singular","neuter","τέκνου","of the child"),
        n("Dative","Singular","neuter","τέκνῳ","to/for the child"),
        n("Accusative","Singular","neuter","τέκνον","the child"),
        n("Nominative","Plural","neuter","τέκνα","the children"),
        n("Genitive","Plural","neuter","τέκνων","of the children"),
        n("Dative","Plural","neuter","τέκνοις","to/for the children"),
        n("Accusative","Plural","neuter","τέκνα","the children"),
        n("Nominative","Singular","feminine","ὁδός","the road"),
        n("Genitive","Singular","feminine","ὁδοῦ","of the road"),
        n("Dative","Singular","feminine","ὁδῷ","to/for the road"),
        n("Accusative","Singular","feminine","ὁδόν","the road"),
        n("Nominative","Plural","feminine","ὁδοί","the roads"),
        n("Genitive","Plural","feminine","ὁδῶν","of the roads"),
        n("Dative","Plural","feminine","ὁδοῖς","to/for the roads"),
        n("Accusative","Plural","feminine","ὁδούς","the roads")
      ]
    },
    {
      id:"n1", group:"noun", tag:{"feminine":"feminine · 1st declension","feminine after e, i, r":"feminine · 1st declension","feminine after a sibilant":"feminine · 1st declension","masculine":"masculine · 1st declension"}, name:"1st Declension", lemma:"ἀδελφή · θύρα · τράπεζα · δεσπότης", lesson:"1.1, 3.1, 3.2, 4.2, 6.4, 7.2, 8.3, 13.2",
      // chip labels: the gender word plus the nom/gen ending pair, the way the
      // lessons name these (6.4 "1st Decl α ας", 8.3 "1st Decl α ης") — John
      // asked for the gender word back in front of the endings (2026-09-10,
      // ninth pass) so a bare "α ης" doesn't read as ambiguous out of context.
      // The full English (e.g. "feminine after a sibilant") stays on hover.
      short:{"feminine":"feminine η ης","feminine after e, i, r":"feminine α ας",
             "feminine after a sibilant":"feminine α ης","masculine":"masculine ης ου"},
      dims:[dimCase(),dimNum(),dimPara("Paradigm",["feminine","feminine after e, i, r","feminine after a sibilant","masculine"])],
      table:{row:"cs",col:"nu",split:"pd"},
      note:"α replaces η through the singular after ε, ι or ρ, and after a sibilant the singular has α in the nominative and accusative but η in the genitive and dative. The genitive plural always takes a circumflex on the ultima. The noun changes from session to session.",
      rows:[
        n("Nominative","Singular","feminine","ἀδελφή","the sister"),
        n("Genitive","Singular","feminine","ἀδελφῆς","of the sister"),
        n("Dative","Singular","feminine","ἀδελφῇ","to/for the sister"),
        n("Accusative","Singular","feminine","ἀδελφήν","the sister"),
        n("Nominative","Plural","feminine","ἀδελφαί","the sisters"),
        n("Genitive","Plural","feminine","ἀδελφῶν","of the sisters"),
        n("Dative","Plural","feminine","ἀδελφαῖς","to/for the sisters"),
        n("Accusative","Plural","feminine","ἀδελφάς","the sisters"),
        n("Nominative","Singular","feminine after e, i, r","θύρα","the door"),
        n("Genitive","Singular","feminine after e, i, r","θύρας","of the door"),
        n("Dative","Singular","feminine after e, i, r","θύρᾳ","to/for the door"),
        n("Accusative","Singular","feminine after e, i, r","θύραν","the door"),
        n("Nominative","Plural","feminine after e, i, r","θύραι","the doors"),
        n("Genitive","Plural","feminine after e, i, r","θυρῶν","of the doors"),
        n("Dative","Plural","feminine after e, i, r","θύραις","to/for the doors"),
        n("Accusative","Plural","feminine after e, i, r","θύρας","the doors"),
        n("Nominative","Singular","feminine after a sibilant","τράπεζα","the table"),
        n("Genitive","Singular","feminine after a sibilant","τραπέζης","of the table"),
        n("Dative","Singular","feminine after a sibilant","τραπέζῃ","to/for the table"),
        n("Accusative","Singular","feminine after a sibilant","τράπεζαν","the table"),
        n("Nominative","Plural","feminine after a sibilant","τράπεζαι","the tables"),
        n("Genitive","Plural","feminine after a sibilant","τραπεζῶν","of the tables"),
        n("Dative","Plural","feminine after a sibilant","τραπέζαις","to/for the tables"),
        n("Accusative","Plural","feminine after a sibilant","τραπέζας","the tables"),
        n("Nominative","Singular","masculine","δεσπότης","the master"),
        n("Genitive","Singular","masculine","δεσπότου","of the master"),
        n("Dative","Singular","masculine","δεσπότῃ","to/for the master"),
        n("Accusative","Singular","masculine","δεσπότην","the master"),
        n("Nominative","Plural","masculine","δεσπόται","the masters"),
        n("Genitive","Plural","masculine","δεσποτῶν","of the masters"),
        n("Dative","Plural","masculine","δεσπόταις","to/for the masters"),
        n("Accusative","Plural","masculine","δεσπότας","the masters")
      ]
    },
    {
      id:"n3", group:"noun", tag:{"neuter":"neuter · 3rd declension","masculine or feminine":"feminine · 3rd declension"}, words:{"neuter":"σπέρμα — seed","masculine or feminine":"σάλπιγξ — trumpet"}, name:"3rd Declension", lemma:"σπέρμα · σάλπιγξ", lesson:"9.3, 10.1, 15.3, 16.3",
      dims:[dimCase(),dimNum(),dimPara("Paradigm",["neuter","masculine or feminine"])],
      table:{row:"cs",col:"nu",split:"pd"},
      note:"Same endings as the interrogative τίς. The stem shows itself everywhere except the nominative singular, where σ reshapes it (σαλπιγγ-ς → σάλπιγξ).",
      rows:[
        n("Nominative","Singular","neuter","σπέρμα","the seed"),
        n("Genitive","Singular","neuter","σπέρματος","of the seed"),
        n("Dative","Singular","neuter","σπέρματι","to/for the seed"),
        n("Accusative","Singular","neuter","σπέρμα","the seed"),
        n("Nominative","Plural","neuter","σπέρματα","the seeds"),
        n("Genitive","Plural","neuter","σπερμάτων","of the seeds"),
        n("Dative","Plural","neuter","σπέρμασι(ν)","to/for the seeds"),
        n("Accusative","Plural","neuter","σπέρματα","the seeds"),
        n("Nominative","Singular","masculine or feminine","σάλπιγξ","the trumpet"),
        n("Genitive","Singular","masculine or feminine","σάλπιγγος","of the trumpet"),
        n("Dative","Singular","masculine or feminine","σάλπιγγι","to/for the trumpet"),
        n("Accusative","Singular","masculine or feminine","σάλπιγγα","the trumpet"),
        n("Nominative","Plural","masculine or feminine","σάλπιγγες","the trumpets"),
        n("Genitive","Plural","masculine or feminine","σαλπίγγων","of the trumpets"),
        n("Dative","Plural","masculine or feminine","σάλπιγξι(ν)","to/for the trumpets"),
        n("Accusative","Plural","masculine or feminine","σάλπιγγας","the trumpets")
      ]
    },
    {
      id:"voc", group:"noun", name:"Vocative", lemma:"ἄνθρωπος", en:"addressing someone", lesson:"12.4",
      words:{"Masculine":"ἄνθρωπος — human being","Feminine":"ἀδελφή — sister","Neuter":"τέκνον — child"},
      tag:"vocative — used to address the hearer",
      dims:[dimNum(),dimGen()],
      table:{row:"gd",col:"nu"},
      note:"Identical to the nominative everywhere except the 2nd declension masculine singular (-ε). ὦ is an interjection, not an article, and an acute on the last syllable stays acute rather than becoming a grave.",
      rows:[
        {nu:"Singular",gd:"Masculine",form:"ὦ ἄνθρωπε",gloss:"O human being"},
        {nu:"Singular",gd:"Feminine",form:"ὦ ἀδελφή",gloss:"O sister"},
        {nu:"Singular",gd:"Neuter",form:"ὦ τέκνον",gloss:"O child"},
        {nu:"Plural",gd:"Masculine",form:"ὦ ἄνθρωποι",gloss:"O human beings"},
        {nu:"Plural",gd:"Feminine",form:"ὦ ἀδελφαί",gloss:"O sisters"},
        {nu:"Plural",gd:"Neuter",form:"ὦ τέκνα",gloss:"O children"}
      ]
    },
    {
      id:"adj", group:"noun", tag:"adjective — agrees with its noun in case, number and gender", en:"white", name:"Adjective -ος -η -ον", lemma:"λευκός", lesson:"9.2",
      dims:[dimCase(),dimNum(),dimGen()],
      table:{row:"cs",col:"gd",split:"nu"},
      note:"2nd declension endings for masculine and neuter, 1st declension for feminine — it agrees with its noun in case, number and gender.",
      rows:[
        r("Nominative","Singular","Masculine","λευκός","white"),
        r("Nominative","Singular","Feminine","λευκή","white"),
        r("Nominative","Singular","Neuter","λευκόν","white"),
        r("Genitive","Singular","Masculine","λευκοῦ","white"),
        r("Genitive","Singular","Feminine","λευκῆς","white"),
        r("Genitive","Singular","Neuter","λευκοῦ","white"),
        r("Dative","Singular","Masculine","λευκῷ","white"),
        r("Dative","Singular","Feminine","λευκῇ","white"),
        r("Dative","Singular","Neuter","λευκῷ","white"),
        r("Accusative","Singular","Masculine","λευκόν","white"),
        r("Accusative","Singular","Feminine","λευκήν","white"),
        r("Accusative","Singular","Neuter","λευκόν","white"),
        r("Nominative","Plural","Masculine","λευκοί","white"),
        r("Nominative","Plural","Feminine","λευκαί","white"),
        r("Nominative","Plural","Neuter","λευκά","white"),
        r("Genitive","Plural","Masculine","λευκῶν","white"),
        r("Genitive","Plural","Feminine","λευκῶν","white"),
        r("Genitive","Plural","Neuter","λευκῶν","white"),
        r("Dative","Plural","Masculine","λευκοῖς","white"),
        r("Dative","Plural","Feminine","λευκαῖς","white"),
        r("Dative","Plural","Neuter","λευκοῖς","white"),
        r("Accusative","Plural","Masculine","λευκούς","white"),
        r("Accusative","Plural","Feminine","λευκάς","white"),
        r("Accusative","Plural","Neuter","λευκά","white")
      ]
    },

    // ---------------- verbs ----------------
    {
      id:"vpres", group:"verb", tag:"present · active · indicative", sem:"imperfective — in progress, or habitual", en:"shout", name:"Present Active (luo)", lemma:"κράζω", lesson:"1.4, 2.1, 4.1, 5.1",
      dims:[dimPers(),dimNum()],
      table:{row:"pn",col:"nu"},
      note:"ω marks 1st person, σ marks 2nd. The 3p -ουσι(ν) carries a movable nu.",
      rows:[
        v("1st","Singular","κράζω","I shout"),
        v("2nd","Singular","κράζεις","you shout"),
        v("3rd","Singular","κράζει","he/she shouts"),
        v("1st","Plural","κράζομεν","we shout"),
        v("2nd","Plural","κράζετε","you (pl) shout"),
        v("3rd","Plural","κράζουσι(ν)","they shout")
      ]
    },
    {
      id:"vmp", group:"verb", tag:"present · medio-passive · indicative", sem:"imperfective — in progress or habitual · the subject is affected by the action", name:"Present Medio-Passive", lemma:"ἔρχομαι · ἀπέρχομαι · εἰσέρχομαι · προσέρχομαι · πορεύομαι · διαπορεύομαι · γεύομαι · ἅπτομαι · ἀσπάζομαι · ἐργάζομαι · δέχομαι · γίνομαι · ὀργίζομαι · στρέφομαι · βαπτίζομαι · βούλομαι · κάθημαι", lesson:"7.1, 7.2, 8.1, 10.3, 10.4, 11.2, 12.2, 13.1, 13.4, 14.2, 14.3, 14.4, 16.1",
      dims:[dimPers(),dimNum(),dimPara("Verb",["come","leave","move-into","approach","go","travel-through","taste","touch","greet","work","receive","become","be-angry","turn-around","be-baptized","want","sit"])],
      table:{row:"pn",col:"nu",split:"pd"},
      note:"Deponent/medio-passive in form — most of these have no active counterpart at all (Biblingo's own definition of \u201cdeponent,\u201d Lesson 8.2), though a couple (βαπτίζομαι, στρέφομαι) are true middle/passive uses of a verb that also exists in the active. -αι ends the 1st/3rd singular; θ marks the medio-passive in 1st/2nd plural; the 2s -ῃ hides an old -εσαι (its iota subscript). Compounds of ἔρχομαι/πορεύομαι keep the base verb's own accent — it never falls on the prefix. κάθημαι is athematic (κάθη-σαι, not the -ῃ/-εται pattern the rest of this table follows) — flagged in its own row notes. NT usage sometimes has βούλει rather than the regular βούλῃ shown here for the 2nd singular of βούλομαι.",
      // 2026-09-16: expanded from the original single fixed verb (ἔρχομαι) to
      // all 17 deponent/medio-passive verbs taught through lesson 16, at
      // John's request -- mirrors the μι Verbs (vmi) side-by-side treatment
      // exactly, chosen over extending the old VERBSETS.vmp rotation pool so
      // a Reference-panel "Show verb" dropdown could work the same way vmi's
      // does (see renderRef()/renderVerbSets() and VMP_VERBS below). This
      // deck is therefore no longer in VERB_DECKS/VERBSETS -- it never
      // rotates, same as vmi. ἔρχομαι/ἐργάζομαι/βαπτίζομαι carry the same
      // example sentences the old rotation pool used; the other 14 don't
      // have ex/exEn yet (same scope note as vmi's non-original 8).
      rows:[
        v("1st","Singular","ἔρχομαι","I come","come","Ἔρχομαι εἰς τὸν οἶκον.","I come into the house."),
        v("2nd","Singular","ἔρχῃ","you come","come","Ἔρχῃ εἰς τὴν ἐκκλησίαν.","You come into the congregation."),
        v("3rd","Singular","ἔρχεται","he/she comes","come","Ὁ ἄνθρωπος ἔρχεται.","The man comes."),
        v("1st","Plural","ἐρχόμεθα","we come","come","Ἐρχόμεθα πρὸς τὸν κύριον.","We come to the lord."),
        v("2nd","Plural","ἔρχεσθε","you (pl) come","come","Ἔρχεσθε εἰς τὸν οἶκον.","You (pl) come into the house."),
        v("3rd","Plural","ἔρχονται","they come","come","Οἱ μαθηταὶ ἔρχονται.","The disciples come."),
        v("1st","Singular","ἀπέρχομαι","I leave","leave"),
        v("2nd","Singular","ἀπέρχῃ","you leave","leave"),
        v("3rd","Singular","ἀπέρχεται","he/she leaves","leave"),
        v("1st","Plural","ἀπερχόμεθα","we leave","leave"),
        v("2nd","Plural","ἀπέρχεσθε","you (pl) leave","leave"),
        v("3rd","Plural","ἀπέρχονται","they leave","leave"),
        v("1st","Singular","εἰσέρχομαι","I move into","move-into"),
        v("2nd","Singular","εἰσέρχῃ","you move into","move-into"),
        v("3rd","Singular","εἰσέρχεται","he/she moves into","move-into"),
        v("1st","Plural","εἰσερχόμεθα","we move into","move-into"),
        v("2nd","Plural","εἰσέρχεσθε","you (pl) move into","move-into"),
        v("3rd","Plural","εἰσέρχονται","they move into","move-into"),
        v("1st","Singular","προσέρχομαι","I approach","approach"),
        v("2nd","Singular","προσέρχῃ","you approach","approach"),
        v("3rd","Singular","προσέρχεται","he/she approaches","approach"),
        v("1st","Plural","προσερχόμεθα","we approach","approach"),
        v("2nd","Plural","προσέρχεσθε","you (pl) approach","approach"),
        v("3rd","Plural","προσέρχονται","they approach","approach"),
        v("1st","Singular","πορεύομαι","I go","go"),
        v("2nd","Singular","πορεύῃ","you go","go"),
        v("3rd","Singular","πορεύεται","he/she goes","go"),
        v("1st","Plural","πορευόμεθα","we go","go"),
        v("2nd","Plural","πορεύεσθε","you (pl) go","go"),
        v("3rd","Plural","πορεύονται","they go","go"),
        v("1st","Singular","διαπορεύομαι","I travel through","travel-through"),
        v("2nd","Singular","διαπορεύῃ","you travel through","travel-through"),
        v("3rd","Singular","διαπορεύεται","he/she travels through","travel-through"),
        v("1st","Plural","διαπορευόμεθα","we travel through","travel-through"),
        v("2nd","Plural","διαπορεύεσθε","you (pl) travel through","travel-through"),
        v("3rd","Plural","διαπορεύονται","they travel through","travel-through"),
        v("1st","Singular","γεύομαι","I taste","taste"),
        v("2nd","Singular","γεύῃ","you taste","taste"),
        v("3rd","Singular","γεύεται","he/she tastes","taste"),
        v("1st","Plural","γευόμεθα","we taste","taste"),
        v("2nd","Plural","γεύεσθε","you (pl) taste","taste"),
        v("3rd","Plural","γεύονται","they taste","taste"),
        v("1st","Singular","ἅπτομαι","I touch","touch"),
        v("2nd","Singular","ἅπτῃ","you touch","touch"),
        v("3rd","Singular","ἅπτεται","he/she touches","touch"),
        v("1st","Plural","ἁπτόμεθα","we touch","touch"),
        v("2nd","Plural","ἅπτεσθε","you (pl) touch","touch"),
        v("3rd","Plural","ἅπτονται","they touch","touch"),
        v("1st","Singular","ἀσπάζομαι","I greet","greet"),
        v("2nd","Singular","ἀσπάζῃ","you greet","greet"),
        v("3rd","Singular","ἀσπάζεται","he/she greets","greet"),
        v("1st","Plural","ἀσπαζόμεθα","we greet","greet"),
        v("2nd","Plural","ἀσπάζεσθε","you (pl) greet","greet"),
        v("3rd","Plural","ἀσπάζονται","they greet","greet"),
        v("1st","Singular","ἐργάζομαι","I work","work","Ἐργάζομαι ἐν τῷ οἴκῳ.","I work in the house."),
        v("2nd","Singular","ἐργάζῃ","you work","work","Ἐργάζῃ ἐν τῇ ἐκκλησίᾳ.","You work in the congregation."),
        v("3rd","Singular","ἐργάζεται","he/she works","work","Ὁ ἄνθρωπος ἐργάζεται.","The man works."),
        v("1st","Plural","ἐργαζόμεθα","we work","work","Ἐργαζόμεθα ἐν τῇ ὁδῷ.","We work on the road."),
        v("2nd","Plural","ἐργάζεσθε","you (pl) work","work","Ἐργάζεσθε ἐν τῷ ἱερῷ.","You (pl) work in the temple."),
        v("3rd","Plural","ἐργάζονται","they work","work","Οἱ μαθηταὶ ἐργάζονται.","The disciples work."),
        v("1st","Singular","δέχομαι","I receive","receive"),
        v("2nd","Singular","δέχῃ","you receive","receive"),
        v("3rd","Singular","δέχεται","he/she receives","receive"),
        v("1st","Plural","δεχόμεθα","we receive","receive"),
        v("2nd","Plural","δέχεσθε","you (pl) receive","receive"),
        v("3rd","Plural","δέχονται","they receive","receive"),
        v("1st","Singular","γίνομαι","I become","become"),
        v("2nd","Singular","γίνῃ","you become","become"),
        v("3rd","Singular","γίνεται","he/she becomes","become"),
        v("1st","Plural","γινόμεθα","we become","become"),
        v("2nd","Plural","γίνεσθε","you (pl) become","become"),
        v("3rd","Plural","γίνονται","they become","become"),
        v("1st","Singular","ὀργίζομαι","I am angry","be-angry"),
        v("2nd","Singular","ὀργίζῃ","you are angry","be-angry"),
        v("3rd","Singular","ὀργίζεται","he/she is angry","be-angry"),
        v("1st","Plural","ὀργιζόμεθα","we are angry","be-angry"),
        v("2nd","Plural","ὀργίζεσθε","you (pl) are angry","be-angry"),
        v("3rd","Plural","ὀργίζονται","they are angry","be-angry"),
        v("1st","Singular","στρέφομαι","I turn around","turn-around"),
        v("2nd","Singular","στρέφῃ","you turn around","turn-around"),
        v("3rd","Singular","στρέφεται","he/she turns around","turn-around"),
        v("1st","Plural","στρεφόμεθα","we turn around","turn-around"),
        v("2nd","Plural","στρέφεσθε","you (pl) turn around","turn-around"),
        v("3rd","Plural","στρέφονται","they turn around","turn-around"),
        v("1st","Singular","βαπτίζομαι","I am baptized","be-baptized","Βαπτίζομαι ἐν τῇ θαλάσσῃ.","I am baptized in the sea."),
        v("2nd","Singular","βαπτίζῃ","you are baptized","be-baptized","Βαπτίζῃ ἐν τῇ θαλάσσῃ.","You are baptized in the sea."),
        v("3rd","Singular","βαπτίζεται","he/she is baptized","be-baptized","Ὁ μαθητὴς βαπτίζεται.","The disciple is baptized."),
        v("1st","Plural","βαπτιζόμεθα","we are baptized","be-baptized","Βαπτιζόμεθα εἰς τὴν ἐκκλησίαν.","We are baptized into the congregation."),
        v("2nd","Plural","βαπτίζεσθε","you (pl) are baptized","be-baptized","Βαπτίζεσθε εἰς τὴν ἐκκλησίαν.","You (pl) are baptized into the congregation."),
        v("3rd","Plural","βαπτίζονται","they are baptized","be-baptized","Οἱ μαθηταὶ βαπτίζονται.","The disciples are baptized."),
        v("1st","Singular","βούλομαι","I want","want"),
        v("2nd","Singular","βούλῃ","you want","want"),
        v("3rd","Singular","βούλεται","he/she wants","want"),
        v("1st","Plural","βουλόμεθα","we want","want"),
        v("2nd","Plural","βούλεσθε","you (pl) want","want"),
        v("3rd","Plural","βούλονται","they want","want"),
        v("1st","Singular","κάθημαι","I sit","sit"),
        v("2nd","Singular","κάθησαι","you sit","sit"),
        v("3rd","Singular","κάθηται","he/she sits","sit"),
        v("1st","Plural","καθήμεθα","we sit","sit"),
        v("2nd","Plural","κάθησθε","you (pl) sit","sit"),
        v("3rd","Plural","κάθηνται","they sit","sit")
      ]
    },
    {
      id:"vfut", group:"verb", tag:"future · active · indicative", sem:"after the moment of speaking", cite:"νεύω", en:"nod", name:"Future (luso)", lemma:"νεύσω", lesson:"10.2",
      dims:[dimPers(),dimNum()],
      table:{row:"pn",col:"nu"},
      note:"A σ between the stem and the present endings. On consonant stems it fuses: βλέπω → βλέψω, κράζω → κράξω.",
      rows:[
        v("1st","Singular","νεύσω","I will nod"),
        v("2nd","Singular","νεύσεις","you will nod"),
        v("3rd","Singular","νεύσει","he/she will nod"),
        v("1st","Plural","νεύσομεν","we will nod"),
        v("2nd","Plural","νεύσετε","you (pl) will nod"),
        v("3rd","Plural","νεύσουσι(ν)","they will nod")
      ]
    },
    {
      id:"vaor2", group:"verb", tag:"aorist (thematic) · active · indicative", sem:"past · perfective — the event as a whole, endpoint included", cite:"λαμβάνω", en:"take", name:"Thematic Aorist (efagon)", lemma:"ἔλαβον", lesson:"11.1, 12.1",
      dims:[dimPers(),dimNum()],
      table:{row:"pn",col:"nu"},
      note:"Augment ε plus a different stem from the present (λαμβάνω → ἔλαβον). 1s and 3p are identical.",
      rows:[
        v("1st","Singular","ἔλαβον","I took"),
        v("2nd","Singular","ἔλαβες","you took"),
        v("3rd","Singular","ἔλαβε(ν)","he/she took"),
        v("1st","Plural","ἐλάβομεν","we took"),
        v("2nd","Plural","ἐλάβετε","you (pl) took"),
        v("3rd","Plural","ἔλαβον","they took")
      ]
    },
    {
      id:"vaor1", group:"verb", tag:"aorist (sigmatic) · active · indicative", sem:"past · perfective — same meaning as the thematic aorist, different shape", cite:"λύω", en:"loose", name:"Sigmatic Aorist (elusa)", lemma:"ἔλυσα", lesson:"13.1, 14.1",
      dims:[dimPers(),dimNum()],
      table:{row:"pn",col:"nu"},
      note:"Augment ε plus -σα on the present stem. Same meaning as the thematic aorist, different shape.",
      rows:[
        v("1st","Singular","ἔλυσα","I loosed"),
        v("2nd","Singular","ἔλυσας","you loosed"),
        v("3rd","Singular","ἔλυσε(ν)","he/she loosed"),
        v("1st","Plural","ἐλύσαμεν","we loosed"),
        v("2nd","Plural","ἐλύσατε","you (pl) loosed"),
        v("3rd","Plural","ἔλυσαν","they loosed")
      ]
    },
    {
      id:"vimpf", group:"verb", tag:"imperfect · active · indicative", sem:"past · imperfective — in progress in the past, or habitual", cite:"λαμβάνω", en:"take", name:"Imperfect (eluon)", lemma:"ἐλάμβανον", lesson:"15.1, 16.1",
      dims:[dimPers(),dimNum()],
      table:{row:"pn",col:"nu"},
      note:"Present stem plus the augment and the thematic-aorist endings. ἐλάμβανον vs ἔλαβον is the stem, not the ending. 1s and 3p are identical.",
      rows:[
        v("1st","Singular","ἐλάμβανον","I was taking"),
        v("2nd","Singular","ἐλάμβανες","you were taking"),
        v("3rd","Singular","ἐλάμβανε(ν)","he/she was taking"),
        v("1st","Plural","ἐλαμβάνομεν","we were taking"),
        v("2nd","Plural","ἐλαμβάνετε","you (pl) were taking"),
        v("3rd","Plural","ἐλάμβανον","they were taking")
      ]
    },
    {
      id:"vmi", group:"verb", tag:"present · active · indicative · athematic", sem:"imperfective — no linking vowel between stem and ending", name:"μι Verbs (present)", lemma:"δίδωμι · ἀποδίδωμι · τίθημι · προστίθημι · ἵστημι · ἀνίστημι · ἀφίημι · συνίημι · δείκνυμι · πίμπλημι · ἀπόλλυμι", lesson:"9.4, 10.1, 10.3, 10.4, 15.1, 15.3, 15.4, 16.1",
      dims:[dimPers(),dimNum(),dimPara("Verb",["give","give-back","put","add","stand","rise","leave","understand","show","fill","destroy"])],
      table:{row:"pn",col:"nu",split:"pd"},
      note:"Athematic — no theme vowel. The stem vowel is long in the singular, short in the plural (δίδω- / δίδο-). δείκνυμι and ἀπόλλυμι (the -νυμι class) don't reduplicate; ἀφίημι and συνίημι (the ἵημι family) reduplicate with ἱ- and take -ᾶσι(ν) in the 3rd plural, like ἵστημι. Compounds keep the base verb's own accent — it never falls on the prefix.",
      // One sentence per row, added 2026-09-10 (ninth pass) -- this deck already
      // showed all three verbs side by side (no rotation needed, unlike the
      // other verb decks below), so it just needed sentences of its own.
      rows:[
        v("1st","Singular","δίδωμι","I give","give","Δίδωμι τῷ μαθητῇ τὸν ἄρτον.","I give the disciple the bread."),
        v("2nd","Singular","δίδως","you give","give","Δίδως τῇ ἀδελφῇ τὸ βιβλίον.","You give the sister the book."),
        v("3rd","Singular","δίδωσι(ν)","he/she gives","give","Ὁ κύριος δίδωσιν τῷ ἀνθρώπῳ τὸν ἄρτον.","The lord gives the man the bread."),
        v("1st","Plural","δίδομεν","we give","give","Δίδομεν τῷ μαθητῇ τὸ βιβλίον.","We give the disciple the book."),
        v("2nd","Plural","δίδοτε","you (pl) give","give","Δίδοτε τῇ ἐκκλησίᾳ τὸν ἄρτον.","You (pl) give the congregation the bread."),
        v("3rd","Plural","διδόασι(ν)","they give","give","Οἱ ἄνθρωποι διδόασιν τῷ κυρίῳ τὸν ἄρτον.","The men give the lord the bread."),
        v("1st","Singular","τίθημι","I put","put","Τίθημι τὸ βιβλίον ἐν τῷ οἴκῳ.","I put the book in the house."),
        v("2nd","Singular","τίθης","you put","put","Τίθης τὸν ἄρτον ἐπὶ τῆς τραπέζης.","You put the bread on the table."),
        v("3rd","Singular","τίθησι(ν)","he/she puts","put","Ὁ μαθητὴς τίθησιν τὸ βιβλίον ἐπὶ τῆς τραπέζης.","The disciple puts the book on the table."),
        v("1st","Plural","τίθεμεν","we put","put","Τίθεμεν τὸν ἄρτον ἐπὶ τῆς τραπέζης.","We put the bread on the table."),
        v("2nd","Plural","τίθετε","you (pl) put","put","Τίθετε τὸ τέκνον ἐν τῷ οἴκῳ.","You (pl) put the child in the house."),
        v("3rd","Plural","τιθέασι(ν)","they put","put","Οἱ ἄνθρωποι τιθέασιν τὸν ἄρτον ἐπὶ τῆς τραπέζης.","The men put the bread on the table."),
        v("1st","Singular","ἵστημι","I stand","stand","Ἵστημι ἐν τῷ ἱερῷ.","I stand in the temple."),
        v("2nd","Singular","ἵστης","you stand","stand","Ἵστης ἐν τῇ ὁδῷ.","You stand on the road."),
        v("3rd","Singular","ἵστησι(ν)","he/she stands","stand","Ὁ μαθητὴς ἵστησιν ἐν τῇ ἐκκλησίᾳ.","The disciple stands in the congregation."),
        v("1st","Plural","ἵσταμεν","we stand","stand","Ἵσταμεν ἐν τῷ οἴκῳ.","We stand in the house."),
        v("2nd","Plural","ἵστατε","you (pl) stand","stand","Ἵστατε πρὸς τὸν κύριον.","You (pl) stand before the lord."),
        v("3rd","Plural","ἱστᾶσι(ν)","they stand","stand","Οἱ ἄνθρωποι ἱστᾶσιν ἐν τῷ ἱερῷ.","The men stand in the temple."),
        // Added 2026-09-15: the remaining -μι verbs taught through lesson 16.
        // Biblingo only gives full present-tense paradigm tables for δίδωμι/
        // τίθημι/ἵστημι (9.4/10.4); these eight are vocab-only entries there
        // (9.4, 10.1, 10.3, 15.1, 15.3, 15.4/16.1), so their forms below follow
        // standard Koine morphology for their conjugation family (confirmed
        // against the lemma each vocab table gives), not a Biblingo table.
        // No ex/exEn -- see "Not built" #3 in the build notes.
        v("1st","Singular","ἀποδίδωμι","I give back","give-back"),
        v("2nd","Singular","ἀποδίδως","you give back","give-back"),
        v("3rd","Singular","ἀποδίδωσι(ν)","he/she gives back","give-back"),
        v("1st","Plural","ἀποδίδομεν","we give back","give-back"),
        v("2nd","Plural","ἀποδίδοτε","you (pl) give back","give-back"),
        v("3rd","Plural","ἀποδιδόασι(ν)","they give back","give-back"),
        v("1st","Singular","προστίθημι","I add","add"),
        v("2nd","Singular","προστίθης","you add","add"),
        v("3rd","Singular","προστίθησι(ν)","he/she adds","add"),
        v("1st","Plural","προστίθεμεν","we add","add"),
        v("2nd","Plural","προστίθετε","you (pl) add","add"),
        v("3rd","Plural","προστιθέασι(ν)","they add","add"),
        v("1st","Singular","ἀνίστημι","I stand up","rise"),
        v("2nd","Singular","ἀνίστης","you stand up","rise"),
        v("3rd","Singular","ἀνίστησι(ν)","he/she stands up","rise"),
        v("1st","Plural","ἀνίσταμεν","we stand up","rise"),
        v("2nd","Plural","ἀνίστατε","you (pl) stand up","rise"),
        v("3rd","Plural","ἀνιστᾶσι(ν)","they stand up","rise"),
        v("1st","Singular","ἀφίημι","I leave","leave"),
        v("2nd","Singular","ἀφίης","you leave","leave"),
        v("3rd","Singular","ἀφίησι(ν)","he/she leaves","leave"),
        v("1st","Plural","ἀφίεμεν","we leave","leave"),
        v("2nd","Plural","ἀφίετε","you (pl) leave","leave"),
        v("3rd","Plural","ἀφιᾶσι(ν)","they leave","leave"),
        v("1st","Singular","συνίημι","I understand","understand"),
        v("2nd","Singular","συνίης","you understand","understand"),
        v("3rd","Singular","συνίησι(ν)","he/she understands","understand"),
        v("1st","Plural","συνίεμεν","we understand","understand"),
        v("2nd","Plural","συνίετε","you (pl) understand","understand"),
        v("3rd","Plural","συνιᾶσι(ν)","they understand","understand"),
        v("1st","Singular","δείκνυμι","I show","show"),
        v("2nd","Singular","δείκνυς","you show","show"),
        v("3rd","Singular","δείκνυσι(ν)","he/she shows","show"),
        v("1st","Plural","δείκνυμεν","we show","show"),
        v("2nd","Plural","δείκνυτε","you (pl) show","show"),
        v("3rd","Plural","δεικνύασι(ν)","they show","show"),
        v("1st","Singular","πίμπλημι","I fill","fill"),
        v("2nd","Singular","πίμπλης","you fill","fill"),
        v("3rd","Singular","πίμπλησι(ν)","he/she fills","fill"),
        v("1st","Plural","πίμπλαμεν","we fill","fill"),
        v("2nd","Plural","πίμπλατε","you (pl) fill","fill"),
        v("3rd","Plural","πιμπλᾶσι(ν)","they fill","fill"),
        v("1st","Singular","ἀπόλλυμι","I destroy","destroy"),
        v("2nd","Singular","ἀπόλλυς","you destroy","destroy"),
        v("3rd","Singular","ἀπόλλυσι(ν)","he/she destroys","destroy"),
        v("1st","Plural","ἀπόλλυμεν","we destroy","destroy"),
        v("2nd","Plural","ἀπόλλυτε","you (pl) destroy","destroy"),
        v("3rd","Plural","ἀπολλύασι(ν)","they destroy","destroy")
      ]
    },
    {
      id:"veimi", group:"verb", tag:"present · indicative", sem:"a state holding now", en:"be", name:"The verb “to be” — present", lemma:"εἰμί", lesson:"5.4, 6.3",
      dims:[dimPers(),dimNum()],
      table:{row:"pn",col:"nu"},
      note:"An irregular μι verb. Compare the plurals with the regular endings: κράζομεν / ἐσμέν, κράζετε / ἐστέ.",
      rows:[
        v("1st","Singular","εἰμί","I am"),
        v("2nd","Singular","εἶ","you are"),
        v("3rd","Singular","ἐστί(ν)","he/she is"),
        v("1st","Plural","ἐσμέν","we are"),
        v("2nd","Plural","ἐστέ","you (pl) are"),
        v("3rd","Plural","εἰσί(ν)","they are")
      ]
    },
    {
      id:"veimpf", group:"verb", tag:"imperfect · indicative", sem:"past · imperfective — a state holding at some past time", cite:"εἰμί", en:"be", name:"The verb “to be” — imperfect", lemma:"ἤμην", lesson:"15.2, 16.4",
      dims:[dimPers(),dimNum()],
      table:{row:"pn",col:"nu"},
      note:"A lengthened η stem. Alternates you will meet: ἦσθα for 2s, ἤμεθα for 1p.",
      rows:[
        v("1st","Singular","ἤμην","I was"),
        v("2nd","Singular","ἦς","you were"),
        v("3rd","Singular","ἦν","he/she was"),
        v("1st","Plural","ἦμεν","we were"),
        v("2nd","Plural","ἦτε","you (pl) were"),
        v("3rd","Plural","ἦσαν","they were")
      ]
    },

    {
      id:"vinf", group:"verb", name:"Infinitives", lemma:"λαμβάνειν · λαβεῖν", en:"", lesson:"16.2",
      tag:"infinitive — a mood, not a tense",
      sem:"aspect only, no tense — the luo stem views the event as ongoing or habitual, the aorist stem as a whole",
      dims:[{k:"pd",label:"Verb",values:["take","hear"],ask:false},
            {k:"asp",label:"Aspect",values:["Imperfective (present stem)","Perfective (aorist stem)"]}],
      table:{row:"asp",col:"pd"},
      note:"-ειν on the present and thematic-aorist stems, -σαι on the sigmatic. λαμβάνειν accents back; λαβεῖν takes a circumflex on the last syllable, ἀκοῦσαι on the second to last.",
      rows:[
        {pd:"take",asp:"Imperfective (present stem)",form:"λαμβάνειν",gloss:"to take, to be taking"},
        {pd:"take",asp:"Perfective (aorist stem)",form:"λαβεῖν",gloss:"to take (the whole event)"},
        {pd:"hear",asp:"Imperfective (present stem)",form:"ἀκούειν",gloss:"to hear, to be hearing"},
        {pd:"hear",asp:"Perfective (aorist stem)",form:"ἀκοῦσαι",gloss:"to hear (the whole event)"}
      ]
    },
    // ---------------- prepositions and conjunctions ----------------
    {
      id:"conj", group:"prep", en:"", name:"Conjunctions", lemma:"καί · δέ · ὅτι", lesson:"3.3, 8.4, 12.2, 13.3, 13.4, 14.4, 15.2, 15.4, 16.2, 16.4",
      dims:[{k:"cs",label:"Word",values:["καί","ἀλλά","δέ","μέν","οὖν","γάρ","τέ","ὅτι","ὅτε","ὡς","εἰ","οὐ, οὐκ, οὐχ"]}],
      table:null,
      note:"A postpositive can never begin its clause — it stands second, after the first word. οὐ is a proclitic and leans on the word after it.",
      rows:[
        {cs:"καί",  form:"Coordinating", gloss:"and, also, even — joins two like elements, or two main clauses"},
        {cs:"ἀλλά", form:"Coordinating", gloss:"but — often answering a negative (οὐ … ἀλλά); elides to ἀλλ’ before a vowel"},
        {cs:"δέ",   form:"Postpositive", gloss:"but, and — contrasts with what precedes; never first in its clause"},
        {cs:"μέν",  form:"Postpositive", gloss:"on the one hand — sets up a contrast that δέ completes"},
        {cs:"οὖν",  form:"Postpositive", gloss:"so, therefore — draws a consequence"},
        {cs:"γάρ",  form:"Postpositive", gloss:"for — gives the reason or explanation for what precedes"},
        {cs:"τέ",   form:"Postpositive", gloss:"and — an enclitic, weaker and rarer than καί"},
        {cs:"ὅτι",  form:"Subordinating", gloss:"that — after verbs of speaking or perceiving · because — giving a reason"},
        {cs:"ὅτε",  form:"Subordinating", gloss:"when — normally followed by an aorist, sometimes by the imperfect"},
        {cs:"ὡς",   form:"Subordinating", gloss:"as"},
        {cs:"εἰ",   form:"Subordinating", gloss:"if — introduces a condition"},
        {cs:"οὐ, οὐκ, οὐχ", form:"Negator", gloss:"not — οὐκ before a smooth vowel, οὐχ before a rough one"}
      ]
    },
    {
      id:"prep", group:"prep", en:"", name:"Prepositions", lemma:"ἐν · εἰς · ἐκ", lesson:"2.4, 3.4, 4.4, 7.4, 10.3, 12.4, 14.3",
      dims:[{k:"cs",label:"Preposition",values:["ἐν","εἰς","πρός","ἀπό","ἐκ","διά","ἐπί"]}],
      table:null,
      note:"A preposition governs a case; the ones that take more than one shift meaning with it.",
      rows:[
        {cs:"ἐν",   form:"Dative",           gloss:"in, among"},
        {cs:"εἰς",  form:"Accusative",       gloss:"into, to"},
        {cs:"πρός", form:"Accusative",       gloss:"to, toward"},
        {cs:"ἀπό",  form:"Genitive",         gloss:"from"},
        {cs:"ἐκ",   form:"Genitive",         gloss:"out of"},
        {cs:"διά",  form:"Gen or Acc",       gloss:"gen: through, during, by means of · acc: because of"},
        {cs:"ἐπί",  form:"Gen, Dat or Acc",  gloss:"on, upon — gen: on a surface, before an authority · dat: relying on, in addition to · acc: onto, at"}
      ]
    }
  ];

  // ======================================================================
  // VOCABULARY — every word from the lesson vocabulary tables of chapters
  // 1–16, plus the words taught inside the grammar sections themselves
  // (the article, prepositions, conjunctions, pronouns, paradigm words).
  // Nouns are written the way the lesson tables write them: word, article.
  // [greek, english, category, lesson]
  // ======================================================================
  var VOCAB = [
    // ---------------- chapter 1 ----------------
    ["ἄνθρωπος, ὁ","human being","noun","1.1"],
    ["ἄρτος, ὁ","bread, loaf","noun","1.1"],
    ["ἀδελφή, ἡ","sister","noun","1.1"],
    ["τέκνον, τό","child","noun","1.1"],
    ["πετεινόν, τό","bird","noun","1.1"],
    ["κράζω","to shout","verb","1.1"],
    ["ὀφθαλμός, ὁ","eye","noun","1.2"],
    ["κεφαλή, ἡ","head","noun","1.2"],
    ["ποίμνη, ἡ","flock","noun","1.2"],
    ["ποτήριον, τό","cup","noun","1.2"],
    ["ἵππος, ὁ","horse","noun","1.2"],
    ["θεός, ὁ","God","noun","1.2"],
    ["καρπός, ὁ","fruit","noun","1.3"],
    ["σκηνή, ἡ","tent","noun","1.3"],
    ["ἐπιστολή, ἡ","letter","noun","1.3"],
    ["ἱμάτιον, τό","clothes","noun","1.3"],
    ["νόμος, ὁ","law","noun","1.3"],
    ["βιβλίον, τό","book","noun","1.4"],
    ["νεύω","to nod","verb","1.4"],
    ["βλέπω τήν","to see","verb","1.4"],
    ["ἐσθίω τήν","to eat","verb","1.4"],
    ["κώμη, ἡ","village","noun","1.4"],
    ["ἀπόστολος, ὁ","apostle, ambassador","noun","1.4"],
    // ---------------- chapter 2 ----------------
    ["πρόβατον, τό","sheep","noun","2.1"],
    ["δένδρον, τό","tree","noun","2.1"],
    ["δοῦλος, ὁ","slave","noun","2.1"],
    ["λύχνος, ὁ","lamp","noun","2.1"],
    ["ἔτι","still","adverb","2.1"],
    ["ἔχω τήν","to have","verb","2.1"],
    ["ζῷον, τό","animal","noun","2.2"],
    ["κλίνη, ἡ","bed","noun","2.2"],
    ["στέφανος, ὁ","crown","noun","2.2"],
    ["νεφέλη, ἡ","cloud","noun","2.2"],
    ["κρύπτω τήν","to hide","verb","2.2"],
    ["δαιμόνιον, τό","demon","noun","2.2"],
    ["πρόσωπον, τό","face","noun","2.3"],
    ["σχοινίον, τό","rope","noun","2.3"],
    ["ἀγρός, ὁ","field","noun","2.3"],
    ["οἶκος, ὁ","house","noun","2.3"],
    ["ἥλιος, ὁ","sun","noun","2.3"],
    ["καιρός, ὁ","occasion","noun","2.3"],
    ["στολή, ἡ","robe","noun","2.4"],
    ["ἄγω σε πρός","to lead","verb","2.4"],
    ["πέμπω σε πρός","to send","verb","2.4"],
    ["λύω τήν","to untie, to loose","verb","2.4"],
    ["πρεσβύτερος, ὁ","old man","noun","2.4"],
    ["χρόνος, ὁ","time","noun","2.4"],
    // ---------------- chapter 3 ----------------
    ["ἀδελφός, ὁ","brother","noun","3.1"],
    ["νύμφη, ἡ","bride","noun","3.1"],
    ["κόσμος, ὁ","world","noun","3.1"],
    ["θυσιαστήριον, τό","altar","noun","3.1"],
    ["παιδίον, τό","child","noun","3.1"],
    ["φέρω σοι τήν","to bring","verb","3.1"],
    ["λίθος, ὁ","stone","noun","3.2"],
    ["φωνή, ἡ","voice","noun","3.2"],
    ["σῦκον, τό","fig","noun","3.2"],
    ["ἀκούω τήν","to hear","verb","3.2"],
    ["πίπτω","to fall","verb","3.2"],
    ["Ἰσραήλ, ὁ","Israel (indeclinable)","noun","3.2"],
    ["ναός, ὁ","temple","noun","3.3"],
    ["οἶνος, ὁ","wine","noun","3.3"],
    ["ἀργύριον, τό","silver coin","noun","3.3"],
    ["ἁρπάζω τήν","to seize","verb","3.3"],
    ["ψυχή, ἡ","soul","noun","3.3"],
    ["οὐρανός, ὁ","sky, heaven","noun","3.4"],
    ["αὐλή, ἡ","courtyard","noun","3.4"],
    ["ἀγάπη, ἡ","love","noun","3.4"],
    ["σανδάλιον, τό","sandal","noun","3.4"],
    ["πάλιν","again","adverb","3.4"],
    ["ἀποθνῄσκω","to die","verb","3.4"],
    // ---------------- chapter 4 ----------------
    ["κλάδος, ὁ","branch","noun","4.1"],
    ["ἔλαιον, τό","olive oil","noun","4.1"],
    ["ξύλον, τό","wood","noun","4.1"],
    ["κλαίω","to weep","verb","4.1"],
    ["φυτεύω τήν","to plant","verb","4.1"],
    ["σαλεύω τήν","to shake","verb","4.1"],
    ["οἰκοδομή, ἡ","building","noun","4.2"],
    ["σελήνη, ἡ","moon","noun","4.2"],
    ["τόπος, ὁ","place","noun","4.2"],
    ["πλοῖον, τό","boat","noun","4.2"],
    ["χρυσίον, τό","gold","noun","4.2"],
    ["οἶκος τοῦ θεοῦ","house of God","phrase","4.2"],
    ["δάκτυλος, ὁ","finger","noun","4.3"],
    ["χόρτος, ὁ","grass","noun","4.3"],
    ["λύκος, ὁ","wolf","noun","4.3"],
    ["ποταμός, ὁ","river","noun","4.3"],
    ["σουδάριον, τό","kerchief","noun","4.3"],
    ["Ἰησοῦς, ὁ","Jesus","noun","4.3"],
    ["ζύμη, ἡ","yeast","noun","4.4"],
    ["πηγή, ἡ","spring","noun","4.4"],
    ["φεύγω ἀπό","to run away","verb","4.4"],
    ["γράφω τήν","to write","verb","4.4"],
    ["θρόνος, ὁ","throne","noun","4.4"],
    ["τότε","then","adverb","4.4"],
    // ---------------- chapter 5 ----------------
    ["γεωργός, ὁ","farmer","noun","5.1"],
    ["κάλαμος, ὁ","pen","noun","5.1"],
    ["ὄχλος, ὁ","crowd","noun","5.1"],
    ["θηρίον, τό","animal","noun","5.1"],
    ["ὅπλον, τό","tool","noun","5.1"],
    ["λάχανον, τό","vegetable","noun","5.1"],
    ["ζωή, ἡ","life","noun","5.2"],
    ["διώκω σε","to chase","verb","5.2"],
    ["αἴρω τήν","to lift","verb","5.2"],
    ["ὑπάγω","to go away","verb","5.2"],
    ["εὐαγγέλιον, τό","good news","noun","5.3"],
    ["τροφή, ἡ","food","noun","5.3"],
    ["συναγωγή, ἡ","synagogue (building)","noun","5.3"],
    ["σοφία, ἡ","wisdom","noun","5.3"],
    ["λαμβάνω τήν","to take, to receive","verb","5.3"],
    ["νῦν","now","adverb","5.3"],
    ["παραβολή, ἡ","parable","noun","5.4"],
    ["δύο","two","number","5.4"],
    ["καθίζω","to sit","verb","5.4"],
    ["εἰμί","to be","verb","5.4"],
    ["δικαιοσύνη, ἡ","righteousness","noun","5.4"],
    ["ἀρχή, ἡ","beginning","noun","5.4"],
    // ---------------- chapter 6 ----------------
    ["λαός, ὁ","nation","noun","6.1"],
    ["Ἰουδαία, ἡ","Judea","noun","6.1"],
    ["σημεῖον, τό","sign","noun","6.1"],
    ["βάλλω σοι τήν","to throw","verb","6.1"],
    ["ἐνδύω σε","to clothe","verb","6.1"],
    ["καθεύδω","to sleep","verb","6.1"],
    ["διδάσκαλος, ὁ","teacher","noun","6.2"],
    ["καπνός, ὁ","smoke","noun","6.2"],
    ["χριστός, ὁ","Christ, anointed one","noun","6.2"],
    ["δηνάριον, τό","denarius","noun","6.2"],
    ["συνέδριον, τό","Sanhedrin","noun","6.2"],
    ["υἱὸς τοῦ ἀνθρώπου","son of man","phrase","6.2"],
    ["δεῖπνον, τό","supper","noun","6.3"],
    ["ἔργον, τό","deed, work","noun","6.3"],
    ["μέτρον, τό","amount","noun","6.3"],
    ["ἀνοίγω τήν","to open","verb","6.3"],
    ["διδάσκω σε","to teach","verb","6.3"],
    ["πάντοτε","always","adverb","6.3"],
    ["θύρα, ἡ","door","noun","6.4"],
    ["ἐλαία, ἡ","olive","noun","6.4"],
    ["ἡμέρα, ἡ","day","noun","6.4"],
    ["πέτρα, ἡ","bedrock","noun","6.4"],
    ["σκιά, ἡ","shadow","noun","6.4"],
    ["καθέδρα, ἡ","chair","noun","6.4"],
    // ---------------- chapter 7 ----------------
    ["ἄγγελος, ὁ","messenger","noun","7.1"],
    ["θυσία, ἡ","sacrifice","noun","7.1"],
    ["καρδία, ἡ","heart","noun","7.1"],
    ["πορεύομαι εἰς","to go","verb","7.1"],
    ["ἔρχομαι εἰς","to come","verb","7.1"],
    ["γεύομαι τήν","to taste","verb","7.1"],
    ["ἀλήθεια, ἡ","truth","noun","7.2"],
    ["χώρα, ἡ","land","noun","7.2"],
    ["εἷς","one","number","7.2"],
    ["λούω τήν","to bathe","verb","7.2"],
    ["ἅπτομαι τῆς","to touch","verb","7.2"],
    ["ὥρα, ἡ","hour","noun","7.2"],
    ["Γαλιλαία, ἡ","Galilee","noun","7.3"],
    ["φόβος, ὁ","fear","noun","7.3"],
    ["λύπη, ἡ","sorrow","noun","7.3"],
    ["ὀργή, ἡ","anger","noun","7.3"],
    ["ἀγορά, ἡ","city square","noun","7.3"],
    ["ἐγείρω σε","to raise","verb","7.3"],
    ["οἰκία, ἡ","household","noun","7.4"],
    ["βασιλεία, ἡ","reign","noun","7.4"],
    ["τάλαντον, τό","talent","noun","7.4"],
    ["κρανίον, τό","skull","noun","7.4"],
    ["ἐξουσία, ἡ","authority","noun","7.4"],
    ["ὧδε","here","adverb","7.4"],
    // ---------------- chapter 8 ----------------
    ["χήρα, ἡ","widow","noun","8.1"],
    ["εἰρήνη, ἡ","peace","noun","8.1"],
    ["ἐργάζομαι","to work","verb","8.1"],
    ["παύω αὐτήν","to stop","verb","8.1"],
    ["ἀσπάζομαί σε","to greet","verb","8.1"],
    ["σάββατον, τό","Sabbath","noun","8.2"],
    ["ἐκεῖ","there","adverb","8.2"],
    ["λόγος, ὁ","speech, word","noun","8.2"],
    ["διάκονος, ὁ","servant","noun","8.2"],
    ["χαρά, ἡ","joy","noun","8.2"],
    ["μένω","to remain","verb","8.2"],
    ["τράπεζα, ἡ","table","noun","8.3"],
    ["θάλασσα, ἡ","sea","noun","8.3"],
    ["γλῶσσα, ἡ","tongue","noun","8.3"],
    ["σῖτος, ὁ","wheat","noun","8.3"],
    ["ἱερόν, τό","temple","noun","8.3"],
    ["δόξα, ἡ","brightness","noun","8.3"],
    ["ἁμαρτία, ἡ","sin","noun","8.4"],
    ["φυλακή, ἡ","prison","noun","8.4"],
    ["λέγω αὐτήν","to say","verb","8.4"],
    ["εὔχομαί σοι","to pray","verb","8.4"],
    ["ἰδού","look!","interjection","8.4"],
    ["ἐνώπιον","before (+ gen)","preposition","8.4"]
  ];
  var VOCAB2 = [
    // ---------------- chapter 9 ----------------
    ["ἄνεμος, ὁ","wind","noun","9.1"],
    ["θερισμός, ὁ","harvest","noun","9.1"],
    ["μισθός, ὁ","pay","noun","9.1"],
    ["ἐκκλησία, ἡ","congregation","noun","9.1"],
    ["γραφή, ἡ","Scriptures","noun","9.1"],
    ["ῥίζα, ἡ","root","noun","9.1"],
    ["ἔσχατος","last","adjective","9.2"],
    ["λευκός","white","adjective","9.2"],
    ["ὑψηλός","tall","adjective","9.2"],
    ["ὀλίγος","few","adjective","9.2"],
    ["καλός","good","adjective","9.2"],
    ["ἀμήν","Amen","interjection","9.2"],
    ["σπέρμα, τό","seed","noun","9.3"],
    ["καινός","new","adjective","9.3"],
    ["αἷμα, τό","blood","noun","9.3"],
    ["στόμα, τό","mouth","noun","9.3"],
    ["κέρας, τό","horn","noun","9.3"],
    ["ῥῆμα, τό","statement","noun","9.3"],
    ["τίθημι αὐτήν","to put","verb","9.4"],
    ["ἀφίημι αὐτήν","to leave","verb","9.4"],
    ["δείκνυμί σοι αὐτήν","to show","verb","9.4"],
    ["ἵστημι αὐτήν","to stand","verb","9.4"],
    ["δίδωμί σοι αὐτήν","to give","verb","9.4"],
    ["ἅλας, τό","salt","noun","9.4"],
    // ---------------- chapter 10 ----------------
    ["γυμνός","naked","adjective","10.1"],
    ["ὕδωρ, τό","water","noun","10.1"],
    ["μέλι, τό","honey","noun","10.1"],
    ["προστίθημι αὐτὴν αὐτῷ","to add","verb","10.1"],
    ["ἀποδίδωμί σοι αὐτήν","to give back","verb","10.1"],
    ["μανθάνω αὐτήν","to learn","verb","10.1"],
    ["πνεῦμα, τό","spirit","noun","10.2"],
    ["τρόπος, ὁ","way","noun","10.2"],
    ["σῶμα, τό","body","noun","10.2"],
    ["τυφλός","blind","adjective","10.2"],
    ["ἐν τῷ μέλλοντι","in the future","phrase","10.2"],
    ["ἀγαθός","good","adjective","10.2"],
    ["ὄνομα, τό","name","noun","10.3"],
    ["ἄλλος","different, other","adjective","10.3"],
    ["θάνατος, ὁ","death","noun","10.3"],
    ["στρέφομαί σοι","to turn around","verb","10.3"],
    ["πίμπλημι αὐτὴν αὐτοῦ","to fill","verb","10.3"],
    ["ἀποστέλλω σε εἰς τόπον","to send","verb","10.3"],
    ["ἀναβαίνω εἰς","to go up","verb","10.4"],
    ["νεκρός","dead","adjective","10.4"],
    ["καλῶς","well","adverb","10.4"],
    ["ναί","yes","adverb","10.4"],
    ["εἰσέρχομαι εἰς","to move into","verb","10.4"],
    ["οἴκημα, τό","room","noun","10.4"],
    // ---------------- chapter 11 ----------------
    ["πρότερον","before","adverb","11.1"],
    ["ἀσθένεια, ἡ","weakness","noun","11.1"],
    ["πῶς","how?","adverb","11.1"],
    ["ὅλος","whole","adjective","11.1"],
    ["δέρω σε","to beat","verb","11.1"],
    ["γινώσκω αὐτήν","to know","verb","11.1"],
    ["πτωχός","poor","adjective","11.2"],
    ["φῶς, τό","light","noun","11.2"],
    ["πρῶτος","first","adjective","11.2"],
    ["εἶπον αὐτήν","said (aorist of λέγω)","verb","11.2"],
    ["δέχομαι αὐτήν","to receive","verb","11.2"],
    ["κακός","bad","adjective","11.2"],
    ["μέσος","in the middle","adverb","11.3"],
    ["κωφός","deaf","adjective","11.3"],
    ["κενός","empty","adjective","11.3"],
    ["θέλω αὐτήν","to want","verb","11.3"],
    ["βάπτισμα, τό","baptism","noun","11.3"],
    ["εἶδον αὐτήν","saw (aorist of ὁράω)","verb","11.3"],
    ["πύργος, ὁ","tower","noun","11.4"],
    ["Ἱεροσόλυμα, τό","Jerusalem","noun","11.4"],
    ["γάμος, ὁ","wedding","noun","11.4"],
    ["χαίρω ἐν","to rejoice","verb","11.4"],
    ["πῶς ἔχεις;","how are you?","phrase","11.4"],
    ["καλῶς ἔχω","I am well","phrase","11.4"],
    // ---------------- chapter 12 ----------------
    ["πάθημα, τό","suffering","noun","12.1"],
    ["μόνος","only","adjective","12.1"],
    ["ἔρημος","uninhabited","adjective","12.1"],
    ["ἐπαγγελία, ἡ","promise","noun","12.1"],
    ["ζώνη, ἡ","belt","noun","12.1"],
    ["γράμμα, τό","letter (of the alphabet)","noun","12.1"],
    ["νυμφίος, ὁ","bridegroom","noun","12.2"],
    ["σεισμός, ὁ","earthquake","noun","12.2"],
    ["κλείω αὐτήν","to shut","verb","12.2"],
    ["ὀργίζομαι","to be angry","verb","12.2"],
    ["ἄκανθα, ἡ","thorn","noun","12.2"],
    ["ἀρνίον, τό","lamb","noun","12.3"],
    ["δίκτυον, τό","net","noun","12.3"],
    ["καίω αὐτήν","to light","verb","12.3"],
    ["βαστάζω αὐτήν","to carry","verb","12.3"],
    ["εὑρίσκω αὐτήν","to find","verb","12.3"],
    ["ἐν ὀλίγῳ","shortly, easily","phrase","12.3"],
    ["κόφινος, ὁ","basket","noun","12.4"],
    ["χιλίαρχος, ὁ","chiliarch","noun","12.4"],
    ["πῶλος, ὁ","colt","noun","12.4"],
    ["κρυπτός","hidden","adjective","12.4"],
    ["μεστός","full","adjective","12.4"],
    ["καταπέτασμα, τό","curtain","noun","12.4"],
    // ---------------- chapter 13 ----------------
    ["δεσμός, ὁ","shackles","noun","13.1"],
    ["ἐκβάλλω σε","to drive out","verb","13.1"],
    ["φίλος, ὁ","friend","noun","13.1"],
    ["κλέπτω αὐτήν","to steal","verb","13.1"],
    ["γίνομαι αὐτή","to become","verb","13.1"],
    ["σκορπίζω αὐτάς","to scatter","verb","13.1"],
    ["ἐργάτης, ὁ","worker","noun","13.2"],
    ["προφήτης, ὁ","prophet","noun","13.2"],
    ["νεανίας, ὁ","young man","noun","13.2"],
    ["στρατιώτης, ὁ","soldier","noun","13.2"],
    ["ὁδός, ἡ","road","noun","13.2"],
    ["ῥάβδος, ἡ","rod","noun","13.2"],
    ["δέσμιος, ὁ","prisoner","noun","13.3"],
    ["μαθητής, ὁ","disciple, follower","noun","13.3"],
    ["τελώνης, ὁ","tax collector","noun","13.3"],
    ["πλοῦτος, ὁ","wealth","noun","13.3"],
    ["χοῖρος, ὁ","pig","noun","13.3"],
    ["οὖν","so, therefore","conjunction","13.3"],
    ["ἀπέρχομαι ἀπ' αὐτῆς","to leave","verb","13.4"],
    ["παρθένος, ἡ","virgin","noun","13.4"],
    ["κηρύσσω σοι αὐτήν","to proclaim","verb","13.4"],
    ["ἑτοιμάζω αὐτήν","to prepare","verb","13.4"],
    ["κακῶς ἔχω","I am sick","phrase","13.4"],
    ["πότε","when?","adverb","13.4"],
    // ---------------- chapter 14 ----------------
    ["ἐν ὀνόματι","in the name","phrase","14.1"],
    ["κάμηλος, ὁ","camel","noun","14.1"],
    ["τρίβος, ἡ","path","noun","14.1"],
    ["ἐρημία, ἡ","wilderness","noun","14.1"],
    ["Μωϋσῆς, ὁ","Moses","noun","14.1"],
    ["χωλός","lame","adjective","14.1"],
    ["παιδίσκη, ἡ","slave girl","noun","14.2"],
    ["ψεύστης, ὁ","liar","noun","14.2"],
    ["πόλεμος, ὁ","war","noun","14.2"],
    ["κλῆρος, ὁ","lot","noun","14.2"],
    ["βίβλος, ἡ","book","noun","14.2"],
    ["κάθημαι ἐπὶ τόπου","to sit","verb","14.2"],
    ["ἐντολή, ἡ","command","noun","14.3"],
    ["σχίσμα, τό","tear","noun","14.3"],
    ["νηστεύω","to fast","verb","14.3"],
    ["διαπορεύομαι διά","to travel through","verb","14.3"],
    ["ἀγοράζω αὐτήν","to buy","verb","14.3"],
    ["προσέρχομαί σοι","to approach","verb","14.3"],
    ["βουλή, ἡ","plan","noun","14.4"],
    ["διδαχή, ἡ","teaching (content)","noun","14.4"],
    ["ὡς","as","conjunction","14.4"],
    ["βαπτίζομαι","to baptize","verb","14.4"],
    ["διὰ τοῦτο","because of this","phrase","14.4"],
    ["πονηρός","evil","adjective","14.4"],
    // ---------------- chapter 15 ----------------
    ["δεύτερος","second","number","15.1"],
    ["δεσπότης, ὁ","master","noun","15.1"],
    ["συνίημι λόγον","to understand","verb","15.1"],
    ["σάρξ, ἡ","flesh","noun","15.1"],
    ["γυνή, ἡ","woman","noun","15.1"],
    ["νύξ, ἡ","night","noun","15.1"],
    ["ἀκοή, ἡ","hearing","noun","15.2"],
    ["φυλή, ἡ","tribe","noun","15.2"],
    ["φυλάσσω αὐτήν","to guard","verb","15.2"],
    ["τρέχω","to run","verb","15.2"],
    ["πάσχω αὐτήν","to suffer","verb","15.2"],
    ["γάρ","for","conjunction","15.2"],
    ["λίαν","very","adverb","15.3"],
    ["σάλπιγξ, ἡ","trumpet","noun","15.3"],
    ["πιστεύω λόγῳ","to believe","verb","15.3"],
    ["ἐπιστρέφω εἰς","to return to","verb","15.3"],
    ["πράσσω αὐτήν","to do","verb","15.3"],
    ["ἀπόλλυμι αὐτήν","to destroy","verb","15.3"],
    ["ἐχθές","yesterday","adverb","15.3"],
    ["ἐνιαυτός, ὁ","year","noun","15.4"],
    ["θησαυρός, ὁ","treasure","noun","15.4"],
    ["κόπος, ὁ","hard work","noun","15.4"],
    ["θεραπεύω σε","to heal","verb","15.4"],
    ["τοῦτ’ ἔστιν","which means","phrase","15.4"],
    ["ἀνίστημι αὐτήν","to stand up","verb","15.4"],
    // ---------------- chapter 16 ----------------
    ["δρέπανον, τό","sickle","noun","16.1"],
    ["χωρίον, τό","place","noun","16.1"],
    ["φύλλον, τό","leaf","noun","16.1"],
    ["βούλομαι πράσσειν","to want","verb","16.1"],
    ["κελεύω σε πράσσειν","to command","verb","16.1"],
    ["ἑκατοντάρχης, ὁ","centurion","noun","16.2"],
    ["στέγη, ἡ","roof","noun","16.2"],
    ["πόσος","how great","adjective","16.2"],
    ["προσέχω αὐτῇ","to pay attention to","verb","16.2"],
    ["ἐπιτρέπω σοι πράσσειν","to allow","verb","16.2"],
    ["εἰ","if","particle","16.2"],
    ["σταφυλή, ἡ","bunch","noun","16.3"],
    ["φοῖνιξ, ὁ","date palm","noun","16.3"],
    ["πίναξ, ὁ","plate","noun","16.3"],
    ["λάρυγξ, ὁ","throat","noun","16.3"],
    ["θρίξ, ἡ","hair","noun","16.3"],
    ["θέλημα, τό","will","noun","16.3"],
    ["ἕτοιμος","ready","adjective","16.4"],
    ["καθαρίζω τι","to clean","verb","16.4"],
    ["λεπρός, ὁ","leper","noun","16.4"],
    ["στενάζω","to groan","verb","16.4"],
    ["τέ","and","particle","16.4"],
    ["ἐμός","my","pronoun","16.4"],
    // ------- taught in the grammar sections, not the vocabulary tables -------
    ["ὁ, ἡ, τό","the","article","1.2"],
    ["τύπτω τήν","to hit","verb","1.3"],
    ["ἐγώ","I","pronoun","2.2"],
    ["σύ","you","pronoun","2.3"],
    ["πρός","to, toward (+ acc)","preposition","2.4"],
    ["καί","and, also","conjunction","3.3"],
    ["ἐν","in, among (+ dat)","preposition","3.4"],
    ["ἀπό","from (+ gen)","preposition","4.4"],
    ["ἡμεῖς","we","pronoun","5.2"],
    ["ὑμεῖς","you (plural)","pronoun","5.3"],
    ["εἰς","into, to (+ acc)","preposition","7.4"],
    ["αὐτός","he, she, it","pronoun","8.1"],
    ["οὐ, οὐκ, οὐχ","not","negation","8.4"],
    ["ἐπί","on, upon (+ gen, dat, acc)","preposition","10.3"],
    ["τίς, τί","who?, what?","pronoun","11.4"],
    ["ὅτι","because, that","conjunction","12.2"],
    ["ἐκ, ἐξ","out of (+ gen)","preposition","12.4"],
    ["ὦ","O (with the vocative)","interjection","12.4"],
    ["κύριος, ὁ","lord","noun","12.4"],
    ["οὗτος","this","pronoun","13.3"],
    ["ἀλλά","but","conjunction","13.4"],
    ["διά","through, because of (+ gen, acc)","preposition","14.3"],
    ["δέ","but, and","conjunction","14.4"],
    ["μέν","on the one hand","conjunction","14.4"],
    ["ὅτε","when","conjunction","15.4"]
  ];

  var ARG_POOL={};       // every argument placeholder used anywhere, for distractors
  var WORDS=[], seenWord={};
  VOCAB.concat(VOCAB2).forEach(function(w){
    if(!seenWord[w[0]]){seenWord[w[0]]=1;WORDS.push(w);}   // a few words repeat across lessons
  });
  WORDS.forEach(function(w){
    if(w[2]==="verb"&&w[0].indexOf(" ")>0)
      w[0].split(/\s+/).slice(1).forEach(function(t){ARG_POOL[t]=1;});
  });
  ARG_POOL=Object.keys(ARG_POOL);
  GROUPS.push({id:"vocab", name:"Vocabulary"});
  [[1,4],[5,8],[9,12],[13,16]].forEach(function(r){
    var rows=WORDS.filter(function(w){
      var ch=parseInt(w[3],10); return ch>=r[0]&&ch<=r[1];
    }).map(function(w){
      var row={form:w[0],gloss:w[1],cat:w[2],lesson:w[3]};
      // a verb taught with its arguments (βάλλω σοι τήν) is answered piece by piece
      if(w[2]==="verb"&&w[0].indexOf(" ")>0){
        row.parts=w[0].split(/\s+/);
        row.head=row.parts[0];
      }
      return row;
    });
    DECKS.push({
      id:"v"+r[0], group:"vocab", kind:"vocab",
      name:"Chapters "+r[0]+"–"+r[1], lemma:rows.length+" words", en:"",
      lesson:"chapters "+r[0]+"–"+r[1], dims:[], table:null,
      note:"Six words per lesson, plus the words taught in the grammar sections themselves.",
      rows:rows
    });
  });

  // ======================================================================
  // CLAUSES — each pronoun form shown inside a minimal sentence, so the case
  // is visible from its work in the clause rather than from a label.
  // Every word here is one John has been taught. Accents follow the enclitic
  // rules of 5.3 and 5.4: an enclitic (με, μου, μοι, σε, σου, σοι) carries no
  // accent, and a word accented as far back as it can go takes an extra acute
  // before one (τὸν οἶκόν σου, Δίδωμί σοι).
  // key = deck id + the dimension values, in the deck's own order
  // ======================================================================
  var CLAUSES = {
    // ---- definite article: case, number, gender. Paired with the deck's own
    // sample nouns (see the deck's note) so the reader sees the article doing
    // its actual job -- agreeing with a noun -- rather than standing alone.
    // λόγος (m) is paroxytone and never shifts; γραφή (f) is oxytone and takes
    // a grave whenever it is not the last word (γραφή→γραφὴ, γραφαί→γραφαὶ); ἔργον (n)
    // is paroxytone and never shifts. Neuter plural subjects take a singular
    // verb, matching the rule already used throughout the noun decks.
    "art|Nominative|Singular|Masculine":["Ὁ λόγος μένει.","The word remains."],
    "art|Nominative|Singular|Feminine":["Ἡ γραφὴ μένει.","The Scripture remains."],
    "art|Nominative|Singular|Neuter":["Τὸ ἔργον μένει.","The deed remains."],
    "art|Genitive|Singular|Masculine":["Ἀκούω τὴν ἀρχὴν τοῦ λόγου.","I hear the beginning of the word."],
    "art|Genitive|Singular|Feminine":["Ἀκούω τὴν ἀρχὴν τῆς γραφῆς.","I hear the beginning of the Scripture."],
    "art|Genitive|Singular|Neuter":["Βλέπω τὴν ἀρχὴν τοῦ ἔργου.","I see the beginning of the deed."],
    "art|Dative|Singular|Masculine":["Πιστεύω τῷ λόγῳ.","I believe the word."],
    "art|Dative|Singular|Feminine":["Πιστεύω τῇ γραφῇ.","I believe the Scripture."],
    "art|Dative|Singular|Neuter":["Χαίρω ἐν τῷ ἔργῳ.","I rejoice in the deed."],
    "art|Accusative|Singular|Masculine":["Ἀκούω τὸν λόγον.","I hear the word."],
    "art|Accusative|Singular|Feminine":["Βλέπω τὴν γραφήν.","I see the Scripture."],
    "art|Accusative|Singular|Neuter":["Βλέπω τὸ ἔργον.","I see the deed."],
    "art|Nominative|Plural|Masculine":["Οἱ λόγοι μένουσιν.","The words remain."],
    "art|Nominative|Plural|Feminine":["Αἱ γραφαὶ μένουσιν.","The Scriptures remain."],
    "art|Nominative|Plural|Neuter":["Τὰ ἔργα μένει.","The deeds remain."],
    "art|Genitive|Plural|Masculine":["Ἀκούω τὴν ἀρχὴν τῶν λόγων.","I hear the beginning of the words."],
    "art|Genitive|Plural|Feminine":["Ἀκούω τὴν ἀρχὴν τῶν γραφῶν.","I hear the beginning of the Scriptures."],
    "art|Genitive|Plural|Neuter":["Βλέπω τὴν ἀρχὴν τῶν ἔργων.","I see the beginning of the deeds."],
    "art|Dative|Plural|Masculine":["Πιστεύω τοῖς λόγοις.","I believe the words."],
    "art|Dative|Plural|Feminine":["Πιστεύω ταῖς γραφαῖς.","I believe the Scriptures."],
    "art|Dative|Plural|Neuter":["Χαίρω ἐν τοῖς ἔργοις.","I rejoice in the deeds."],
    "art|Accusative|Plural|Masculine":["Ἀκούω τοὺς λόγους.","I hear the words."],
    "art|Accusative|Plural|Feminine":["Βλέπω τὰς γραφάς.","I see the Scriptures."],
    "art|Accusative|Plural|Neuter":["Βλέπω τὰ ἔργα.","I see the deeds."],

    // ---- 1st & 2nd person: case, number, person ----
    "p12|Nominative|Singular|1st":["Ἐγὼ τύπτω τὸν ἄνθρωπον.","I am hitting the man."],
    "p12|Genitive|Singular|1st":["Ἡ ἀδελφή μου κράζει.","My sister is shouting."],
    "p12|Dative|Singular|1st":["Ὁ ἀδελφὸς λέγει μοι.","The brother is speaking to me."],
    "p12|Accusative|Singular|1st":["Ὁ ἄνθρωπος τύπτει με.","The man is hitting me."],
    "p12|Nominative|Singular|2nd":["Σὺ γράφεις τὴν ἐπιστολήν.","You are writing the letter."],
    "p12|Genitive|Singular|2nd":["Βλέπω τὸν οἶκόν σου.","I see your house."],
    "p12|Dative|Singular|2nd":["Δίδωμί σοι τὸν ἄρτον.","I am giving you the bread."],
    "p12|Accusative|Singular|2nd":["Ἄγω σε πρὸς τὴν κώμην.","I am leading you to the village."],
    "p12|Nominative|Plural|1st":["Ἡμεῖς ἐσθίομεν τὸν ἄρτον.","We are eating the bread."],
    "p12|Genitive|Plural|1st":["Βλέπω τὸν οἶκον ἡμῶν.","I see our house."],
    "p12|Dative|Plural|1st":["Ὁ διδάσκαλος λέγει ἡμῖν.","The teacher is speaking to us."],
    "p12|Accusative|Plural|1st":["Οἱ ἄνθρωποι βλέπουσιν ἡμᾶς.","The people see us."],
    "p12|Nominative|Plural|2nd":["Ὑμεῖς ἀκούετε τὴν φωνήν.","You (pl) hear the voice."],
    "p12|Genitive|Plural|2nd":["Ἀκούω τὴν φωνὴν ὑμῶν.","I hear your (pl) voice."],
    "p12|Dative|Plural|2nd":["Γράφω ὑμῖν τὴν ἐπιστολήν.","I am writing you (pl) the letter."],
    "p12|Accusative|Plural|2nd":["Βλέπομεν ὑμᾶς.","We see you (pl)."],

    // ---- 3rd person αὐτός: case, number, gender ----
    "p3|Nominative|Singular|Masculine":["Αὐτὸς κράζει.","He is shouting."],
    "p3|Nominative|Singular|Feminine":["Αὐτὴ γράφει.","She is writing."],
    "p3|Nominative|Singular|Neuter":["Αὐτὸ πίπτει.","It is falling."],
    "p3|Genitive|Singular|Masculine":["Βλέπω τὸν οἶκον αὐτοῦ.","I see his house."],
    "p3|Genitive|Singular|Feminine":["Ἀκούω τὴν φωνὴν αὐτῆς.","I hear her voice."],
    "p3|Genitive|Singular|Neuter":["Ἐσθίω τὸν καρπὸν αὐτοῦ.","I am eating its fruit."],
    "p3|Dative|Singular|Masculine":["Λέγω αὐτῷ.","I am speaking to him."],
    "p3|Dative|Singular|Feminine":["Δίδωμι αὐτῇ τὸν ἄρτον.","I am giving her the bread."],
    "p3|Dative|Singular|Neuter":["Μένω ἐν αὐτῷ.","I am remaining in it."],
    "p3|Accusative|Singular|Masculine":["Βλέπω αὐτόν.","I see him."],
    "p3|Accusative|Singular|Feminine":["Παύω αὐτήν.","I am stopping her."],
    "p3|Accusative|Singular|Neuter":["Λαμβάνω αὐτό.","I am taking it."],
    "p3|Nominative|Plural|Masculine":["Αὐτοὶ ἔρχονται.","They are coming."],
    "p3|Nominative|Plural|Feminine":["Αὐταὶ ἀκούουσιν.","They hear."],
    "p3|Nominative|Plural|Neuter":["Αὐτὰ πίπτει.","They are falling."],
    "p3|Genitive|Plural|Masculine":["Βλέπω τοὺς οἴκους αὐτῶν.","I see their houses."],
    "p3|Genitive|Plural|Feminine":["Ἀκούω τὰς φωνὰς αὐτῶν.","I hear their voices."],
    "p3|Genitive|Plural|Neuter":["Ἐσθίω τοὺς καρποὺς αὐτῶν.","I am eating their fruit."],
    "p3|Dative|Plural|Masculine":["Λέγω αὐτοῖς.","I am speaking to them."],
    "p3|Dative|Plural|Feminine":["Γράφω αὐταῖς.","I am writing to them."],
    "p3|Dative|Plural|Neuter":["Μένω ἐν αὐτοῖς.","I am remaining among them."],
    "p3|Accusative|Plural|Masculine":["Βλέπω αὐτούς.","I see them."],
    "p3|Accusative|Plural|Feminine":["Ἄγω αὐτὰς πρὸς τὴν κώμην.","I am leading them to the village."],
    "p3|Accusative|Plural|Neuter":["Λαμβάνω αὐτά.","I am taking them."],

    // ---- demonstrative near οὗτος: normally stands with the article ----
    "dem|Nominative|Singular|Masculine":["Οὗτος ὁ ἄνθρωπος κράζει.","This man is shouting."],
    "dem|Nominative|Singular|Feminine":["Αὕτη ἡ ἀδελφὴ γράφει.","This sister is writing."],
    "dem|Nominative|Singular|Neuter":["Τοῦτο τὸ τέκνον ἐσθίει.","This child is eating."],
    "dem|Genitive|Singular|Masculine":["Βλέπω τὸν οἶκον τούτου τοῦ ἀνθρώπου.","I see this man's house."],
    "dem|Genitive|Singular|Feminine":["Ἀκούω τὴν φωνὴν ταύτης τῆς ἀδελφῆς.","I hear this sister's voice."],
    "dem|Genitive|Singular|Neuter":["Ἐσθίω τὸν καρπὸν τούτου τοῦ δένδρου.","I am eating the fruit of this tree."],
    "dem|Dative|Singular|Masculine":["Λέγω τούτῳ τῷ ἀνθρώπῳ.","I am speaking to this man."],
    "dem|Dative|Singular|Feminine":["Δίδωμι ταύτῃ τῇ ἀδελφῇ τὸν ἄρτον.","I am giving this sister the bread."],
    "dem|Dative|Singular|Neuter":["Μένω ἐν τούτῳ τῷ οἴκῳ.","I am remaining in this house."],
    "dem|Accusative|Singular|Masculine":["Βλέπω τοῦτον τὸν ἄνθρωπον.","I see this man."],
    "dem|Accusative|Singular|Feminine":["Ἀκούω ταύτην τὴν φωνήν.","I hear this voice."],
    "dem|Accusative|Singular|Neuter":["Λαμβάνω τοῦτο τὸ βιβλίον.","I am taking this book."],
    "dem|Nominative|Plural|Masculine":["Οὗτοι οἱ ἄνθρωποι κράζουσιν.","These men are shouting."],
    "dem|Nominative|Plural|Feminine":["Αὗται αἱ ἀδελφαὶ γράφουσιν.","These sisters are writing."],
    "dem|Nominative|Plural|Neuter":["Ταῦτα τὰ τέκνα ἐσθίει.","These children are eating."],
    "dem|Genitive|Plural|Masculine":["Βλέπω τοὺς οἴκους τούτων τῶν ἀνθρώπων.","I see these men's houses."],
    "dem|Genitive|Plural|Feminine":["Ἀκούω τὰς φωνὰς τούτων τῶν ἀδελφῶν.","I hear these sisters' voices."],
    "dem|Genitive|Plural|Neuter":["Ἐσθίω τοὺς καρποὺς τούτων τῶν δένδρων.","I am eating the fruit of these trees."],
    "dem|Dative|Plural|Masculine":["Λέγω τούτοις τοῖς ἀνθρώποις.","I am speaking to these men."],
    "dem|Dative|Plural|Feminine":["Γράφω ταύταις ταῖς ἀδελφαῖς.","I am writing to these sisters."],
    "dem|Dative|Plural|Neuter":["Μένω ἐν τούτοις τοῖς οἴκοις.","I am remaining in these houses."],
    "dem|Accusative|Plural|Masculine":["Βλέπω τούτους τοὺς ἀνθρώπους.","I see these men."],
    "dem|Accusative|Plural|Feminine":["Ἀκούω ταύτας τὰς φωνάς.","I hear these voices."],
    "dem|Accusative|Plural|Neuter":["Λαμβάνω ταῦτα τὰ βιβλία.","I am taking these books."],

    // ---- interrogative τίς: questions end with the Greek question mark ----
    "wh|Nominative|Singular|Masc/Fem":["Τίς κράζει;","Who is shouting?"],
    "wh|Genitive|Singular|Masc/Fem":["Τίνος ἡ ἐπιστολή;","Whose is the letter?"],
    "wh|Dative|Singular|Masc/Fem":["Τίνι γράφεις;","To whom are you writing?"],
    "wh|Accusative|Singular|Masc/Fem":["Τίνα βλέπει ὁ ἄνθρωπος;","Whom does the man see?"],
    "wh|Nominative|Singular|Neuter":["Τί πίπτει;","What is falling?"],
    "wh|Genitive|Singular|Neuter":["Τίνος ἅπτῃ;","What are you touching?"],
    "wh|Dative|Singular|Neuter":["Τίνι τύπτεις;","With what are you hitting?"],
    "wh|Accusative|Singular|Neuter":["Τί ἐσθίεις;","What are you eating?"],
    "wh|Nominative|Plural|Masc/Fem":["Τίνες κράζουσιν;","Who are shouting?"],
    "wh|Genitive|Plural|Masc/Fem":["Τίνων αἱ φωναί;","Whose are the voices?"],
    "wh|Dative|Plural|Masc/Fem":["Τίσι λέγεις;","To whom are you speaking?"],
    "wh|Accusative|Plural|Masc/Fem":["Τίνας βλέπεις;","Whom do you see?"],
    "wh|Nominative|Plural|Neuter":["Τίνα πίπτει;","What things are falling?"],
    "wh|Genitive|Plural|Neuter":["Τίνων ἅπτῃ;","What things are you touching?"],
    "wh|Dative|Plural|Neuter":["Τίσι τύπτεις;","With what things are you hitting?"],
    "wh|Accusative|Plural|Neuter":["Τίνα ἐσθίεις;","What things are you eating?"]
  };

  // Curated noun sets -- capped at 3 words per paradigm (John's own choice,
  // 2026-09-10 seventh pass, down from the sixth pass's up-to-5), picked for
  // thematic/lexical interest from the words John has actually been taught.
  // Every entry -- including entry [0], the deck's original default/citation
  // word -- now carries its OWN full 8-slot ex/exEn sentence pair, in the
  // same order as f[]: nom sg, gen sg, dat sg, acc sg, nom pl, gen pl, dat
  // pl, acc pl. rollNouns() just reads ex[i]/exEn[i] for whichever slot a
  // row is -- no more "only the default word gets full coverage" special
  // case, and no more single-slot exCs/exNu gating for the others: every
  // word on every card now has a genuinely illustrative sentence. n3 is
  // included here for the first time (seventh pass) -- see the build notes
  // for what was checked in the lesson PDFs to find its extra words. Forms
  // and sentences are checked against the lesson tables (9.3, 10.1, 15.3,
  // 16.3 for n3) and against the accent rules used throughout this file:
  // oxytone words (accent on the ultima) print an acute in citation form or
  // sentence-final position, and a grave wherever they appear mid-sentence
  // followed by another word; paroxytone/proparoxytone words and anything
  // accented with a circumflex never shift regardless of position. Every
  // sentence below keeps genitive/dative/accusative forms sentence-final
  // (matching this file's existing style) specifically so that rule never
  // has to be applied there; only a handful of oxytone nominative subjects
  // (θεός, ἱερόν, ζωή, μαθητής, σάρξ, γυνή) sit mid-sentence and need the
  // grave -- each is called out below.
  var NOUNSETS = {
    "n2|masculine":[
      {g:"human being",f:["ἄνθρωπος","ἀνθρώπου","ἀνθρώπῳ","ἄνθρωπον","ἄνθρωποι","ἀνθρώπων","ἀνθρώποις","ἀνθρώπους"],
        ex:["Ὁ ἄνθρωπος γράφει.","Βλέπω τὸν οἶκον τοῦ ἀνθρώπου.","Λέγω τῷ ἀνθρώπῳ.","Ὁ ἀδελφὸς τύπτει τὸν ἄνθρωπον.",
            "Οἱ ἄνθρωποι κράζουσιν.","Βλέπω τοὺς οἴκους τῶν ἀνθρώπων.","Λέγω τοῖς ἀνθρώποις.","Βλέπω τοὺς ἀνθρώπους."],
        exEn:["The man is writing.","I see the man's house.","I am speaking to the man.","The brother is hitting the man.",
              "The men are shouting.","I see the men's houses.","I am speaking to the men.","I see the men."]},
      // λόγος is paroxytone (accent on the penult) -- never shifts, at any position
      {g:"word",f:["λόγος","λόγου","λόγῳ","λόγον","λόγοι","λόγων","λόγοις","λόγους"],
        ex:["Ὁ λόγος μένει.","Ἀκούω τὴν ἀρχὴν τοῦ λόγου.","Πιστεύω τῷ λόγῳ.","Ἀκούω τὸν λόγον.",
            "Οἱ λόγοι μένουσιν.","Ἀκούω τὴν ἀρχὴν τῶν λόγων.","Πιστεύω τοῖς λόγοις.","Ἀκούω τοὺς λόγους."],
        exEn:["The word remains.","I hear the beginning of the word.","I believe the word.","I hear the word.",
              "The words remain.","I hear the beginning of the words.","I believe the words.","I hear the words."]},
      // θεός is oxytone -- nom/acc sg and nom/acc pl carry a grave when not
      // sentence-final (θεὸς, θεοὶ here); gen/dat are circumflex, immune
      {g:"God",f:["θεός","θεοῦ","θεῷ","θεόν","θεοί","θεῶν","θεοῖς","θεούς"],
        ex:["Ὁ θεὸς βλέπει.","Ἀκούω τὸν λόγον τοῦ θεοῦ.","Λέγω τῷ θεῷ.","Βλέπω τὸν θεόν.",
            "Οἱ θεοὶ βλέπουσιν.","Ἀκούω τὸν λόγον τῶν θεῶν.","Λέγω τοῖς θεοῖς.","Βλέπω τοὺς θεούς."],
        exEn:["God sees.","I hear the word of God.","I am speaking to God.","I see God.",
              "The gods see.","I hear the word of the gods.","I am speaking to the gods.","I see the gods."]}
    ],
    "n2|neuter":[
      {g:"child",f:["τέκνον","τέκνου","τέκνῳ","τέκνον","τέκνα","τέκνων","τέκνοις","τέκνα"],
        // neuter plural subject, singular verb throughout
        ex:["Τὸ τέκνον ἐσθίει.","Βλέπω τὸ βιβλίον τοῦ τέκνου.","Δίδωμι τῷ τέκνῳ τὸν ἄρτον.","Βλέπω τὸ τέκνον.",
            "Τὰ τέκνα ἐσθίει.","Βλέπω τὰ βιβλία τῶν τέκνων.","Δίδωμι τοῖς τέκνοις τὸν ἄρτον.","Βλέπω τὰ τέκνα."],
        exEn:["The child is eating.","I see the child's book.","I am giving the child the bread.","I see the child.",
              "The children are eating.","I see the children's books.","I am giving the children the bread.","I see the children."]},
      // δένδρον is paroxytone -- never shifts
      {g:"tree",f:["δένδρον","δένδρου","δένδρῳ","δένδρον","δένδρα","δένδρων","δένδροις","δένδρα"],
        ex:["Τὸ δένδρον πίπτει.","Βλέπω τοὺς καρποὺς τοῦ δένδρου.","Μένω ἐν τῷ δένδρῳ.","Βλέπω τὸ δένδρον.",
            "Τὰ δένδρα πίπτει.","Βλέπω τοὺς καρποὺς τῶν δένδρων.","Μένω ἐν τοῖς δένδροις.","Βλέπω τὰ δένδρα."],
        exEn:["The tree is falling.","I see the fruits of the tree.","I am remaining in the tree.","I see the tree.",
              "The trees are falling.","I see the fruits of the trees.","I am remaining in the trees.","I see the trees."]},
      // ἱερόν is oxytone throughout its neuter nom/acc forms -- grave when
      // non-final (ἱερὸν, ἱερὰ here); gen/dat are circumflex, immune
      {g:"temple",f:["ἱερόν","ἱεροῦ","ἱερῷ","ἱερόν","ἱερά","ἱερῶν","ἱεροῖς","ἱερά"],
        ex:["Τὸ ἱερὸν μένει.","Βλέπω τὴν θύραν τοῦ ἱεροῦ.","Μένω ἐν τῷ ἱερῷ.","Βλέπω τὸ ἱερόν.",
            "Τὰ ἱερὰ μένει.","Βλέπω τὴν θύραν τῶν ἱερῶν.","Μένω ἐν τοῖς ἱεροῖς.","Βλέπω τὰ ἱερά."],
        exEn:["The temple remains.","I see the door of the temple.","I am remaining in the temple.","I see the temple.",
              "The temples remain.","I see the door of the temples.","I am remaining in the temples.","I see the temples."]}
    ],
    "n2|feminine":[
      // ὁδός is oxytone in nom/acc sg and nom/acc pl -- kept sentence-final
      // throughout (including the subject slots) so it never needs a grave
      {g:"road",f:["ὁδός","ὁδοῦ","ὁδῷ","ὁδόν","ὁδοί","ὁδῶν","ὁδοῖς","ὁδούς"],
        ex:["Ἄγει πρὸς τὴν κώμην ἡ ὁδός.","Βλέπω τὴν ἀρχὴν τῆς ὁδοῦ.","Μένω ἐν τῇ ὁδῷ.","Βλέπω τὴν ὁδόν.",
            "Ἄγουσιν πρὸς τὴν κώμην αἱ ὁδοί.","Βλέπω τὴν ἀρχὴν τῶν ὁδῶν.","Μένω ἐν ταῖς ὁδοῖς.","Βλέπω τὰς ὁδούς."],
        exEn:["The road leads to the village.","I see the beginning of the road.","I am remaining on the road.","I see the road.",
              "The roads lead to the village.","I see the beginning of the roads.","I am remaining on the roads.","I see the roads."]},
      // παρθένος is paroxytone -- never shifts
      {g:"virgin",f:["παρθένος","παρθένου","παρθένῳ","παρθένον","παρθένοι","παρθένων","παρθένοις","παρθένους"],
        ex:["Ἡ παρθένος ἔρχεται.","Βλέπω τὸν οἶκον τῆς παρθένου.","Λέγω τῇ παρθένῳ.","Βλέπω τὴν παρθένον.",
            "Αἱ παρθένοι ἔρχονται.","Βλέπω τὸν οἶκον τῶν παρθένων.","Λέγω ταῖς παρθένοις.","Βλέπω τὰς παρθένους."],
        exEn:["The virgin is coming.","I see the house of the virgin.","I am speaking to the virgin.","I see the virgin.",
              "The virgins are coming.","I see the house of the virgins.","I am speaking to the virgins.","I see the virgins."]},
      // ῥάβδος is paroxytone -- never shifts. ἐν + dat as instrumental
      // "with" (ἐν ῥάβδῳ, 1 Cor 4:21) is genuine attested NT usage
      {g:"rod",f:["ῥάβδος","ῥάβδου","ῥάβδῳ","ῥάβδον","ῥάβδοι","ῥάβδων","ῥάβδοις","ῥάβδους"],
        ex:["Ἡ ῥάβδος πίπτει.","Βλέπω τὸ τέλος τῆς ῥάβδου.","Τύπτω ἐν τῇ ῥάβδῳ.","Βλέπω τὴν ῥάβδον.",
            "Αἱ ῥάβδοι πίπτουσιν.","Βλέπω τὸ τέλος τῶν ῥάβδων.","Τύπτω ἐν ταῖς ῥάβδοις.","Βλέπω τὰς ῥάβδους."],
        exEn:["The rod is falling.","I see the end of the rod.","I am striking with the rod.","I see the rod.",
              "The rods are falling.","I see the end of the rods.","I am striking with the rods.","I see the rods."]}
    ],
    "n1|feminine":[
      // ἀδελφή is oxytone -- grave when non-final (ἀδελφὴ here)
      {g:"sister",f:["ἀδελφή","ἀδελφῆς","ἀδελφῇ","ἀδελφήν","ἀδελφαί","ἀδελφῶν","ἀδελφαῖς","ἀδελφάς"],
        ex:["Ἡ ἀδελφὴ γράφει.","Βλέπω τὸ βιβλίον τῆς ἀδελφῆς.","Δίδωμι τῇ ἀδελφῇ τὸν ἄρτον.","Βλέπω τὴν ἀδελφήν.",
            "Γράφουσιν αἱ ἀδελφαί.","Βλέπω τὰ βιβλία τῶν ἀδελφῶν.","Δίδωμι ταῖς ἀδελφαῖς τὸν ἄρτον.","Βλέπω τὰς ἀδελφάς."],
        exEn:["The sister is writing.","I see the sister's book.","I am giving the sister the bread.","I see the sister.",
              "The sisters are writing.","I see the sisters' books.","I am giving the sisters the bread.","I see the sisters."]},
      // ζωή is oxytone -- grave when non-final (ζωὴ, ζωαὶ here)
      {g:"life",f:["ζωή","ζωῆς","ζωῇ","ζωήν","ζωαί","ζωῶν","ζωαῖς","ζωάς"],
        ex:["Ἡ ζωὴ μένει.","Βλέπω τὴν ἀρχὴν τῆς ζωῆς.","Πιστεύω τῇ ζωῇ.","Βλέπω τὴν ζωήν.",
            "Αἱ ζωαὶ μένουσιν.","Βλέπω τὴν ἀρχὴν τῶν ζωῶν.","Πιστεύω ταῖς ζωαῖς.","Βλέπω τὰς ζωάς."],
        exEn:["The life remains.","I see the beginning of the life.","I believe the life.","I see the life.",
              "The lives remain.","I see the beginning of the lives.","I believe the lives.","I see the lives."]},
      // ἀγάπη is paroxytone -- never shifts
      {g:"love",f:["ἀγάπη","ἀγάπης","ἀγάπῃ","ἀγάπην","ἀγάπαι","ἀγαπῶν","ἀγάπαις","ἀγάπας"],
        ex:["Ἡ ἀγάπη μένει.","Βλέπω τὸ ἔργον τῆς ἀγάπης.","Μένω ἐν τῇ ἀγάπῃ.","Βλέπω τὴν ἀγάπην.",
            "Αἱ ἀγάπαι μένουσιν.","Βλέπω τὸ ἔργον τῶν ἀγαπῶν.","Μένω ἐν ταῖς ἀγάπαις.","Βλέπω τὰς ἀγάπας."],
        exEn:["The love remains.","I see the work of the love.","I am remaining in love.","I see the love.",
              "The loves remain.","I see the work of the loves.","I am remaining in the loves.","I see the loves."]}
    ],
    "n1|feminine after e, i, r":[
      {g:"door",f:["θύρα","θύρας","θύρᾳ","θύραν","θύραι","θυρῶν","θύραις","θύρας"],
        ex:["Ἡ θύρα μένει.","Ἀκούω τὴν φωνὴν τῆς θύρας.","Μένω ἐν τῇ θύρᾳ.","Βλέπω τὴν θύραν τοῦ οἴκου.",
            "Αἱ θύραι μένουσιν.","Ἀκούω τὰς φωνὰς τῶν θυρῶν.","Μένω ἐν ταῖς θύραις.","Βλέπω τὰς θύρας τοῦ οἴκου."],
        exEn:["The door remains.","I hear the sound of the door.","I am remaining at the door.","I see the door of the house.",
              "The doors remain.","I hear the sounds of the doors.","I am remaining at the doors.","I see the doors of the house."]},
      // καρδία is paroxytone -- never shifts
      {g:"heart",f:["καρδία","καρδίας","καρδίᾳ","καρδίαν","καρδίαι","καρδιῶν","καρδίαις","καρδίας"],
        ex:["Ἡ καρδία κράζει.","Ἀκούω τὴν φωνὴν τῆς καρδίας.","Μένω ἐν τῇ καρδίᾳ.","Βλέπω τὴν καρδίαν.",
            "Αἱ καρδίαι κράζουσιν.","Ἀκούω τὴν φωνὴν τῶν καρδιῶν.","Μένω ἐν ταῖς καρδίαις.","Βλέπω τὰς καρδίας."],
        exEn:["The heart cries out.","I hear the voice of the heart.","I am remaining in the heart.","I see the heart.",
              "The hearts cry out.","I hear the voice of the hearts.","I am remaining in the hearts.","I see the hearts."]},
      // ἐκκλησία is paroxytone -- never shifts
      {g:"congregation",f:["ἐκκλησία","ἐκκλησίας","ἐκκλησίᾳ","ἐκκλησίαν","ἐκκλησίαι","ἐκκλησιῶν","ἐκκλησίαις","ἐκκλησίας"],
        ex:["Ἡ ἐκκλησία μένει.","Ἀκούω τὴν φωνὴν τῆς ἐκκλησίας.","Μένω ἐν τῇ ἐκκλησίᾳ.","Βλέπω τὴν ἐκκλησίαν.",
            "Αἱ ἐκκλησίαι μένουσιν.","Ἀκούω τὴν φωνὴν τῶν ἐκκλησιῶν.","Μένω ἐν ταῖς ἐκκλησίαις.","Βλέπω τὰς ἐκκλησίας."],
        exEn:["The congregation remains.","I hear the voice of the congregation.","I am remaining in the congregation.","I see the congregation.",
              "The congregations remain.","I hear the voice of the congregations.","I am remaining in the congregations.","I see the congregations."]}
    ],
    "n1|feminine after a sibilant":[
      {g:"table",f:["τράπεζα","τραπέζης","τραπέζῃ","τράπεζαν","τράπεζαι","τραπεζῶν","τραπέζαις","τραπέζας"],
        ex:["Ἡ τράπεζα μένει.","Βλέπω τὸν ἄρτον ἐπὶ τῆς τραπέζης.","Ὁ ἄρτος μένει ἐπὶ τῇ τραπέζῃ.","Βλέπω τὴν τράπεζαν.",
            "Αἱ τράπεζαι μένουσιν.","Βλέπω τὸν ἄρτον ἐπὶ τῶν τραπεζῶν.","Ὁ ἄρτος μένει ἐπὶ ταῖς τραπέζαις.","Βλέπω τὰς τραπέζας."],
        exEn:["The table remains.","I see the bread on the table.","The bread remains on the table.","I see the table.",
              "The tables remain.","I see the bread on the tables.","The bread remains on the tables.","I see the tables."]},
      // θάλασσα is proparoxytone (accent on the antepenult) -- never shifts
      {g:"sea",f:["θάλασσα","θαλάσσης","θαλάσσῃ","θάλασσαν","θάλασσαι","θαλασσῶν","θαλάσσαις","θαλάσσας"],
        ex:["Ἡ θάλασσα μένει.","Βλέπω τὸ ὕδωρ τῆς θαλάσσης.","Μένω ἐν τῇ θαλάσσῃ.","Βλέπω τὴν θάλασσαν.",
            "Αἱ θάλασσαι μένουσιν.","Βλέπω τὸ ὕδωρ τῶν θαλασσῶν.","Μένω ἐν ταῖς θαλάσσαις.","Βλέπω τὰς θαλάσσας."],
        exEn:["The sea remains.","I see the water of the sea.","I am remaining in the sea.","I see the sea.",
              "The seas remain.","I see the water of the seas.","I am remaining in the seas.","I see the seas."]},
      // δόξα is paroxytone -- never shifts
      {g:"brightness",f:["δόξα","δόξης","δόξῃ","δόξαν","δόξαι","δοξῶν","δόξαις","δόξας"],
        ex:["Ἡ δόξα μένει.","Βλέπω τὸ φῶς τῆς δόξης.","Μένω ἐν τῇ δόξῃ.","Βλέπω τὴν δόξαν.",
            "Αἱ δόξαι μένουσιν.","Βλέπω τὸ φῶς τῶν δοξῶν.","Μένω ἐν ταῖς δόξαις.","Βλέπω τὰς δόξας."],
        exEn:["The glory remains.","I see the light of the glory.","I am remaining in the glory.","I see the glory.",
              "The glories remain.","I see the light of the glories.","I am remaining in the glories.","I see the glories."]}
    ],
    "n1|masculine":[
      // δεσπότης is paroxytone -- never shifts
      {g:"master",f:["δεσπότης","δεσπότου","δεσπότῃ","δεσπότην","δεσπόται","δεσποτῶν","δεσπόταις","δεσπότας"],
        ex:["Ὁ δεσπότης λέγει.","Βλέπω τὸν οἶκον τοῦ δεσπότου.","Λέγω τῷ δεσπότῃ.","Βλέπω τὸν δεσπότην.",
            "Οἱ δεσπόται λέγουσιν.","Βλέπω τοὺς οἴκους τῶν δεσποτῶν.","Λέγω τοῖς δεσπόταις.","Βλέπω τοὺς δεσπότας."],
        exEn:["The master is speaking.","I see the master's house.","I am speaking to the master.","I see the master.",
              "The masters are speaking.","I see the masters' houses.","I am speaking to the masters.","I see the masters."]},
      // μαθητής is oxytone -- grave when non-final (μαθητὴς, μαθηταὶ here)
      {g:"disciple",f:["μαθητής","μαθητοῦ","μαθητῇ","μαθητήν","μαθηταί","μαθητῶν","μαθηταῖς","μαθητάς"],
        ex:["Ὁ μαθητὴς ἀκούει.","Βλέπω τὸν οἶκον τοῦ μαθητοῦ.","Λέγω τῷ μαθητῇ.","Βλέπω τὸν μαθητήν.",
            "Οἱ μαθηταὶ ἀκούουσιν.","Βλέπω τὸν οἶκον τῶν μαθητῶν.","Λέγω τοῖς μαθηταῖς.","Βλέπω τοὺς μαθητάς."],
        exEn:["The disciple is listening.","I see the house of the disciple.","I am speaking to the disciple.","I see the disciple.",
              "The disciples are listening.","I see the house of the disciples.","I am speaking to the disciples.","I see the disciples."]},
      // προφήτης is paroxytone (accent on the penult, not the ultima) --
      // never shifts; its plural προφῆται carries a circumflex on that same
      // penult, likewise immune
      {g:"prophet",f:["προφήτης","προφήτου","προφήτῃ","προφήτην","προφῆται","προφητῶν","προφήταις","προφήτας"],
        ex:["Ὁ προφήτης κράζει.","Ἀκούω τὸν λόγον τοῦ προφήτου.","Λέγω τῷ προφήτῃ.","Βλέπω τὸν προφήτην.",
            "Οἱ προφῆται κράζουσιν.","Ἀκούω τὸν λόγον τῶν προφητῶν.","Λέγω τοῖς προφήταις.","Βλέπω τοὺς προφήτας."],
        exEn:["The prophet cries out.","I hear the word of the prophet.","I am speaking to the prophet.","I see the prophet.",
              "The prophets cry out.","I hear the word of the prophets.","I am speaking to the prophets.","I see the prophets."]}
    ],
    // ---- 3rd declension: n3 never had a NOUNSETS entry before the
    // seventh pass (John had only learned one word per paradigm). Checked
    // the lesson PDFs (9.3, 10.1 for the neuter -μα/-ας pattern; 15.3, 16.3
    // for the masc/fem -ξ pattern) against the app's own taught-vocabulary
    // list: σπέρμα's own vocabulary table (9.3) also teaches αἷμα, στόμα,
    // κέρας, ῥῆμα as the same declension pattern, of which στόμα and κέρας
    // were picked (natural, countable plurals -- see the build notes for
    // why αἷμα/ῥῆμα/ὕδωρ/μέλι/ἅλας/φῶς were passed over); σάλπιγξ's
    // pattern is shared by φοῖνιξ, πίναξ, λάρυγξ, θρίξ (16.3) and by γυνή
    // and σάρξ, both taught earlier (15.1) and both far more central NT
    // vocabulary than the 16.3 words, so those two were picked instead.
    "n3|neuter":[
      {g:"seed",f:["σπέρμα","σπέρματος","σπέρματι","σπέρμα","σπέρματα","σπερμάτων","σπέρμασι(ν)","σπέρματα"],
        ex:["Τὸ σπέρμα πίπτει.","Βλέπω τὸν καρπὸν τοῦ σπέρματος.","Μένω ἐν τῷ σπέρματι.","Βλέπω τὸ σπέρμα.",
            "Τὰ σπέρματα πίπτει.","Βλέπω τὸν καρπὸν τῶν σπερμάτων.","Μένω ἐν τοῖς σπέρμασιν.","Βλέπω τὰ σπέρματα."],
        exEn:["The seed is falling.","I see the fruit of the seed.","I am remaining in the seed.","I see the seed.",
              "The seeds are falling.","I see the fruit of the seeds.","I am remaining in the seeds.","I see the seeds."]},
      // στόμα is paroxytone (like σπέρμα) -- never shifts
      {g:"mouth",f:["στόμα","στόματος","στόματι","στόμα","στόματα","στομάτων","στόμασι(ν)","στόματα"],
        ex:["Τὸ στόμα λέγει.","Ἀκούω τὸν λόγον τοῦ στόματος.","Μένω ἐν τῷ στόματι.","Βλέπω τὸ στόμα.",
            "Τὰ στόματα λέγει.","Ἀκούω τὸν λόγον τῶν στομάτων.","Μένω ἐν τοῖς στόμασιν.","Βλέπω τὰ στόματα."],
        exEn:["The mouth speaks.","I hear the word of the mouth.","I am remaining in the mouth.","I see the mouth.",
              "The mouths speak.","I hear the word of the mouths.","I am remaining in the mouths.","I see the mouths."]},
      // κέρας is paroxytone -- never shifts
      {g:"horn",f:["κέρας","κέρατος","κέρατι","κέρας","κέρατα","κεράτων","κέρασι(ν)","κέρατα"],
        ex:["Τὸ κέρας πίπτει.","Βλέπω τὸ τέλος τοῦ κέρατος.","Μένω ἐν τῷ κέρατι.","Βλέπω τὸ κέρας.",
            "Τὰ κέρατα πίπτει.","Βλέπω τὸ τέλος τῶν κεράτων.","Μένω ἐν τοῖς κέρασιν.","Βλέπω τὰ κέρατα."],
        exEn:["The horn is falling.","I see the end of the horn.","I am remaining on the horn.","I see the horn.",
              "The horns are falling.","I see the end of the horns.","I am remaining on the horns.","I see the horns."]}
    ],
    // σάλπιγξ, σάρξ and γυνή are all grammatically feminine despite the
    // paradigm's "masculine or feminine" label, which names the shared
    // 3rd-declension -ξ ending set, not any one word's own gender
    "n3|masculine or feminine":[
      {g:"trumpet",f:["σάλπιγξ","σάλπιγγος","σάλπιγγι","σάλπιγγα","σάλπιγγες","σαλπίγγων","σάλπιγξι(ν)","σάλπιγγας"],
        ex:["Ἡ σάλπιγξ κράζει.","Ἀκούω τὴν φωνὴν τῆς σάλπιγγος.","Μένω ἐν τῇ σάλπιγγι.","Ἀκούω τὴν σάλπιγγα.",
            "Αἱ σάλπιγγες κράζουσιν.","Ἀκούω τὰς φωνὰς τῶν σαλπίγγων.","Μένω ἐν ταῖς σάλπιγξιν.","Ἀκούω τὰς σάλπιγγας."],
        exEn:["The trumpet is sounding.","I hear the sound of the trumpet.","I am remaining by the trumpet.","I hear the trumpet.",
              "The trumpets are sounding.","I hear the sound of the trumpets.","I am remaining by the trumpets.","I hear the trumpets."]},
      // σάρξ is a monosyllable and oxytone throughout -- grave when
      // non-final (σὰρξ here); gen/dat sg and gen/dat pl carry the
      // monosyllable accent-on-ultima rule but stay sentence-final below,
      // so no shift is needed there
      {g:"flesh",f:["σάρξ","σαρκός","σαρκί","σάρκα","σάρκες","σαρκῶν","σαρξί(ν)","σάρκας"],
        ex:["Ἡ σὰρξ μένει.","Βλέπω τὸ αἷμα τῆς σαρκός.","Μένω ἐν τῇ σαρκί.","Βλέπω τὴν σάρκα.",
            "Αἱ σάρκες μένουσιν.","Βλέπω τὸ αἷμα τῶν σαρκῶν.","Μένω ἐν ταῖς σαρξίν.","Βλέπω τὰς σάρκας."],
        exEn:["The flesh remains.","I see the blood of the flesh.","I am remaining in the flesh.","I see the flesh.",
              "The fleshes remain.","I see the blood of the fleshes.","I am remaining in the fleshes.","I see the fleshes."]},
      // γυνή is irregular (stem γυναικ-) and oxytone in the nominative
      // singular only -- grave when non-final (γυνὴ here); γυναῖκα/
      // γυναῖκες/γυναῖκας all carry a circumflex on the penult per the
      // lesson's own stated rule and never shift
      {g:"woman",f:["γυνή","γυναικός","γυναικί","γυναῖκα","γυναῖκες","γυναικῶν","γυναιξί(ν)","γυναῖκας"],
        ex:["Ἡ γυνὴ ἔρχεται.","Βλέπω τὸν οἶκον τῆς γυναικός.","Λέγω τῇ γυναικί.","Βλέπω τὴν γυναῖκα.",
            "Αἱ γυναῖκες ἔρχονται.","Βλέπω τὸν οἶκον τῶν γυναικῶν.","Λέγω ταῖς γυναιξίν.","Βλέπω τὰς γυναῖκας."],
        exEn:["The woman is coming.","I see the house of the woman.","I am speaking to the woman.","I see the woman.",
              "The women are coming.","I see the house of the women.","I am speaking to the women.","I see the women."]}
    ]
  };

  // Metadata for the Nouns settings group -- label shown next to each
  // paradigm's dropdown. Order matches the deck rail (n2 before n1, then n3).
  var NOUN_PARADIGMS = [
    {key:"n2|masculine",label:"2nd Decl. \u2014 masculine"},
    {key:"n2|neuter",label:"2nd Decl. \u2014 neuter"},
    {key:"n2|feminine",label:"2nd Decl. \u2014 feminine (\u1f41\u03b4\u03cc\u03c2-type)"},
    {key:"n1|feminine",label:"1st Decl. \u2014 \u03b7 \u03b7\u03c2"},
    {key:"n1|feminine after e, i, r",label:"1st Decl. \u2014 \u03b1 \u03b1\u03c2"},
    {key:"n1|feminine after a sibilant",label:"1st Decl. \u2014 \u03b1 \u03b7\u03c2"},
    {key:"n1|masculine",label:"1st Decl. \u2014 \u03b7\u03c2 \u03bf\u03c5 (masc.)"},
    {key:"n3|neuter",label:"3rd Decl. \u2014 neuter"},
    {key:"n3|masculine or feminine",label:"3rd Decl. \u2014 masc./fem. (-\u03be)"}
  ];

  // Rotating verb sets -- added 2026-09-10 (ninth pass), the verb-deck
  // counterpart to NOUNSETS above. Unlike nouns, each of these six decks
  // covers exactly one paradigm (there's no separate |paradigm key -- the
  // whole deck IS the paradigm), so this is keyed by deck id alone. Every
  // entry is {f:[6 forms in 1s,2s,3s,1p,2p,3p order], g:[6 bare glosses,
  // same order], ex:[6 sentences], exEn:[6 English]} -- same uniform shape
  // NOUNSETS settled on in the seventh pass, applied here from the start.
  // Entry 0 is always the deck's original default verb. The other two were
  // picked from vocabulary already taught by chapter 16 (checked against
  // WORDS) and, for the two thematic-aorist additions, from words the
  // lessons themselves already introduce AS aorist forms (\u03b5\u1f36\u03c0\u03bf\u03bd at 11.2,
  // \u03b5\u1f36\u03b4\u03bf\u03bd at 11.3, glossed "aorist of \u03bb\u03ad\u03b3\u03c9/\u1f41\u03c1\u03ac\u03c9" right in the vocab table) --
  // no lesson PDF gives these two a full paradigm of their own to check
  // against (they're vocabulary entries, not the subject of a grammar
  // lesson), so the non-1st-singular forms follow the fully regular
  // thematic-aorist endings already used for \u1f14\u03bb\u03b1\u03b2\u03bf\u03bd in this same deck
  // (\u03b5\u1f36\u03c0\u03b5\u03c2/\u03b5\u1f34\u03c0\u03bf\u03bc\u03b5\u03bd/\u03b5\u1f34\u03c0\u03b5\u03c4\u03b5, not the mixed \u03b5\u1f36\u03c0\u03b1\u03c2/\u03b5\u1f34\u03c0\u03b1\u03c4\u03b5 alternate also
  // attested in the NT) -- consistent with what this deck actually teaches,
  // the regular ending pattern, rather than importing an exception form
  // nothing else here has introduced.
  var VERBSETS = {
    "vpres":[
      {f:["\u03ba\u03c1\u03ac\u03b6\u03c9","\u03ba\u03c1\u03ac\u03b6\u03b5\u03b9\u03c2","\u03ba\u03c1\u03ac\u03b6\u03b5\u03b9","\u03ba\u03c1\u03ac\u03b6\u03bf\u03bc\u03b5\u03bd","\u03ba\u03c1\u03ac\u03b6\u03b5\u03c4\u03b5","\u03ba\u03c1\u03ac\u03b6\u03bf\u03c5\u03c3\u03b9(\u03bd)"],
       g:["I shout","you shout","he/she shouts","we shout","you (pl) shout","they shout"],
       ex:["\u039a\u03c1\u03ac\u03b6\u03c9 \u1f10\u03bd \u03c4\u1ff7 \u03bf\u1f34\u03ba\u1ff3.","\u039a\u03c1\u03ac\u03b6\u03b5\u03b9\u03c2 \u1f10\u03bd \u03c4\u1fc7 \u1f41\u03b4\u1ff7.","\u1f49 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03c2 \u03ba\u03c1\u03ac\u03b6\u03b5\u03b9.","\u039a\u03c1\u03ac\u03b6\u03bf\u03bc\u03b5\u03bd \u1f10\u03bd \u03c4\u1fc7 \u1f10\u03ba\u03ba\u03bb\u03b7\u03c3\u03af\u1fb3.","\u039a\u03c1\u03ac\u03b6\u03b5\u03c4\u03b5 \u03c0\u03c1\u1f78\u03c2 \u03c4\u1f78\u03bd \u03b8\u03b5\u03cc\u03bd.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u03ba\u03c1\u03ac\u03b6\u03bf\u03c5\u03c3\u03b9\u03bd."],
       exEn:["I shout in the house.","You shout in the road.","The man shouts.","We shout in the congregation.","You (pl) shout to God.","The disciples shout."]},
      {f:["\u03b2\u03bb\u03ad\u03c0\u03c9","\u03b2\u03bb\u03ad\u03c0\u03b5\u03b9\u03c2","\u03b2\u03bb\u03ad\u03c0\u03b5\u03b9","\u03b2\u03bb\u03ad\u03c0\u03bf\u03bc\u03b5\u03bd","\u03b2\u03bb\u03ad\u03c0\u03b5\u03c4\u03b5","\u03b2\u03bb\u03ad\u03c0\u03bf\u03c5\u03c3\u03b9(\u03bd)"],
       g:["I see","you see","he/she sees","we see","you (pl) see","they see"],
       ex:["\u0392\u03bb\u03ad\u03c0\u03c9 \u03c4\u1f78\u03bd \u03bf\u1f36\u03ba\u03bf\u03bd.","\u0392\u03bb\u03ad\u03c0\u03b5\u03b9\u03c2 \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u03b2\u03bb\u03ad\u03c0\u03b5\u03b9 \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd.","\u0392\u03bb\u03ad\u03c0\u03bf\u03bc\u03b5\u03bd \u03c4\u1f74\u03bd \u1f10\u03ba\u03ba\u03bb\u03b7\u03c3\u03af\u03b1\u03bd.","\u0392\u03bb\u03ad\u03c0\u03b5\u03c4\u03b5 \u03c4\u1f78 \u03c4\u03ad\u03ba\u03bd\u03bf\u03bd.","\u039f\u1f31 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03b9 \u03b2\u03bb\u03ad\u03c0\u03bf\u03c5\u03c3\u03b9\u03bd \u03c4\u1f78\u03bd \u03b8\u03b5\u03cc\u03bd."],
       exEn:["I see the house.","You see the word.","The disciple sees the lord.","We see the congregation.","You (pl) see the child.","The men see God."]},
      {f:["\u03b3\u03c1\u03ac\u03c6\u03c9","\u03b3\u03c1\u03ac\u03c6\u03b5\u03b9\u03c2","\u03b3\u03c1\u03ac\u03c6\u03b5\u03b9","\u03b3\u03c1\u03ac\u03c6\u03bf\u03bc\u03b5\u03bd","\u03b3\u03c1\u03ac\u03c6\u03b5\u03c4\u03b5","\u03b3\u03c1\u03ac\u03c6\u03bf\u03c5\u03c3\u03b9(\u03bd)"],
       g:["I write","you write","he/she writes","we write","you (pl) write","they write"],
       ex:["\u0393\u03c1\u03ac\u03c6\u03c9 \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u0393\u03c1\u03ac\u03c6\u03b5\u03b9\u03c2 \u03c4\u1f74\u03bd \u1f10\u03c0\u03b9\u03c3\u03c4\u03bf\u03bb\u03ae\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u03b3\u03c1\u03ac\u03c6\u03b5\u03b9.","\u0393\u03c1\u03ac\u03c6\u03bf\u03bc\u03b5\u03bd \u03c4\u1f74\u03bd \u1f10\u03c0\u03b9\u03c3\u03c4\u03bf\u03bb\u03ae\u03bd.","\u0393\u03c1\u03ac\u03c6\u03b5\u03c4\u03b5 \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u03b3\u03c1\u03ac\u03c6\u03bf\u03c5\u03c3\u03b9\u03bd."],
       exEn:["I write the word.","You write the letter.","The disciple writes.","We write the letter.","You (pl) write the word.","The disciples write."]}
    ],
    "vfut":[
      {f:["\u03bd\u03b5\u03cd\u03c3\u03c9","\u03bd\u03b5\u03cd\u03c3\u03b5\u03b9\u03c2","\u03bd\u03b5\u03cd\u03c3\u03b5\u03b9","\u03bd\u03b5\u03cd\u03c3\u03bf\u03bc\u03b5\u03bd","\u03bd\u03b5\u03cd\u03c3\u03b5\u03c4\u03b5","\u03bd\u03b5\u03cd\u03c3\u03bf\u03c5\u03c3\u03b9(\u03bd)"],
       g:["I will nod","you will nod","he/she will nod","we will nod","you (pl) will nod","they will nod"],
       ex:["\u039d\u03b5\u03cd\u03c3\u03c9 \u03c4\u1ff7 \u1f00\u03bd\u03b8\u03c1\u03ce\u03c0\u1ff3.","\u039d\u03b5\u03cd\u03c3\u03b5\u03b9\u03c2 \u03c4\u1fc7 \u1f00\u03b4\u03b5\u03bb\u03c6\u1fc7.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u03bd\u03b5\u03cd\u03c3\u03b5\u03b9.","\u039d\u03b5\u03cd\u03c3\u03bf\u03bc\u03b5\u03bd \u03c4\u1ff7 \u03ba\u03c5\u03c1\u03af\u1ff3.","\u039d\u03b5\u03cd\u03c3\u03b5\u03c4\u03b5 \u03c4\u1ff7 \u03b8\u03b5\u1ff7.","\u039f\u1f31 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03b9 \u03bd\u03b5\u03cd\u03c3\u03bf\u03c5\u03c3\u03b9\u03bd."],
       exEn:["I will nod to the man.","You will nod to the sister.","The disciple will nod.","We will nod to the lord.","You (pl) will nod to God.","The men will nod."]},
      {f:["\u03b2\u03bb\u03ad\u03c8\u03c9","\u03b2\u03bb\u03ad\u03c8\u03b5\u03b9\u03c2","\u03b2\u03bb\u03ad\u03c8\u03b5\u03b9","\u03b2\u03bb\u03ad\u03c8\u03bf\u03bc\u03b5\u03bd","\u03b2\u03bb\u03ad\u03c8\u03b5\u03c4\u03b5","\u03b2\u03bb\u03ad\u03c8\u03bf\u03c5\u03c3\u03b9(\u03bd)"],
       g:["I will see","you will see","he/she will see","we will see","you (pl) will see","they will see"],
       ex:["\u0392\u03bb\u03ad\u03c8\u03c9 \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd.","\u0392\u03bb\u03ad\u03c8\u03b5\u03b9\u03c2 \u03c4\u1f78\u03bd \u03bf\u1f36\u03ba\u03bf\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u03b2\u03bb\u03ad\u03c8\u03b5\u03b9 \u03c4\u1f78\u03bd \u03b8\u03b5\u03cc\u03bd.","\u0392\u03bb\u03ad\u03c8\u03bf\u03bc\u03b5\u03bd \u03c4\u1f74\u03bd \u1f10\u03ba\u03ba\u03bb\u03b7\u03c3\u03af\u03b1\u03bd.","\u0392\u03bb\u03ad\u03c8\u03b5\u03c4\u03b5 \u03c4\u1f78 \u03c4\u03ad\u03ba\u03bd\u03bf\u03bd.","\u039f\u1f31 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03b9 \u03b2\u03bb\u03ad\u03c8\u03bf\u03c5\u03c3\u03b9\u03bd \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd."],
       exEn:["I will see the lord.","You will see the house.","The disciple will see God.","We will see the congregation.","You (pl) will see the child.","The men will see the lord."]},
      {f:["\u03ba\u03c1\u03ac\u03be\u03c9","\u03ba\u03c1\u03ac\u03be\u03b5\u03b9\u03c2","\u03ba\u03c1\u03ac\u03be\u03b5\u03b9","\u03ba\u03c1\u03ac\u03be\u03bf\u03bc\u03b5\u03bd","\u03ba\u03c1\u03ac\u03be\u03b5\u03c4\u03b5","\u03ba\u03c1\u03ac\u03be\u03bf\u03c5\u03c3\u03b9(\u03bd)"],
       g:["I will shout","you will shout","he/she will shout","we will shout","you (pl) will shout","they will shout"],
       ex:["\u039a\u03c1\u03ac\u03be\u03c9 \u1f10\u03bd \u03c4\u1fc7 \u1f10\u03ba\u03ba\u03bb\u03b7\u03c3\u03af\u1fb3.","\u039a\u03c1\u03ac\u03be\u03b5\u03b9\u03c2 \u03c0\u03c1\u1f78\u03c2 \u03c4\u1f78\u03bd \u03b8\u03b5\u03cc\u03bd.","\u1f49 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03c2 \u03ba\u03c1\u03ac\u03be\u03b5\u03b9.","\u039a\u03c1\u03ac\u03be\u03bf\u03bc\u03b5\u03bd \u1f10\u03bd \u03c4\u1ff7 \u1f31\u03b5\u03c1\u1ff7.","\u039a\u03c1\u03ac\u03be\u03b5\u03c4\u03b5 \u03c0\u03c1\u1f78\u03c2 \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u03ba\u03c1\u03ac\u03be\u03bf\u03c5\u03c3\u03b9\u03bd."],
       exEn:["I will shout in the congregation.","You will shout to God.","The man will shout.","We will shout in the temple.","You (pl) will shout to the lord.","The disciples will shout."]}
    ],
    "vaor2":[
      {f:["\u1f14\u03bb\u03b1\u03b2\u03bf\u03bd","\u1f14\u03bb\u03b1\u03b2\u03b5\u03c2","\u1f14\u03bb\u03b1\u03b2\u03b5(\u03bd)","\u1f10\u03bb\u03ac\u03b2\u03bf\u03bc\u03b5\u03bd","\u1f10\u03bb\u03ac\u03b2\u03b5\u03c4\u03b5","\u1f14\u03bb\u03b1\u03b2\u03bf\u03bd"],
       g:["I took","you took","he/she took","we took","you (pl) took","they took"],
       ex:["\u1f1c\u03bb\u03b1\u03b2\u03bf\u03bd \u03c4\u1f78\u03bd \u1f04\u03c1\u03c4\u03bf\u03bd.","\u1f1c\u03bb\u03b1\u03b2\u03b5\u03c2 \u03c4\u1f78 \u03b2\u03b9\u03b2\u03bb\u03af\u03bf\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u1f14\u03bb\u03b1\u03b2\u03b5\u03bd \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u1f18\u03bb\u03ac\u03b2\u03bf\u03bc\u03b5\u03bd \u03c4\u1f78\u03bd \u1f04\u03c1\u03c4\u03bf\u03bd.","\u1f18\u03bb\u03ac\u03b2\u03b5\u03c4\u03b5 \u03c4\u1f78 \u03c4\u03ad\u03ba\u03bd\u03bf\u03bd.","\u039f\u1f31 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03b9 \u1f14\u03bb\u03b1\u03b2\u03bf\u03bd \u03c4\u1f78\u03bd \u03bf\u1f36\u03ba\u03bf\u03bd."],
       exEn:["I took the bread.","You took the book.","The disciple took the word.","We took the bread.","You (pl) took the child.","The men took the house."]},
      {f:["\u03b5\u1f36\u03c0\u03bf\u03bd","\u03b5\u1f36\u03c0\u03b5\u03c2","\u03b5\u1f36\u03c0\u03b5(\u03bd)","\u03b5\u1f34\u03c0\u03bf\u03bc\u03b5\u03bd","\u03b5\u1f34\u03c0\u03b5\u03c4\u03b5","\u03b5\u1f36\u03c0\u03bf\u03bd"],
       g:["I said","you said","he/she said","we said","you (pl) said","they said"],
       ex:["\u0395\u1f36\u03c0\u03bf\u03bd \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u0395\u1f36\u03c0\u03b5\u03c2 \u03c4\u1fc7 \u1f00\u03b4\u03b5\u03bb\u03c6\u1fc7.","\u1f49 \u03ba\u03cd\u03c1\u03b9\u03bf\u03c2 \u03b5\u1f36\u03c0\u03b5\u03bd.","\u0395\u1f34\u03c0\u03bf\u03bc\u03b5\u03bd \u03c4\u1ff7 \u03bc\u03b1\u03b8\u03b7\u03c4\u1fc7.","\u0395\u1f34\u03c0\u03b5\u03c4\u03b5 \u03c4\u1ff7 \u03b8\u03b5\u1ff7.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u03b5\u1f36\u03c0\u03bf\u03bd."],
       exEn:["I said the word.","You said to the sister.","The lord said.","We said to the disciple.","You (pl) said to God.","The disciples said."]},
      {f:["\u03b5\u1f36\u03b4\u03bf\u03bd","\u03b5\u1f36\u03b4\u03b5\u03c2","\u03b5\u1f36\u03b4\u03b5(\u03bd)","\u03b5\u1f34\u03b4\u03bf\u03bc\u03b5\u03bd","\u03b5\u1f34\u03b4\u03b5\u03c4\u03b5","\u03b5\u1f36\u03b4\u03bf\u03bd"],
       g:["I saw","you saw","he/she saw","we saw","you (pl) saw","they saw"],
       ex:["\u0395\u1f36\u03b4\u03bf\u03bd \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd.","\u0395\u1f36\u03b4\u03b5\u03c2 \u03c4\u1f78\u03bd \u03bf\u1f36\u03ba\u03bf\u03bd.","\u1f49 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03c2 \u03b5\u1f36\u03b4\u03b5\u03bd \u03c4\u1f78 \u03c4\u03ad\u03ba\u03bd\u03bf\u03bd.","\u0395\u1f34\u03b4\u03bf\u03bc\u03b5\u03bd \u03c4\u1f74\u03bd \u1f10\u03ba\u03ba\u03bb\u03b7\u03c3\u03af\u03b1\u03bd.","\u0395\u1f34\u03b4\u03b5\u03c4\u03b5 \u03c4\u1f78\u03bd \u03b8\u03b5\u03cc\u03bd.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u03b5\u1f36\u03b4\u03bf\u03bd \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd."],
       exEn:["I saw the lord.","You saw the house.","The man saw the child.","We saw the congregation.","You (pl) saw God.","The disciples saw the lord."]}
    ],
    "vaor1":[
      {f:["\u1f14\u03bb\u03c5\u03c3\u03b1","\u1f14\u03bb\u03c5\u03c3\u03b1\u03c2","\u1f14\u03bb\u03c5\u03c3\u03b5(\u03bd)","\u1f10\u03bb\u03cd\u03c3\u03b1\u03bc\u03b5\u03bd","\u1f10\u03bb\u03cd\u03c3\u03b1\u03c4\u03b5","\u1f14\u03bb\u03c5\u03c3\u03b1\u03bd"],
       g:["I loosed","you loosed","he/she loosed","we loosed","you (pl) loosed","they loosed"],
       ex:["\u1f1c\u03bb\u03c5\u03c3\u03b1 \u03c4\u1f74\u03bd \u03b8\u03cd\u03c1\u03b1\u03bd.","\u1f1c\u03bb\u03c5\u03c3\u03b1\u03c2 \u03c4\u1f74\u03bd \u03b8\u03cd\u03c1\u03b1\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u1f14\u03bb\u03c5\u03c3\u03b5\u03bd \u03c4\u1f74\u03bd \u03b8\u03cd\u03c1\u03b1\u03bd.","\u1f18\u03bb\u03cd\u03c3\u03b1\u03bc\u03b5\u03bd \u03c4\u1f74\u03bd \u03b8\u03cd\u03c1\u03b1\u03bd.","\u1f18\u03bb\u03cd\u03c3\u03b1\u03c4\u03b5 \u03c4\u1f74\u03bd \u03b8\u03cd\u03c1\u03b1\u03bd.","\u039f\u1f31 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03b9 \u1f14\u03bb\u03c5\u03c3\u03b1\u03bd \u03c4\u1f74\u03bd \u03b8\u03cd\u03c1\u03b1\u03bd."],
       exEn:["I loosed the door.","You loosed the door.","The disciple loosed the door.","We loosed the door.","You (pl) loosed the door.","The men loosed the door."]},
      {f:["\u1f10\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b1","\u1f10\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b1\u03c2","\u1f10\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b5(\u03bd)","\u1f10\u03c0\u03b9\u03c3\u03c4\u03b5\u03cd\u03c3\u03b1\u03bc\u03b5\u03bd","\u1f10\u03c0\u03b9\u03c3\u03c4\u03b5\u03cd\u03c3\u03b1\u03c4\u03b5","\u1f10\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b1\u03bd"],
       g:["I believed","you believed","he/she believed","we believed","you (pl) believed","they believed"],
       ex:["\u1f18\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b1 \u03c4\u1ff7 \u03bb\u03cc\u03b3\u1ff3.","\u1f18\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b1\u03c2 \u03c4\u1ff7 \u03ba\u03c5\u03c1\u03af\u1ff3.","\u1f49 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03c2 \u1f10\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b5\u03bd \u03c4\u1ff7 \u03b8\u03b5\u1ff7.","\u1f18\u03c0\u03b9\u03c3\u03c4\u03b5\u03cd\u03c3\u03b1\u03bc\u03b5\u03bd \u03c4\u1ff7 \u03bb\u03cc\u03b3\u1ff3.","\u1f18\u03c0\u03b9\u03c3\u03c4\u03b5\u03cd\u03c3\u03b1\u03c4\u03b5 \u03c4\u1ff7 \u03ba\u03c5\u03c1\u03af\u1ff3.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u1f10\u03c0\u03af\u03c3\u03c4\u03b5\u03c5\u03c3\u03b1\u03bd \u03c4\u1ff7 \u03b8\u03b5\u1ff7."],
       exEn:["I believed the word.","You believed the lord.","The man believed God.","We believed the word.","You (pl) believed the lord.","The disciples believed God."]},
      {f:["\u1f24\u03ba\u03bf\u03c5\u03c3\u03b1","\u1f24\u03ba\u03bf\u03c5\u03c3\u03b1\u03c2","\u1f24\u03ba\u03bf\u03c5\u03c3\u03b5(\u03bd)","\u1f20\u03ba\u03bf\u03cd\u03c3\u03b1\u03bc\u03b5\u03bd","\u1f20\u03ba\u03bf\u03cd\u03c3\u03b1\u03c4\u03b5","\u1f24\u03ba\u03bf\u03c5\u03c3\u03b1\u03bd"],
       g:["I heard","you heard","he/she heard","we heard","you (pl) heard","they heard"],
       ex:["\u1f2c\u03ba\u03bf\u03c5\u03c3\u03b1 \u03c4\u1f74\u03bd \u03c6\u03c9\u03bd\u03ae\u03bd.","\u1f2c\u03ba\u03bf\u03c5\u03c3\u03b1\u03c2 \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u1f24\u03ba\u03bf\u03c5\u03c3\u03b5\u03bd \u03c4\u1f74\u03bd \u03c6\u03c9\u03bd\u03ae\u03bd.","\u1f28\u03ba\u03bf\u03cd\u03c3\u03b1\u03bc\u03b5\u03bd \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u1f28\u03ba\u03bf\u03cd\u03c3\u03b1\u03c4\u03b5 \u03c4\u1f74\u03bd \u03c6\u03c9\u03bd\u03ae\u03bd.","\u039f\u1f31 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03b9 \u1f24\u03ba\u03bf\u03c5\u03c3\u03b1\u03bd \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd."],
       exEn:["I heard the voice.","You heard the word.","The disciple heard the voice.","We heard the word.","You (pl) heard the voice.","The men heard the lord."]}
    ],
    "vimpf":[
      {f:["\u1f10\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03bf\u03bd","\u1f10\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03b5\u03c2","\u1f10\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03b5(\u03bd)","\u1f10\u03bb\u03b1\u03bc\u03b2\u03ac\u03bd\u03bf\u03bc\u03b5\u03bd","\u1f10\u03bb\u03b1\u03bc\u03b2\u03ac\u03bd\u03b5\u03c4\u03b5","\u1f10\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03bf\u03bd"],
       g:["I was taking","you were taking","he/she was taking","we were taking","you (pl) were taking","they were taking"],
       ex:["\u1f18\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03bf\u03bd \u03c4\u1f78\u03bd \u1f04\u03c1\u03c4\u03bf\u03bd.","\u1f18\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03b5\u03c2 \u03c4\u1f78 \u03b2\u03b9\u03b2\u03bb\u03af\u03bf\u03bd.","\u1f49 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03c2 \u1f10\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03b5\u03bd \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u1f18\u03bb\u03b1\u03bc\u03b2\u03ac\u03bd\u03bf\u03bc\u03b5\u03bd \u03c4\u1f78\u03bd \u1f04\u03c1\u03c4\u03bf\u03bd.","\u1f18\u03bb\u03b1\u03bc\u03b2\u03ac\u03bd\u03b5\u03c4\u03b5 \u03c4\u1f78 \u03c4\u03ad\u03ba\u03bd\u03bf\u03bd.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u1f10\u03bb\u03ac\u03bc\u03b2\u03b1\u03bd\u03bf\u03bd \u03c4\u1f78\u03bd \u03bf\u1f36\u03ba\u03bf\u03bd."],
       exEn:["I was taking the bread.","You were taking the book.","The man was taking the word.","We were taking the bread.","You (pl) were taking the child.","The disciples were taking the house."]},
      {f:["\u1f14\u03b2\u03bb\u03b5\u03c0\u03bf\u03bd","\u1f14\u03b2\u03bb\u03b5\u03c0\u03b5\u03c2","\u1f14\u03b2\u03bb\u03b5\u03c0\u03b5(\u03bd)","\u1f10\u03b2\u03bb\u03ad\u03c0\u03bf\u03bc\u03b5\u03bd","\u1f10\u03b2\u03bb\u03ad\u03c0\u03b5\u03c4\u03b5","\u1f14\u03b2\u03bb\u03b5\u03c0\u03bf\u03bd"],
       g:["I was seeing","you were seeing","he/she was seeing","we were seeing","you (pl) were seeing","they were seeing"],
       ex:["\u1f1c\u03b2\u03bb\u03b5\u03c0\u03bf\u03bd \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd.","\u1f1c\u03b2\u03bb\u03b5\u03c0\u03b5\u03c2 \u03c4\u1f74\u03bd \u1f10\u03ba\u03ba\u03bb\u03b7\u03c3\u03af\u03b1\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u1f14\u03b2\u03bb\u03b5\u03c0\u03b5\u03bd \u03c4\u1f78\u03bd \u03b8\u03b5\u03cc\u03bd.","\u1f18\u03b2\u03bb\u03ad\u03c0\u03bf\u03bc\u03b5\u03bd \u03c4\u1f78\u03bd \u03bf\u1f36\u03ba\u03bf\u03bd.","\u1f18\u03b2\u03bb\u03ad\u03c0\u03b5\u03c4\u03b5 \u03c4\u1f78 \u03c4\u03ad\u03ba\u03bd\u03bf\u03bd.","\u039f\u1f31 \u1f04\u03bd\u03b8\u03c1\u03c9\u03c0\u03bf\u03b9 \u1f14\u03b2\u03bb\u03b5\u03c0\u03bf\u03bd \u03c4\u1f78\u03bd \u03ba\u03cd\u03c1\u03b9\u03bf\u03bd."],
       exEn:["I was seeing the lord.","You were seeing the congregation.","The disciple was seeing God.","We were seeing the house.","You (pl) were seeing the child.","The men were seeing the lord."]},
      {f:["\u1f14\u03b3\u03c1\u03b1\u03c6\u03bf\u03bd","\u1f14\u03b3\u03c1\u03b1\u03c6\u03b5\u03c2","\u1f14\u03b3\u03c1\u03b1\u03c6\u03b5(\u03bd)","\u1f10\u03b3\u03c1\u03ac\u03c6\u03bf\u03bc\u03b5\u03bd","\u1f10\u03b3\u03c1\u03ac\u03c6\u03b5\u03c4\u03b5","\u1f14\u03b3\u03c1\u03b1\u03c6\u03bf\u03bd"],
       g:["I was writing","you were writing","he/she was writing","we were writing","you (pl) were writing","they were writing"],
       ex:["\u1f1c\u03b3\u03c1\u03b1\u03c6\u03bf\u03bd \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u1f1c\u03b3\u03c1\u03b1\u03c6\u03b5\u03c2 \u03c4\u1f74\u03bd \u1f10\u03c0\u03b9\u03c3\u03c4\u03bf\u03bb\u03ae\u03bd.","\u1f49 \u03bc\u03b1\u03b8\u03b7\u03c4\u1f74\u03c2 \u1f14\u03b3\u03c1\u03b1\u03c6\u03b5\u03bd.","\u1f18\u03b3\u03c1\u03ac\u03c6\u03bf\u03bc\u03b5\u03bd \u03c4\u1f74\u03bd \u1f10\u03c0\u03b9\u03c3\u03c4\u03bf\u03bb\u03ae\u03bd.","\u1f18\u03b3\u03c1\u03ac\u03c6\u03b5\u03c4\u03b5 \u03c4\u1f78\u03bd \u03bb\u03cc\u03b3\u03bf\u03bd.","\u039f\u1f31 \u03bc\u03b1\u03b8\u03b7\u03c4\u03b1\u1f76 \u1f14\u03b3\u03c1\u03b1\u03c6\u03bf\u03bd."],
       exEn:["I was writing the word.","You were writing the letter.","The disciple was writing.","We were writing the letter.","You (pl) were writing the word.","The disciples were writing."]}
    ]
  };
  // Metadata for the Verbs settings group -- label shown next to each
  // deck's dropdown, same {key,label} shape as NOUN_PARADIGMS. Order
  // matches the deck rail.
  var VERB_DECKS = [
    {key:"vpres",label:"Present Active"},
    {key:"vfut",label:"Future"},
    {key:"vaor2",label:"Thematic Aorist"},
    {key:"vaor1",label:"Sigmatic Aorist"},
    {key:"vimpf",label:"Imperfect"}
  ];
  // The μι Verbs (vmi) deck's roster -- not in VERB_DECKS since it never
  // rotates (see renderVerbSets below), but its dropdown options need the
  // same {key,label}-shaped list every other verb deck gets. Shared by the
  // Settings-panel dropdown (renderVerbSets) and the Reference-panel
  // "Show verb" dropdown (renderRef) so the two never drift apart. Order
  // groups each compound next to its base verb.
  var MI_VERBS = [
    {v:"give",g:"δίδωμι"},{v:"give-back",g:"ἀποδίδωμι"},
    {v:"put",g:"τίθημι"},{v:"add",g:"προστίθημι"},
    {v:"stand",g:"ἵστημι"},{v:"rise",g:"ἀνίστημι"},
    {v:"leave",g:"ἀφίημι"},{v:"understand",g:"συνίημι"},
    {v:"show",g:"δείκνυμι"},
    {v:"fill",g:"πίμπλημι"},
    {v:"destroy",g:"ἀπόλλυμι"}
  ];
  // The medio-passive/deponent (vmp) deck's roster, added 2026-09-16 -- same
  // reason and shape as MI_VERBS just above: vmp used to be one of the six
  // rotating VERBSETS/VERB_DECKS decks (a fixed 3-word pool swapped one at a
  // time), but John wanted every deponent verb taught through lesson 16
  // visible side by side with Settings + Reference dropdowns like vmi, so
  // it was pulled out of VERB_DECKS/VERBSETS entirely (see the vmp deck
  // definition and rollVerbs() above). Order groups each ἔρχομαι/πορεύομαι
  // compound next to its base verb.
  var VMP_VERBS = [
    {v:"come",g:"ἔρχομαι"},{v:"leave",g:"ἀπέρχομαι"},
    {v:"move-into",g:"εἰσέρχομαι"},{v:"approach",g:"προσέρχομαι"},
    {v:"go",g:"πορεύομαι"},{v:"travel-through",g:"διαπορεύομαι"},
    {v:"taste",g:"γεύομαι"},
    {v:"touch",g:"ἅπτομαι"},
    {v:"greet",g:"ἀσπάζομαι"},
    {v:"work",g:"ἐργάζομαι"},
    {v:"receive",g:"δέχομαι"},
    {v:"become",g:"γίνομαι"},
    {v:"be-angry",g:"ὀργίζομαι"},
    {v:"turn-around",g:"στρέφομαι"},
    {v:"be-baptized",g:"βαπτίζομαι"},
    {v:"want",g:"βούλομαι"},
    {v:"sit",g:"κάθημαι"}
  ];

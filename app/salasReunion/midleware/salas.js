let UtilFecha = {
  convertDate: (inputFormat) => {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
  },

  getIsSame: (fechaActual, fechaRegistro) => {
    let fechaInicio = new Date(fechaActual);
    let fechaFinal = new Date(fechaRegistro);
    return fechaInicio - fechaFinal == 0;
  },

  getFecha: () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    var seg = today.getSeconds();

    if (min < 10) {
      min = "0" + min;
    }
    if (seg < 10) {
      seg = "0" + seg;
    }
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }
    return (
      "" + yyyy + "-" + mm + "-" + dd + " " + "" + hh + ":" + min + ":" + seg
    );
  },
};

let CallInit = {
  showSala: (sala) => {
    const domain = "meet.jit.si";
    const options = {
      roomName: sala.roomName, //RECIBIR DESDE URL
      parentNode: document.querySelector("#meet"),
      interfaceConfigOverwrite: {
        LANG_DETECTION: true,
        defaultLanguage: "es",
        DEFAULT_LOCAL_DISPLAY_NAME: "Yo",
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_REMOTE_DISPLAY_NAME: "Invitado",
        APP_NAME: "<Habitanto Meet>",
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "profile",
          "chat",
          "recording",
          "livestreaming",
          "etherpad",
          "sharedvideo",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "feedback",
          "stats",
          "shortcuts",
          "tileview",
          "download",
          "help",
          "mute-everyone",
          "e2ee",
        ],
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
      },
    };
    sala.domain = domain;
    sala.options = options;
    CallInit.runJitisi(sala);
  },
  runJitisi: (sala) => {
    const api = new JitsiMeetExternalAPI(sala.domain, sala.options);
    api.executeCommand("displayName", sala.displayName); //RECIBIR DESDE URL
    api.executeCommand("subject", sala.subject); //RECIBIR DESDE URL
    api.executeCommand(
      "avatarUrl",
      "https://d2hrzhjasluzh8.cloudfront.net/habigato.jpg"
    );

    //Configurar un password para la reunión
    const passMeet = sala.password;
    setTimeout(() => {
      // Cuando un usuario local esta intentando ingresar a la sala
      api.addEventListener("passwordRequired", () => {
        api.executeCommand("password", passMeet);
      });
      // Cuando un usuario local se ha unido a la reunión
      api.addEventListener("videoConferenceJoined", (response) => {
        api.executeCommand("password", passMeet);
      });
    }, 10);
  },
};

let SalaCreate = {
  getUrlSala: (salaInit) => {
    let salaNew = JSON.stringify(salaInit);
    let token = Base64.encode(salaNew);
    return salaInit.uri + "?token=" + token;
  },
  configSala: () => {
    var URLactual = window.location;
    let parametrosSala = URLactual.search;
    parametrosSala = parametrosSala.replace("?token=", "");
    let sala = SalaCreate.getConfigSala(parametrosSala);
    delete sala.uri;
    return sala;
  },
  getConfigSala: (token) => {
    let tokenDecode = Base64.decode(token);
    return JSON.parse(tokenDecode);
  },
};

let Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    }

    return output;
  },

  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);

    return output;
  },

  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },

  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c = (c1 = c2 = 0);

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }
    return string;
  },
};

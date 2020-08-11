$(document).ready(function () {

    $("#sucursal_option").hide()

    let getDataForm = (imput) => $('#' + imput).serializeArray();

    let concursar = () => {
        let formulario_concurso = {}
        formulario_concurso = getDataForm('concurso_form');
        let data_form = validateForm(formulario_concurso);
        if(data_form['paciente'] == 'no') {
            data_form['carcelen'] = 'Contactar'
        }
        let is_concursante = Object.values(data_form).length
        if(is_concursante == 6) {
            $("#formulario_concurso").delay(2000).fadeOut('slow');
            $("#formulario_concurso").html("<h1>Su participación se realizo correctamente</h1>");
            setTimeout(function(){
                window.location.replace("https://www.ortodonciasmile.com/");
            }, 3000);
        }
  
    }

    $('input:radio[name=paciente]').on('click', () => {
        let paciente = $('input:radio[name=paciente]:checked').val();
        if(paciente == 'si') {
            $("#sucursal_option").show()
        }else {
            $("#sucursal_option").hide()
        }
    });
    
    $('#concursar').on('click', () => concursar());
    // Detectar que presionar enter al final
    $("#respuesta").on("keydown", (event) => {
        if (event.which == 13) concursar(); 
    });
});

let validateForm = (formulario_concurso) => {
    let datos_formulario = [];
    formulario_concurso.forEach(element => {
        if (element.value) {
            $("#" + element.name).css("border-color", "green");
            datos_formulario[element.name] = element.value;
        } else {
            $("#" + element.name).css("border-color", "red");
        }
    });

    let is_email = validateEmail(datos_formulario['email']);
    datos_formulario = show_error(datos_formulario, 'email', is_email);
    let is_celular = validateNumber(datos_formulario['telefono']);
    datos_formulario = show_error(datos_formulario, 'telefono', is_celular);
    let is_nombre = validateString(datos_formulario['nombre']);
    datos_formulario = show_error(datos_formulario, 'nombre', is_nombre);

    return datos_formulario;
}

let show_error = (datos_formulario, campo, is_email) => {
    if(!is_email) {
        $("#"+campo).css("border-color", "red")
        $("#exampleModalCenter").modal("show")
        delete datos_formulario[campo]
    }else {
        $("#"+campo).css("border-color", "green")
    }
    return datos_formulario;
}

let validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

let validateNumber = (number) => {
    const re = /^[0-9]+$/;
    return re.test(number);
}

let validateString = (string) => {
    const re = /^[a-zA-Z]+$/
    let isString = string ? re.test(string) : false;
    return  isString;
}
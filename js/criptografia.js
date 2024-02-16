function codifica(texto) {
    var caracteres = texto.value.split("");

    caracteres.forEach(function(item, i) {
        if(item == "a") {
            caracteres[i] = "uE";

        } else if(item == "e") {
            caracteres[i] = "aO";

        } else if(item == "i") {
            caracteres[i] = "aU";

        } else if(item == "o") {
            caracteres[i] = "eI";

        } else if(item == "u") {
            caracteres[i] = "oI";
 
        } else if(item == "A") {
            caracteres[i] = "Eu";

        } else if(item == "E") {
            caracteres[i] = "Oa";

        } else if(item == "I") {
            caracteres[i] = "Ua";

        } else if(item == "O") {
            caracteres[i] = "Ie";

        } else if(item == "U") {
            caracteres[i] = "Io";
 
        } else if(item == "Á") {
            caracteres[i] = "Éu";

        } else if(item == "á") {
            caracteres[i] = "úE";

        } else if(item == "â") {
            caracteres[i] = "uÊ";

        } else if(item == "Â") {
            caracteres[i] = "Êu";

        } else if(item == "à") {
            caracteres[i] = "aa";
 
        } else if(item == "À") {
            caracteres[i] = "eX";

        } else if(item == "é") {
            caracteres[i] = "áO";

        } else if(item == "É") {
            caracteres[i] = "Óa";
 
        } else if(item == "Ê") {
            caracteres[i] = "Ôa";
        
        } else if(item == "ê") {
            caracteres[i] = "âO";

        } else if(item == "Í") {
            caracteres[i] = "Úa";
 
        } else if(item == "í") {
            caracteres[i] = "áU";
        
        } else if(item == "Ó") {
            caracteres[i] = "Íe";
        
        } else if(item == "ó") {
            caracteres[i] = "éI";

        } else if(item == "Ô") {
            caracteres[i] = "Iê";
 
        } else if(item == "ô") {
            caracteres[i] = "êI";
        
        } else if(item == "Ú") {
            caracteres[i] = "Ió";
        
        } else if(item == "ú") {
            caracteres[i] = "oÍ";

        } else if(item == "Ã") {
            caracteres[i] = "F#";
 
        } else if(item == "ã") {
            caracteres[i] = "f#";
        }  

    })
    return caracteres.join("");
}

function decodifica(texto) {
    var codigo = [["a", "uE"], ["e", "aO"], ["i", "aU"], ["o", "eI"], ["u", "oI"], ["A", "Eu"], ["E", "Oa"], ["I", "Ua"], ["O", "Ie"], ["U", "Io"], ["Á", "Éu"], ["á", "úE"], 
    ["â", "uÊ"], ["Â", "Êu"], ["à", "aa"], ["À", "eX"], ["é", "áO"], ["É", "Óa"], ["Ê", "Ôa"], ["ê", "âO"], ["Í", "Ua"], ["í", "áU"], ["Ó", "Íe"], ["ó", "éI"], ["Ô", "Iê"], 
    ["ô", "êI"], ["Ú", "Ió"], ["ú", "oÍ"], ["Ã", "F#"], ["ã", "f#"]];
    texto = texto.value;

    for(var i = 0; i < codigo.length; i++) {
        if(texto.includes(codigo[i][1])) {
            texto = texto.replaceAll(codigo[i][1], codigo[i][0]);
        }
    }
    return texto;
}

function escreveCodificado() {
    var btnCopiar = document.querySelector(".btn-copiar");
    btnCopiar.classList.remove("invisivel");
    
    resultado.textContent = codifica(inputTexto);
}

function escreveDecodificado() {
    var btnCopiar = document.querySelector(".btn-copiar");
    btnCopiar.classList.remove("invisivel");

    resultado.textContent = decodifica(inputTexto);
}

var inputTexto = document.querySelector(".input-texto");
var resultado = document.querySelector(".resultado");

var btnCodificar = document.querySelector(".btn-codificar");
var btnDecodificar = document.querySelector(".btn-decodificar");

var mensagensErro = document.querySelector(".mensagens-erro");

btnCodificar.onclick = function() {
    var erros = validaTexto(inputTexto);

    if(erros.length > 0) {
        mostraErros(erros);
        resultado.textContent = "";
        return;
    }

    escreveCodificado();
    mensagensErro.innerHTML = "";
}

btnDecodificar.onclick = function() {
    var erros = validaTexto(inputTexto);

    if(erros.length > 0) {
        mostraErros(erros);
        resultado.textContent = "";
        return;
    }
    
    escreveDecodificado();
    mensagensErro.innerHTML = "";
}
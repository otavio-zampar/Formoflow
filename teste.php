<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Textura de Papel</title>
    <style>
        /* Defina um fundo de papel como uma imagem de textura de papel */
        body {
            background-image: url('papel-textura.jpg');
            background-repeat: repeat;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        /* Estilize a div onde você quer aplicar a textura de papel */
        .papel {
            background-color: rgba(255, 255, 255, 0.8); /* Cor de fundo semitransparente para simular papel */
            padding: 20px;
            margin: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra para dar profundidade */
        }

        /* Estilize o conteúdo dentro da div */
        h1, p {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="papel">
        <h1>Texto com Textura de Papel</h1>
        <p>Seu conteúdo aqui...</p>
    </div>
</body>
</html>

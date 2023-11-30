const data = [
    { option: "Evaluation", form: "doEval", qnt: 1, exit: 1, placeholder: ["2 + 2"] },
    { option: "Bhaskara", form: "bhaskara", qnt: 3, exit: 2, placeholder: ["A", "B", "C"] },
    { option: "Circle Area", form: "Acirculo", qnt: 1, exit: 1, placeholder: ["Radius"] },
    { option: "Rectangle Area", form: "Aretangulo", qnt: 2, exit: 1, placeholder: ["Base", "Height"] },
    { option: "Triangle Area", form: "Atriangulo", qnt: 2, exit: 1, placeholder: ["Base", "Height"] },
    { option: "Equilateral Triangle Area", form: "AtrianguloEquilatero", qnt: 1, exit: 1, placeholder: ["Side"] },
    { option: "Trapezoid Area", form: "Atrapezio", qnt: 3, exit: 1, placeholder: ["Base", "Top Base", "Height"] },
    { option: "Diamond Area", form: "Alosango", qnt: 2, exit: 1, placeholder: ["Diagonal", "Diagonal"] },
    { option: "Triangle Angle Area", form: "AanguloTriangulo", qnt: 3, exit: 1, placeholder: ["Side 1", "Side 2", "Angle"] },
    { option: "Factoring", form: "fatoracao", qnt: 1, exit: 1, placeholder: [] },
    { option: "Hypotenuse", form: "hipotenusa", qnt: 2, exit: 1, placeholder: ["Cathetus", "Cathetus"] },
    { option: "Cathetus", form: "cateto", qnt: 2, exit: 1, placeholder: ["Cathetus", "Hypotenuse"] },
    { option: "Perimeter", form: "perimetro", qnt: 2, exit: 1, placeholder: ["Side", "Length"] },
    { option: "Cube Volume", form: "Vcubo", qnt: 1, exit: 1, placeholder: ["Side"] },
    { option: "Parallelepiped Volume", form: "Vparalelepipedo", qnt: 3, exit: 1, placeholder: ["Width", "Length", "Height"] },
    { option: "Cylinder Volume", form: "Vcilindro", qnt: 2, exit: 1, placeholder: ["Radius", "Height"] },
    { option: "Sphere Volume", form: "Vesfera", qnt: 1, exit: 1, placeholder: ["Radius"] },
    { option: "Cone Volume", form: "Vcone", qnt: 2, exit: 1, placeholder: ["Radius", "Height"] },
    { option: "Prism Volume", form: "Vprisma", qnt: 2, exit: 1, placeholder: ["Base Area", "Height"] },
    { option: "Sum", form: "soma", qnt: 2, exit: 1, placeholder: [] },
    { option: "Subtraction", form: "subtracao", qnt: 2, exit: 1, placeholder: [] },
    { option: "Multiplication", form: "multiplicacao", qnt: 2, exit: 1, placeholder: [] },
    { option: "Division", form: "divisao", qnt: 2, exit: 1, placeholder: [] },
    { option: "Exponential", form: "Math.pow", qnt: 2, exit: 1, placeholder: ["Base", "Exponent"] },
    { option: "Square Root", form: "raizQ", qnt: 2, exit: 1, placeholder: ["Radical", "Index"] },
    { option: "Natural Logarithm", form: "log", qnt: 1, exit: 1, placeholder: [] },
    { option: "Logarithm Base 10", form: "log10", qnt: 1, exit: 1, placeholder: [] },
    { option: "Logarithm Base 2", form: "log2", qnt: 1, exit: 1, placeholder: [] },
    { option: "Inverse", form: "inversao", qnt: 1, exit: 1, placeholder: [] },
    { option: "Modulus", form: "modulo", qnt: 1, exit: 1, placeholder: [] },
    { option: "Linear Function", form: "fPrimeiro", qnt: 3, exit: 1, placeholder: ["X", "B", "C"] },
    { option: "Quadratic/Exponential Function", form: "fSegundo", qnt: 4, exit: 1, placeholder: ["X", "A", "B", "C"] },
    { option: "Quadratic/Logarithmic Function", form: "fExponencial", qnt: 4, exit: 1, placeholder: ["X", "A", "B", "C"] },
    { option: "Sine", form: "Math.sin", qnt: 1, exit: 1, placeholder: ["Sine"] },
    { option: "Cosine", form: "Math.cos", qnt: 1, exit: 1, placeholder: ["Cosine"] },
    { option: "Tangent", form: "Math.tan", qnt: 1, exit: 1, placeholder: ["Tangent"] },
    { option: "Random", form: "aleatorio", qnt: 2, exit: 1, placeholder: ["Minimum", "Maximum"] },
    { option: "Bit Shift Zero Left", form: "bitShiftZL", qnt: 2, exit: 1, placeholder: ["X", "Y"] },
    { option: "Bit Shift Signed Right", form: "bitShiftSR", qnt: 2, exit: 1, placeholder: ["X", "Y"] },
    { option: "Bit Shift Zero Right", form: "bitShiftZR", qnt: 2, exit: 1, placeholder: ["X", "Y"] },
    { option: "AND", form: "and", qnt: 2, exit: 1, placeholder: ["X", "Y"] },
    { option: "OR", form: "or", qnt: 2, exit: 1, placeholder: ["X", "Y"] },
    { option: "XOR", form: "xor", qnt: 2, exit: 1, placeholder: ["X", "Y"] },
    { option: "NOT", form: "not", qnt: 1, exit: 1, placeholder: [] },
    { option: "Binary", form: "binario", qnt: 1, exit: 1, placeholder: [] },
    { option: "Hexadecimal", form: "hexadecimal", qnt: 1, exit: 1, placeholder: [] },
    { option: "Octal", form: "octal", qnt: 1, exit: 1, placeholder: [] },
    { option: "Base X", form: "base", qnt: 2, exit: 1, placeholder: ["X", "Base"] },
    { option: "Base X to Decimal", form: "basePraDecimal", qnt: 2, exit: 1, placeholder: ["X", "Base"] },
    { option: "Range", form: "input", type: "range", qnt: 1, exit: 1 },
    { option: "Text Area", form: "textarea", type: "", qnt: 0, exit: 0 }
    
    // Adicione outras opções com mensagens personalizadas aqui
];
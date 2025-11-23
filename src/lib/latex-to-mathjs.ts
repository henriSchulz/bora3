export function latexToMathJs(latex: string): string {
    if (!latex) return "";

    let s = latex;

   
    s = s.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
    s = s.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');
    s = s.replace(/\\left\{/g, '{').replace(/\\right\}/g, '}'); 

    // 2. Handle Operators
    s = s.replace(/\\cdot/g, '*');
    s = s.replace(/\\times/g, '*');
    s = s.replace(/\\div/g, '/');
    s = s.replace(/\\pm/g, '+'); 

    while (s.includes('\\frac{')) {
        s = replaceCommand(s, '\\frac', (args) => `(${args[0]})/(${args[1]})`);
    }

    
    while (s.includes('\\sqrt')) {
      
        const match = s.match(/\\sqrt\[(.*?)\]\{(.*?)\}/); 
    
      
        if (s.match(/\\sqrt\{/)) {
             s = replaceCommand(s, '\\sqrt', (args) => `sqrt(${args[0]})`);
        } else {
           
            const complexSqrt = /\\sqrt\[([^\]]+)\]/;
            const m = s.match(complexSqrt);
            if (m) {
                 
                 break; 
            } else {
                break;
            }
        }
    }


    while (s.includes('\\text{')) {
        s = replaceCommand(s, '\\text', (args) => args[0]); // Just unwrap
    }
    while (s.includes('\\mathrm{')) {
        s = replaceCommand(s, '\\mathrm', (args) => args[0]);
    }

    

    s = s.replace(/\^\{([^}]+)\}/g, '^($1)'); 

   
    s = s.replace(/\\([a-zA-Z]+)/g, '$1');

    s = s.replace(/\{/g, '(').replace(/\}/g, ')');

    return s;
}


function replaceCommand(latex: string, command: string, handler: (args: string[]) => string): string {
    const cmdIndex = latex.indexOf(command);
    if (cmdIndex === -1) return latex;


    let cursor = cmdIndex + command.length;
    const args: string[] = [];

  
    while (cursor < latex.length) {
        // Skip whitespace
        while (latex[cursor] === ' ' || latex[cursor] === '\t') cursor++;

        if (latex[cursor] === '{') {
            const end = findMatchingBrace(latex, cursor);
            if (end === -1) break; // Error or malformed
            args.push(latex.substring(cursor + 1, end));
            cursor = end + 1;
        } else {
            break; // No more args
        }
    }

    if (args.length === 0) {
       
        return latex; 
    }

    const before = latex.substring(0, cmdIndex);
    const after = latex.substring(cursor);
    const replacement = handler(args);

    return before + replacement + after;
}

function findMatchingBrace(str: string, start: number): number {
    let depth = 0;
    for (let i = start; i < str.length; i++) {
        if (str[i] === '{') depth++;
        if (str[i] === '}') depth--;
        if (depth === 0) return i;
    }
    return -1;
}

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  c: "10.2.0",      
  cpp: "10.2.0"     
};
  
export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp: 'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  c: `#include <stdio.h>\n\nint main() {\n\tchar name[] = "Alex";\n\tprintf("Hello, %s!\\n", name);\n\treturn 0;\n}\n`,
  cpp: `#include <iostream>\n#include <string>\n\nint main() {\n\tstd::string name = "Alex";\n\tstd::cout << "Hello, " << name << "!" << std::endl;\n\treturn 0;\n}\n`
};

export const INTERVIEWER_INFO = [
  {
    id: 1,
    image: "/man1.jpg",
    title: "Empathatic Bob"
  },
  {
    id: 2,
    image: "/women1.jpg",
    title: "Explorer Lisa"
  },
  {
    id: 3,
    image: "/man2.jpg",
    title: "Speedy Adam"
  }
]
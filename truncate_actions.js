const fs = require('fs');
const readline = require('readline');

const filePath = String.raw`C:\Users\JONATHAN EGYIR\Documents\PROJECTS\STUDENT MANAGEMENT SYSTEM\src\lib\actions.ts`;

async function processFile() {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lines = [];
  let foundLoginRevalidate = false;
  let finished = false;

  for await (const line of rl) {
      if (finished) break;
      
      lines.push(line);
      
      if (line.includes('revalidatePath("/login");')) {
          foundLoginRevalidate = true;
      }
      
      if (foundLoginRevalidate && line.trim() === '};') {
          // This is the end of the updateSettings function
          finished = true;
      }
  }
  
  if (finished) {
      const finalContent = lines.join('\n'); // No append this time
      fs.writeFileSync(filePath, finalContent);
      console.log("Successfully truncated actions.ts");
  } else {
      console.log("Could not find the end of the file correctly");
  }
}

processFile();

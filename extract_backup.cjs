const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('C:\\Users\\Andropedia\\.gemini\\antigravity\\brain\\6f6708f7-04db-4b5b-ba67-6ffb5edff1f4\\.system_generated\\logs\\transcript_full.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let bestContent = "";
    
    for await (const line of rl) {
        try {
            const data = JSON.parse(line);
            if (data.type === 'PLANNER_RESPONSE' && data.tool_calls) {
                for (const tool of data.tool_calls) {
                    if ((tool.name === 'write_to_file' || tool.name === 'default_api:write_to_file') && tool.args.TargetFile && tool.args.TargetFile.includes('App.jsx')) {
                        // wait, previous agents might have used write_to_file to completely overwrite App.jsx
                        if (tool.args.CodeContent && tool.args.CodeContent.length > 20000) {
                            bestContent = tool.args.CodeContent;
                        }
                    }
                }
            }
        } catch(e) {}
    }
    
    if (bestContent) {
        fs.writeFileSync('d:\\multisite\\recovered_App.jsx', bestContent);
        console.log("Recovered a large App.jsx to recovered_App.jsx!");
    } else {
        console.log("Could not find a large write_to_file for App.jsx.");
    }
}
extract();

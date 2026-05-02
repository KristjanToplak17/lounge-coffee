const commandName = process.argv[2] || "command";

console.log(`[phase-1] Reserved script '${commandName}' is wired, but full tooling is not configured yet.`);
console.log("[phase-1] This is intentional: the command surface exists before deeper lint/test tooling is added.");

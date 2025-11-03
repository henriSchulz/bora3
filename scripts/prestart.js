

// execute files: node scripts/move-icons.js and generate-widget-registry.js 


const { execSync } = require('child_process');

const NODE_SCRIPTS_TO_RUN = [
    "scripts/generate-widget-registry.js",
    "scripts/move-icons.js"
];


if(process.env.SKIP_NODE_SCRIPTS !== 'true'){



for (const script of NODE_SCRIPTS_TO_RUN) {
    try {
        console.log(`Running script: ${script}`);
        execSync(`node ${script}`, { stdio: 'inherit' });
        console.log(`Finished script: ${script}`);
    } catch (error) {
        console.error(`Error running script: ${script}`, error);
        process.exit(1);
    }
} }  


if(process.env.MIGRATE_PRISMA === 'true'){
    const prismaMigrateCommand = "npx prisma migrate dev --name init" 
    try {
        console.log(`Running Prisma migration: ${prismaMigrateCommand}`);
        execSync(prismaMigrateCommand, { stdio: 'inherit' });
        console.log(`Finished Prisma migration`);
    } catch (error) {
        console.error(`Error running Prisma migration`, error);
        process.exit(1);
    }
}
    




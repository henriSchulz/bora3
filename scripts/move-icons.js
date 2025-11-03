#!/usr/bin/env node
'use strict';

const fs = require('fs').promises;
const path = require('path');

(async () => {
	try {
		const projectRoot = path.resolve(__dirname, '..');
		const sourceDir = path.join(projectRoot, 'icons');
		const destDir = path.join(projectRoot, 'public', 'icons');

		// Ensure sourceDir exists; create if not
		try {
			const stat = await fs.stat(sourceDir);
			if (!stat.isDirectory()) {
				throw new Error(`${sourceDir} exists and is not a directory`);
			}
		} catch (err) {
			if (err.code === 'ENOENT') {
				await fs.mkdir(sourceDir, { recursive: true });
				console.log(`No icons folder found. Created project icons folder at: ${sourceDir}`);
			} else {
				throw err;
			}
		}

		// Read icons
		const items = await fs.readdir(sourceDir);
		if (!items || items.length === 0) {
			console.log(`No icons found in project icons folder at ${sourceDir}. Nothing to copy.`);
			process.exit(0);
		}

		// Ensure destination exists
		await fs.mkdir(destDir, { recursive: true });

			// Copy files (icons)
		let copied = 0;
		for (const name of items) {
			const src = path.join(sourceDir, name);
			const dst = path.join(destDir, name);
			try {
				const stat = await fs.stat(src);
				if (stat.isFile()) {
					await fs.copyFile(src, dst);
					copied++;
				}
			} catch (innerErr) {
					// skip problematic entries but log (mention icons)
					console.warn(`Skipping entry while processing icons: ${src} - ${innerErr.message || innerErr}`);
			}
		}

			console.log(`Found ${items.length} icon(s) in ${sourceDir}.`);
			console.log(`Copied ${copied} icon(s) to ${destDir}.`);
			if (copied > 0) {
				console.log('Icons copied successfully.');
			} else {
				console.log('No icons were copied (no regular icon files found).');
			}
	} catch (err) {
		console.error('Error while moving icons:', err);
		process.exit(1);
	}
})();


#!/usr/bin/env node
import { createCli } from './cli.js';

async function main() {
	const cli = createCli();
	cli.parse();
}

main();

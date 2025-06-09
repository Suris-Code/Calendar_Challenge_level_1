/// <reference types="node" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { endpoints } from './endpoints';
import * as process from 'process';
import * as fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const baseFolder =
	process.env.APPDATA !== undefined && process.env.APPDATA !== ''
		? `${process.env.APPDATA}/ASP.NET/https`
		: `${process.env.HOME}/.aspnet/https`;

if (!fs.existsSync(baseFolder)) {
	fs.mkdirSync(baseFolder, { recursive: true });
}

const certificateName = "reactnet.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
	if (0 !== child_process.spawnSync('dotnet', [
		'dev-certs',
		'https',
		'--export-path',
		certFilePath,
		'--format',
		'Pem',
		'--no-password',
	], { stdio: 'inherit', }).status) {
		throw new Error("Could not create certificate.");
	}
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react(), tailwindcss()],
  	server: {
		proxy: endpoints,
		port: 5173,
		https: mode === 'development' ? {
			key: fs.readFileSync(keyFilePath),
			cert: fs.readFileSync(certFilePath),
		} : undefined
	},
}));

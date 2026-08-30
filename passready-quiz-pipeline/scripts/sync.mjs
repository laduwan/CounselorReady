#!/usr/bin/env node
/** Validate questions/ and copy them into public/data for the compositions. */
import {syncToPublic} from './lib/questions.mjs';

const ids = syncToPublic();
console.log(`Synced ${ids.length} question(s) to public/data: ${ids.join(', ')}`);

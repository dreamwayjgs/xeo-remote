import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

// Official Xeo 2 column, hexadecimal command bytes:
// https://dynaudio.com/faq/where-do-i-find-the-hex-codes-for-the-xeo-remote-control
const commands = [
  ['Power On', 0x00], ['Power Off', 0x14],
  ['Volume Down', 0x04], ['Volume Up', 0x06], ['Mute', 0x16],
  ['Input 1 - Line', 0x19], ['Input 2 - Optical', 0x17],
  ['Input 3 - Aux', 0x18], ['Input 4 - Bluetooth', 0x1D],
  ['A', 0x10], ['B', 0x11], ['C', 0x12],
  ['Status LED On-Off', 0x40], ['Bluetooth Pairing', 0x20],
  ['Bluetooth Play-Pause', 0x1B], ['Bluetooth Previous Track', 0x1F],
  ['Bluetooth Next Track', 0x1C],
];
const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== '--check')) {
  throw new Error('Usage: node generate.mjs [--check]');
}
const checkOnly = args[0] === '--check';
const reverse8 = value => parseInt(value.toString(2).padStart(8, '0').split('').reverse().join(''), 2);
const hex8 = value => value.toString(16).padStart(2, '0').toUpperCase();

function rawFrame(command) {
  const reversed = reverse8(command);
  const frame = [9000, 4500];
  // MSB-first representation of NEC's LSB-first address/command bytes.
  for (const byte of [0x00, 0xFF, reversed, reversed ^ 0xFF]) {
    for (let bit = 7; bit >= 0; bit--) frame.push(560, (byte >> bit) & 1 ? 1690 : 560);
  }
  frame.push(560, 40020); // Trailing mark and gap: 108 ms total, one initial frame.
  return frame;
}

// Independent known vector: owner-confirmed diagnostic B, Volume Down.
const knownVolumeDown = [
  9000, 4500,
  560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560,
  560, 1690, 560, 1690, 560, 1690, 560, 1690, 560, 1690, 560, 1690, 560, 1690, 560, 1690,
  560, 560, 560, 560, 560, 1690, 560, 560, 560, 560, 560, 560, 560, 560, 560, 560,
  560, 1690, 560, 1690, 560, 560, 560, 1690, 560, 1690, 560, 1690, 560, 1690, 560, 1690,
  560, 40020,
];
assert.deepEqual(rawFrame(0x04), knownVolumeDown);
assert.equal(commands.length, 17);
assert.equal(new Set(commands.map(([name]) => name)).size, 17);
for (const [name, command] of commands) {
  assert.ok(Number.isInteger(command) && command >= 0 && command <= 255, name);
  const frame = rawFrame(command);
  assert.equal(frame.length, 68, name);
  assert.ok(frame.every(duration => Number.isInteger(duration) && duration > 0), name);
  assert.equal(frame.reduce((sum, duration) => sum + duration, 0), 108000, name);
  // Standard NEC definition, independently expressed as LSB-first logical bytes.
  const expectedBits = [0, 255, command, command ^ 255].flatMap(byte =>
    Array.from({ length: 8 }, (_, bit) => (byte >> bit) & 1));
  const actualBits = Array.from({ length: 32 }, (_, bit) => {
    assert.equal(frame[2 + bit * 2], 560, name);
    const space = frame[3 + bit * 2];
    assert.ok(space === 560 || space === 1690, name);
    return Number(space === 1690);
  });
  assert.deepEqual(actualBits, expectedBits, name);
}

const rawHeader = `Filetype: IR signals file
Version: 1
#
# Dynaudio Xeo 2 - canonical RAW profile.
# Official codes: https://dynaudio.com/faq/where-do-i-find-the-hex-codes-for-the-xeo-remote-control
# Based on owner-confirmed RAW diagnostic B: 00FF20DF lowers volume.
# Wire bytes, MSB-first: 00 FF reverse8(official command) inverse.
# 38 kHz; one initial frame per tap. No explicit repeat frames.
# Owner confirmed Power On/Off and Volume Up/Down on POCO X7 Pro / Xeo 2.
# Other functions, Bluetooth long presses, and repeat behavior are unverified.
# A/B/C and Status LED are parenthesized in the official Xeo 2 table.
`;
const necHeader = `Filetype: IR signals file
Version: 1
#
# Dynaudio Xeo 2 - parsed NEC alternative; RAW remains canonical.
# Official codes: https://dynaudio.com/faq/where-do-i-find-the-hex-codes-for-the-xeo-remote-control
# Standard NEC uses logical address 00 and the official command byte.
# Address/command inverses and LSB-first wire order are encoder-generated.
# Volume Down command 04 should encode to MSB-first payload 00FF20DF.
# Owner report 2026-10-24: non-Bluetooth buttons work on POCO X7 Pro / Xeo 2.
# Bluetooth functions and long-press/repeat behavior remain unverified.
# Carrier/timing/repeat generation is delegated to the importing application.
# Use Dynaudio_Xeo_2.ir for the owner-confirmed RAW profile.
`;
const outputs = new Map([
  ['Dynaudio_Xeo_2.ir', rawHeader + commands.map(([name, command]) =>
    `#\nname: ${name}\ntype: raw\nfrequency: 38000\nduty_cycle: 0.330000\ndata: ${rawFrame(command).join(' ')}\n`).join('')],
  ['xeo-2-nec.ir', necHeader + commands.map(([name, command]) =>
    `#\nname: ${name}\ntype: parsed\nprotocol: NEC\naddress: 00 00 00 00\ncommand: ${hex8(command)} 00 00 00\n`).join('')],
]);
for (const [filename, content] of outputs) {
  const path = new URL(filename, import.meta.url);
  if (checkOnly) {
    assert.equal(readFileSync(path, 'utf8').replace(/\r\n/g, '\n'), content, `${filename} differs; run node generate.mjs`);
    console.log(`OK ${filename}`);
  } else {
    writeFileSync(path, content, 'utf8');
    console.log(`Generated ${filename}`);
  }
}
console.log('PASS: 17 NEC payloads, frame structure, timing, and known working Volume Down vector. Physical Bluetooth/hold behavior is not tested.');

# About The project

This project aims to automate the process of creating Anki cards. To create cards, in batch, you can write a simple LaTeX document which is then transformed into markdown and csv file. The latter is used to be imported into Anki. The former is simplified LaTeX document for reading without compiler LaTeX document.

## File Merger

A simple program that searches for PDF files and merges them into a simgle large PDF document. It uses predefined folder structure to find documents.

## LaTeX Template

Easy to use command line interface for creating a template that is used to batch write Anki cards in LaTeX format. Although not necessary, yet very handy and time saving.


## Regex Manipulator

Command line interface that transforms LaTeX document into markdown and csv files. The goal of this program is making process of creating Anki cards easier and faster by writing Anki card in a simgle file which can be easily modified and searched for changes and automatically calling Anki for import. Windows users require for auto importing set Anki environmental variable.


## Built with

- Node.js
- TypeScript
- commander.js

# Getting started

To get started you need installed Node.js LTS 14.x or later alongsite other tools.

## Prerequisites

- Node.js LTS 14.x or later
- TypeScript

## Installation

1) Install Node.js
2) Clone the repo
```bash
git clone https://github.com/janmerhar/LaTeX_manipulator
```
3) Install NPM packages
```bash
npm install
```
4) Install TypeScript
```bash
npm install typescript
```
5) Run TypeScript compiler
```bash
tsc -w
```

# Usage

Scripts are located in ```execs``` folder. You can run them with ```node```. Note, you need to comple TypeScript before you can run them.

## File Merger CLI 


## LaTeX Template CLI


## Regex Mnaipualtor CLI




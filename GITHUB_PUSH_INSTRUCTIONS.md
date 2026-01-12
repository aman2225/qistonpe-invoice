# GitHub Push Instructions

## Steps to Push to GitHub

1. **Create a repository on GitHub** (if not already created):
   - Go to https://github.com/new
   - Name: `qistonpe-invoice` (or your preferred name)
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Run these commands** (replace `YOUR_USERNAME` with your GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/qistonpe-invoice.git
git push -u origin main
```

Or if you prefer SSH:

```bash
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/qistonpe-invoice.git
git push -u origin main
```

## Quick Push (if repository already exists)

If you've already created the repository on GitHub, just run:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/qistonpe-invoice.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `qistonpe-invoice` with your actual GitHub username and repository name.

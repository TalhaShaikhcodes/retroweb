# Git Push Instructions

## Step-by-Step Commands

Run these commands in your terminal from the `retroweb-builder` directory:

### 1. Navigate to the project directory
```bash
cd retroweb-builder
```

### 2. Initialize Git repository (if not already initialized)
```bash
git init
```

### 3. Add all files to staging
```bash
git add .
```

### 4. Check what will be committed (optional)
```bash
git status
```

### 5. Create initial commit
```bash
git commit -m "Initial commit: RetroWeb Builder with security fixes"
```

### 6. Add your GitHub repository as remote
```bash
git remote add origin https://github.com/TalhaShaikhcodes/retroweb-builder.git
```

### 7. Verify remote was added (optional)
```bash
git remote -v
```

### 8. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## ✅ Verification

After pushing, verify:
1. Go to https://github.com/TalhaShaikhcodes/retroweb-builder
2. You should see all your files
3. README.md should be displayed on the homepage

## 🚨 If You Get Errors

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TalhaShaikhcodes/retroweb-builder.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push -u origin main
```

### Error: Authentication failed
You may need to use a Personal Access Token instead of password:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with 'repo' scope
3. Use token as password when prompted

Or use SSH:
```bash
git remote set-url origin git@github.com:TalhaShaikhcodes/retroweb-builder.git
```

## 📝 Next Steps After Pushing

1. ✅ Verify code is on GitHub
2. ✅ Go to Vercel Dashboard
3. ✅ Import the GitHub repository
4. ✅ Follow DEPLOYMENT_GUIDE.md for deployment

## 🔄 Future Updates

To push future changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

## 🌿 Working with Branches (Optional)

Create a development branch:
```bash
git checkout -b development
git push -u origin development
```

Switch back to main:
```bash
git checkout main
```

## 📚 Useful Git Commands

```bash
# Check current status
git status

# View commit history
git log --oneline

# View remote repositories
git remote -v

# Pull latest changes
git pull

# Discard local changes
git checkout -- .

# View differences
git diff
```

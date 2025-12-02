  Steps to Deploy:

  1. Check Your Repository Name

  The workflow currently has:
  VITE_BASE_PATH: '/senseable/'

  If your GitHub repo URL is github.com/YOUR-USERNAME/senseable, this is correct.
  ✅

  If your repo has a different name, update line 43 in
  .github/workflows/deploy.yml:
  VITE_BASE_PATH: '/YOUR-REPO-NAME/'

  2. Push to Main Branch

  The workflow triggers on push to main branch. You're currently on versions
  branch, so you need to:

  # Option A: Merge to main
  git checkout main
  git merge versions
  git push origin main

  3. Enable GitHub Pages

  1. Go to your repo on GitHub
  2. Click Settings → Pages (in sidebar)
  3. Under Source, select "GitHub Actions"
  4. Click Save

  4. Wait for Deployment

  - GitHub Actions will automatically build and deploy
  - Check progress: Actions tab in your repo
  - Your site will be live at: https://YOUR-USERNAME.github.io/senseable/

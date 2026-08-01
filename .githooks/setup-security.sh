#!/bin/bash
# 🔐 Security Setup Script for EVChamp
# This script sets up pre-commit hooks and security checks

echo "🔐 EVChamp Security Setup"
echo "========================="
echo ""

# Check if in git repository
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Please run this from the project root."
    exit 1
fi

# Create hooks directory
mkdir -p .git/hooks

# Copy pre-commit hook
if [ -f .githooks/pre-commit ]; then
    echo "📋 Installing pre-commit hook..."
    cp .githooks/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hook installed"
else
    echo "⚠️  .githooks/pre-commit not found"
fi

# Configure git to use .githooks directory
echo "⚙️  Configuring git hooks directory..."
git config core.hooksPath .githooks
echo "✅ Git hooks path configured"

echo ""
echo "🔍 Scanning for existing secrets in git history..."
echo ""

# Function to scan git history
scan_git_history() {
    local pattern=$1
    local description=$2
    
    if git log --all --patch -S "$pattern" | grep -q "$pattern"; then
        echo "⚠️  WARNING: Found '$description' in git history"
        echo "   This should be rotated immediately!"
        return 1
    fi
}

# Scan for common secrets
FOUND_ISSUES=0

if scan_git_history "sk_live" "Razorpay live key"; then
    FOUND_ISSUES=1
fi

if scan_git_history "DATABASE_URL=postgres" "Database URL"; then
    FOUND_ISSUES=1
fi

if [ $FOUND_ISSUES -eq 0 ]; then
    echo "✅ No obvious secrets found in git history"
fi

echo ""
echo "📋 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your actual credentials"
echo "2. Make sure .env.local is in .gitignore (already done)"
echo "3. Verify with: git check-ignore -v .env.local"
echo "4. Try committing a file to test the pre-commit hook"
echo ""
echo "Important: The pre-commit hook will prevent commits with secrets."
echo "If you accidentally commit secrets, rotate them immediately!"
echo ""
echo "For more info, see: SECURITY_INCIDENT_RESPONSE.md"

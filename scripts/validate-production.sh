#!/bin/bash
# Production Build Validation Checklist
# Run this before every production build

echo "==============================================="
echo "BirthdayBuddy Production Build Validation"
echo "==============================================="
echo ""

PASS="✓"
FAIL="✗"
ISSUES=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}${PASS}${NC} File exists: $1"
  else
    echo -e "${RED}${FAIL}${NC} File missing: $1"
    ISSUES=$((ISSUES+1))
  fi
}

check_json_field() {
  local file=$1
  local field=$2
  if grep -q "$field" "$file"; then
    echo -e "${GREEN}${PASS}${NC} Field found: $field in $file"
  else
    echo -e "${RED}${FAIL}${NC} Field missing: $field in $file"
    ISSUES=$((ISSUES+1))
  fi
}

echo "1. Checking configuration files..."
check_file "app.json"
check_file "eas.json"
check_file "package.json"
check_file "metro.config.js"
check_file "babel.config.js"
check_file "tsconfig.json"
echo ""

echo "2. Checking Android configuration..."
check_file "android/gradle.properties"
check_file "android/app/build.gradle"
check_file "android/app/src/main/AndroidManifest.xml"
echo ""

echo "3. Checking app.json production settings..."
check_json_field "app.json" "runtimeVersion"
check_json_field "app.json" '"updates"'
check_json_field "app.json" '"versionCode"'
check_json_field "app.json" '"package"'
echo ""

echo "4. Checking eas.json profiles..."
check_json_field "eas.json" '"production"'
check_json_field "eas.json" '"production-apk"'
check_json_field "eas.json" '"autoIncrement"'
echo ""

echo "5. Checking environment configuration..."
if [ -f ".env.example" ]; then
  echo -e "${GREEN}${PASS}${NC} Environment example exists"
else
  echo -e "${RED}${FAIL}${NC} .env.example missing"
  ISSUES=$((ISSUES+1))
fi

if [ -f ".env.production" ]; then
  echo -e "${GREEN}${PASS}${NC} .env.production exists"
else
  echo -e "${YELLOW}⚠${NC}  .env.production not found (will use app defaults)"
fi
echo ""

echo "6. Checking Node/Expo installation..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}${PASS}${NC} Node.js installed: $NODE_VERSION"
else
  echo -e "${RED}${FAIL}${NC} Node.js not found"
  ISSUES=$((ISSUES+1))
fi

if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  echo -e "${GREEN}${PASS}${NC} npm installed: $NPM_VERSION"
else
  echo -e "${RED}${FAIL}${NC} npm not found"
  ISSUES=$((ISSUES+1))
fi

if command -v eas &> /dev/null; then
  EAS_VERSION=$(eas --version)
  echo -e "${GREEN}${PASS}${NC} EAS CLI installed: $EAS_VERSION"
else
  echo -e "${RED}${FAIL}${NC} EAS CLI not found (install with: npm install -g eas-cli)"
  ISSUES=$((ISSUES+1))
fi
echo ""

echo "7. Checking dependencies..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}${PASS}${NC} node_modules directory exists"
else
  echo -e "${RED}${FAIL}${NC} node_modules not found (run: npm install)"
  ISSUES=$((ISSUES+1))
fi
echo ""

echo "8. Checking Android keystore..."
if [ -f "android/app/birthday-buddy-release.keystore" ]; then
  echo -e "${GREEN}${PASS}${NC} Production keystore found"
else
  echo -e "${YELLOW}⚠${NC}  Production keystore not found (required for builds)"
  echo "     Run: keytool -genkeypair -v -storetype PKCS12 -keystore android/app/birthday-buddy-release.keystore..."
fi
echo ""

echo "9. TypeScript check..."
if npm run typecheck 2>/dev/null; then
  echo -e "${GREEN}${PASS}${NC} TypeScript compilation successful"
else
  echo -e "${RED}${FAIL}${NC} TypeScript compilation failed"
  ISSUES=$((ISSUES+1))
fi
echo ""

echo "==============================================="
if [ $ISSUES -eq 0 ]; then
  echo -e "${GREEN}All checks passed! Ready for production build.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Run: eas build --platform android --profile production"
  echo "2. Or run: eas build --platform android --profile production-apk"
  exit 0
else
  echo -e "${RED}$ISSUES issue(s) found. Please fix before proceeding.${NC}"
  exit 1
fi

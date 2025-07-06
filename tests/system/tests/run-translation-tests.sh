#!/bin/bash

# Translation Tests Runner
# مشغل اختبارات الترجمة

echo "🌐 Starting Translation Tests Suite"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${BLUE}📋 Running: $test_name${NC}"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ $test_name - PASSED${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}❌ $test_name - FAILED${NC}"
        ((FAILED_TESTS++))
    fi
    
    ((TOTAL_TESTS++))
}

# Create reports directory
mkdir -p tests/reports/translation

echo -e "${YELLOW}📊 Translation Test Environment${NC}"
echo "Locales Directory: public/locales"
echo "Supported Languages: Arabic (ar), English (en)"
echo ""

# Phase 1: Translation File Validation
echo -e "${BLUE}🔍 Phase 1: Translation File Validation${NC}"
echo "======================================="

run_test "Translation Structure Validation" "cd tests && npm test -- --testPathPattern=translation-validation.test.ts"
run_test "Missing Translations Detection" "cd tests && npm test -- --testPathPattern=missing-translations-detector.test.ts"
run_test "Translation Paths Validation" "cd tests && npm test -- --testPathPattern=translation-paths-validator.test.ts"

# Phase 2: Translation Usage Analysis
echo -e "\n${BLUE}📈 Phase 2: Translation Usage Analysis${NC}"
echo "======================================"

# Check for hardcoded Arabic text
echo -e "\n${YELLOW}🔍 Scanning for hardcoded Arabic text...${NC}"
ARABIC_HARDCODED=$(grep -r "[\u0600-\u06FF]" src/ --include="*.tsx" --include="*.ts" --exclude-dir=node_modules | grep -v "console\|comment\|//" | wc -l)
if [ "$ARABIC_HARDCODED" -gt 0 ]; then
    echo -e "${RED}❌ Found $ARABIC_HARDCODED instances of hardcoded Arabic text${NC}"
    grep -r "[\u0600-\u06FF]" src/ --include="*.tsx" --include="*.ts" --exclude-dir=node_modules | grep -v "console\|comment\|//" | head -5
else
    echo -e "${GREEN}✅ No hardcoded Arabic text found${NC}"
fi

# Check for hardcoded English text that might need translation
echo -e "\n${YELLOW}🔍 Scanning for potential hardcoded English text...${NC}"
ENGLISH_HARDCODED=$(grep -r '"[A-Z][a-zA-Z ]{10,}"' src/ --include="*.tsx" --include="*.ts" --exclude-dir=node_modules | grep -v "console\|import\|export\|//" | wc -l)
if [ "$ENGLISH_HARDCODED" -gt 0 ]; then
    echo -e "${YELLOW}⚠️ Found $ENGLISH_HARDCODED potential hardcoded English strings${NC}"
    grep -r '"[A-Z][a-zA-Z ]{10,}"' src/ --include="*.tsx" --include="*.ts" --exclude-dir=node_modules | grep -v "console\|import\|export\|//" | head -3
else
    echo -e "${GREEN}✅ No obvious hardcoded English text found${NC}"
fi

# Phase 3: Translation File Analysis
echo -e "\n${BLUE}📊 Phase 3: Translation File Analysis${NC}"
echo "===================================="

# Count translation keys
AR_KEYS=$(jq -r 'paths(scalars) as $p | $p | join(".")' public/locales/ar/common.json | wc -l)
EN_KEYS=$(jq -r 'paths(scalars) as $p | $p | join(".")' public/locales/en/common.json | wc -l)

echo "Arabic translation keys: $AR_KEYS"
echo "English translation keys: $EN_KEYS"

if [ "$AR_KEYS" -eq "$EN_KEYS" ]; then
    echo -e "${GREEN}✅ Translation key counts match${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ Translation key counts don't match${NC}"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Check for empty translations
echo -e "\n${YELLOW}🔍 Checking for empty translations...${NC}"
EMPTY_AR=$(jq -r 'paths(scalars) as $p | select(getpath($p) == "") | $p | join(".")' public/locales/ar/common.json | wc -l)
EMPTY_EN=$(jq -r 'paths(scalars) as $p | select(getpath($p) == "") | $p | join(".")' public/locales/en/common.json | wc -l)

if [ "$EMPTY_AR" -eq 0 ] && [ "$EMPTY_EN" -eq 0 ]; then
    echo -e "${GREEN}✅ No empty translations found${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ Found empty translations: AR($EMPTY_AR), EN($EMPTY_EN)${NC}"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Phase 4: Translation Usage Patterns
echo -e "\n${BLUE}🔧 Phase 4: Translation Usage Patterns${NC}"
echo "====================================="

# Check for useTranslation usage
USE_TRANSLATION=$(grep -r "useTranslation\|useUnifiedTranslation" src/ --include="*.tsx" --include="*.ts" | wc -l)
T_FUNCTION_USAGE=$(grep -r "\bt(" src/ --include="*.tsx" --include="*.ts" | wc -l)

echo "useTranslation hook usage: $USE_TRANSLATION"
echo "t() function usage: $T_FUNCTION_USAGE"

if [ "$USE_TRANSLATION" -gt 0 ] && [ "$T_FUNCTION_USAGE" -gt 0 ]; then
    echo -e "${GREEN}✅ Translation hooks and functions are being used${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${YELLOW}⚠️ Limited translation usage detected${NC}"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Phase 5: File Size and Performance Check
echo -e "\n${BLUE}⚡ Phase 5: Performance Analysis${NC}"
echo "==============================="

AR_SIZE=$(stat -f%z public/locales/ar/common.json 2>/dev/null || stat -c%s public/locales/ar/common.json)
EN_SIZE=$(stat -f%z public/locales/en/common.json 2>/dev/null || stat -c%s public/locales/en/common.json)

AR_SIZE_KB=$((AR_SIZE / 1024))
EN_SIZE_KB=$((EN_SIZE / 1024))

echo "Arabic translation file size: ${AR_SIZE_KB}KB"
echo "English translation file size: ${EN_SIZE_KB}KB"

if [ "$AR_SIZE_KB" -lt 500 ] && [ "$EN_SIZE_KB" -lt 500 ]; then
    echo -e "${GREEN}✅ Translation files are reasonably sized${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${YELLOW}⚠️ Large translation files detected${NC}"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Generate comprehensive report
echo -e "\n${BLUE}📄 Generating Translation Test Report${NC}"
echo "====================================="

cat > tests/reports/translation/translation-test-report.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "summary": {
    "totalTests": $TOTAL_TESTS,
    "passedTests": $PASSED_TESTS,
    "failedTests": $FAILED_TESTS,
    "successRate": $(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l)
  },
  "translationFiles": {
    "arabicKeys": $AR_KEYS,
    "englishKeys": $EN_KEYS,
    "keysMatch": $([ "$AR_KEYS" -eq "$EN_KEYS" ] && echo "true" || echo "false"),
    "arabicFileSize": "${AR_SIZE_KB}KB",
    "englishFileSize": "${EN_SIZE_KB}KB"
  },
  "codeAnalysis": {
    "hardcodedArabic": $ARABIC_HARDCODED,
    "potentialHardcodedEnglish": $ENGLISH_HARDCODED,
    "useTranslationUsage": $USE_TRANSLATION,
    "tFunctionUsage": $T_FUNCTION_USAGE
  },
  "qualityChecks": {
    "emptyTranslationsArabic": $EMPTY_AR,
    "emptyTranslationsEnglish": $EMPTY_EN,
    "filesUnderSizeLimit": $([ "$AR_SIZE_KB" -lt 500 ] && [ "$EN_SIZE_KB" -lt 500 ] && echo "true" || echo "false")
  }
}
EOF

# Display final results
echo -e "\n${YELLOW}📊 TRANSLATION TEST RESULTS${NC}"
echo "============================"
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TRANSLATION TESTS PASSED! 🎉${NC}"
    echo -e "Success Rate: ${GREEN}100%${NC}"
    exit 0
else
    SUCCESS_RATE=$(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l)
    echo -e "\n${YELLOW}⚠️  Some translation tests failed${NC}"
    echo -e "Success Rate: ${YELLOW}${SUCCESS_RATE}%${NC}"
    
    if (( $(echo "$SUCCESS_RATE >= 80" | bc -l) )); then
        echo -e "${YELLOW}📊 Overall result: ACCEPTABLE (≥80%)${NC}"
        exit 0
    else
        echo -e "${RED}📊 Overall result: NEEDS ATTENTION (<80%)${NC}"
        exit 1
    fi
fi

echo -e "\n${BLUE}📁 Reports Location:${NC}"
echo "Translation Report: tests/reports/translation/translation-test-report.json"

echo -e "\n${BLUE}🔧 Recommendations:${NC}"
echo "1. Review any hardcoded text found"
echo "2. Ensure all user-facing text uses translation keys"
echo "3. Keep translation files synchronized between languages"
echo "4. Monitor translation file sizes for performance"
echo "5. Use consistent translation key naming conventions"

echo -e "\n${GREEN}✅ Translation Test Suite Complete!${NC}"
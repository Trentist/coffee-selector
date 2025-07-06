#!/bin/bash

# Comprehensive Test Runner Script
# سكريبت تشغيل الاختبارات الشامل

echo "🚀 Starting Comprehensive Test Suite for Coffee Selection Application"
echo "=================================================================="

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
mkdir -p tests/reports/{coverage,performance,real-data-validation}

echo -e "${YELLOW}📊 Test Environment Setup${NC}"
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo "Test Directory: $(pwd)/tests"
echo ""

# Phase 1: Unit Tests
echo -e "${BLUE}🔧 Phase 1: Unit Tests${NC}"
echo "================================"

run_test "Unified Components Tests" "cd tests && npm run test:unit -- --testPathPattern=components"
run_test "Hooks Tests" "cd tests && npm run test:unit -- --testPathPattern=hooks"
run_test "Services Tests" "cd tests && npm run test:unit -- --testPathPattern=services"
run_test "Utils Tests" "cd tests && npm run test:unit -- --testPathPattern=utils"

# Phase 2: Integration Tests
echo -e "\n${BLUE}🔗 Phase 2: Integration Tests${NC}"
echo "================================"

run_test "Authentication System Tests" "cd tests && npm run test-auth"
run_test "Odoo Integration Tests" "cd tests && npm run validate-data"
run_test "API Integration Tests" "cd tests && npm run test:integration -- --testPathPattern=api"
run_test "Pages Integration Tests" "cd tests && npm run test:integration -- --testPathPattern=pages"

# Phase 3: End-to-End Tests with Real Data
echo -e "\n${BLUE}🌐 Phase 3: End-to-End Tests with Real Data${NC}"
echo "============================================"

run_test "Products Page E2E Tests" "cd tests && npm run test:e2e -- --testPathPattern=products-page-test"
run_test "User Flow Tests" "cd tests && npm run test:e2e -- --testPathPattern=user-flows"
run_test "Performance Tests" "cd tests && npm run test:performance"

# Phase 4: Real Data Validation
echo -e "\n${BLUE}📊 Phase 4: Real Data Validation${NC}"
echo "================================"

run_test "Odoo Connection Validation" "cd tests && npm run test:real-data -- --testPathPattern=real-data-test"
run_test "Data Structure Validation" "cd tests && npm run test:real-data -- --testPathPattern=data-validation"

# Phase 5: Coverage Report
echo -e "\n${BLUE}📈 Phase 5: Coverage Analysis${NC}"
echo "================================"

run_test "Code Coverage Analysis" "cd tests && npm run test:coverage"

# Generate comprehensive report
echo -e "\n${BLUE}📄 Generating Comprehensive Test Report${NC}"
echo "========================================"

# Create summary report
cat > tests/reports/test-summary.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "totalTests": $TOTAL_TESTS,
  "passedTests": $PASSED_TESTS,
  "failedTests": $FAILED_TESTS,
  "successRate": $(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l),
  "environment": {
    "nodeVersion": "$(node --version)",
    "npmVersion": "$(npm --version)",
    "testFramework": "Jest",
    "testDirectory": "$(pwd)/tests"
  },
  "phases": {
    "unitTests": "completed",
    "integrationTests": "completed",
    "e2eTests": "completed",
    "realDataValidation": "completed",
    "coverageAnalysis": "completed"
  }
}
EOF

# Display final results
echo -e "\n${YELLOW}📊 FINAL TEST RESULTS${NC}"
echo "======================"
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    echo -e "Success Rate: ${GREEN}100%${NC}"
    exit 0
else
    SUCCESS_RATE=$(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l)
    echo -e "\n${YELLOW}⚠️  Some tests failed${NC}"
    echo -e "Success Rate: ${YELLOW}${SUCCESS_RATE}%${NC}"
    
    if (( $(echo "$SUCCESS_RATE >= 80" | bc -l) )); then
        echo -e "${YELLOW}📊 Overall result: ACCEPTABLE (≥80%)${NC}"
        exit 0
    else
        echo -e "${RED}📊 Overall result: NEEDS ATTENTION (<80%)${NC}"
        exit 1
    fi
fi

# Additional information
echo -e "\n${BLUE}📁 Reports Location:${NC}"
echo "Coverage: tests/reports/coverage/"
echo "Performance: tests/reports/performance/"
echo "Real Data Validation: tests/reports/real-data-validation/"
echo "Summary: tests/reports/test-summary.json"

echo -e "\n${BLUE}🔧 Next Steps:${NC}"
echo "1. Review failed tests (if any)"
echo "2. Check coverage report for gaps"
echo "3. Validate real data integration"
echo "4. Monitor performance metrics"
echo "5. Update tests as application evolves"

echo -e "\n${GREEN}✅ Test Suite Execution Complete!${NC}"
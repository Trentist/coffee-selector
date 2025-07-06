#!/bin/bash

# GraphQL System Comprehensive Test Suite
# مجموعة اختبارات نظام GraphQL الشاملة

set -e

echo "🚀 بدء تشغيل اختبارات نظام GraphQL الشاملة..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test directories
TEST_DIR="tests/graphql-system"
QUERIES_DIR="$TEST_DIR/queries"
MUTATIONS_DIR="$TEST_DIR/mutations"
HOOKS_DIR="$TEST_DIR/hooks"
REAL_TIME_DIR="$TEST_DIR/real-time"
INTEGRATIONS_DIR="$TEST_DIR/integrations"
PERFORMANCE_DIR="$TEST_DIR/performance"
LIFECYCLES_DIR="$TEST_DIR/lifecycles"

# Function to run tests with error handling
run_test_suite() {
    local test_name=$1
    local test_path=$2
    local description=$3
    
    echo -e "${BLUE}📋 تشغيل اختبارات: $description${NC}"
    echo "-----------------------------------"
    
    if [ -d "$test_path" ]; then
        if npm test -- "$test_path" --verbose --coverage; then
            echo -e "${GREEN}✅ نجحت اختبارات: $test_name${NC}"
        else
            echo -e "${RED}❌ فشلت اختبارات: $test_name${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  مجلد الاختبارات غير موجود: $test_path${NC}"
    fi
    
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 فحص المتطلبات الأساسية...${NC}"
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js غير مثبت${NC}"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm غير مثبت${NC}"
        exit 1
    fi
    
    # Check if Jest is available
    if ! npm list jest &> /dev/null; then
        echo -e "${YELLOW}⚠️  Jest غير مثبت، جاري التثبيت...${NC}"
        npm install --save-dev jest @types/jest
    fi
    
    # Check if GraphQL dependencies are installed
    if ! npm list @apollo/client &> /dev/null; then
        echo -e "${RED}❌ Apollo Client غير مثبت${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ جميع المتطلبات متوفرة${NC}"
    echo ""
}

# Function to setup test environment
setup_test_environment() {
    echo -e "${BLUE}⚙️  إعداد بيئة الاختبار...${NC}"
    
    # Set test environment variables
    export NODE_ENV=test
    export NEXT_PUBLIC_ODOO_API_URL="http://localhost:4000/graphql/test"
    export NEXT_PUBLIC_ODOO_API_TOKEN="test-token"
    
    # Create test database if needed
    if [ -f "scripts/setup-test-db.js" ]; then
        node scripts/setup-test-db.js
    fi
    
    echo -e "${GREEN}✅ تم إعداد بيئة الاختبار${NC}"
    echo ""
}

# Function to generate test report
generate_test_report() {
    echo -e "${BLUE}📊 إنشاء تقرير الاختبارات...${NC}"
    
    # Create reports directory
    mkdir -p reports/graphql-system
    
    # Generate coverage report
    npm test -- --coverage --coverageReporters=html --coverageDirectory=reports/graphql-system/coverage
    
    # Generate test results report
    npm test -- --json --outputFile=reports/graphql-system/test-results.json
    
    echo -e "${GREEN}✅ تم إنشاء تقرير الاختبارات في مجلد reports/graphql-system${NC}"
    echo ""
}

# Function to cleanup after tests
cleanup_test_environment() {
    echo -e "${BLUE}🧹 تنظيف بيئة الاختبار...${NC}"
    
    # Remove test database if created
    if [ -f "scripts/cleanup-test-db.js" ]; then
        node scripts/cleanup-test-db.js
    fi
    
    # Clear test cache
    npm test -- --clearCache
    
    echo -e "${GREEN}✅ تم تنظيف بيئة الاختبار${NC}"
    echo ""
}

# Main execution
main() {
    local start_time=$(date +%s)
    local failed_tests=0
    
    echo -e "${BLUE}🎯 بدء تشغيل اختبارات نظام GraphQL الشاملة${NC}"
    echo "التاريخ: $(date)"
    echo "=================================================="
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Setup test environment
    setup_test_environment
    
    # Run test suites
    echo -e "${YELLOW}📋 تشغيل مجموعات الاختبارات...${NC}"
    echo ""
    
    # 1. Queries Tests
    if ! run_test_suite "queries" "$QUERIES_DIR" "اختبارات الاستعلامات (Queries)"; then
        ((failed_tests++))
    fi
    
    # 2. Mutations Tests
    if ! run_test_suite "mutations" "$MUTATIONS_DIR" "اختبارات الطفرات (Mutations)"; then
        ((failed_tests++))
    fi
    
    # 3. Hooks Tests
    if ! run_test_suite "hooks" "$HOOKS_DIR" "اختبارات الخطافات (Hooks)"; then
        ((failed_tests++))
    fi
    
    # 4. Real-time Tests
    if ! run_test_suite "real-time" "$REAL_TIME_DIR" "اختبارات التحديثات المباشرة (Real-time)"; then
        ((failed_tests++))
    fi
    
    # 5. Integration Tests
    if ! run_test_suite "integrations" "$INTEGRATIONS_DIR" "اختبارات التكامل (Integration)"; then
        ((failed_tests++))
    fi
    
    # 6. Performance Tests
    if ! run_test_suite "performance" "$PERFORMANCE_DIR" "اختبارات الأداء (Performance)"; then
        ((failed_tests++))
    fi
    
    # 7. Lifecycle Tests
    if ! run_test_suite "lifecycles" "$LIFECYCLES_DIR" "اختبارات دورات الحياة (Lifecycles)"; then
        ((failed_tests++))
    fi
    
    # Generate test report
    generate_test_report
    
    # Cleanup
    cleanup_test_environment
    
    # Calculate execution time
    local end_time=$(date +%s)
    local execution_time=$((end_time - start_time))
    
    # Final results
    echo "=================================================="
    echo -e "${BLUE}📊 ملخص نتائج الاختبارات${NC}"
    echo "=================================================="
    echo "وقت التنفيذ: ${execution_time} ثانية"
    echo "عدد مجموعات الاختبارات: 7"
    echo "عدد المجموعات الناجحة: $((7 - failed_tests))"
    echo "عدد المجموعات الفاشلة: $failed_tests"
    echo ""
    
    if [ $failed_tests -eq 0 ]; then
        echo -e "${GREEN}🎉 جميع الاختبارات نجحت بنجاح!${NC}"
        echo -e "${GREEN}✅ نظام GraphQL جاهز للإنتاج${NC}"
        exit 0
    else
        echo -e "${RED}❌ فشل في $failed_tests مجموعة اختبارات${NC}"
        echo -e "${RED}🔧 يرجى مراجعة الأخطاء وإصلاحها${NC}"
        exit 1
    fi
}

# Handle script interruption
trap cleanup_test_environment EXIT

# Run specific test suite if provided
if [ $# -eq 1 ]; then
    case $1 in
        "queries")
            check_prerequisites
            setup_test_environment
            run_test_suite "queries" "$QUERIES_DIR" "اختبارات الاستعلامات"
            ;;
        "mutations")
            check_prerequisites
            setup_test_environment
            run_test_suite "mutations" "$MUTATIONS_DIR" "اختبارات الطفرات"
            ;;
        "hooks")
            check_prerequisites
            setup_test_environment
            run_test_suite "hooks" "$HOOKS_DIR" "اختبارات الخطافات"
            ;;
        "real-time")
            check_prerequisites
            setup_test_environment
            run_test_suite "real-time" "$REAL_TIME_DIR" "اختبارات التحديثات المباشرة"
            ;;
        "integrations")
            check_prerequisites
            setup_test_environment
            run_test_suite "integrations" "$INTEGRATIONS_DIR" "اختبارات التكامل"
            ;;
        "performance")
            check_prerequisites
            setup_test_environment
            run_test_suite "performance" "$PERFORMANCE_DIR" "اختبارات الأداء"
            ;;
        "lifecycles")
            check_prerequisites
            setup_test_environment
            run_test_suite "lifecycles" "$LIFECYCLES_DIR" "اختبارات دورات الحياة"
            ;;
        "help"|"-h"|"--help")
            echo "استخدام: $0 [نوع الاختبار]"
            echo ""
            echo "أنواع الاختبارات المتاحة:"
            echo "  queries      - اختبارات الاستعلامات"
            echo "  mutations    - اختبارات الطفرات"
            echo "  hooks        - اختبارات الخطافات"
            echo "  real-time    - اختبارات التحديثات المباشرة"
            echo "  integrations - اختبارات التكامل"
            echo "  performance  - اختبارات الأداء"
            echo "  lifecycles   - اختبارات دورات الحياة"
            echo ""
            echo "لتشغيل جميع الاختبارات: $0"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ نوع اختبار غير صحيح: $1${NC}"
            echo "استخدم '$0 help' لعرض المساعدة"
            exit 1
            ;;
    esac
else
    # Run all tests
    main
fi
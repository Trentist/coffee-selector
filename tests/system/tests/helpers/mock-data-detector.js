/**
 * Mock Data Detection Tool
 * أداة اكتشاف البيانات الوهمية
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Deep Search for Mock Data in Application...');
console.log('==============================================');

// Common mock data patterns
const MOCK_PATTERNS = [
  // Mock data keywords
  /mock|fake|dummy|test|sample|placeholder/gi,
  // Lorem ipsum text
  /lorem\s+ipsum|dolor\s+sit\s+amet/gi,
  // Fake names
  /john\s+doe|jane\s+doe|test\s+user|admin\s+user/gi,
  // Test emails
  /test@|example@|fake@|mock@|dummy@/gi,
  // Hardcoded arrays with sample data
  /\[\s*{[^}]*"name"\s*:\s*"[^"]*test|sample|mock/gi,
  // Static product data
  /products?\s*=\s*\[/gi,
  // Mock API responses
  /mockResponse|fakeData|dummyData/gi,
  // Test phone numbers
  /123-?456-?7890|555-?0123/gi,
  // Placeholder images
  /placeholder\.com|via\.placeholder|picsum\.photos/gi,
  // Static user data
  /users?\s*=\s*\[.*{.*"id"\s*:\s*[0-9]/gi
];

// File extensions to search
const SEARCH_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json'];

// Directories to skip
const SKIP_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];

let foundMockData = [];
let totalFilesScanned = 0;

function searchInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace(process.cwd(), '');
    const lines = content.split('\n');
    
    let fileMockData = [];
    
    lines.forEach((line, lineNumber) => {
      MOCK_PATTERNS.forEach((pattern, patternIndex) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            fileMockData.push({
              file: relativePath,
              line: lineNumber + 1,
              content: line.trim(),
              match: match,
              pattern: patternIndex,
              severity: getSeverity(match, line)
            });
          });
        }
      });
    });
    
    // Additional checks for specific mock data structures
    if (content.includes('const products = [') || content.includes('const categories = [')) {
      const productMatches = content.match(/const\s+(products|categories)\s*=\s*\[[\s\S]*?\]/g);
      if (productMatches) {
        productMatches.forEach(match => {
          fileMockData.push({
            file: relativePath,
            line: 'multiple',
            content: match.substring(0, 100) + '...',
            match: 'Static data array',
            pattern: 'hardcoded-data',
            severity: 'HIGH'
          });
        });
      }
    }
    
    // Check for hardcoded user data
    if (content.includes('"email"') && content.includes('"password"')) {
      const userDataMatches = content.match(/{\s*"email"[\s\S]*?"password"[\s\S]*?}/g);
      if (userDataMatches) {
        userDataMatches.forEach(match => {
          fileMockData.push({
            file: relativePath,
            line: 'multiple',
            content: match.substring(0, 100) + '...',
            match: 'Hardcoded user credentials',
            pattern: 'credentials',
            severity: 'CRITICAL'
          });
        });
      }
    }
    
    if (fileMockData.length > 0) {
      foundMockData.push(...fileMockData);
    }
    
    totalFilesScanned++;
  } catch (error) {
    // Skip files that can't be read
  }
}

function getSeverity(match, line) {
  if (match.toLowerCase().includes('password') || match.toLowerCase().includes('secret')) {
    return 'CRITICAL';
  }
  if (match.toLowerCase().includes('user') || match.toLowerCase().includes('admin')) {
    return 'HIGH';
  }
  if (match.toLowerCase().includes('test') || match.toLowerCase().includes('mock')) {
    return 'MEDIUM';
  }
  return 'LOW';
}

function searchDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!SKIP_DIRS.includes(file) && !file.startsWith('.')) {
          searchDirectory(fullPath);
        }
      } else {
        const ext = path.extname(file);
        if (SEARCH_EXTENSIONS.includes(ext)) {
          searchInFile(fullPath);
        }
      }
    });
  } catch (error) {
    // Skip directories that can't be read
  }
}

function analyzeResults() {
  console.log(`\n📊 Scan Results:`);
  console.log(`================`);
  console.log(`Files Scanned: ${totalFilesScanned}`);
  console.log(`Mock Data Found: ${foundMockData.length} instances`);
  
  if (foundMockData.length === 0) {
    console.log(`✅ No mock data detected in the application!`);
    return;
  }
  
  // Group by severity
  const bySeverity = {
    CRITICAL: foundMockData.filter(item => item.severity === 'CRITICAL'),
    HIGH: foundMockData.filter(item => item.severity === 'HIGH'),
    MEDIUM: foundMockData.filter(item => item.severity === 'MEDIUM'),
    LOW: foundMockData.filter(item => item.severity === 'LOW')
  };
  
  console.log(`\n🚨 Severity Breakdown:`);
  console.log(`   CRITICAL: ${bySeverity.CRITICAL.length} (Security Risk)`);
  console.log(`   HIGH: ${bySeverity.HIGH.length} (Production Risk)`);
  console.log(`   MEDIUM: ${bySeverity.MEDIUM.length} (Development Artifacts)`);
  console.log(`   LOW: ${bySeverity.LOW.length} (Minor Issues)`);
  
  // Group by file
  const byFile = {};
  foundMockData.forEach(item => {
    if (!byFile[item.file]) {
      byFile[item.file] = [];
    }
    byFile[item.file].push(item);
  });
  
  console.log(`\n📁 Files with Mock Data:`);
  Object.keys(byFile).slice(0, 20).forEach(file => {
    const items = byFile[file];
    const severities = [...new Set(items.map(i => i.severity))];
    console.log(`   ${file} (${items.length} issues - ${severities.join(', ')})`);
  });
  
  if (Object.keys(byFile).length > 20) {
    console.log(`   ... and ${Object.keys(byFile).length - 20} more files`);
  }
  
  // Show critical issues
  if (bySeverity.CRITICAL.length > 0) {
    console.log(`\n🚨 CRITICAL Issues (Must Fix Immediately):`);
    bySeverity.CRITICAL.slice(0, 10).forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.file}:${item.line}`);
      console.log(`      Match: ${item.match}`);
      console.log(`      Content: ${item.content.substring(0, 80)}...`);
    });
  }
  
  // Show high priority issues
  if (bySeverity.HIGH.length > 0) {
    console.log(`\n⚠️ HIGH Priority Issues:`);
    bySeverity.HIGH.slice(0, 10).forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.file}:${item.line}`);
      console.log(`      Match: ${item.match}`);
    });
  }
  
  // Analyze patterns
  console.log(`\n🔍 Common Mock Data Patterns Found:`);
  const patternCounts = {};
  foundMockData.forEach(item => {
    const key = item.match.toLowerCase();
    patternCounts[key] = (patternCounts[key] || 0) + 1;
  });
  
  Object.entries(patternCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([pattern, count]) => {
      console.log(`   "${pattern}": ${count} occurrences`);
    });
}

function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFilesScanned,
      mockDataInstances: foundMockData.length,
      criticalIssues: foundMockData.filter(i => i.severity === 'CRITICAL').length,
      highPriorityIssues: foundMockData.filter(i => i.severity === 'HIGH').length,
      mediumPriorityIssues: foundMockData.filter(i => i.severity === 'MEDIUM').length,
      lowPriorityIssues: foundMockData.filter(i => i.severity === 'LOW').length
    },
    findings: foundMockData,
    recommendations: []
  };
  
  // Add recommendations
  if (report.summary.criticalIssues > 0) {
    report.recommendations.push('URGENT: Remove all hardcoded credentials and sensitive data');
  }
  if (report.summary.highPriorityIssues > 0) {
    report.recommendations.push('Replace hardcoded user data with dynamic data from Odoo');
  }
  if (report.summary.mediumPriorityIssues > 0) {
    report.recommendations.push('Clean up development artifacts and test data');
  }
  if (foundMockData.length > 0) {
    report.recommendations.push('Implement proper data fetching from GraphQL API');
    report.recommendations.push('Use environment variables for configuration');
    report.recommendations.push('Add data validation and error handling');
  }
  
  // Save report
  const reportsDir = 'tests/reports/real-data-validation';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(reportsDir, 'mock-data-detection-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n📄 Detailed report saved to: tests/reports/real-data-validation/mock-data-detection-report.json`);
  
  return report;
}

// Run the deep search
console.log('🔍 Starting deep scan...');
searchDirectory(process.cwd());

analyzeResults();
const report = generateReport();

console.log(`\n🎯 Final Assessment:`);
if (report.summary.mockDataInstances === 0) {
  console.log('🎉 EXCELLENT! No mock data found in the application.');
  console.log('✅ Application appears to be using real data sources.');
} else if (report.summary.criticalIssues > 0) {
  console.log('🚨 CRITICAL! Security risks found - immediate action required.');
} else if (report.summary.highPriorityIssues > 0) {
  console.log('⚠️ HIGH PRIORITY! Production readiness issues detected.');
} else {
  console.log('⚠️ MEDIUM PRIORITY! Some cleanup needed for production.');
}

console.log(`\n🔧 Next Steps:`);
report.recommendations.forEach((rec, index) => {
  console.log(`   ${index + 1}. ${rec}`);
});

process.exit(report.summary.criticalIssues > 0 ? 2 : report.summary.highPriorityIssues > 0 ? 1 : 0);
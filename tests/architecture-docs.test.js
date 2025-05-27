const fs = require('fs');
const path = require('path');

describe('Architecture Documentation Tests', () => {
  
  test('ARCHITECTURE.md file exists', () => {
    const architectureFilePath = path.join(__dirname, '..', 'ARCHITECTURE.md');
    expect(fs.existsSync(architectureFilePath)).toBe(true);
  });

  test('ARCHITECTURE.md contains required sections', () => {
    const architectureFilePath = path.join(__dirname, '..', 'ARCHITECTURE.md');
    const content = fs.readFileSync(architectureFilePath, 'utf8');
    
    // Check for required sections
    expect(content).toContain('# Lambda Extensions Architecture Documentation');
    expect(content).toContain('## Functionality Summary');
    expect(content).toContain('## Process Sequence Diagram');
    expect(content).toContain('## Infrastructure Diagram');
    expect(content).toContain('## Infrastructure Dependency Table');
    expect(content).toContain('## WAR Summary');
  });

  test('ARCHITECTURE.md contains mermaid diagrams', () => {
    const architectureFilePath = path.join(__dirname, '..', 'ARCHITECTURE.md');
    const content = fs.readFileSync(architectureFilePath, 'utf8');
    
    // Check for mermaid diagrams
    expect(content).toContain('```mermaid');
    
    // Check for sequence diagram
    const hasSequenceDiagram = content.includes('sequenceDiagram');
    expect(hasSequenceDiagram).toBe(true);
    
    // Check for infrastructure diagram
    const hasInfrastructureDiagram = content.includes('graph TD');
    expect(hasInfrastructureDiagram).toBe(true);
  });

  test('README.md references architecture documentation', () => {
    const readmeFilePath = path.join(__dirname, '..', 'README.md');
    const content = fs.readFileSync(readmeFilePath, 'utf8');
    
    expect(content).toContain('Architecture Documentation');
    expect(content).toContain('[Architecture Documentation](./ARCHITECTURE.md)');
  });

  test('Kinesis Telemetry Extension has its own documentation', () => {
    const extensionReadmePath = path.join(__dirname, '..', 'packages', 'kinesis-telemetry-extension', 'README.md');
    expect(fs.existsSync(extensionReadmePath)).toBe(true);
    
    const content = fs.readFileSync(extensionReadmePath, 'utf8');
    expect(content).toContain('# Kinesis Telemetry Extension');
    expect(content).toContain('## Architecture');
    expect(content).toContain('```mermaid');
  });
});